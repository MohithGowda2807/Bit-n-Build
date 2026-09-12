from datetime import datetime, timezone

from app.services.ais.simulation import SimulationAISProvider
from app.services.surveillance.features import kinematic_points_from_reports
from app.services.surveillance.loitering import assess_loitering

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)


def _scenario_track(name):
    provider = SimulationAISProvider(name, start_time=T0)
    return kinematic_points_from_reports(provider.get_positions())


def test_loitering_scenario_scores_high():
    result = assess_loitering(_scenario_track("LOITERING"))
    assert result.score >= 60
    assert result.level in ("HIGH", "CRITICAL")
    assert result.movement_radius_km < 3.0
    assert result.mean_speed_knots < 3.0


def test_normal_transit_scores_low():
    result = assess_loitering(_scenario_track("NORMAL_VESSEL"))
    assert result.score < 10
    assert result.level == "LOW"


def test_empty_track_scores_zero():
    assert assess_loitering([]).score == 0
