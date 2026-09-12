from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class StormBase(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Cyclone Vardah"})
    storm_type: str = Field(default="cyclone", json_schema_extra={"example": "cyclone"})
    severity: str = Field(default="high", json_schema_extra={"example": "high"})  # low, moderate, high, critical
    center_latitude: float = Field(..., ge=-90.0, le=90.0, json_schema_extra={"example": 13.5})
    center_longitude: float = Field(..., ge=-180.0, le=180.0, json_schema_extra={"example": 84.2})
    radius_km: float = Field(default=150.0, ge=10.0, le=1000.0, json_schema_extra={"example": 180.0})
    wind_speed_knots: float = Field(default=45.0, ge=0.0, json_schema_extra={"example": 55.0})
    movement_direction_deg: float = Field(default=45.0, ge=0.0, le=360.0, json_schema_extra={"example": 60.0})
    movement_speed_knots: float = Field(default=10.0, ge=0.0, json_schema_extra={"example": 12.0})
    forecast_time: Optional[datetime] = None
    is_active: bool = True
    source: str = "marine-meteorological-center"


class StormCreate(StormBase):
    pass


class StormResponse(StormBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StormScenarioInject(BaseModel):
    scenario_preset: str = Field(
        default="bay_of_bengal_cyclone",
        description="Preconfigured scenario: bay_of_bengal_cyclone, malacca_squall, arabian_sea_monsoon, custom",
        json_schema_extra={"example": "bay_of_bengal_cyclone"}
    )
    custom_storm: Optional[StormCreate] = None
