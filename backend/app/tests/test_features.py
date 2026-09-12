from datetime import datetime, timedelta, timezone

from app.services.surveillance.features import KinematicPoint, compute_features

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)


def pt(minutes, lat, lon, sog, cog):
    return KinematicPoint(T0 + timedelta(minutes=minutes), lat, lon, sog, cog)


def test_straight_transit_features():
    track = [pt(i * 10, 12.0 + i * 0.05, 72.0, 12.0, 0.0) for i in range(7)]  # 1 hour due north
    f = compute_features(track)
    assert f.duration_seconds == 3600
    assert f.speed_mean == 12.0
    assert f.speed_stddev == 0.0
    assert f.course_change_rate_deg_per_hour == 0.0
    assert f.time_at_low_speed_seconds == 0
    assert 32 < f.distance_traveled_km < 34
    assert 16 < f.movement_radius_km < 17


def test_zigzag_track_has_high_turning_and_low_speed_time():
    track = [pt(i * 10, 12.0, 72.0 + (0.001 if i % 2 else 0.0), 2.0, 90.0 if i % 2 else 270.0) for i in range(7)]
    f = compute_features(track)
    assert f.course_change_rate_deg_per_hour == 6 * 180 / 1.0
    assert f.time_at_low_speed_seconds == 3600
    assert f.movement_radius_km < 0.1


def test_course_change_wraps_around_north():
    track = [pt(0, 12.0, 72.0, 5.0, 350.0), pt(60, 12.1, 72.0, 5.0, 10.0)]
    assert compute_features(track).course_change_rate_deg_per_hour == 20.0


def test_empty_and_single_point_tracks_are_safe():
    assert compute_features([]).duration_seconds == 0
    assert compute_features([pt(0, 12.0, 72.0, 0.0, 0.0)]).distance_traveled_km == 0.0
