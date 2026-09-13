from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.voyage import Voyage
from app.models.vessel import Vessel
from app.models.route import Route
from app.schemas.voyage import VoyageCreate, VoyageUpdate, VoyageResponse
from app.security import require

router = APIRouter(prefix="/api/v1/voyages", tags=["Voyages"])


@router.get("", response_model=List[VoyageResponse])
def list_voyages(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Voyage)
    if status:
        query = query.filter(Voyage.status == status)
    return query.all()


@router.get("/{voyage_id}", response_model=VoyageResponse)
def get_voyage(voyage_id: int, db: Session = Depends(get_db)):
    voyage = db.query(Voyage).filter(Voyage.id == voyage_id).first()
    if not voyage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "VOYAGE_NOT_FOUND", "message": f"Voyage with ID {voyage_id} not found."}
        )
    return voyage


@router.post("", response_model=VoyageResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require("OPERATOR"))])
def create_voyage(payload: VoyageCreate, db: Session = Depends(get_db)):
    vessel = db.query(Vessel).filter(Vessel.id == payload.vessel_id).first()
    if not vessel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "VESSEL_NOT_FOUND", "message": f"Vessel with ID {payload.vessel_id} not found."}
        )
    route = db.query(Route).filter(Route.id == payload.route_id).first()
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "ROUTE_NOT_FOUND", "message": f"Route with ID {payload.route_id} not found."}
        )

    dep_time = payload.departure_time or datetime.now(timezone.utc)
    est_arrival = dep_time + datetime.timedelta(hours=route.estimated_time_hours) if hasattr(datetime, 'timedelta') else None
    from datetime import timedelta
    est_arrival = dep_time + timedelta(hours=route.estimated_time_hours)

    voyage = Voyage(
        vessel_id=vessel.id,
        route_id=route.id,
        status="planned",
        departure_time=dep_time,
        estimated_arrival=est_arrival,
        starting_fuel=vessel.current_fuel_liters,
        estimated_fuel=route.estimated_fuel_liters,
        fuel_saved=0.0,
        co2_estimated=route.estimated_co2_kg
    )
    db.add(voyage)
    db.commit()
    db.refresh(voyage)
    return voyage


@router.patch("/{voyage_id}", response_model=VoyageResponse, dependencies=[Depends(require("OPERATOR"))])
def update_voyage(voyage_id: int, payload: VoyageUpdate, db: Session = Depends(get_db)):
    voyage = db.query(Voyage).filter(Voyage.id == voyage_id).first()
    if not voyage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "VOYAGE_NOT_FOUND", "message": f"Voyage with ID {voyage_id} not found."}
        )
    for field, val in payload.dict(exclude_unset=True).items():
        setattr(voyage, field, val)
    db.commit()
    db.refresh(voyage)
    return voyage
