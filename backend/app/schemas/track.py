from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class TrackBase(BaseModel):
    vessel_id: int
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    speed_knots: float = Field(0.0, ge=0)
    heading: float = Field(0.0, ge=0.0, lt=360.0)
    status: str = Field("underway")


class TrackCreate(TrackBase):
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class TrackResponse(TrackBase):
    id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
