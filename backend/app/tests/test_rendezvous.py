from datetime import datetime, timedelta, timezone

from app.services.ais.simulation import SimulationAISProvider
from app.services.surveillance.features import kinematic_points_from_reports
from app.services.surveillance.rendezvous import detect_rendezvous

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)


def _tracks(name):
    provider = SimulationAISProvider(name, start_time=T0)
    end = T0 + timedelta(hours=6)
    return {v.mmsi: (v, kinematic_points_from_reports(provider.get_track(v.mmsi, T0, end)))
            for v in provider.get_vessels()}


def test_rendezvous_scenario_detects_one_meeting():
    tracks = _tracks("VESSEL_RENDEZVOUS")
    (info_a, track_a), (info_b, track_b) = tracks.values()
    interactions = detect_rendezvous(track_a, track_b, info_a.vessel_type, info_b.vessel_type)
    assert len(interactions) == 1
    meeting = interactions[0]
    assert (meeting.end_time - meeting.start_time) >= timedelta(minutes=30)
    assert meeting.minimum_distance_km < 1.0
    assert meeting.interaction_type == "POSSIBLE_TRANSSHIPMENT"  # fishing vessel meets cargo vessel
    assert 0.0 < meeting.confidence <= 1.0
    assert 12.1 < meeting.latitude < 12.2


def test_vessels_that_never_meet_produce_no_interaction():
    a = _tracks("NORMAL_VESSEL")["353000101"][1]
    b = _tracks("LOITERING")["419000501"][1]
    assert detect_rendezvous(a, b, "CARGO", "FISHING") == []


def test_two_fishing_vessels_meeting_is_a_plain_rendezvous():
    tracks = _tracks("VESSEL_RENDEZVOUS")
    (_, track_a), (_, track_b) = tracks.values()
    assert detect_rendezvous(track_a, track_b, "FISHING", "FISHING")[0].interaction_type == "RENDEZVOUS"
