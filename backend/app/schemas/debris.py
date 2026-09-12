from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class DebrisBase(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    debris_type: str = Field("plastic_patch")
    estimated_size_m2: float = Field(100.0, gt=0)
    density_category: str = Field("medium")
    severity: float = Field(50.0, ge=0.0, le=100.0)
    clean_up_priority: str = Field("medium")
    status: str = Field("detected")
    source: str = Field("synthetic_sensor")
    description: Optional[str] = None


class DebrisCreate(DebrisBase):
    detected_at: Optional[datetime] = None


class DebrisUpdate(BaseModel):
    status: Optional[str] = None
    clean_up_priority: Optional[str] = None
    severity: Optional[float] = Field(None, ge=0.0, le=100.0)
    description: Optional[str] = None


class DebrisResponse(DebrisBase):
    id: int
    detected_at: datetime

    model_config = ConfigDict(from_attributes=True)
