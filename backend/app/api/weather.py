import json
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from app.security import require
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.route import Route
from app.models.storm import Storm
from app.schemas.weather import WeatherData, OceanCurrentData, RouteWeatherReport
from app.schemas.storm import StormCreate, StormResponse
from app.services.weather.service import weather_service
from app.services.ocean.service import ocean_service
from app.services.storm.service import storm_service

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


@router.get("/weather/route/{route_id}", response_model=RouteWeatherReport)
def get_route_weather(route_id: int, db: Session = Depends(get_db)):
    """Sample atmospheric and wave telemetry along waypoints of a maritime route."""
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    try:
        coords = json.loads(route.geometry_geojson)
    except Exception:
        coords = []

    return weather_service.sample_route_weather(route_id, coords)


# --- Storm Management Endpoints ---

@router.get("/storms", response_model=List[StormResponse])
def list_storms(db: Session = Depends(get_db)):
    """List all recorded storms."""
    return db.query(Storm).all()


@router.get("/storms/active", response_model=List[StormResponse])
def list_active_storms(db: Session = Depends(get_db)):
    """List all currently active storms."""
    return storm_service.get_active_storms(db)


@router.get("/storms/{storm_id}", response_model=StormResponse)
def get_storm(storm_id: int, db: Session = Depends(get_db)):
    """Get storm by id."""
    storm = storm_service.get_storm_by_id(db, storm_id)
    if not storm:
        raise HTTPException(status_code=404, detail="Storm not found")
    return storm


@router.post("/storms", response_model=StormResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require("OPERATOR"))])
def create_storm(payload: StormCreate, db: Session = Depends(get_db)):
    """Inject or report an active storm."""
    return storm_service.create_storm(db, payload)


@router.delete("/storms/{storm_id}", dependencies=[Depends(require("OPERATOR"))])
def deactivate_storm(storm_id: int, db: Session = Depends(get_db)):
    """Deactivate a storm."""
    success = storm_service.deactivate_storm(db, storm_id)
    if not success:
        raise HTTPException(status_code=404, detail="Storm not found")
    return {"message": f"Storm {storm_id} deactivated successfully"}


@router.delete("/storms", dependencies=[Depends(require("OPERATOR"))])
def clear_all_storms(db: Session = Depends(get_db)):
    """Clear all active storms (restore calm conditions)."""
    count = storm_service.clear_all_storms(db)
    return {"message": f"Cleared {count} active storms"}
