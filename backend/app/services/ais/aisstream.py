"""Live AIS from aisstream.io, normalised behind the same provider interface as the simulation.

The stream is a websocket: after a subscription message it pushes one JSON
document per AIS message. The provider collects for a fixed number of seconds
and then answers like any other provider. The network client is a separate
function so tests can hand the provider recorded messages instead.
"""
import json
import logging
import re
from datetime import datetime, timezone
from typing import Dict, Iterable, List, Optional, Tuple

from app.services.ais.provider import AISProvider, AISReport, AISVesselInfo, BoundingBox

logger = logging.getLogger("oceansentinel.aisstream")

STREAM_URL = "wss://stream.aisstream.io/v0/stream"
HEADING_NOT_AVAILABLE = 511

# AIS ship-type codes (ITU-R M.1371) collapsed onto the vessel types the risk engine knows.
_TYPE_RANGES = (
    ((30, 30), "FISHING"), ((31, 32), "TUG"), ((36, 37), "SAILING"), ((40, 49), "HIGH_SPEED_CRAFT"),
    ((50, 59), "SPECIAL"), ((60, 69), "PASSENGER"), ((70, 79), "CARGO"), ((80, 89), "TANKER"), ((90, 99), "OTHER"),
)


def vessel_type_from_ais_code(code: Optional[int]) -> str:
    if code is None:
        return "UNKNOWN"
    for (low, high), label in _TYPE_RANGES:
        if low <= code <= high:
            return label
    return "UNKNOWN"


def parse_stream_time(value: str) -> datetime:
    """aisstream stamps like '2026-09-13 06:15:20.123456789 +0000 UTC'; keep microsecond precision."""
    match = re.match(r"(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})(?:\.(\d+))?", value)
    if not match:
        return datetime.now(timezone.utc)
    stamp = datetime.strptime(match.group(1), "%Y-%m-%d %H:%M:%S")
    fraction = (match.group(2) or "0")[:6].ljust(6, "0")
    return stamp.replace(microsecond=int(fraction), tzinfo=timezone.utc)


def fetch_messages(api_key: str, bounding_box: BoundingBox, collect_seconds: float) -> List[dict]:
    """Subscribe to the stream for the box and return the raw messages received in the window."""
    from websockets.sync.client import connect

    min_lat, min_lon, max_lat, max_lon = bounding_box
    subscription = {
        "APIKey": api_key,
        "BoundingBoxes": [[[min_lat, min_lon], [max_lat, max_lon]]],
        "FilterMessageTypes": ["PositionReport", "ShipStaticData"],
    }
    messages: List[dict] = []
    deadline = datetime.now(timezone.utc).timestamp() + collect_seconds
    with connect(STREAM_URL, open_timeout=10) as socket:
        socket.send(json.dumps(subscription))
        while datetime.now(timezone.utc).timestamp() < deadline:
            remaining = max(0.1, deadline - datetime.now(timezone.utc).timestamp())
            try:
                raw = socket.recv(timeout=remaining)
            except TimeoutError:
                break
            try:
                messages.append(json.loads(raw))
            except ValueError:
                continue
    logger.info("aisstream: collected %d messages in %.0fs", len(messages), collect_seconds)
    return messages


class AISStreamProvider(AISProvider):
    def __init__(self, api_key: str, bounding_box: BoundingBox, collect_seconds: float = 30.0,
                 messages: Optional[Iterable[dict]] = None):
        self.api_key = api_key
        self.bounding_box = bounding_box
        self.collect_seconds = collect_seconds
        self._messages = list(messages) if messages is not None else None
        self._reports: Optional[List[AISReport]] = None
        self._vessels: Dict[str, AISVesselInfo] = {}

    # Collection

    def _load(self) -> None:
        if self._reports is not None:
            return
        raw = self._messages if self._messages is not None else fetch_messages(self.api_key, self.bounding_box, self.collect_seconds)
        reports: List[AISReport] = []
        static: Dict[str, dict] = {}
        names: Dict[str, str] = {}
        for message in raw:
            meta = message.get("MetaData") or {}
            mmsi = str(meta.get("MMSI", "")).strip()
            if not mmsi:
                continue
            if meta.get("ShipName"):
                names[mmsi] = str(meta["ShipName"]).strip()
            kind = message.get("MessageType")
            body = (message.get("Message") or {}).get(kind) or {}
            if kind == "PositionReport":
                report = self._report(mmsi, meta, body)
                if report:
                    reports.append(report)
            elif kind == "ShipStaticData":
                static[mmsi] = body
        for mmsi in {r.mmsi for r in reports} | set(static):
            data = static.get(mmsi, {})
            imo = data.get("ImoNumber")
            self._vessels[mmsi] = AISVesselInfo(
                mmsi=mmsi, name=names.get(mmsi) or str(data.get("Name") or f"MMSI {mmsi}").strip(),
                vessel_type=vessel_type_from_ais_code(data.get("Type")),
                callsign=(str(data["CallSign"]).strip() or None) if data.get("CallSign") else None,
                imo_number=str(imo) if imo else None,
            )
        self._reports = sorted(reports, key=lambda r: r.timestamp)

    @staticmethod
    def _report(mmsi: str, meta: dict, body: dict) -> Optional[AISReport]:
        lat, lon = meta.get("latitude"), meta.get("longitude")
        if lat is None or lon is None:
            return None
        heading = body.get("TrueHeading")
        return AISReport(
            mmsi=mmsi, timestamp=parse_stream_time(str(meta.get("time_utc", ""))),
            latitude=float(lat), longitude=float(lon),
            speed_over_ground=float(body.get("Sog") or 0.0), course_over_ground=float(body.get("Cog") or 0.0),
            heading=None if heading in (None, HEADING_NOT_AVAILABLE) else float(heading),
            navigation_status=str(body["NavigationalStatus"]) if body.get("NavigationalStatus") is not None else None,
            source="AISSTREAM",
        )

    # Provider interface

    def get_vessels(self, area: Optional[BoundingBox] = None) -> List[AISVesselInfo]:
        self._load()
        return list(self._vessels.values())

    def get_vessel(self, mmsi: str) -> Optional[AISVesselInfo]:
        self._load()
        return self._vessels.get(mmsi)

    def get_track(self, mmsi: str, start_time: datetime, end_time: datetime) -> List[AISReport]:
        self._load()
        return [r for r in self._reports if r.mmsi == mmsi and start_time <= r.timestamp <= end_time]

    def get_positions(self, area: Optional[BoundingBox] = None,
                      time_range: Optional[Tuple[datetime, datetime]] = None) -> List[AISReport]:
        self._load()
        reports = self._reports
        if time_range:
            reports = [r for r in reports if time_range[0] <= r.timestamp <= time_range[1]]
        if area:
            min_lat, min_lon, max_lat, max_lon = area
            reports = [r for r in reports if min_lat <= r.latitude <= max_lat and min_lon <= r.longitude <= max_lon]
        return list(reports)
