"""Advance every active cleanup unit by one simulation tick and persist the result.

The simulator object is rebuilt from the database on each tick, so the two
pieces of progress it keeps between steps, the waypoint it is heading for and
how long it has been collecting, must round-trip through the unit row. Without
them a unit re-arrives at its first waypoint forever and never leaves its base.
"""
import json
from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.models.cleanup_unit import CleanupUnit
from app.models.mission import Mission
from app.services.debris.fleet_simulator import AutonomousUnitState

ACTIVE_STATUSES = ("transit", "collecting", "returning")


def _waypoints(db: Session, unit: CleanupUnit) -> List[Dict[str, Any]]:
    if not unit.assigned_mission_id:
        return []
    mission = db.get(Mission, unit.assigned_mission_id)
    if not mission or not mission.waypoints_json:
        return []
    try:
        return json.loads(mission.waypoints_json)
    except ValueError:
        return []


def advance_fleet(db: Session, dt_hours: float = 0.05) -> List[Dict[str, Any]]:
    """Step every transit, collecting or returning unit; returns their telemetry for broadcast."""
    telemetry: List[Dict[str, Any]] = []
    units = db.query(CleanupUnit).filter(CleanupUnit.status.in_(ACTIVE_STATUSES)).all()
    for unit in units:
        sim = AutonomousUnitState(
            unit_id=unit.id, unit_name=unit.unit_name, unit_type=unit.unit_type,
            latitude=unit.latitude, longitude=unit.longitude, battery_pct=unit.battery_pct,
            capacity_kg=unit.capacity_kg, current_load_kg=unit.current_load_kg, speed_knots=unit.speed_knots,
            status=unit.status, waypoints=_waypoints(db, unit),
            current_waypoint_index=unit.current_waypoint_index or 0,
            collection_timer_hours=unit.collection_timer_hours or 0.0,
        )
        state = sim.step(dt_hours=dt_hours)
        unit.latitude = state["latitude"]
        unit.longitude = state["longitude"]
        unit.heading_deg = state["heading_deg"]
        unit.battery_pct = state["battery_pct"]
        unit.current_load_kg = state["current_load_kg"]
        unit.status = state["status"]
        unit.current_waypoint_index = state["current_waypoint_index"]
        unit.collection_timer_hours = sim.collection_timer_hours
        telemetry.append(state)
    db.commit()
    return telemetry
