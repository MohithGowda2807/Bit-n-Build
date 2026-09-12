import json
from datetime import datetime, timedelta, timezone

from app.models.fishing_zone import FishingZone
from app.models.marine_protected_area import MarineProtectedArea
from app.services.surveillance.geofence import GeofenceEngine, TrackPoint

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)

# 0.2 degree square centred on (13.5, 71.5), GeoJSON order is [lon, lat].
SQUARE = json.dumps({
    "type": "Polygon",
    "coordinates": [[[71.4, 13.4], [71.6, 13.4], [71.6, 13.6], [71.4, 13.6], [71.4, 13.4]]],
})


def _mpa():
    return MarineProtectedArea(name="Test Reef", geometry_geojson=SQUARE, protection_level="NO_TAKE", authority="Test")


def test_zone_models_persist_with_geojson_geometry(db):
    db.add(FishingZone(name="Restricted Bank", geometry_geojson=SQUARE, zone_type="NO_FISHING", jurisdiction="IN"))
    db.add(_mpa())
    db.commit()
    assert db.query(FishingZone).one().zone_type == "NO_FISHING"
    assert db.query(MarineProtectedArea).one().protection_level == "NO_TAKE"


def test_point_inside_and_outside_zone():
    engine = GeofenceEngine()
    assert engine.is_inside(13.5, 71.5, _mpa()) is True
    assert engine.is_inside(12.0, 70.0, _mpa()) is False


def test_distance_to_zone_is_zero_inside_and_positive_outside():
    engine = GeofenceEngine()
    assert engine.distance_to_zone_km(13.5, 71.5, _mpa()) == 0.0
    # 0.1 degree of latitude south of the boundary is roughly 11 km.
    outside = engine.distance_to_zone_km(13.3, 71.5, _mpa())
    assert 10.5 < outside < 11.5


def test_trajectory_intersection_and_entry_exit_events():
    engine = GeofenceEngine()
    track = [
        TrackPoint(T0, 13.2, 71.5),
        TrackPoint(T0 + timedelta(minutes=10), 13.45, 71.5),  # entered
        TrackPoint(T0 + timedelta(minutes=20), 13.55, 71.5),  # still inside
        TrackPoint(T0 + timedelta(minutes=30), 13.8, 71.5),   # exited
    ]
    assert engine.trajectory_intersects_zone(track, _mpa()) is True
    transitions = engine.zone_transitions(track, _mpa())
    assert [(t.kind, t.timestamp) for t in transitions] == [
        ("ZONE_ENTRY", T0 + timedelta(minutes=10)),
        ("ZONE_EXIT", T0 + timedelta(minutes=30)),
    ]
    assert transitions[0].dwell_seconds is None
    assert transitions[1].dwell_seconds == 20 * 60


def test_track_that_never_touches_zone_has_no_transitions():
    engine = GeofenceEngine()
    track = [TrackPoint(T0, 12.0, 70.0), TrackPoint(T0 + timedelta(minutes=10), 12.1, 70.1)]
    assert engine.trajectory_intersects_zone(track, _mpa()) is False
    assert engine.zone_transitions(track, _mpa()) == []
