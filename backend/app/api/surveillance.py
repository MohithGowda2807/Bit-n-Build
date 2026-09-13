from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.agents.commander_hook import run_surveillance_cycle
from app.database import get_db
from app.models.surveillance_event import SurveillanceEvent
from app.models.vessel_risk_score import VesselRiskScore
from app.schemas.surveillance import HeatmapResponse, SurveillanceEventResponse, VesselRiskSummary
from app.services.surveillance.heatmap import build_heatmap

from app.security import require

router = APIRouter(prefix="/api/v1/surveillance", tags=["Surveillance"])


@router.get("/events", response_model=List[SurveillanceEventResponse])
def list_events(
    vessel_id: Optional[int] = None,
    event_type: Optional[str] = None,
    limit: int = Query(200, ge=1, le=2000),
    db: Session = Depends(get_db),
):
    query = db.query(SurveillanceEvent)
    if vessel_id is not None:
        query = query.filter(SurveillanceEvent.vessel_id == vessel_id)
    if event_type:
        query = query.filter(SurveillanceEvent.event_type == event_type.upper())
    return query.order_by(SurveillanceEvent.timestamp.desc()).limit(limit).all()


@router.get("/risk", response_model=List[VesselRiskSummary])
def list_vessel_risk(min_score: float = 0.0, level: Optional[str] = None, db: Session = Depends(get_db)):
    """Newest risk assessment per vessel, highest score first."""
    latest_ids = db.query(func.max(VesselRiskScore.id)).group_by(VesselRiskScore.vessel_id).scalar_subquery()
    query = db.query(VesselRiskScore).filter(VesselRiskScore.id.in_(latest_ids), VesselRiskScore.score >= min_score)
    if level:
        query = query.filter(VesselRiskScore.level == level.upper())
    rows = query.order_by(VesselRiskScore.score.desc()).all()
    return [
        VesselRiskSummary(
            vessel_id=r.vessel_id, score=r.score, level=r.level, computed_at=r.computed_at,
            top_factor=(r.factors[0]["explanation"] if r.factors else None),
        )
        for r in rows
    ]


@router.get("/heatmap", response_model=HeatmapResponse)
def activity_heatmap(cell_degrees: float = Query(0.25, gt=0.0, le=5.0),
                     hours: Optional[float] = Query(None, gt=0.0), db: Session = Depends(get_db)):
    """AIS positions, detections and the riskiest vessel seen, aggregated per grid cell; intensity is relative to the hottest cell."""
    cells = build_heatmap(db, cell_degrees=cell_degrees, hours=hours)
    return HeatmapResponse(cell_degrees=cell_degrees, hours=hours, cells=[c.as_dict() for c in cells])


@router.post("/run-cycle", dependencies=[Depends(require("ADMIN"))])
def run_cycle(db: Session = Depends(get_db)):
    """One surveillance cycle over stored AIS: detect events, reassess risk, open or update cases."""
    return run_surveillance_cycle(db).as_dict()
