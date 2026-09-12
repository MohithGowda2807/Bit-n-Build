from datetime import datetime, timedelta, timezone

from app.services.surveillance.ais_gap import detect_ais_gaps, Observation

T0 = datetime(2026, 9, 12, 10, 0, tzinfo=timezone.utc)


def obs(minutes, lat=12.0, lon=72.0):
    return Observation(timestamp=T0 + timedelta(minutes=minutes), latitude=lat, longitude=lon)


def test_regular_reporting_produces_no_gaps():
    track = [obs(0), obs(5), obs(10), obs(15)]
    assert detect_ais_gaps(track, threshold_seconds=600) == []


def test_spec_scenario_detects_single_dark_period_with_true_elapsed_time():
    # 10:00, 10:05, 10:10 reported; 10:15, 10:20, 10:25 missing; 10:30 reported.
    track = [obs(0), obs(5), obs(10, 12.0, 72.0), obs(30, 12.1, 72.1)]
    gaps = detect_ais_gaps(track, threshold_seconds=600)
    assert len(gaps) == 1
    gap = gaps[0]
    assert gap.start_time == T0 + timedelta(minutes=10)
    assert gap.end_time == T0 + timedelta(minutes=30)
    assert gap.duration_seconds == 20 * 60
    assert (gap.last_latitude, gap.last_longitude) == (12.0, 72.0)
    assert (gap.reappearance_latitude, gap.reappearance_longitude) == (12.1, 72.1)
    assert 15.0 < gap.estimated_distance_km < 16.0


def test_unordered_observations_are_sorted_before_detection():
    track = [obs(30), obs(0), obs(10), obs(5)]
    gaps = detect_ais_gaps(track, threshold_seconds=600)
    assert len(gaps) == 1
    assert gaps[0].start_time == T0 + timedelta(minutes=10)


def test_vessel_currently_silent_yields_open_gap():
    track = [obs(0), obs(5)]
    now = T0 + timedelta(minutes=40)
    gaps = detect_ais_gaps(track, threshold_seconds=600, now=now)
    assert len(gaps) == 1
    gap = gaps[0]
    assert gap.end_time is None
    assert gap.duration_seconds == 35 * 60
    assert gap.reappearance_latitude is None
    assert gap.estimated_distance_km is None
