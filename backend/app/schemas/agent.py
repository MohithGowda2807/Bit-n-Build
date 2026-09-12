from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class OrchestratorRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Instruction or operational query for the Orchestrator")
    vessel_id: Optional[int] = Field(None, description="Optional target vessel ID")
    route_id: Optional[int] = Field(None, description="Optional route ID")
    zone_id: Optional[int] = Field(None, description="Optional marine zone ID")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Arbitrary situational context")
    use_assistant: Optional[bool] = Field(None, description="Force (true) or suppress (false) the Phase 3 LLM assistant; default: only for questions")


class AgentFinding(BaseModel):
    agent_name: str
    role: str
    status: str = "completed"
    summary: str
    risk_level: str = "low"  # low, medium, high, critical
    details: Dict[str, Any] = Field(default_factory=dict)


class AgentTraceStep(BaseModel):
    step_number: int
    agent: str
    action: str
    input: Optional[str] = None
    output: Optional[str] = None
    timestamp: Optional[str] = None


class OrchestratorResponse(BaseModel):
    mission_id: str
    query: str
    status: str = "success"
    orchestrator_decision: str
    recommendations: List[str]
    agent_findings: List[AgentFinding]
    compliance_report: Optional[str] = None
    requires_human_approval: bool = False
    approval_status: str = "auto_cleared"  # auto_cleared, pending_human_approval, approved, action_executed, replan_requested, rejected
    proposed_action: Optional[str] = None
    assistant_answer: Optional[str] = None  # Phase 3 LLM assistant, grounded in surveillance tools
    assistant_provider: Optional[str] = None
    execution_time_ms: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    agent_traces: List[AgentTraceStep] = Field(default_factory=list)
    actions_proposed: List[Dict[str, Any]] = Field(default_factory=list)
    domain_impact: Dict[str, Any] = Field(default_factory=dict)


class HumanApprovalRequest(BaseModel):
    mission_id: str
    decision: str = Field(..., description="Operator decision: 'approve', 'replan', or 'reject'")
    action_notes: Optional[str] = Field(None, description="Optional operator rationale or constraints")


class HumanApprovalResponse(BaseModel):
    mission_id: str
    decision: str
    approval_status: str
    action_result: str
    execution_timestamp: datetime = Field(default_factory=datetime.utcnow)
