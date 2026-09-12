from datetime import datetime, timedelta, timezone

from app.services.ais.simulation import SimulationAISProvider
from app.services.surveillance.features import KinematicPoint, kinematic_points_from_reports
from app.services.surveillance.fishing_pattern import assess_fishing_activity

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)


def _scenario_track(name):
    provider = SimulationAISProvider(name, start_time=T0)
    return kinematic_points_from_reports(provider.get_positions())


def test_zigzag_fishing_scenario_scores_high():
    result = assess_fishing_activity(_scenario_track("SUSPICIOUS_FISHING"))
    assert result.score >= 60
    assert result.level in ("HIGH", "CRITICAL")


def test_straight_transit_scores_low():
    result = assess_fishing_activity(_scenario_track("NORMAL_VESSEL"))
    assert result.score < 20
    assert result.level == "LOW"


def test_stationary_vessel_is_not_fishing_like():
    track = [KinematicPoint(T0 + timedelta(minutes=10 * i), 12.0, 72.0, 0.0, 0.0) for i in range(13)]
    assert assess_fishing_activity(track).score < 20


def test_result_carries_contributing_features():
    result = assess_fishing_activity(_scenario_track("SUSPICIOUS_FISHING"))
    assert result.features.course_change_rate_deg_per_hour > 100
    assert result.features.time_at_low_speed_seconds >= 2700  # at least 45 min of the best hour was slow


def test_short_fishing_bout_after_long_transit_still_scores_high():
    """Windowed assessment: 3 hours of straight transit must not dilute 1 hour of fishing-like movement."""
    transit = [KinematicPoint(T0 + timedelta(minutes=5 * i), 12.0 + 0.0167 * i, 72.0, 12.0, 0.0) for i in range(36)]
    base_lat = transit[-1].latitude
    bout = [
        KinematicPoint(T0 + timedelta(minutes=180 + 5 * i), base_lat + 0.001 * i, 72.0 + (0.008 if i % 2 else 0.0),
                       2.5, 90.0 if i % 2 else 270.0)
        for i in range(13)
    ]
    result = assess_fishing_activity(transit + bout)
    assert result.score >= 60
    assert result.window_start is not None and result.window_start >= T0 + timedelta(minutes=150)


def test_dark_fishing_composite_scenario_is_registered_with_two_vessels():
    from app.services.ais.simulation import SCENARIOS
    assert len(SCENARIOS["DARK_FISHING_COMPOSITE"]) == 2
