"""Fishing-like movement: slow but moving, frequent turns, variable speed.

Scored over sliding one-hour windows so a short bout of fishing is not diluted
by hours of transit. These are indicators, not proof; the score feeds the risk
engine as one input.
"""
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import List, Optional, Sequence

from app.services.surveillance.features import EMPTY_FEATURES, KinematicPoint, VesselFeatures, compute_features
from app.services.surveillance.levels import clamp, level_for

TURNING_FULL_SCORE_DEG_PER_HOUR = 240.0
SPEED_STDDEV_FULL_SCORE_KNOTS = 3.0
MIN_DURATION_SECONDS = 30 * 60
WINDOW = timedelta(hours=1)
STEP = timedelta(minutes=10)

WEIGHT_SLOW_MOVING = 40.0
WEIGHT_TURNING = 40.0
WEIGHT_SPEED_VARIABILITY = 20.0


@dataclass(frozen=True)
class FishingActivityResult:
    score: int
    level: str
    features: VesselFeatures
    window_start: Optional[datetime] = None
    window_end: Optional[datetime] = None


def _score_window(points: Sequence[KinematicPoint]) -> tuple:
    features = compute_features(points)
    if features.duration_seconds <= 0:
        return 0, features
    slow_moving_seconds = features.time_at_low_speed_seconds - features.time_stationary_seconds
    slow_moving_fraction = clamp(slow_moving_seconds / features.duration_seconds)
    turning_factor = clamp(features.course_change_rate_deg_per_hour / TURNING_FULL_SCORE_DEG_PER_HOUR)
    variability_factor = clamp(features.speed_stddev / SPEED_STDDEV_FULL_SCORE_KNOTS)
    raw = (
        WEIGHT_SLOW_MOVING * slow_moving_fraction
        + WEIGHT_TURNING * turning_factor
        + WEIGHT_SPEED_VARIABILITY * variability_factor
    )
    duration_factor = clamp(features.duration_seconds / MIN_DURATION_SECONDS)
    return round(raw * duration_factor), features


def _windows(points: List[KinematicPoint]) -> List[List[KinematicPoint]]:
    start, end = points[0].timestamp, points[-1].timestamp
    if end - start <= WINDOW:
        return [points]
    windows = []
    cursor = start
    while cursor + WINDOW <= end + STEP:
        window = [p for p in points if cursor <= p.timestamp <= cursor + WINDOW]
        if len(window) >= 2:
            windows.append(window)
        cursor += STEP
    return windows


def assess_fishing_activity(track: Sequence[KinematicPoint]) -> FishingActivityResult:
    points = sorted(track, key=lambda p: p.timestamp)
    if len(points) < 2:
        return FishingActivityResult(0, "LOW", EMPTY_FEATURES)

    best_score, best_features, best_window = -1, EMPTY_FEATURES, points
    for window in _windows(points):
        score, features = _score_window(window)
        if score > best_score:
            best_score, best_features, best_window = score, features, window

    return FishingActivityResult(
        score=best_score,
        level=level_for(best_score),
        features=best_features,
        window_start=best_window[0].timestamp,
        window_end=best_window[-1].timestamp,
    )
