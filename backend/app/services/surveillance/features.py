"""Kinematic feature extraction over a single vessel track (spec section 81)."""
import math
from dataclasses import dataclass
from datetime import datetime
from typing import Iterable, List, Sequence

from app.services.ais.provider import AISReport
from app.services.routing.geometry import haversine_distance

LOW_SPEED_KNOTS = 5.0
STATIONARY_KNOTS = 0.5


@dataclass(frozen=True)
class KinematicPoint:
    timestamp: datetime
    latitude: float
    longitude: float
    speed_over_ground: float
    course_over_ground: float


@dataclass(frozen=True)
class VesselFeatures:
    point_count: int
    duration_seconds: float
    speed_mean: float
    speed_stddev: float
    course_change_rate_deg_per_hour: float
    time_at_low_speed_seconds: float
    time_stationary_seconds: float
    distance_traveled_km: float
    movement_radius_km: float


EMPTY_FEATURES = VesselFeatures(0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)


def kinematic_points_from_reports(reports: Iterable[AISReport]) -> List[KinematicPoint]:
    return [
        KinematicPoint(r.timestamp, r.latitude, r.longitude, r.speed_over_ground or 0.0, r.course_over_ground or 0.0)
        for r in reports
    ]


def course_delta(a: float, b: float) -> float:
    """Smallest absolute angle between two courses in degrees (0-180)."""
    diff = abs(a - b) % 360.0
    return 360.0 - diff if diff > 180.0 else diff


def compute_features(track: Sequence[KinematicPoint], low_speed_knots: float = LOW_SPEED_KNOTS) -> VesselFeatures:
    points = sorted(track, key=lambda p: p.timestamp)
    if not points:
        return EMPTY_FEATURES

    speeds = [p.speed_over_ground for p in points]
    mean = sum(speeds) / len(speeds)
    stddev = math.sqrt(sum((s - mean) ** 2 for s in speeds) / len(speeds))
    duration = (points[-1].timestamp - points[0].timestamp).total_seconds()

    distance = 0.0
    turning = 0.0
    low_speed_time = 0.0
    stationary_time = 0.0
    for previous, current in zip(points, points[1:]):
        distance += haversine_distance(previous.latitude, previous.longitude, current.latitude, current.longitude)
        turning += course_delta(previous.course_over_ground, current.course_over_ground)
        interval = (current.timestamp - previous.timestamp).total_seconds()
        if previous.speed_over_ground < low_speed_knots:
            low_speed_time += interval
        if previous.speed_over_ground < STATIONARY_KNOTS:
            stationary_time += interval

    centroid_lat = sum(p.latitude for p in points) / len(points)
    centroid_lon = sum(p.longitude for p in points) / len(points)
    radius = max(haversine_distance(centroid_lat, centroid_lon, p.latitude, p.longitude) for p in points)
    hours = duration / 3600.0

    return VesselFeatures(
        point_count=len(points),
        duration_seconds=duration,
        speed_mean=mean,
        speed_stddev=stddev,
        course_change_rate_deg_per_hour=turning / hours if hours > 0 else 0.0,
        time_at_low_speed_seconds=low_speed_time,
        time_stationary_seconds=stationary_time,
        distance_traveled_km=distance,
        movement_radius_km=radius,
    )
