from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class CleanupUnitBase(BaseModel):
    unit_name: str
    unit_type: str = Field("asv_skimmer", description="asv_skimmer, autonomous_drone, towed_boom, robotic_interceptor")
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    heading_deg: float = Field(0.0, ge=0.0, le=360.0)
    speed_knots: float = Field(8.0, ge=0.0)
    battery_pct: float = Field(100.0, ge=0.0, le=100.0)
    max_range_nm: float = Field(120.0, gt=0.0)
    capacity_kg: float = Field(1500.0, gt=0.0)
    current_load_kg: float = Field(0.0, ge=0.0)
    status: str = Field("idle", description="idle, transit, collecting, returning, docked, maintenance")
    assigned_mission_id: Optional[int] = None
    home_port_id: Optional[int] = None
    operator_override: Optional[str] = None


class CleanupUnitCreate(CleanupUnitBase):
    pass


class CleanupUnitUpdate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    heading_deg: Optional[float] = None
    speed_knots: Optional[float] = None
    battery_pct: Optional[float] = None
    current_load_kg: Optional[float] = None
    status: Optional[str] = None
    assigned_mission_id: Optional[int] = None
    operator_override: Optional[str] = None


class CleanupUnitCommandRequest(BaseModel):
    command: str = Field(..., description="hold, return_to_base, resume, dispatch")
    target_lat: Optional[float] = None
    target_lon: Optional[float] = None
    notes: Optional[str] = None


class CleanupUnitResponse(CleanupUnitBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
