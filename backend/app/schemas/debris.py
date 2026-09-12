from typing import Optional, List
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

    # Phase 4 fields
    cluster_id: Optional[int] = None
    estimated_mass_kg: float = Field(500.0, ge=0.0)
    estimated_volume_m3: float = Field(1.5, ge=0.0)
    confidence: float = Field(0.92, ge=0.0, le=1.0)
    drift_heading_deg: Optional[float] = None
    drift_speed_knots: Optional[float] = None
    target_species_threatened: Optional[str] = None
    environmental_risk_score: float = Field(50.0, ge=0.0, le=100.0)
    nearest_mpa_distance_nm: Optional[float] = None


class DebrisCreate(DebrisBase):
    detected_at: Optional[datetime] = None


class DebrisUpdate(BaseModel):
    status: Optional[str] = None
    clean_up_priority: Optional[str] = None
    severity: Optional[float] = Field(None, ge=0.0, le=100.0)
    description: Optional[str] = None
    cluster_id: Optional[int] = None
    drift_heading_deg: Optional[float] = None
    drift_speed_knots: Optional[float] = None
    environmental_risk_score: Optional[float] = None


class DebrisResponse(DebrisBase):
    id: int
    detected_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DebrisDriftTrajectoryPoint(BaseModel):
    hour: int
    latitude: float
    longitude: float
    timestamp: str
    current_speed_knots: float
    wind_speed_knots: float
    mpa_collision_risk: bool = False
    nearest_zone: Optional[str] = None
    uncertainty_radius_nm: Optional[float] = None


class DebrisDriftForecastResponse(BaseModel):
    debris_id: int
    debris_type: str
    start_latitude: float
    start_longitude: float
    drift_speed_knots: float
    drift_heading_deg: float
    forecast_hours: int
    trajectory: List[DebrisDriftTrajectoryPoint]
    crosses_mpa: bool = False
    mpa_warning: Optional[str] = None
    recommended_action: str
