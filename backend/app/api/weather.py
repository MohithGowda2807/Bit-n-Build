from fastapi import APIRouter, Query
from app.services.weather.service import weather_service
from app.services.ocean.service import ocean_service
from app.schemas.weather import WeatherData, OceanCurrentData

router = APIRouter(prefix="/api/v1", tags=["Environmental & Marine Telemetry"])


@router.get("/weather", response_model=WeatherData)
async def get_marine_weather(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude"),
    lon: float = Query(..., ge=-180.0, le=180.0, description="Longitude")
):
    """Get atmospheric and marine weather telemetry for specified coordinates."""
    return await weather_service.get_marine_weather(lat, lon)


@router.get("/ocean/currents", response_model=OceanCurrentData)
def get_ocean_currents(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude"),
    lon: float = Query(..., ge=-180.0, le=180.0, description="Longitude")
):
    """Get hydrodynamic ocean current, salinity, and tidal drift data for specified coordinates."""
    return ocean_service.get_ocean_currents(lat, lon)
