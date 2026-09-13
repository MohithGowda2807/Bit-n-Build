import json

from app.models.cleanup_unit import CleanupUnit
from app.models.mission import Mission
from app.services.debris.fleet_service import advance_fleet


def _dispatch(db, status="transit"):
    """A unit sitting at its deployment base with a mission whose first waypoint is that base."""
    unit = CleanupUnit(unit_name="Test ASV", unit_type="asv_skimmer", latitude=10.0, longitude=72.0,
                       speed_knots=8.0, battery_pct=90.0, capacity_kg=1500.0, current_load_kg=0.0, status=status)
    db.add(unit)
    db.flush()
    waypoints = [
        {"waypoint_index": 0, "latitude": 10.0, "longitude": 72.0, "action": "transit", "label": "Base"},
        {"waypoint_index": 1, "latitude": 10.5, "longitude": 72.0, "action": "collect", "label": "Patch"},
        {"waypoint_index": 2, "latitude": 10.0, "longitude": 72.0, "action": "dock", "label": "Base"},
    ]
    mission = Mission(mission_name="Test sortie", mission_type="debris_cleanup", status="active",
                      assigned_unit_id=unit.id, waypoints_json=json.dumps(waypoints), approval_status="approved")
    db.add(mission)
    db.flush()
    unit.assigned_mission_id = mission.id
    db.commit()
    return unit


def test_unit_leaves_its_base_across_consecutive_ticks(db):
    unit = _dispatch(db)
    advance_fleet(db, dt_hours=0.25)
    advance_fleet(db, dt_hours=0.25)
    db.refresh(unit)
    assert unit.latitude > 10.0, "the unit must move toward the collect point, not re-arrive at its base every tick"
    assert unit.current_waypoint_index == 1
    assert unit.status == "transit"


def test_collection_finishes_across_ticks_because_the_timer_is_persisted(db):
    unit = _dispatch(db, status="collecting")
    unit.latitude, unit.longitude, unit.current_waypoint_index = 10.5, 72.0, 1
    db.commit()
    for _ in range(7):
        advance_fleet(db, dt_hours=0.25)
    db.refresh(unit)
    assert unit.current_load_kg > 0
    assert unit.status == "transit" and unit.current_waypoint_index == 2


def test_advance_returns_telemetry_for_active_units_only(db):
    _dispatch(db)
    idle = CleanupUnit(unit_name="Idle ASV", unit_type="asv_skimmer", latitude=9.0, longitude=71.0, status="idle")
    db.add(idle)
    db.commit()
    telemetry = advance_fleet(db, dt_hours=0.25)
    assert [t["unit_name"] for t in telemetry] == ["Test ASV"]
