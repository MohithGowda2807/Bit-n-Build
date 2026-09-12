from datetime import timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.vessel import Vessel
from app.schemas.vessel import VesselResponse, VesselCreate, VesselUpdate
from app.models.ais_position import AISPosition
from app.schemas.surveillance import AISPositionResponse, VesselRiskResponse
from app.models.evidence import Evidence
from app.services.surveillance.risk_service import RiskService

router = APIRouter(prefix="/api/v1/vessels", tags=["Vessels"])


@router.get("", response_model=List[VesselResponse])
def list_vessels(
    vessel_type: Optional[str] = None,
    status: Optional[str] = None,
    mmsi: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Vessel)
    if mmsi:
        query = query.filter(Vessel.mmsi == mmsi)
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
    vessel = Vessel(**payload.model_dump())
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
    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(vessel, field, val)
    db.commit()
    db.refresh(vessel)
    return vessel


@router.get("/{vessel_id}/track", response_model=List[AISPositionResponse])
def get_vessel_track(vessel_id: int, hours: Optional[float] = None, db: Session = Depends(get_db)):
    """AIS positions for a vessel in time order, optionally limited to the last N hours of its track."""
    query = db.query(AISPosition).filter(AISPosition.vessel_id == vessel_id)
    if hours is not None:
        latest = query.order_by(AISPosition.timestamp.desc()).first()
        if latest:
            query = query.filter(AISPosition.timestamp >= latest.timestamp - timedelta(hours=hours))
    return query.order_by(AISPosition.timestamp).all()


@router.get("/{vessel_id}/risk", response_model=VesselRiskResponse)
def get_vessel_risk(vessel_id: int, db: Session = Depends(get_db)):
    risk = RiskService(db).latest_for(vessel_id)
    if not risk:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "RISK_NOT_ASSESSED", "message": f"No risk assessment exists for vessel {vessel_id}."}
        )
    evidence = db.query(Evidence).filter(Evidence.risk_score_id == risk.id).order_by(Evidence.strength.desc()).all()
    return VesselRiskResponse(
        vessel_id=risk.vessel_id, risk_score_id=risk.id, score=risk.score, level=risk.level,
        factors=risk.factors, computed_at=risk.computed_at, evidence=evidence,
    )
