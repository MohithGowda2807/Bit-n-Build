"""Loitering: a vessel staying slow inside a small area for a long time."""
from dataclasses import dataclass
from typing import Sequence

from app.services.surveillance.features import KinematicPoint, compute_features
from app.services.surveillance.levels import clamp, level_for

SPEED_THRESHOLD_KNOTS = 3.0
RADIUS_THRESHOLD_KM = 3.0
FULL_SCORE_HOURS = 2.0


@dataclass(frozen=True)
class LoiteringResult:
    score: int
    level: str
    duration_seconds: float
    movement_radius_km: float
    mean_speed_knots: float


def assess_loitering(
    track: Sequence[KinematicPoint],
    speed_threshold_knots: float = SPEED_THRESHOLD_KNOTS,
    radius_threshold_km: float = RADIUS_THRESHOLD_KM,
    full_score_hours: float = FULL_SCORE_HOURS,
) -> LoiteringResult:
    features = compute_features(track)
    if features.point_count < 2:
        return LoiteringResult(0, "LOW", 0.0, 0.0, 0.0)

    duration_factor = clamp(features.duration_seconds / 3600.0 / full_score_hours)
    radius_factor = clamp(1.0 - features.movement_radius_km / (2.0 * radius_threshold_km))
    speed_factor = clamp(1.0 - features.speed_mean / (2.0 * speed_threshold_knots))
    score = round(100.0 * duration_factor * min(radius_factor, speed_factor))

    return LoiteringResult(
        score=score,
        level=level_for(score),
        duration_seconds=features.duration_seconds,
        movement_radius_km=features.movement_radius_km,
        mean_speed_knots=features.speed_mean,
    )
