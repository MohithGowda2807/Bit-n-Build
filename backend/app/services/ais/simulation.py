"""Deterministic scripted AIS scenarios for demos and tests.

Each scenario is a list of vessel scripts. A script is a start point plus
legs (minutes, destination); positions are interpolated every
REPORT_INTERVAL_MINUTES. Minutes inside a dark window emit no report.
"""
import math
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

from app.services.routing.geometry import haversine_distance, km_to_nautical_miles
from app.services.ais.provider import AISProvider, AISReport, AISVesselInfo, BoundingBox, HistoricalBaseline
from app.services.surveillance.baseline import cell_of

REPORT_INTERVAL_MINUTES = 5

# Scripted 30-day histories by vessel type: what each scenario vessel normally does.
HISTORICAL_BASELINES = {
    "FISHING": {"average_speed": 6.5, "speed_stddev": 1.5, "course_change_rate_deg_per_hour": 30.0},
    "CARGO": {"average_speed": 12.0, "speed_stddev": 1.0, "course_change_rate_deg_per_hour": 15.0},
}
HISTORY_HOURS = 30 * 24


@dataclass(frozen=True)
class Leg:
    minutes: int
    to_lat: float
    to_lon: float


@dataclass(frozen=True)
class VesselScript:
    info: AISVesselInfo
    start: Tuple[float, float]
    legs: List[Leg]
    dark_windows: List[Tuple[int, int]] = field(default_factory=list)  # (start_min, end_min)

    def total_minutes(self) -> int:
        return sum(leg.minutes for leg in self.legs)


def _fishing(mmsi: str, name: str) -> AISVesselInfo:
    return AISVesselInfo(mmsi=mmsi, name=name, vessel_type="FISHING", flag="IN")


def _cargo(mmsi: str, name: str) -> AISVesselInfo:
    return AISVesselInfo(mmsi=mmsi, name=name, vessel_type="CARGO", flag="PA")


def _zigzag(lat: float, lon: float, passes: int, step: float = 0.008, climb: float = 0.004,
            minutes: int = 20) -> List[Leg]:
    """Slow back-and-forth passes (about 3 knots) that creep northward, like trawling."""
    legs = []
    for i in range(passes):
        lon_off = step if i % 2 == 0 else -step
        legs.append(Leg(minutes, lat + (i + 1) * climb, lon + lon_off))
    return legs


# Region: eastern Arabian Sea, roughly lat 12-15 N, lon 70-73 E.
# Transit legs run at realistic speeds: about 12 knots for cargo, 8 knots for fishing vessels.
SCENARIOS: Dict[str, List[VesselScript]] = {
    "NORMAL_VESSEL": [
        VesselScript(_cargo("353000101", "MV Steady Course"), (12.0, 70.0),
                     [Leg(240, 12.6, 70.6)]),
    ],
    "AIS_GAP": [
        VesselScript(_fishing("419000201", "FV Silent Tide"), (12.0, 72.0),
                     [Leg(90, 12.15, 72.15), Leg(60, 12.25, 72.25), Leg(90, 12.4, 72.4)],
                     dark_windows=[(90, 150)]),
    ],
    "SUSPICIOUS_FISHING": [
        VesselScript(_fishing("419000301", "FV Restless"), (12.0, 71.0),
                     [Leg(60, 12.1, 71.1)] + _zigzag(12.1, 71.1, 6) + [Leg(60, 12.25, 71.25)]),
    ],
    "MPA_INTRUSION": [
        # Enters the 13.4-13.6 N / 71.4-71.6 E protected square, works it slowly, then leaves.
        VesselScript(_fishing("419000401", "FV Boundary Runner"), (13.25, 71.25),
                     [Leg(60, 13.42, 71.42)] + _zigzag(13.42, 71.42, 4) + [Leg(60, 13.6, 71.7)]),
    ],
    "LOITERING": [
        VesselScript(_fishing("419000501", "FV Drifter"), (14.0, 72.0),
                     [Leg(45, 14.01, 72.01), Leg(45, 14.0, 72.02), Leg(45, 13.99, 72.01), Leg(45, 14.0, 72.0)]),
    ],
    "VESSEL_RENDEZVOUS": [
        VesselScript(_fishing("419000601", "FV Meeting Point"), (12.0, 72.0),
                     [Leg(60, 12.15, 72.15), Leg(40, 12.155, 72.155), Leg(60, 12.0, 72.3)]),
        VesselScript(_cargo("353000602", "MV Quiet Partner"), (12.3, 72.3),
                     [Leg(60, 12.155, 72.155), Leg(40, 12.16, 72.16), Leg(60, 12.3, 72.0)]),
    ],
    "DARK_FISHING_COMPOSITE": [
        # The spec's end-to-end story: enter a closed bank, fish it, go dark, reappear, meet a cargo ship, leave.
        VesselScript(_fishing("419000801", "FV Night Hauler"), (12.0, 72.05),
                     [Leg(60, 12.2, 72.22)] + _zigzag(12.2, 72.22, 4)
                     + [Leg(60, 12.3, 72.3), Leg(30, 12.32, 72.32), Leg(60, 12.45, 72.45)],
                     dark_windows=[(140, 200)]),
        VesselScript(_cargo("353000802", "MV Grey Broker"), (12.5, 72.5),
                     [Leg(140, 12.5, 72.45), Leg(60, 12.305, 72.305), Leg(30, 12.325, 72.325), Leg(60, 12.5, 72.5)]),
    ],
    "TRANSIT_ANOMALY": [
        VesselScript(_cargo("353000701", "MV Odd Detour"), (12.0, 70.0),
                     [Leg(60, 12.2, 70.2), Leg(60, 12.5, 70.15), Leg(60, 12.3, 70.4), Leg(60, 12.5, 70.6)]),
    ],
}


