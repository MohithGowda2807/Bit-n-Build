from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.agents.triton_crew import triton_agents
from app.schemas.agent import OrchestratorRequest, OrchestratorResponse

router = APIRouter(prefix="/api/v1/agents", tags=["TRITON Multi-Agent Framework"])


@router.post("/orchestrate", response_model=OrchestratorResponse)
def orchestrate_mission(request: OrchestratorRequest, db: Session = Depends(get_db)):
    """
    Primary multi-agent entry point:
    Operator / User -> API -> Orchestrator Agent ->
    (Vessel Watch, Route Planner, Debris Sentinel, Compliance Agent) ->
    Synthesized Operational Response.
    """
    return triton_agents.orchestrate(request, db)


@router.get("/status")
def get_agents_status():
    """Check initialization state and registered capabilities for all 4 agents & Orchestrator."""
    return {
        "framework": "TRITON-CrewAI-Hybrid",
        "orchestrator_agent": {
            "name": "TRITON Master Mission Orchestrator",
            "status": "ready",
            "role": "Master command coordination & multi-agent synthesis"
        },
        "agents": [
            {
                "id": "vessel_watch",
                "name": "Vessel Watch Agent",
                "role": "Vessel Watch & AIS Sentinel",
                "status": "active",
                "capabilities": ["kinematic_drift", "speed_violation_detection", "dark_ship_tracking"]
            },
            {
                "id": "route_planner",
                "name": "Route Planner Agent",
                "role": "Autonomous Marine Route Strategist",
                "status": "active",
                "capabilities": ["fuel_optimization", "eta_computation", "weather_routing"]
            },
            {
                "id": "debris_sentinel",
                "name": "Debris Sentinel Agent",
                "role": "Ocean Debris & Hazard Sentinel",
                "status": "active",
                "capabilities": ["debris_mapping", "collision_risk_assessment", "cleanup_targeting"]
            },
            {
                "id": "compliance",
                "name": "Compliance Agent",
                "role": "Marine Sanctuary & Regulatory Compliance Officer",
                "status": "active",
                "capabilities": ["mpa_incursion_monitoring", "speed_restriction_enforcement", "imo_compliance"]
            }
        ],
        "crewai_initialized": triton_agents.crewai_initialized
    }
