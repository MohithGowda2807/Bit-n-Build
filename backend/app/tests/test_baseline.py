from datetime import datetime, timedelta, timezone

from app.services.surveillance.baseline import (
    MIN_BASELINE_POINTS, assess_deviation, build_profile, split_track,
)
from app.services.surveillance.features import KinematicPoint

T0 = datetime(2026, 9, 12, 6, 0, tzinfo=timezone.utc)


def _track(minutes, speed, course, start_minute=0, lat=12.0, lon=72.0, jitter=0.0):
    """Five-minute reports at a steady speed; `jitter` alternates the course to imitate trawling."""
    points = []
    for i, minute in enumerate(range(start_minute, start_minute + minutes, 5)):
        heading = course + (jitter if i % 2 == 0 else -jitter)
        points.append(KinematicPoint(T0 + timedelta(minutes=minute), lat + minute * 0.001, lon + minute * 0.001, speed, heading))
    return points


def test_profile_needs_a_minimum_history():
    assert build_profile(_track(minutes=5 * (MIN_BASELINE_POINTS - 1), speed=8.0, course=45.0)) is None
    profile = build_profile(_track(minutes=120, speed=8.0, course=45.0))
    assert profile is not None
    assert abs(profile.average_speed - 8.0) < 1e-6 and profile.speed_stddev == 0.0
    assert profile.point_count == 24


def test_split_track_keeps_the_last_hours_as_recent():
    track = _track(minutes=240, speed=8.0, course=45.0)
    history, recent = split_track(track, recent_hours=2.0)
    assert history[-1].timestamp < recent[0].timestamp
    assert recent[0].timestamp == track[-1].timestamp - timedelta(hours=2) + timedelta(minutes=5)
    assert len(history) + len(recent) == len(track)


def test_steady_transit_does_not_deviate_from_its_own_baseline():
    track = _track(minutes=240, speed=12.0, course=90.0)
    history, recent = split_track(track, recent_hours=2.0)
    deviation = assess_deviation(build_profile(history), recent)
    assert deviation is not None
    assert deviation.score < 20


def test_slow_zigzag_after_a_transit_is_a_strong_deviation():
    history = _track(minutes=120, speed=8.0, course=45.0)
    recent = _track(minutes=120, speed=3.0, course=45.0, start_minute=120, jitter=80.0)
    deviation = assess_deviation(build_profile(history), recent)
    assert deviation.score > 40
    assert "8.0 kn" in deviation.explanation and "3.0 kn" in deviation.explanation
    assert deviation.speed_z > 3


def test_new_gaps_in_the_recent_window_add_to_the_deviation():
    history = _track(minutes=120, speed=8.0, course=45.0)
    recent = _track(minutes=120, speed=8.0, course=45.0, start_minute=120)
    quiet = assess_deviation(build_profile(history), recent)
    dark = assess_deviation(build_profile(history), recent, recent_gaps=1)
    assert dark.score > quiet.score
    assert "AIS gap" in dark.explanation