def initial_bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dlon = math.radians(lon2 - lon1)
    x = math.sin(dlon) * math.cos(phi2)
    y = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(dlon)
    return (math.degrees(math.atan2(x, y)) + 360.0) % 360.0


def _position_at(script: VesselScript, minute: int) -> Optional[Tuple[float, float, float, float]]:
    """Return (lat, lon, sog_knots, cog_deg) at a minute offset, or None past the script end."""
    lat, lon = script.start
    elapsed = 0
    for leg in script.legs:
        if minute <= elapsed + leg.minutes:
            fraction = (minute - elapsed) / leg.minutes
            distance_km = haversine_distance(lat, lon, leg.to_lat, leg.to_lon)
            sog = km_to_nautical_miles(distance_km) / (leg.minutes / 60.0)
            cog = initial_bearing(lat, lon, leg.to_lat, leg.to_lon)
            return (
                lat + (leg.to_lat - lat) * fraction,
                lon + (leg.to_lon - lon) * fraction,
                round(sog, 2),
                round(cog, 1),
            )
        elapsed += leg.minutes
        lat, lon = leg.to_lat, leg.to_lon
    return None


def _is_dark(script: VesselScript, minute: int) -> bool:
    return any(start < minute < end for start, end in script.dark_windows)


def generate_reports(script: VesselScript, start_time: datetime) -> List[AISReport]:
    reports = []
    for minute in range(0, script.total_minutes() + 1, REPORT_INTERVAL_MINUTES):
        if _is_dark(script, minute):
            continue
        state = _position_at(script, minute)
        if state is None:
            break
        lat, lon, sog, cog = state
        reports.append(AISReport(
            mmsi=script.info.mmsi,
            timestamp=start_time + timedelta(minutes=minute),
            latitude=round(lat, 6),
            longitude=round(lon, 6),
            speed_over_ground=sog,
            course_over_ground=cog,
            heading=cog,
            navigation_status="UNDER_WAY_USING_ENGINE",
            source="SIMULATION",
        ))
    return reports


def _in_area(report: AISReport, area: Optional[BoundingBox]) -> bool:
    if area is None:
        return True
    min_lat, min_lon, max_lat, max_lon = area
    return min_lat <= report.latitude <= max_lat and min_lon <= report.longitude <= max_lon


class SimulationAISProvider(AISProvider):
    def __init__(self, scenario: str, start_time: datetime):
        if scenario not in SCENARIOS:
            raise ValueError(f"Unknown scenario '{scenario}'. Choose from {sorted(SCENARIOS)}")
        self.scenario = scenario
        self.start_time = start_time
        self._scripts = {s.info.mmsi: s for s in SCENARIOS[scenario]}
        self._reports = {mmsi: generate_reports(s, start_time) for mmsi, s in self._scripts.items()}

    def get_vessels(self, area: Optional[BoundingBox] = None) -> List[AISVesselInfo]:
        return [s.info for s in self._scripts.values()]

    def get_vessel(self, mmsi: str) -> Optional[AISVesselInfo]:
        script = self._scripts.get(mmsi)
        return script.info if script else None

    def get_track(self, mmsi: str, start_time: datetime, end_time: datetime) -> List[AISReport]:
        return [r for r in self._reports.get(mmsi, []) if start_time <= r.timestamp <= end_time]

    def get_historical_baselines(self) -> List[HistoricalBaseline]:
        return [
            HistoricalBaseline(
                mmsi=script.info.mmsi, **HISTORICAL_BASELINES[script.info.vessel_type],
                hours_observed=HISTORY_HOURS, point_count=HISTORY_HOURS * 60 // REPORT_INTERVAL_MINUTES,
                common_cells=[cell_of(*script.start)],
            )
            for script in self._scripts.values()
        ]

    def get_positions(
        self, area: Optional[BoundingBox] = None, time_range: Optional[Tuple[datetime, datetime]] = None
    ) -> List[AISReport]:
        reports = [r for track in self._reports.values() for r in track]
        if time_range:
            reports = [r for r in reports if time_range[0] <= r.timestamp <= time_range[1]]
        return sorted((r for r in reports if _in_area(r, area)), key=lambda r: r.timestamp)
