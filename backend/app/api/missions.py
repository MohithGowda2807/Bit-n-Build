import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import require
from app.models.mission import Mission
from app.models.cleanup_unit import CleanupUnit
from app.models.debris import Debris
from app.schemas.mission import (
    MissionResponse,
    MissionCreate,
    MissionUpdate,
    MissionPlanRequest,
    MissionPlanResponse,
    MissionWaypoint
)
from app.services.debris.mission_planner import plan_autonomous_cleanup_mission

router = APIRouter(prefix="/api/v1/missions", tags=["Maritime Missions"])


@router.get("", response_model=List[MissionResponse])
def list_missions(
    status: Optional[str] = Query(None, description="Filter by status (pending, active, completed, cancelled)"),
    mission_type: Optional[str] = Query(None, description="Filter by type (patrol, debris_cleanup, escort)"),
    db: Session = Depends(get_db)
):
    """List maritime operations and autonomous cleanup missions."""
    query = db.query(Mission)
    if status:
        query = query.filter(Mission.status == status)
    if mission_type:
        query = query.filter(Mission.mission_type == mission_type)
    return query.order_by(Mission.created_at.desc()).all()


@router.get("/{mission_id}", response_model=MissionResponse)
def get_mission(mission_id: int, db: Session = Depends(get_db)):
    """Retrieve details for a single mission."""
    m = db.query(Mission).filter(Mission.id == mission_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Mission not found")
    return m


@router.post("/plan", response_model=MissionPlanResponse, dependencies=[Depends(require("OPERATOR"))])
def plan_cleanup_mission_endpoint(
    req: MissionPlanRequest,
    db: Session = Depends(get_db)
):
    """Calculates an optimal autonomous cleanup mission (VRP waypoints, energy, and payload yield)."""
    # Find unit
    unit = None
    if req.unit_id:
        unit = db.query(CleanupUnit).filter(CleanupUnit.id == req.unit_id).first()
    if not unit:
        unit = db.query(CleanupUnit).filter(CleanupUnit.status.in_(["idle", "docked"])).first()
    if not unit:
        unit = db.query(CleanupUnit).first()

    if not unit:
        raise HTTPException(status_code=400, detail="No autonomous cleanup units available in fleet")

    # Fetch debris targets
    debris_rows = db.query(Debris).filter(Debris.id.in_(req.debris_ids)).all()
    if not debris_rows:
        raise HTTPException(status_code=404, detail="None of the specified debris IDs were found")

    unit_dict = {
        "id": unit.id,
        "unit_name": unit.unit_name,
        "unit_type": unit.unit_type,
        "latitude": unit.latitude,
        "longitude": unit.longitude,
        "speed_knots": unit.speed_knots,
        "capacity_kg": unit.capacity_kg,
        "current_load_kg": unit.current_load_kg,
        "home_port_lat": unit.latitude,
        "home_port_lon": unit.longitude
    }
    debris_dicts = [{
        "id": d.id,
        "latitude": d.latitude,
        "longitude": d.longitude,
        "debris_type": d.debris_type,
        "estimated_mass_kg": d.estimated_mass_kg,
        "severity": d.severity,
        "environmental_risk_score": d.environmental_risk_score
    } for d in debris_rows]

    plan_dict = plan_autonomous_cleanup_mission(unit_dict, debris_dicts, req.max_duration_hours or 18.0)

    waypoints = [
        MissionWaypoint(
            waypoint_index=w["waypoint_index"],
            latitude=w["latitude"],
            longitude=w["longitude"],
            label=w["label"],
            action=w["action"],
            target_debris_id=w.get("target_debris_id"),
            estimated_arrival_hours=w.get("estimated_arrival_hours")
        )
        for w in plan_dict["waypoints"]
    ]

    return MissionPlanResponse(
        mission_name=plan_dict["mission_name"],
        assigned_unit_id=plan_dict["assigned_unit_id"],
        assigned_unit_name=plan_dict["assigned_unit_name"],
        target_debris_count=plan_dict["target_debris_count"],
        total_distance_nm=plan_dict["total_distance_nm"],
        estimated_duration_hours=plan_dict["estimated_duration_hours"],
        estimated_energy_kwh=plan_dict["estimated_energy_kwh"],
        estimated_yield_kg=plan_dict["estimated_yield_kg"],
        waypoints=waypoints,
        requires_human_approval=True,
        ecological_benefit_summary=plan_dict["ecological_benefit_summary"]
    )


@router.post("", response_model=MissionResponse, status_code=201, dependencies=[Depends(require("OPERATOR"))])
def create_mission(
    mission_in: MissionCreate,
    db: Session = Depends(get_db)
):
    """Creates a new mission and dispatches assigned unit if approved."""
    data = mission_in.model_dump()
    mission = Mission(**data)
    db.add(mission)
    db.commit()
    db.refresh(mission)

    # Link unit if assigned
    if mission.assigned_unit_id and mission.status == "active":
        unit = db.query(CleanupUnit).filter(CleanupUnit.id == mission.assigned_unit_id).first()
        if unit:
            unit.assigned_mission_id = mission.id
            unit.status = "transit"
            db.commit()

    return mission


@router.post("/{mission_id}/approve", response_model=MissionResponse, dependencies=[Depends(require("OPERATOR"))])
def approve_mission(
    mission_id: int,
    decision: str = Query("approve", description="approve or reject"),
    db: Session = Depends(get_db)
):
    """Human-in-the-loop operator approval for autonomous mission dispatch."""
    m = db.query(Mission).filter(Mission.id == mission_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Mission not found")

    if decision.lower() == "approve":
        m.approval_status = "approved"
        m.status = "active"
        if m.assigned_unit_id:
            unit = db.query(CleanupUnit).filter(CleanupUnit.id == m.assigned_unit_id).first()
            if unit:
                unit.assigned_mission_id = m.id
                unit.status = "transit"
    else:
        m.approval_status = "rejected"
        m.status = "cancelled"

    db.commit()
    db.refresh(m)
    return m
