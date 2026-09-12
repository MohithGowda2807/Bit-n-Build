from typing import Optional, Any, Dict
from pydantic import BaseModel, Field, ConfigDict


class MarineZoneBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    zone_type: str = Field(...)
    geometry_geojson: str = Field(...)
    risk_level: float = Field(0.0, ge=0.0, le=100.0)
    restricted: bool = Field(False)
    description: Optional[str] = None


class MarineZoneResponse(MarineZoneBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
