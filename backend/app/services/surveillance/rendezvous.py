"""Two-vessel proximity events: approach, stay close, separate."""
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional, Sequence

from app.services.routing.geometry import haversine_distance
from app.services.surveillance.features import KinematicPoint
from app.services.surveillance.levels import clamp

PROXIMITY_KM = 1.0
MIN_DURATION_SECONDS = 20 * 60
TIME_TOLERANCE_SECONDS = 5 * 60
SUPPORT_VESSEL_TYPES = {"CARGO", "TANKER", "CONTAINER", "REEFER"}


@dataclass(frozen=True)
class VesselInteraction:
    start_time: datetime
    end_time: datetime
    minimum_distance_km: float
    latitude: float
    longitude: float
    interaction_type: str  # RENDEZVOUS, POSSIBLE_TRANSSHIPMENT
    confidence: float


@dataclass(frozen=True)
class _Sample:
    timestamp: datetime
    distance_km: float
    latitude: float
    longitude: float


def _nearest_in_time(point: KinematicPoint, track: Sequence[KinematicPoint], tolerance: float) -> Optional[KinematicPoint]:
    best = min(track, key=lambda p: abs((p.timestamp - point.timestamp).total_seconds()), default=None)
    if best is None or abs((best.timestamp - point.timestamp).total_seconds()) > tolerance:
        return None
    return best


def _interaction_type(type_a: str, type_b: str) -> str:
    types = {type_a.upper(), type_b.upper()}
    if "FISHING" in types and types & SUPPORT_VESSEL_TYPES:
        return "POSSIBLE_TRANSSHIPMENT"
    return "RENDEZVOUS"


def _build(run: List[_Sample], type_a: str, type_b: str, proximity_km: float) -> VesselInteraction:
    closest = min(run, key=lambda s: s.distance_km)
    duration_hours = (run[-1].timestamp - run[0].timestamp).total_seconds() / 3600.0
    confidence = clamp(0.5 + 0.25 * min(duration_hours, 1.0) + 0.25 * (1.0 - closest.distance_km / proximity_km))
    return VesselInteraction(
        start_time=run[0].timestamp,
        end_time=run[-1].timestamp,
        minimum_distance_km=closest.distance_km,
        latitude=closest.latitude,
        longitude=closest.longitude,
        interaction_type=_interaction_type(type_a, type_b),
        confidence=round(confidence, 2),
    )


def detect_rendezvous(
    track_a: Sequence[KinematicPoint],
    track_b: Sequence[KinematicPoint],
    type_a: str,
    type_b: str,
    proximity_km: float = PROXIMITY_KM,
    min_duration_seconds: float = MIN_DURATION_SECONDS,
    time_tolerance_seconds: float = TIME_TOLERANCE_SECONDS,
) -> List[VesselInteraction]:
    """Contiguous stretches where the vessels stay within proximity_km for at least min_duration_seconds."""
    interactions: List[VesselInteraction] = []
    run: List[_Sample] = []

    def flush():
        if run and (run[-1].timestamp - run[0].timestamp).total_seconds() >= min_duration_seconds:
            interactions.append(_build(run, type_a, type_b, proximity_km))
        run.clear()

    for a in sorted(track_a, key=lambda p: p.timestamp):
        b = _nearest_in_time(a, track_b, time_tolerance_seconds)
        if b is None:
            flush()
            continue
        distance = haversine_distance(a.latitude, a.longitude, b.latitude, b.longitude)
        if distance <= proximity_km:
            run.append(_Sample(a.timestamp, distance, (a.latitude + b.latitude) / 2, (a.longitude + b.longitude) / 2))
        else:
            flush()
    flush()
    return interactions
