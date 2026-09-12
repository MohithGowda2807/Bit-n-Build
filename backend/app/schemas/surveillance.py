from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class AISPositionResponse(BaseModel):
    id: int
    vessel_id: int
    timestamp: datetime
    latitude: float
    longitude: float
    speed_over_ground: Optional[float] = None
    course_over_ground: Optional[float] = None
    heading: Optional[float] = None
    navigation_status: Optional[str] = None
    source: str

    model_config = ConfigDict(from_attributes=True)


class DarkPeriodResponse(BaseModel):
    id: int
    vessel_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_seconds: float
    last_latitude: float
    last_longitude: float
    reappearance_latitude: Optional[float] = None
    reappearance_longitude: Optional[float] = None
    estimated_distance_km: Optional[float] = None
    severity: str

    model_config = ConfigDict(from_attributes=True)


class SimulationRunRequest(BaseModel):
    scenario: str = Field(..., min_length=1)
    start_time: Optional[datetime] = None
    reset: bool = True  # wipe this scenario's earlier data so replays are clean


class SimulationRunResponse(BaseModel):
    scenario: str
    start_time: datetime
    end_time: datetime
    vessels_created: int
    positions_added: int
    dark_periods_added: int
    events_added: int
    cases_opened: int
    reset: bool


class ScenarioInfo(BaseModel):
    name: str
    vessel_count: int
    duration_minutes: int


class SurveillanceEventResponse(BaseModel):
    id: int
    event_type: str
    vessel_id: int
    other_vessel_id: Optional[int] = None
    zone_kind: Optional[str] = None
    zone_id: Optional[int] = None
    zone_name: Optional[str] = None
    timestamp: datetime
    latitude: float
    longitude: float
    score: Optional[float] = None
    confidence: float
    source: str
    payload: dict

    model_config = ConfigDict(from_attributes=True)


class FishingZoneResponse(BaseModel):
    id: int
    name: str
    zone_type: str
    jurisdiction: Optional[str] = None
    allowed_vessel_types: Optional[str] = None
    active_from: Optional[datetime] = None
    active_until: Optional[datetime] = None
    geometry: dict

    model_config = ConfigDict(from_attributes=True)


class ProtectedAreaResponse(BaseModel):
    id: int
    name: str
    protection_level: str
    authority: Optional[str] = None
    rules: Optional[str] = None
    geometry: dict

    model_config = ConfigDict(from_attributes=True)


class RiskFactorResponse(BaseModel):
    type: str
    score: int
    explanation: str
    event_ids: List[int] = []


class EvidenceResponse(BaseModel):
    id: int
    event_id: Optional[int] = None
    evidence_type: str
    factor_type: str
    strength: float
    confidence: float
    source: str
    timestamp: datetime
    latitude: float
    longitude: float
    description: str

    model_config = ConfigDict(from_attributes=True)


class VesselRiskResponse(BaseModel):
    vessel_id: int
    risk_score_id: int
    score: float
    level: str
    factors: List[RiskFactorResponse]
    computed_at: datetime
    evidence: List[EvidenceResponse] = []


class VesselRiskSummary(BaseModel):
    vessel_id: int
    score: float
    level: str
    computed_at: datetime
    top_factor: Optional[str] = None


class CaseVessel(BaseModel):
    id: int
    name: str
    vessel_type: str
    mmsi: Optional[str] = None
    flag: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class InvestigationCaseResponse(BaseModel):
    id: int
    vessel_id: int
    risk_score: float
    risk_level: str
    status: str
    assigned_to: Optional[str] = None
    summary: str
    dismissed_reason: Optional[str] = None
    agent_summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InvestigationCaseDetail(InvestigationCaseResponse):
    vessel: CaseVessel
    evidence_snapshot: List[dict]
    audit_log: List[dict]


class AssignRequest(BaseModel):
    assignee: str = Field(..., min_length=1)
    actor: str = Field("operator", min_length=1)


class CaseActionRequest(BaseModel):
    actor: str = Field("operator", min_length=1)
    note: Optional[str] = None


class DismissRequest(CaseActionRequest):
    reason: str = Field(..., min_length=1)


class ReplayRequest(BaseModel):
    scenario: str = Field(..., min_length=1)
    step_seconds: float = Field(0.5, ge=0.0, le=10.0)  # wall-clock pause between scripted reports
    run_analysis: bool = True  # ingest, detect and score before animating


class BehaviorProfileResponse(BaseModel):
    source: str
    point_count: int
    hours_observed: float
    average_speed: float
    speed_stddev: float
    course_change_rate_deg_per_hour: float
    gap_count: int
    common_cells: List[str]
    window_start: Optional[datetime] = None
    window_end: Optional[datetime] = None
    last_updated: datetime

    model_config = ConfigDict(from_attributes=True)


class BehaviorDeviationResponse(BaseModel):
    score: int
    speed_z: float
    baseline_speed: float
    recent_speed: float
    turning_ratio: float
    new_gaps: int
    explanation: str
    timestamp: datetime


class VesselBaselineResponse(BaseModel):
    vessel_id: int
    profile: BehaviorProfileResponse
    deviation: Optional[BehaviorDeviationResponse] = None


class ReplayDarkWindow(BaseModel):
    mmsi: str
    name: str
    start: float  # fraction of the scenario span
    end: float


class ReplayStartResponse(BaseModel):
    status: str
    scenario: str
    steps: int
    step_seconds: float
    start_time: datetime
    end_time: datetime
    dark_windows: List[ReplayDarkWindow] = []
