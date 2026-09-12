"""Pull AIS reports from a provider into the database and record dark periods."""
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional

from sqlalchemy.orm import Session

from app.models.ais_position import AISPosition
from app.models.dark_period import DarkPeriod
from app.models.vessel import Vessel
from app.services.ais.provider import AISProvider, AISReport, AISVesselInfo
from app.services.surveillance.ais_gap import Observation, detect_ais_gaps


@dataclass
class IngestSummary:
    vessels_created: int = 0
    positions_added: int = 0
    dark_periods_added: int = 0


class AISIngestor:
    def __init__(self, db: Session, gap_threshold_seconds: float):
        self.db = db
        self.gap_threshold_seconds = gap_threshold_seconds

    def ingest(self, provider: AISProvider, now: Optional[datetime] = None) -> IngestSummary:
        summary = IngestSummary()
        reports_by_mmsi: Dict[str, List[AISReport]] = {}
        for report in provider.get_positions():
            reports_by_mmsi.setdefault(report.mmsi, []).append(report)

        for mmsi, reports in reports_by_mmsi.items():
            vessel = self._vessel_for(provider.get_vessel(mmsi), mmsi, summary)
            summary.positions_added += self._store_positions(vessel, reports)
            self._update_live_position(vessel, reports[-1])
            summary.dark_periods_added += self._store_dark_periods(vessel, now)

        self.db.commit()
        return summary

    def _vessel_for(self, info: Optional[AISVesselInfo], mmsi: str, summary: IngestSummary) -> Vessel:
        vessel = self.db.query(Vessel).filter_by(mmsi=mmsi).first()
        if vessel:
            return vessel
        vessel = Vessel(
            vessel_identifier=f"MMSI-{mmsi}",
            name=info.name if info else f"Unknown {mmsi}",
            vessel_type=info.vessel_type if info else "UNKNOWN",
            mmsi=mmsi,
            imo_number=info.imo_number if info else None,
            callsign=info.callsign if info else None,
            flag=info.flag if info else None,
        )
        self.db.add(vessel)
        self.db.flush()
        summary.vessels_created += 1
        return vessel

    def _store_positions(self, vessel: Vessel, reports: List[AISReport]) -> int:
        existing = {
            row.timestamp.replace(tzinfo=None)
            for row in self.db.query(AISPosition.timestamp).filter_by(vessel_id=vessel.id)
        }
        added = 0
        for report in reports:
            if report.timestamp.replace(tzinfo=None) in existing:
                continue
            self.db.add(AISPosition(
                vessel_id=vessel.id,
                timestamp=report.timestamp,
                latitude=report.latitude,
                longitude=report.longitude,
                speed_over_ground=report.speed_over_ground,
                course_over_ground=report.course_over_ground,
                heading=report.heading,
                navigation_status=report.navigation_status,
                source=report.source,
            ))
            added += 1
        self.db.flush()
        return added

    def _update_live_position(self, vessel: Vessel, latest: AISReport) -> None:
        vessel.latitude = latest.latitude
        vessel.longitude = latest.longitude
        vessel.heading = latest.heading if latest.heading is not None else latest.course_over_ground
        vessel.status = "underway"

    def _store_dark_periods(self, vessel: Vessel, now: Optional[datetime]) -> int:
        rows = (
            self.db.query(AISPosition)
            .filter_by(vessel_id=vessel.id)
            .order_by(AISPosition.timestamp)
            .all()
        )
        observations = [Observation(r.timestamp, r.latitude, r.longitude) for r in rows]
        naive_now = now.replace(tzinfo=None) if now else None
        gaps = detect_ais_gaps(observations, self.gap_threshold_seconds, now=naive_now)

        known_starts = {
            row.start_time for row in self.db.query(DarkPeriod.start_time).filter_by(vessel_id=vessel.id)
        }
        added = 0
        for gap in gaps:
            if gap.start_time in known_starts:
                continue
            self.db.add(DarkPeriod.from_gap(vessel.id, gap))
            added += 1
        self.db.flush()
        return added
