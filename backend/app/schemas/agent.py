from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class OrchestratorRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Instruction or operational query for the Orchestrator")
    vessel_id: Optional[int] = Field(None, description="Optional target vessel ID")
    route_id: Optional[int] = Field(None, description="Optional route ID")
    zone_id: Optional[int] = Field(None, description="Optional marine zone ID")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Arbitrary situational context")


class AgentFinding(BaseModel):
    agent_name: str
    role: str
    status: str = "completed"
    summary: str
    risk_level: str = "low"  # low, medium, high, critical
    details: Dict[str, Any] = Field(default_factory=dict)


class OrchestratorResponse(BaseModel):
    mission_id: str
    query: str
    status: str = "success"
    orchestrator_decision: str
    recommendations: List[str]
    agent_findings: List[AgentFinding]
    execution_time_ms: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
