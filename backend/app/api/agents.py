from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.agents.triton_crew import triton_agents
from app.schemas.agent import (
    OrchestratorRequest,
    OrchestratorResponse,
    HumanApprovalRequest,
    HumanApprovalResponse
)
from app.security import require

router = APIRouter(prefix="/api/v1/agents", tags=["TRITON Multi-Agent Framework"])


@router.post("/orchestrate", response_model=OrchestratorResponse, dependencies=[Depends(require("ANALYST"))])
def orchestrate_mission(request: OrchestratorRequest, db: Session = Depends(get_db)):
    """
    Primary multi-agent entry point:
    ASK TRITON (Natural Language) -> Orchestrator Agent ->
    (Vessel Watch, Route Planner, Debris Sentinel) ->
    Compliance Report Agent -> Human Approval -> Action/Replan.
    """
    return triton_agents.orchestrate(request, db)


@router.post("/decision", response_model=HumanApprovalResponse, dependencies=[Depends(require("OPERATOR"))])
def operator_decision(request: HumanApprovalRequest, db: Session = Depends(get_db)):
    """
    Human Approval Gate:
    Enables operator to approve, trigger replan, or reject directives synthesized by TRITON.
    Flow: Compliance Report Agent -> HUMAN APPROVAL -> ACTION / REPLAN.
    """
    return triton_agents.handle_human_decision(request, db)


@router.post("/approve", response_model=HumanApprovalResponse, dependencies=[Depends(require("OPERATOR"))])
def operator_approve(request: HumanApprovalRequest, db: Session = Depends(get_db)):
    """Convenience alias for approving an operational mission directive."""
    request.decision = "approve"
    return triton_agents.handle_human_decision(request, db)


@router.get("/status")
def get_agents_status():
    """Check initialization state and registered capabilities for all 4 agents & Orchestrator."""
    return {
        "framework": "TRITON-CrewAI-Hybrid",
        "pipeline": [
            "ASK_TRITON_NATURAL_LANGUAGE",
            "ORCHESTRATOR",
            "PARALLEL_SPECIALISTS:[vessel_watch, route_planner, debris_sentinel]",
            "COMPLIANCE_REPORT_AGENT",
            "HUMAN_APPROVAL",
            "ACTION_OR_REPLAN"
        ],
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
                "name": "Compliance Report Agent",
                "role": "Marine Sanctuary & Regulatory Compliance Officer",
                "status": "active",
                "capabilities": ["mpa_incursion_monitoring", "speed_restriction_enforcement", "imo_compliance", "multi_agent_synthesis"]
            },
            {
                "id": "cleanup_fleet",
                "name": "Autonomous Cleanup Fleet Agent",
                "role": "Autonomous Marine Fleet Coordinator",
                "status": "active",
                "capabilities": ["asv_dispatch", "vrp_route_optimization", "battery_budgeting", "payload_monitoring"]
            }
        ],
        "crewai_initialized": triton_agents.crewai_initialized
    }

