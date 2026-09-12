"""AIS gap (dark period) detection over a single vessel's observations.

A gap is any silence between consecutive AIS messages longer than the
configured threshold. Duration is the true elapsed time between the last
message before the silence and the first message after it. A gap is
reported as an anomaly to investigate, never as proof of wrongdoing.
"""
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional, Sequence

from app.services.routing.geometry import haversine_distance


@dataclass(frozen=True)
class Observation:
    timestamp: datetime
    latitude: float
    longitude: float


@dataclass(frozen=True)
class AISGap:
    start_time: datetime
    end_time: Optional[datetime]  # None while the vessel is still silent
    duration_seconds: float
    last_latitude: float
    last_longitude: float
    reappearance_latitude: Optional[float]
    reappearance_longitude: Optional[float]
    estimated_distance_km: Optional[float]


def detect_ais_gaps(
    observations: Sequence[Observation],
    threshold_seconds: float,
    now: Optional[datetime] = None,
) -> List[AISGap]:
    """Return every silence longer than threshold_seconds, oldest first.

    If `now` is given and the vessel has been silent since its last
    observation for longer than the threshold, an open gap is appended.
    """
    track = sorted(observations, key=lambda o: o.timestamp)
    gaps: List[AISGap] = []

    for previous, current in zip(track, track[1:]):
        silence = (current.timestamp - previous.timestamp).total_seconds()
        if silence > threshold_seconds:
            gaps.append(AISGap(
                start_time=previous.timestamp,
                end_time=current.timestamp,
                duration_seconds=silence,
                last_latitude=previous.latitude,
                last_longitude=previous.longitude,
                reappearance_latitude=current.latitude,
                reappearance_longitude=current.longitude,
                estimated_distance_km=haversine_distance(
                    previous.latitude, previous.longitude, current.latitude, current.longitude
                ),
            ))

    if now is not None and track:
        last = track[-1]
        silence = (now - last.timestamp).total_seconds()
        if silence > threshold_seconds:
            gaps.append(AISGap(
                start_time=last.timestamp,
                end_time=None,
                duration_seconds=silence,
                last_latitude=last.latitude,
                last_longitude=last.longitude,
                reappearance_latitude=None,
                reappearance_longitude=None,
                estimated_distance_km=None,
            ))

    return gaps
