from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class PortBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    country: str = Field(..., min_length=2, max_length=100)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    capacity: int = Field(5000, ge=0)
    congestion_level: float = Field(0.0, ge=0.0, le=100.0)
    status: str = Field("operational")


class PortCreate(PortBase):
    pass


class PortResponse(PortBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
