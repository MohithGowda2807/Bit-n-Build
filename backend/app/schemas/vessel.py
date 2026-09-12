from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class VesselBase(BaseModel):
    vessel_identifier: str = Field(..., min_length=2, max_length=50)
    name: str = Field(..., min_length=2, max_length=100)
    mmsi: Optional[str] = Field(None, max_length=20)
    callsign: Optional[str] = Field(None, max_length=20)
    vessel_type: str = Field("container")
    length_m: float = Field(..., gt=0)
    width_m: float = Field(..., gt=0)
    draft_m: float = Field(..., gt=0)
    max_speed_knots: float = Field(..., gt=0)
    cruise_speed_knots: float = Field(..., gt=0)
    speed_knots: float = Field(0.0, ge=0)
    fuel_capacity_liters: float = Field(..., gt=0)
    fuel_consumption_rate: float = Field(..., gt=0)
    cargo_capacity_tonnes: float = Field(..., ge=0)
    current_fuel_liters: float = Field(..., ge=0)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    heading: float = Field(0.0, ge=0.0, lt=360.0)
    destination: Optional[str] = None
    eta: Optional[str] = None
    status: str = Field("docked")


class VesselCreate(VesselBase):
    pass


class VesselUpdate(BaseModel):
    name: Optional[str] = None
    mmsi: Optional[str] = None
    callsign: Optional[str] = None
    vessel_type: Optional[str] = None
    speed_knots: Optional[float] = Field(None, ge=0)
    current_fuel_liters: Optional[float] = Field(None, ge=0)
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    heading: Optional[float] = Field(None, ge=0.0, lt=360.0)
    destination: Optional[str] = None
    eta: Optional[str] = None
    status: Optional[str] = None


class VesselResponse(VesselBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
