from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, ConfigDict, Field


class RecalculateRouteRequest(BaseModel):
    voyage_id: int = Field(..., description="Active voyage ID to recalculate")
    reason: str = Field(default="STORM_DETECTED", description="Reason for dynamic recalculation")
    mode: str = Field(default="semi_autonomous", description="advisory, semi_autonomous, or autonomous")
    candidate_profile: str = Field(default="safest", description="Optimization goal: safest, fuel_efficient, fastest, balanced")
    min_improvement_pct: float = Field(default=5.0, description="Minimum risk improvement percentage required to switch")


class RecalculateRouteResponse(BaseModel):
    voyage_id: int
    previous_route_id: int
    new_route_id: int
    version_number: int
    risk_reduction_pct: float
    fuel_change_pct: float
    eta_change_hours: float
    reasons: List[str]
    tradeoffs: Dict[str, Any]
    route_geojson: str
    applied: bool
    mode: str


class RouteVersionResponse(BaseModel):
    id: int
    voyage_id: int
    version_number: int
    route_id: int
    trigger_event: str
    change_reason: Optional[str] = None
    risk_score: float
    fuel_liters: float
    eta_hours: float
    co2_kg: float
    risk_reduction_pct: Optional[float] = 0.0
    fuel_change_pct: Optional[float] = 0.0
    eta_change_hours: Optional[float] = 0.0
    explanation_json: Optional[str] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CandidateRouteOption(BaseModel):
    profile: str  # fastest, fuel_efficient, safest, balanced
    distance_km: float
    eta_hours: float
    fuel_liters: float
    risk_score: float
    co2_kg: float
    geometry_geojson: str
    route_id: Optional[int] = None


class CandidateRoutesResponse(BaseModel):
    voyage_id: int
    origin: Dict[str, float]
    destination: Dict[str, float]
    candidates: List[CandidateRouteOption]
    recommended_profile: str
    recommendation_reason: str


class VoyageHealthResponse(BaseModel):
    voyage_id: int
    overall_health: float
    safety_score: float
    fuel_efficiency_score: float
    environmental_score: float
    eta_adherence_score: float
    current_risk: float
    active_storms_count: int
    route_status: str
    operating_mode: str
    alerts: List[Dict[str, Any]]
