from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class WeatherData(BaseModel):
    latitude: float
    longitude: float
    temperature_c: float
    wind_speed_knots: float
    wind_direction_deg: float
    wave_height_m: float
    wave_period_s: float = 6.0
    visibility_nm: float
    pressure_hpa: float
    conditions: str
    sea_state: int = Field(default=1, description="Douglas scale: 0 Calm, 1 Slight, 2 Moderate, 3 Rough, 4 Very Rough, 5 Dangerous")
    is_stale: bool = False
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
    is_stale: bool = False
    source: str = "copernicus-fallback"
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class RouteWeatherWaypoint(BaseModel):
    latitude: float
    longitude: float
    distance_from_start_km: float
    wind_speed_knots: float
    wind_direction_deg: float
    wave_height_m: float
    sea_state: int
    current_speed_knots: float
    current_direction_deg: float
    segment_risk: float


class RouteWeatherReport(BaseModel):
    route_id: int
    waypoints_count: int
    avg_wave_height_m: float
    max_wave_height_m: float
    avg_wind_speed_knots: float
    max_wind_speed_knots: float
    max_sea_state: int
    overall_environmental_risk: float
    is_stale: bool = False
    waypoints: List[RouteWeatherWaypoint]
