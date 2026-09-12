import json
import logging
import time
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.security import require
from sqlalchemy.orm import Session

try:
    import redis
except ImportError:
    redis = None

from app.database import get_db
from app.config import settings
from app.models.route import Route
from app.schemas.route import RouteOptimizeRequest, RouteOptimizeResponse
from app.schemas.dynamic_routing import RecalculateRouteRequest, RecalculateRouteResponse, RouteVersionResponse
from app.services.optimization.service import OptimizationService

logger = logging.getLogger("oceansentinel.routes")
router = APIRouter(prefix="/api/v1/routes", tags=["Routes"])
optimization_service = OptimizationService()


def get_redis_client():
    if not redis:
        return None
    try:
        return redis.from_url(settings.REDIS_URL, socket_timeout=1.0)
    except Exception:
        return None


@router.post("/optimize", response_model=RouteOptimizeResponse)
def optimize_route(payload: RouteOptimizeRequest, db: Session = Depends(get_db)):
    start_time = time.time()
    logger.info(
        f"Route optimization requested: vessel={payload.vessel_id}, "
        f"origin=({payload.origin.latitude}, {payload.origin.longitude}), "
        f"dest=({payload.destination.latitude}, {payload.destination.longitude}), "
        f"mode={payload.mode}"
    )

    # 1. Check Redis Cache
    cache_key = (
        f"route:vessel:{payload.vessel_id}:"
        f"orig:{payload.origin.latitude:.4f},{payload.origin.longitude:.4f}:"
        f"dest:{payload.destination.latitude:.4f},{payload.destination.longitude:.4f}:"
        f"mode:{payload.mode}:grid:{settings.GRID_VERSION}"
    )
    r = get_redis_client()
    if r:
        try:
            cached = r.get(cache_key)
            if cached:
                logger.info(f"Cache hit for key {cache_key}")
                return json.loads(cached)
        except Exception as e:
            logger.warning(f"Redis cache check failed: {e}")

    # 2. Run Multi-Objective Optimization Engine
    try:
        response = optimization_service.optimize(payload, db=db)
    except Exception as e:
        logger.error(f"Route optimization failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "ROUTE_OPTIMIZATION_FAILED", "message": str(e)}
        )

    # 3. Store in cache
    if r:
        try:
            r.setex(cache_key, 3600, response.json())
        except Exception as e:
            logger.warning(f"Redis cache write failed: {e}")

    duration_ms = (time.time() - start_time) * 1000.0
    logger.info(
        f"Route optimization completed: vessel={payload.vessel_id}, "
        f"recommended={response.recommended_route.name}, "
        f"duration={duration_ms:.1f}ms"
    )

    return response


@router.get("", response_model=List[dict])
def list_routes(limit: int = 20, db: Session = Depends(get_db)):
    routes = db.query(Route).order_by(Route.created_at.desc()).limit(limit).all()
    result = []
    for r in routes:
        result.append({
            "id": r.id,
            "name": r.name,
            "origin_lat": r.origin_lat,
            "origin_lon": r.origin_lon,
            "destination_lat": r.destination_lat,
            "destination_lon": r.destination_lon,
            "distance_km": r.distance_km,
            "estimated_time_hours": r.estimated_time_hours,
            "estimated_fuel_liters": r.estimated_fuel_liters,
            "estimated_co2_kg": r.estimated_co2_kg,
            "estimated_cost": r.estimated_cost,
            "optimization_mode": r.optimization_mode,
            "geometry": json.loads(r.geometry_geojson) if r.geometry_geojson else None,
            "created_at": r.created_at
        })
    return result


@router.get("/{route_id}", response_model=dict)
def get_route(route_id: int, db: Session = Depends(get_db)):
    r = db.query(Route).filter(Route.id == route_id).first()
    if not r:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "ROUTE_NOT_FOUND", "message": f"Route {route_id} not found."}
        )
    return {
        "id": r.id,
        "name": r.name,
        "origin_lat": r.origin_lat,
        "origin_lon": r.origin_lon,
        "destination_lat": r.destination_lat,
        "destination_lon": r.destination_lon,
        "distance_km": r.distance_km,
        "estimated_time_hours": r.estimated_time_hours,
        "estimated_fuel_liters": r.estimated_fuel_liters,
        "estimated_co2_kg": r.estimated_co2_kg,
        "estimated_cost": r.estimated_cost,
        "optimization_mode": r.optimization_mode,
        "geometry": json.loads(r.geometry_geojson) if r.geometry_geojson else None,
        "created_at": r.created_at
    }


@router.post("/recalculate", response_model=RecalculateRouteResponse, dependencies=[Depends(require("OPERATOR"))])
def recalculate_route(payload: RecalculateRouteRequest, db: Session = Depends(get_db)):
    """
    Dynamically recalculate a voyage route avoiding detected storms or extreme sea-states.
    Applies anti-oscillation guards and records route versions.
    """
    try:
        from app.services.routing.service import routing_service
        result = routing_service.recalculate_voyage_route(
            voyage_id=payload.voyage_id,
            reason=payload.reason,
            mode=payload.mode,
            db=db,
            candidate_profile=payload.candidate_profile,
            min_improvement_pct=payload.min_improvement_pct
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        logger.error(f"Route recalculation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/voyages/{voyage_id}/versions", response_model=List[RouteVersionResponse])
def get_voyage_route_versions(voyage_id: int, db: Session = Depends(get_db)):
    """Retrieve all route version iterations and lineages for a voyage."""
    from app.models.route_version import RouteVersion
    versions = db.query(RouteVersion).filter(RouteVersion.voyage_id == voyage_id).order_by(RouteVersion.version_number.asc()).all()
    return versions
