from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.debris import Debris
from app.models.marine_protected_area import MarineProtectedArea
from app.models.marine_zone import MarineZone
from app.schemas.debris import (
    DebrisResponse,
    DebrisCreate,
    DebrisUpdate,
    DebrisDriftForecastResponse,
    DebrisDriftTrajectoryPoint
)
from app.services.debris.drift import predict_drift_trajectory
from app.services.debris.clustering import cluster_debris_sightings
from app.services.debris.environmental_risk import evaluate_debris_environmental_risk
from app.security import require

router = APIRouter(prefix="/api/v1/debris", tags=["Debris Sentinel"])


@router.get("", response_model=List[DebrisResponse])
def list_debris(
    status: Optional[str] = Query(None, description="Filter by status (detected, monitoring, dispatch_scheduled, cleared)"),
    priority: Optional[str] = Query(None, description="Filter by priority (low, medium, high, urgent)"),
    min_severity: Optional[float] = Query(None, ge=0.0, le=100.0),
    db: Session = Depends(get_db)
):
    """Retrieve all detected marine debris clusters and hazards."""
    query = db.query(Debris)
    if status:
        query = query.filter(Debris.status == status)
    if priority:
        query = query.filter(Debris.clean_up_priority == priority)
    if min_severity is not None:
        query = query.filter(Debris.severity >= min_severity)

    return query.order_by(Debris.severity.desc()).all()


@router.get("/clusters")
def get_debris_clusters(
    eps_km: float = Query(35.0, ge=5.0, le=200.0),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    """Groups detected debris items into spatial clusters using DBSCAN/proximity."""
    items = db.query(Debris).filter(Debris.status != "cleared").all()
    dicts = [{
        "id": d.id, "latitude": d.latitude, "longitude": d.longitude,
        "estimated_mass_kg": d.estimated_mass_kg, "estimated_size_m2": d.estimated_size_m2,
        "severity": d.severity, "debris_type": d.debris_type
    } for d in items]
    return cluster_debris_sightings(dicts, eps_km=eps_km)


@router.get("/{debris_id}/drift", response_model=DebrisDriftForecastResponse)
def get_debris_drift_forecast(
    debris_id: int,
    hours: int = Query(24, ge=6, le=72),
    db: Session = Depends(get_db)
):
    """Computes leeway drift vector and trajectory forecast, evaluating collision risks with MPAs."""
    item = db.query(Debris).filter(Debris.id == debris_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Debris not found")

    trajectory = predict_drift_trajectory(
        start_lat=item.latitude,
        start_lon=item.longitude,
        forecast_hours=hours,
        current_speed_knots=item.drift_speed_knots or 1.4,
        current_heading_deg=item.drift_heading_deg or 82.0,
        debris_type=item.debris_type
    )

    mpas = [{"name": m.name, "geometry_geojson": m.geometry_geojson} for m in db.query(MarineProtectedArea).all()]
    shipping_zones = [{"name": z.name, "geometry_geojson": z.geometry_geojson} for z in db.query(MarineZone).filter_by(zone_type="shipping_lane").all()]

    risk_eval = evaluate_debris_environmental_risk(
        debris_lat=item.latitude,
        debris_lon=item.longitude,
        debris_type=item.debris_type,
        estimated_mass_kg=item.estimated_mass_kg,
        trajectory=trajectory,
        mpas=mpas,
        shipping_zones=shipping_zones
    )

    traj_points = [
        DebrisDriftTrajectoryPoint(
            hour=pt["hour"],
            latitude=pt["latitude"],
            longitude=pt["longitude"],
            timestamp=pt["timestamp"],
            current_speed_knots=pt["current_speed_knots"],
            wind_speed_knots=pt["wind_speed_knots"],
            mpa_collision_risk=pt.get("mpa_collision_risk", False),
            nearest_zone=pt.get("nearest_zone"),
            uncertainty_radius_nm=pt.get("uncertainty_radius_nm"),
        )
        for pt in trajectory
    ]

    action = "Dispatch autonomous skimmer" if risk_eval["crosses_mpa"] or risk_eval["priority"] == "urgent" else "Maintain satellite monitoring"

    return DebrisDriftForecastResponse(
        debris_id=item.id,
        debris_type=item.debris_type,
        start_latitude=item.latitude,
        start_longitude=item.longitude,
        drift_speed_knots=item.drift_speed_knots or 1.4,
        drift_heading_deg=item.drift_heading_deg or 82.0,
        forecast_hours=hours,
        trajectory=traj_points,
        crosses_mpa=risk_eval["crosses_mpa"],
        mpa_warning=risk_eval.get("threatened_mpa"),
        recommended_action=action
    )


@router.get("/{debris_id}", response_model=DebrisResponse)
def get_debris(debris_id: int, db: Session = Depends(get_db)):
    """Retrieve details for a single debris cluster."""
    item = db.query(Debris).filter(Debris.id == debris_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Debris not found")
    return item


@router.post("", response_model=DebrisResponse, status_code=201, dependencies=[Depends(require("ANALYST"))])
def report_debris(debris_in: DebrisCreate, db: Session = Depends(get_db)):
    """Report a new marine debris detection."""
    data = debris_in.model_dump()
    debris = Debris(**data)
    db.add(debris)
    db.commit()
    db.refresh(debris)
    return debris


@router.patch("/{debris_id}", response_model=DebrisResponse, dependencies=[Depends(require("OPERATOR"))])
def update_debris(debris_id: int, debris_update: DebrisUpdate, db: Session = Depends(get_db)):
    """Update status, severity, or priority of a debris cluster."""
    item = db.query(Debris).filter(Debris.id == debris_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Debris not found")

    update_dict = debris_update.model_dump(exclude_unset=True)
    for field, val in update_dict.items():
        setattr(item, field, val)

    db.commit()
    db.refresh(item)
    return item
