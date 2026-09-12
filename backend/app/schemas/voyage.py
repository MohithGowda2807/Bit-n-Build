from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class VoyageCreate(BaseModel):
    vessel_id: int
    route_id: int
    departure_time: Optional[datetime] = None


class VoyageUpdate(BaseModel):
    status: Optional[str] = None  # planned, active, completed, cancelled
    actual_arrival: Optional[datetime] = None


class VoyageResponse(BaseModel):
    id: int
    vessel_id: int
    route_id: int
    status: str
    departure_time: datetime
    estimated_arrival: Optional[datetime]
    actual_arrival: Optional[datetime]
    starting_fuel: float
    estimated_fuel: float
    fuel_saved: float
    co2_estimated: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
