from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.agent_decision import AgentDecisionLog
from app.schemas.storm import StormResponse, StormScenarioInject
from app.services.storm.service import storm_service
from app.agents.commander import maritime_commander

router = APIRouter(prefix="/api/v1/simulation", tags=["Simulation & Scenario Injection"])


@router.post("/scenarios/inject-storm", response_model=List[StormResponse])
def inject_storm_scenario(payload: StormScenarioInject, db: Session = Depends(get_db)):
    """
    Injects a preset maritime storm disturbance directly onto an active corridor
    to demonstrate live agent detection, risk evaluation, and dynamic re-routing.
    """
    storms = storm_service.inject_preset_scenario(db, payload.scenario_preset)
    return storms


@router.post("/scenarios/reset-environment")
def reset_environment(db: Session = Depends(get_db)):
    """
    Clears all active storms and resets the oceanic environment to calm baseline conditions.
    """
    cleared = storm_service.clear_all_storms(db)
    return {
        "message": "Environment successfully reset to calm conditions.",
        "storms_cleared": cleared
    }


@router.get("/mode")
def get_operating_mode():
    """Retrieve current autonomous command mode (advisory, semi_autonomous, autonomous)."""
    return {"mode": maritime_commander.get_mode()}


@router.post("/mode")
def set_operating_mode(payload: Dict[str, str] = Body(..., example={"mode": "autonomous"})):
    """Set commander operating mode."""
    mode = payload.get("mode", "autonomous")
    if mode not in ("advisory", "semi_autonomous", "autonomous"):
        raise HTTPException(status_code=400, detail="Invalid mode. Allowed: advisory, semi_autonomous, autonomous")
    maritime_commander.set_mode(mode)
    return {"message": f"Commander mode set to {mode}", "mode": mode}


@router.post("/cycle")
def execute_command_cycle(db: Session = Depends(get_db)):
    """
    Triggers an autonomous monitoring & decision cycle across both Environmental
    Dynamic Routing (Phase 2) and Surveillance (Phase 3).
    """
    return maritime_commander.run_full_command_cycle(db)


@router.get("/decisions")
def get_agent_decisions(limit: int = Query(default=20, le=100), db: Session = Depends(get_db)):
    """Retrieve audit trail of multi-agent decisions and route recalculations."""
    logs = db.query(AgentDecisionLog).order_by(AgentDecisionLog.created_at.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "agent_name": l.agent_name,
            "action": l.action,
            "trigger_event": l.trigger_event,
            "target_id": l.target_id,
            "reason": l.reason,
            "confidence": l.confidence,
            "mode": l.mode,
            "created_at": l.created_at
        }
        for l in logs
    ]
