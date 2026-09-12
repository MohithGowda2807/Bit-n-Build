"""Run the deterministic detectors over vessel tracks and emit surveillance events."""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional, Sequence

from app.services.surveillance.features import KinematicPoint
from app.services.surveillance.fishing_pattern import assess_fishing_activity
from app.services.surveillance.geofence import GeofenceEngine, TrackPoint
from app.services.surveillance.loitering import assess_loitering
from app.services.surveillance.rendezvous import detect_rendezvous

EVENT_SCORE_THRESHOLD = 40  # detector scores at or below this stay silent


@dataclass
class DetectedEvent:
    event_type: str
    vessel_id: int
    timestamp: datetime
    latitude: float
    longitude: float
    score: Optional[float] = None
    confidence: float = 1.0
    source: str = "AIS"
    other_vessel_id: Optional[int] = None
    zone_kind: Optional[str] = None
    zone_id: Optional[int] = None
    zone_name: Optional[str] = None
    payload: Dict[str, Any] = field(default_factory=dict)


class SurveillanceAnalyzer:
    def __init__(self, fishing_zones: Sequence, protected_areas: Sequence, geofence: Optional[GeofenceEngine] = None):
        self.zones = [("FISHING_ZONE", z) for z in fishing_zones] + [("MARINE_PROTECTED_AREA", a) for a in protected_areas]
        self.geofence = geofence or GeofenceEngine()

    def analyze_vessel(self, vessel_id: int, track: Sequence[KinematicPoint]) -> List[DetectedEvent]:
        if len(track) < 2:
            return []
        events = self._zone_events(vessel_id, track)
        events += self._loitering_event(vessel_id, track)
        events += self._fishing_event(vessel_id, track)
        return events

    def analyze_pair(
        self, vessel_a: int, track_a: Sequence[KinematicPoint], type_a: str,
        vessel_b: int, track_b: Sequence[KinematicPoint], type_b: str,
    ) -> List[DetectedEvent]:
        events: List[DetectedEvent] = []
        for meeting in detect_rendezvous(track_a, track_b, type_a, type_b):
            payload = {
                "interaction_type": meeting.interaction_type,
                "start_time": meeting.start_time.isoformat(),
                "end_time": meeting.end_time.isoformat(),
                "duration_seconds": (meeting.end_time - meeting.start_time).total_seconds(),
                "minimum_distance_km": round(meeting.minimum_distance_km, 3),
            }
            for me, other in ((vessel_a, vessel_b), (vessel_b, vessel_a)):
                events.append(DetectedEvent(
                    "VESSEL_RENDEZVOUS", me, meeting.start_time, meeting.latitude, meeting.longitude,
                    confidence=meeting.confidence, other_vessel_id=other, payload=dict(payload),
                ))
        return events

    def _zone_events(self, vessel_id: int, track: Sequence[KinematicPoint]) -> List[DetectedEvent]:
        points = [TrackPoint(p.timestamp, p.latitude, p.longitude) for p in track]
        events: List[DetectedEvent] = []
        for kind, zone in self.zones:
            for transition in self.geofence.zone_transitions(points, zone):
                payload = {"zone_type": getattr(zone, "zone_type", None) or getattr(zone, "protection_level", None)}
                if transition.dwell_seconds is not None:
                    payload["dwell_seconds"] = transition.dwell_seconds
                events.append(DetectedEvent(
                    transition.kind, vessel_id, transition.timestamp, transition.latitude, transition.longitude,
                    zone_kind=kind, zone_id=zone.id, zone_name=zone.name, payload=payload,
                ))
        return events

    def _loitering_event(self, vessel_id: int, track: Sequence[KinematicPoint]) -> List[DetectedEvent]:
        result = assess_loitering(track)
        if result.score <= EVENT_SCORE_THRESHOLD:
            return []
        last = track[-1]
        return [DetectedEvent(
            "LOITERING", vessel_id, last.timestamp, last.latitude, last.longitude, score=result.score,
            confidence=0.8,
            payload={
                "duration_seconds": result.duration_seconds,
                "movement_radius_km": round(result.movement_radius_km, 3),
                "mean_speed_knots": round(result.mean_speed_knots, 2),
            },
        )]

    def _fishing_event(self, vessel_id: int, track: Sequence[KinematicPoint]) -> List[DetectedEvent]:
        result = assess_fishing_activity(track)
        if result.score <= EVENT_SCORE_THRESHOLD:
            return []
        last = track[-1]
        f = result.features
        return [DetectedEvent(
            "FISHING_PATTERN", vessel_id, last.timestamp, last.latitude, last.longitude, score=result.score,
            confidence=0.75,
            payload={
                "course_change_rate_deg_per_hour": round(f.course_change_rate_deg_per_hour, 1),
                "time_at_low_speed_seconds": f.time_at_low_speed_seconds,
                "speed_stddev_knots": round(f.speed_stddev, 2),
            },
        )]
