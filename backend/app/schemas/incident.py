from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class IncidentBase(BaseModel):
    title: str = Field(..., max_length=150)
    incident_type: str = Field("oil_spill", max_length=100)
    severity: str = Field("moderate", max_length=50)
    location_lat: float = Field(..., ge=-90.0, le=90.0)
    location_lon: float = Field(..., ge=-180.0, le=180.0)
    description: Optional[str] = None
    status: str = Field("reported", max_length=50)


class IncidentCreate(IncidentBase):
    pass


class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    severity: Optional[str] = None
    description: Optional[str] = None
    resolved_at: Optional[datetime] = None


class IncidentResponse(IncidentBase):
    id: int
    reported_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
