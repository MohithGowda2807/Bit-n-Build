from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cleanup_unit import CleanupUnit
from app.models.mission import Mission
from app.schemas.cleanup_unit import (
    CleanupUnitResponse,
    CleanupUnitCreate,
    CleanupUnitUpdate,
    CleanupUnitCommandRequest
)
from app.services.debris.fleet_simulator import AutonomousUnitState

router = APIRouter(prefix="/api/v1/fleet", tags=["Autonomous Cleanup Fleet"])


@router.get("/units", response_model=List[CleanupUnitResponse])
def list_cleanup_units(
    status: Optional[str] = Query(None, description="Filter by status (idle, transit, collecting, returning, docked)"),
    unit_type: Optional[str] = Query(None, description="Filter by unit type (asv_skimmer, autonomous_drone)"),
    db: Session = Depends(get_db)
):
    """Retrieve all autonomous surface vehicles (ASVs) and marine cleanup drones."""
    query = db.query(CleanupUnit)
    if status:
        query = query.filter(CleanupUnit.status == status)
    if unit_type:
        query = query.filter(CleanupUnit.unit_type == unit_type)
    return query.order_by(CleanupUnit.id).all()


@router.get("/units/{unit_id}", response_model=CleanupUnitResponse)
def get_cleanup_unit(unit_id: int, db: Session = Depends(get_db)):
    """Retrieve telemetry and operational status for a single autonomous unit."""
    unit = db.query(CleanupUnit).filter(CleanupUnit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Cleanup unit not found")
    return unit


@router.post("/units", response_model=CleanupUnitResponse, status_code=201)
def register_cleanup_unit(unit_in: CleanupUnitCreate, db: Session = Depends(get_db)):
    """Register a new autonomous surface vehicle or marine drone in the fleet."""
    existing = db.query(CleanupUnit).filter(CleanupUnit.unit_name == unit_in.unit_name).first()
    if existing:
        raise HTTPException(status_code=400, detail="A unit with this name is already registered")

    data = unit_in.model_dump()
    unit = CleanupUnit(**data)
    db.add(unit)
    db.commit()
    db.refresh(unit)
    return unit


@router.post("/units/{unit_id}/command", response_model=CleanupUnitResponse)
def issue_unit_command(
    unit_id: int,
    command_req: CleanupUnitCommandRequest,
    db: Session = Depends(get_db)
):
    """Operator intervention / override: send commands (hold, return_to_base, resume, dispatch)."""
    unit = db.query(CleanupUnit).filter(CleanupUnit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Cleanup unit not found")

    cmd = command_req.command.lower().strip()
    if cmd == "hold":
        unit.status = "idle"
        unit.operator_override = "hold"
    elif cmd == "return_to_base":
        unit.status = "returning"
        unit.operator_override = "return_home"
    elif cmd == "resume":
        unit.operator_override = None
        if unit.assigned_mission_id:
            unit.status = "transit"
    else:
        unit.operator_override = cmd

    db.commit()
    db.refresh(unit)
    return unit


@router.post("/units/{unit_id}/step", response_model=CleanupUnitResponse)
def step_unit_simulation(
    unit_id: int,
    dt_hours: float = Query(0.25, ge=0.05, le=2.0),
    db: Session = Depends(get_db)
):
    """Advances simulated autonomous physics (position, battery, load) by dt_hours."""
    unit = db.query(CleanupUnit).filter(CleanupUnit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Cleanup unit not found")

    import json
    waypoints = []
    if unit.assigned_mission_id:
        mission = db.query(Mission).filter(Mission.id == unit.assigned_mission_id).first()
        if mission and mission.waypoints_json:
            try:
                waypoints = json.loads(mission.waypoints_json)
            except Exception:
                pass

    sim = AutonomousUnitState(
        unit_id=unit.id,
        unit_name=unit.unit_name,
        unit_type=unit.unit_type,
        latitude=unit.latitude,
        longitude=unit.longitude,
        battery_pct=unit.battery_pct,
        capacity_kg=unit.capacity_kg,
        current_load_kg=unit.current_load_kg,
        speed_knots=unit.speed_knots,
        status=unit.status,
        waypoints=waypoints,
        home_port_coords=(unit.latitude, unit.longitude)
    )

    new_state = sim.step(dt_hours=dt_hours)
    unit.latitude = new_state["latitude"]
    unit.longitude = new_state["longitude"]
    unit.heading_deg = new_state["heading_deg"]
    unit.battery_pct = new_state["battery_pct"]
    unit.current_load_kg = new_state["current_load_kg"]
    unit.status = new_state["status"]

    db.commit()
    db.refresh(unit)
    return unit
