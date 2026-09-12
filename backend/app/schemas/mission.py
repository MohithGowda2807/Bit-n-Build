from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class MissionBase(BaseModel):
    mission_name: str = Field(..., max_length=150)
    mission_type: str = Field("patrol", max_length=50)
    status: str = Field("pending", max_length=50)
    assigned_vessel_id: Optional[int] = None
    priority: str = Field("medium", max_length=50)
    target_lat: Optional[float] = Field(None, ge=-90.0, le=90.0)
    target_lon: Optional[float] = Field(None, ge=-180.0, le=180.0)
    parameters: Optional[str] = None


class MissionCreate(MissionBase):
    pass


class MissionUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_vessel_id: Optional[int] = None
    parameters: Optional[str] = None


class MissionResponse(MissionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
