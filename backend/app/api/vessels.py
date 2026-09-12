from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.vessel import Vessel
from app.schemas.vessel import VesselResponse, VesselCreate, VesselUpdate

router = APIRouter(prefix="/api/v1/vessels", tags=["Vessels"])


@router.get("", response_model=List[VesselResponse])
def list_vessels(
    vessel_type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Vessel)
    if vessel_type:
        query = query.filter(Vessel.vessel_type == vessel_type)
    if status:
        query = query.filter(Vessel.status == status)
    return query.all()


@router.get("/{vessel_id}", response_model=VesselResponse)
def get_vessel(vessel_id: int, db: Session = Depends(get_db)):
    vessel = db.query(Vessel).filter(Vessel.id == vessel_id).first()
    if not vessel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "VESSEL_NOT_FOUND", "message": f"Vessel with ID {vessel_id} not found."}
        )
    return vessel


@router.post("", response_model=VesselResponse, status_code=status.HTTP_201_CREATED)
def create_vessel(payload: VesselCreate, db: Session = Depends(get_db)):
    existing = db.query(Vessel).filter(Vessel.vessel_identifier == payload.vessel_identifier).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "VESSEL_EXISTS", "message": "Vessel identifier already exists."}
        )
    vessel = Vessel(**payload.dict())
    db.add(vessel)
    db.commit()
    db.refresh(vessel)
    return vessel


@router.patch("/{vessel_id}", response_model=VesselResponse)
def update_vessel(vessel_id: int, payload: VesselUpdate, db: Session = Depends(get_db)):
    vessel = db.query(Vessel).filter(Vessel.id == vessel_id).first()
    if not vessel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "VESSEL_NOT_FOUND", "message": f"Vessel with ID {vessel_id} not found."}
        )
    for field, val in payload.dict(exclude_unset=True).items():
        setattr(vessel, field, val)
    db.commit()
    db.refresh(vessel)
    return vessel
