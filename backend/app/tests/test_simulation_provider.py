from datetime import datetime, timedelta, timezone

from app.services.ais.simulation import SimulationAISProvider, SCENARIOS
from app.services.surveillance.ais_gap import detect_ais_gaps, Observation

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)


def _as_observations(reports):
    return [Observation(r.timestamp, r.latitude, r.longitude) for r in reports]


def test_normal_vessel_scenario_reports_regularly_without_gaps():
    provider = SimulationAISProvider("NORMAL_VESSEL", start_time=T0)
    vessels = provider.get_vessels()
    assert len(vessels) == 1
    track = provider.get_track(vessels[0].mmsi, T0, T0 + timedelta(hours=4))
    assert len(track) > 20
    assert detect_ais_gaps(_as_observations(track), threshold_seconds=1800) == []


def test_ais_gap_scenario_contains_one_scripted_dark_period():
    provider = SimulationAISProvider("AIS_GAP", start_time=T0)
    vessel = provider.get_vessels()[0]
    track = provider.get_track(vessel.mmsi, T0, T0 + timedelta(hours=4))
    gaps = detect_ais_gaps(_as_observations(track), threshold_seconds=1800)
    assert len(gaps) == 1
    assert gaps[0].duration_seconds >= 45 * 60


def test_reports_carry_speed_and_course_and_are_deterministic():
    a = SimulationAISProvider("NORMAL_VESSEL", start_time=T0).get_positions()
    b = SimulationAISProvider("NORMAL_VESSEL", start_time=T0).get_positions()
    assert [(r.timestamp, r.latitude, r.longitude) for r in a] == [(r.timestamp, r.latitude, r.longitude) for r in b]
    assert all(r.speed_over_ground > 0 for r in a)
    assert all(0 <= r.course_over_ground < 360 for r in a)
    assert all(r.source == "SIMULATION" for r in a)


def test_get_track_respects_time_window():
    provider = SimulationAISProvider("NORMAL_VESSEL", start_time=T0)
    mmsi = provider.get_vessels()[0].mmsi
    window = provider.get_track(mmsi, T0 + timedelta(hours=1), T0 + timedelta(hours=2))
    assert window
    assert all(T0 + timedelta(hours=1) <= r.timestamp <= T0 + timedelta(hours=2) for r in window)


def test_unknown_scenario_is_rejected():
    import pytest
    with pytest.raises(ValueError):
        SimulationAISProvider("NOT_A_SCENARIO", start_time=T0)


def test_all_seven_spec_scenarios_are_registered():
    assert set(SCENARIOS) >= {
        "NORMAL_VESSEL", "AIS_GAP", "SUSPICIOUS_FISHING", "MPA_INTRUSION",
        "LOITERING", "VESSEL_RENDEZVOUS", "TRANSIT_ANOMALY",
    }
