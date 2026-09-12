"""Run the analyzer over every tracked vessel and persist new surveillance events."""
from dataclasses import dataclass
from itertools import combinations
from typing import Dict, List, Optional, Sequence, Set, Tuple

from sqlalchemy.orm import Session

from app.events.publisher import Event, EventPublisher, get_publisher
from app.models.ais_position import AISPosition
from app.models.dark_period import DarkPeriod
from app.models.fishing_zone import FishingZone
from app.models.marine_protected_area import MarineProtectedArea
from app.models.surveillance_event import SurveillanceEvent
from app.models.vessel import Vessel
from app.services.surveillance.analyzer import DetectedEvent, SurveillanceAnalyzer
from app.services.surveillance.baseline_service import BaselineService
from app.services.surveillance.features import KinematicPoint

EventKey = Tuple[str, int, object, Optional[int], Optional[int]]


@dataclass
class PipelineSummary:
    vessels_analyzed: int = 0
    events_added: int = 0


def _key(event_type: str, vessel_id: int, timestamp, zone_id: Optional[int], other_vessel_id: Optional[int]) -> EventKey:
    return (event_type, vessel_id, timestamp.replace(tzinfo=None), zone_id, other_vessel_id)


class SurveillancePipeline:
    def __init__(self, db: Session, analyzer: Optional[SurveillanceAnalyzer] = None,
                 publisher: Optional[EventPublisher] = None):
        self.db = db
        self.publisher = publisher or get_publisher()
        self.analyzer = analyzer or SurveillanceAnalyzer(
            db.query(FishingZone).all(), db.query(MarineProtectedArea).all()
        )
        self.baseline = BaselineService(db)

    def run(self, vessel_ids: Optional[Sequence[int]] = None) -> PipelineSummary:
        tracks = self._load_tracks(vessel_ids)
        vessels = {v.id: v for v in self.db.query(Vessel).filter(Vessel.id.in_(tracks.keys())).all()}
        known = self._known_event_keys()
        summary = PipelineSummary(vessels_analyzed=len(tracks))

        detected: List[DetectedEvent] = []
        for vessel_id, track in tracks.items():
            periods = self.db.query(DarkPeriod).filter_by(vessel_id=vessel_id).all()
            detected += self.analyzer.analyze_vessel(vessel_id, track)
            detected += self._gap_events(vessel_id, periods)
            detected += self.baseline.detect(vessel_id, track, periods)
        for (id_a, track_a), (id_b, track_b) in combinations(tracks.items(), 2):
            detected += self.analyzer.analyze_pair(
                id_a, track_a, vessels[id_a].vessel_type, id_b, track_b, vessels[id_b].vessel_type
            )

        new_rows: List[SurveillanceEvent] = []
        for event in detected:
            key = _key(event.event_type, event.vessel_id, event.timestamp, event.zone_id, event.other_vessel_id)
            if key in known:
                continue
            known.add(key)
            row = SurveillanceEvent.from_detected(event)
            self.db.add(row)
            new_rows.append(row)
            summary.events_added += 1

        self.db.commit()
        for row in new_rows:
            self.publisher.publish(Event(
                event_type=row.event_type, source="surveillance_pipeline", vessel_id=row.vessel_id,
                payload={
                    "surveillance_event_id": row.id, "timestamp": row.timestamp.isoformat(),
                    "latitude": row.latitude, "longitude": row.longitude, "score": row.score,
                    "zone_name": row.zone_name, "other_vessel_id": row.other_vessel_id, **row.payload,
                },
            ))
        return summary

    def _load_tracks(self, vessel_ids: Optional[Sequence[int]]) -> Dict[int, List[KinematicPoint]]:
        query = self.db.query(AISPosition).order_by(AISPosition.vessel_id, AISPosition.timestamp)
        if vessel_ids:
            query = query.filter(AISPosition.vessel_id.in_(vessel_ids))
        tracks: Dict[int, List[KinematicPoint]] = {}
        for row in query.all():
            tracks.setdefault(row.vessel_id, []).append(KinematicPoint(
                row.timestamp, row.latitude, row.longitude, row.speed_over_ground or 0.0, row.course_over_ground or 0.0
            ))
        return tracks

    def _known_event_keys(self) -> Set[EventKey]:
        rows = self.db.query(
            SurveillanceEvent.event_type, SurveillanceEvent.vessel_id, SurveillanceEvent.timestamp,
            SurveillanceEvent.zone_id, SurveillanceEvent.other_vessel_id,
        ).all()
        return {_key(*row) for row in rows}

    def _gap_events(self, vessel_id: int, periods: Sequence[DarkPeriod]) -> List[DetectedEvent]:
        events = []
        for period in periods:
            payload = {
                "dark_period_id": period.id,
                "duration_seconds": period.duration_seconds,
                "severity": period.severity,
                "estimated_distance_km": period.estimated_distance_km,
                "end_time": period.end_time.isoformat() if period.end_time else None,
            }
            events.append(DetectedEvent(
                "AIS_GAP_DETECTED", vessel_id, period.start_time, period.last_latitude, period.last_longitude,
                confidence=0.99, payload=payload,
            ))
        return events
