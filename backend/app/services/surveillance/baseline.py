"""Vessel behavior baseline and deviation scoring (spec sections 30-33, 83).

A profile summarises how a vessel normally moves: speed, turning rate, AIS gap
rate and the grid cells it usually works. The current activity window of its
track is then compared against that profile. Profiles are learned from stored
history when enough exists; otherwise the provider supplies one (the scripted
scenarios carry a 30-day history per vessel type).
"""
import math
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import List, Optional, Sequence, Tuple

from app.services.surveillance.features import KinematicPoint, compute_features
from app.services.surveillance.levels import clamp

MIN_BASELINE_POINTS = 6
MIN_RECENT_POINTS = 6
CELL_DEGREES = 0.25
COMMON_CELL_LIMIT = 5

SPEED_STDDEV_FLOOR_KNOTS = 1.0     # a perfectly steady history must not make tiny changes look extreme
SPEED_Z_FULL_SCORE = 3.0           # z of 3 earns the full speed component
TURNING_FLOOR_DEG_PER_HOUR = 20.0
TURNING_RATIO_FULL_SCORE = 3.0     # turning three times the usual rate earns the full turning component
MAX_SPEED_COMPONENT = 60.0
MAX_TURNING_COMPONENT = 20.0
NEW_GAP_COMPONENT = 20.0


@dataclass(frozen=True)
class BehaviorProfile:
    point_count: int
    hours_observed: float
    average_speed: float
    speed_stddev: float
    course_change_rate_deg_per_hour: float
    gap_count: int
    common_cells: List[str]
    window_start: datetime
    window_end: datetime

    @property
    def gaps_per_hour(self) -> float:
        return self.gap_count / self.hours_observed if self.hours_observed > 0 else 0.0


@dataclass(frozen=True)
class BehaviorDeviation:
    score: int
    speed_z: float
    baseline_speed: float
    recent_speed: float
    turning_ratio: float
    new_gaps: int
    explanation: str


def cell_of(latitude: float, longitude: float) -> str:
    return f"{math.floor(latitude / CELL_DEGREES) * CELL_DEGREES:.2f},{math.floor(longitude / CELL_DEGREES) * CELL_DEGREES:.2f}"


def split_track(track: Sequence[KinematicPoint], recent_hours: float) -> Tuple[List[KinematicPoint], List[KinematicPoint]]:
    """History and recent window; the recent window is the last `recent_hours` before the newest report."""
    points = sorted(track, key=lambda p: p.timestamp)
    if not points:
        return [], []
    cutoff = points[-1].timestamp - timedelta(hours=recent_hours)
    history = [p for p in points if p.timestamp <= cutoff]
    recent = [p for p in points if p.timestamp > cutoff]
    return history, recent


def build_profile(track: Sequence[KinematicPoint], gap_count: int = 0) -> Optional[BehaviorProfile]:
    points = sorted(track, key=lambda p: p.timestamp)
    if len(points) < MIN_BASELINE_POINTS:
        return None
    features = compute_features(points)
    cells = Counter(cell_of(p.latitude, p.longitude) for p in points)
    return BehaviorProfile(
        point_count=len(points),
        hours_observed=features.duration_seconds / 3600.0,
        average_speed=features.speed_mean,
        speed_stddev=features.speed_stddev,
        course_change_rate_deg_per_hour=features.course_change_rate_deg_per_hour,
        gap_count=gap_count,
        common_cells=[cell for cell, _ in cells.most_common(COMMON_CELL_LIMIT)],
        window_start=points[0].timestamp,
        window_end=points[-1].timestamp,
    )


def assess_deviation(profile: Optional[BehaviorProfile], recent: Sequence[KinematicPoint],
                     recent_gaps: int = 0) -> Optional[BehaviorDeviation]:
    if profile is None or len(recent) < MIN_RECENT_POINTS:
        return None
    features = compute_features(recent)

    speed_z = abs(features.speed_mean - profile.average_speed) / max(profile.speed_stddev, SPEED_STDDEV_FLOOR_KNOTS)
    speed_component = MAX_SPEED_COMPONENT * clamp(speed_z / SPEED_Z_FULL_SCORE)

    usual_turning = max(profile.course_change_rate_deg_per_hour, TURNING_FLOOR_DEG_PER_HOUR)
    turning_ratio = features.course_change_rate_deg_per_hour / usual_turning
    turning_component = MAX_TURNING_COMPONENT * clamp((turning_ratio - 1.0) / (TURNING_RATIO_FULL_SCORE - 1.0))

    gap_component = NEW_GAP_COMPONENT if recent_gaps > 0 and profile.gaps_per_hour == 0 else 0.0

    score = int(round(min(100.0, speed_component + turning_component + gap_component)))
    return BehaviorDeviation(
        score=score, speed_z=round(speed_z, 2), baseline_speed=round(profile.average_speed, 2),
        recent_speed=round(features.speed_mean, 2), turning_ratio=round(turning_ratio, 2), new_gaps=recent_gaps,
        explanation=_explain(profile, features.speed_mean, speed_z, turning_ratio, recent_gaps, gap_component),
    )


def _explain(profile: BehaviorProfile, recent_speed: float, speed_z: float, turning_ratio: float,
             recent_gaps: int, gap_component: float) -> str:
    if speed_z < 0.5:
        parts = [f"speed near its usual {profile.average_speed:.1f} kn"]
    else:
        direction = "below" if recent_speed < profile.average_speed else "above"
        parts = [f"usually {profile.average_speed:.1f} kn, now {recent_speed:.1f} kn ({speed_z:.1f} sd {direction})"]
    if turning_ratio > 1.0:
        parts.append(f"turning {turning_ratio:.0f}x more than usual")
    if gap_component:
        noun = "AIS gap" if recent_gaps == 1 else "AIS gaps"
        parts.append(f"{recent_gaps} new {noun} with none in its history")
    return "Behavior departs from this vessel's baseline: " + "; ".join(parts)
