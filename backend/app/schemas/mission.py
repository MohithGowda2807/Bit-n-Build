from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class MissionWaypoint(BaseModel):
    waypoint_index: int
    latitude: float
    longitude: float
    label: str
    action: str = Field("transit", description="transit, collect, patrol, sample, dock")
    target_debris_id: Optional[int] = None
    estimated_arrival_hours: Optional[float] = None


class MissionBase(BaseModel):
    mission_name: str = Field(..., max_length=150)
    mission_type: str = Field("debris_cleanup", max_length=50)
    status: str = Field("pending", max_length=50)  # pending, active, completed, cancelled, aborted
    assigned_vessel_id: Optional[int] = None
    assigned_unit_id: Optional[int] = None
    priority: str = Field("medium", max_length=50)
    target_lat: Optional[float] = Field(None, ge=-90.0, le=90.0)
    target_lon: Optional[float] = Field(None, ge=-180.0, le=180.0)
    origin_lat: Optional[float] = Field(None, ge=-90.0, le=90.0)
    origin_lon: Optional[float] = Field(None, ge=-180.0, le=180.0)
    waypoints_json: Optional[str] = None
    target_debris_ids: Optional[str] = None
    estimated_duration_hours: Optional[float] = None
    estimated_energy_kwh: Optional[float] = None
    collected_kg: float = 0.0
    target_kg: float = 500.0
    approval_status: str = Field("approved", max_length=50)  # pending_approval, approved, rejected
    parameters: Optional[str] = None


class MissionCreate(MissionBase):
    pass


class MissionUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_vessel_id: Optional[int] = None
    assigned_unit_id: Optional[int] = None
    collected_kg: Optional[float] = None
    approval_status: Optional[str] = None
    parameters: Optional[str] = None


class MissionResponse(MissionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class MissionPlanRequest(BaseModel):
    debris_ids: List[int]
    unit_id: Optional[int] = None
    max_duration_hours: Optional[float] = 18.0
    priority_override: Optional[str] = None


class MissionPlanResponse(BaseModel):
    mission_name: str
    assigned_unit_id: int
    assigned_unit_name: str
    target_debris_count: int
    total_distance_nm: float
    estimated_duration_hours: float
    estimated_energy_kwh: float
    estimated_yield_kg: float
    waypoints: List[MissionWaypoint]
    requires_human_approval: bool = True
    ecological_benefit_summary: str
