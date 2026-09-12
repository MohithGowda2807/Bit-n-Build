from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class WeatherData(BaseModel):
    latitude: float
    longitude: float
    temperature_c: float
    wind_speed_knots: float
    wind_direction_deg: float
    wave_height_m: float
    visibility_nm: float
    pressure_hpa: float
    conditions: str
    source: str = "open-meteo-marine-fallback"
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class OceanCurrentData(BaseModel):
    latitude: float
    longitude: float
    current_speed_knots: float
    current_direction_deg: float
    sea_surface_temp_c: float
    salinity_psu: float
    tidal_state: str
    source: str = "copernicus-fallback"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
