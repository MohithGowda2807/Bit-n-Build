import json
from datetime import datetime, timedelta, timezone

from app.data.surveillance_seed import seed_surveillance_zones
from app.models.fishing_zone import FishingZone
from app.models.marine_protected_area import MarineProtectedArea
from app.models.surveillance_event import SurveillanceEvent
from app.services.ais.simulation import SimulationAISProvider
from app.services.surveillance.analyzer import SurveillanceAnalyzer
from app.services.surveillance.features import kinematic_points_from_reports

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)


def _analyzer(db):
    seed_surveillance_zones(db)
    return SurveillanceAnalyzer(db.query(FishingZone).all(), db.query(MarineProtectedArea).all())


def _track(scenario, mmsi=None):
    provider = SimulationAISProvider(scenario, start_time=T0)
    vessels = provider.get_vessels()
    info = next(v for v in vessels if mmsi is None or v.mmsi == mmsi)
    return info, kinematic_points_from_reports(provider.get_track(info.mmsi, T0, T0 + timedelta(hours=6)))


def test_mpa_intrusion_yields_entry_and_exit_events(db):
    info, track = _track("MPA_INTRUSION")
    events = _analyzer(db).analyze_vessel(vessel_id=1, track=track)
    kinds = [(e.event_type, e.zone_kind) for e in events]
    assert ("ZONE_ENTRY", "MARINE_PROTECTED_AREA") in kinds
    assert ("ZONE_EXIT", "MARINE_PROTECTED_AREA") in kinds
    exit_event = next(e for e in events if e.event_type == "ZONE_EXIT")
    assert exit_event.payload["dwell_seconds"] > 3600
    assert exit_event.zone_name


def test_suspicious_fishing_yields_fishing_pattern_in_restricted_zone(db):
    info, track = _track("SUSPICIOUS_FISHING")
    events = _analyzer(db).analyze_vessel(vessel_id=1, track=track)
    fishing = next(e for e in events if e.event_type == "FISHING_PATTERN")
    assert fishing.score >= 60
    assert any(e.event_type == "ZONE_ENTRY" and e.zone_kind == "FISHING_ZONE" for e in events)


def test_loitering_scenario_yields_loitering_event(db):
    info, track = _track("LOITERING")
    events = _analyzer(db).analyze_vessel(vessel_id=1, track=track)
    assert any(e.event_type == "LOITERING" and e.score >= 60 for e in events)


def test_normal_transit_yields_no_events(db):
    info, track = _track("NORMAL_VESSEL")
    assert _analyzer(db).analyze_vessel(vessel_id=1, track=track) == []


def test_rendezvous_pair_yields_mirrored_events(db):
    info_a, track_a = _track("VESSEL_RENDEZVOUS", "419000601")
    info_b, track_b = _track("VESSEL_RENDEZVOUS", "353000602")
    events = _analyzer(db).analyze_pair(1, track_a, info_a.vessel_type, 2, track_b, info_b.vessel_type)
    assert [e.event_type for e in events] == ["VESSEL_RENDEZVOUS", "VESSEL_RENDEZVOUS"]
    assert {(e.vessel_id, e.other_vessel_id) for e in events} == {(1, 2), (2, 1)}
    assert events[0].payload["interaction_type"] == "POSSIBLE_TRANSSHIPMENT"


def test_detected_event_persists_with_payload(db):
    info, track = _track("LOITERING")
    detected = next(e for e in _analyzer(db).analyze_vessel(vessel_id=1, track=track) if e.event_type == "LOITERING")
    db.add(SurveillanceEvent.from_detected(detected))
    db.commit()
    stored = db.query(SurveillanceEvent).one()
    assert stored.event_type == "LOITERING"
    assert json.loads(stored.payload_json) == detected.payload
    assert stored.score == detected.score


def test_fishing_pattern_event_is_anchored_inside_its_window_not_at_track_end(db):
    # DARK_FISHING_COMPOSITE fishes during minutes 60-140 and then transits for 150 more minutes.
    info, track = _track("DARK_FISHING_COMPOSITE", mmsi="419000801")
    events = _analyzer(db).analyze_vessel(vessel_id=1, track=track)
    fishing = next(e for e in events if e.event_type == "FISHING_PATTERN")
    window_start = datetime.fromisoformat(fishing.payload["window_start"])
    window_end = datetime.fromisoformat(fishing.payload["window_end"])
    assert window_start <= fishing.timestamp <= window_end
    assert fishing.timestamp < track[-1].timestamp - timedelta(hours=1)
    assert fishing.latitude != track[-1].latitude
