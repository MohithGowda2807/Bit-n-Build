from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.ais.service import ais_service
from app.services.websocket.hub import ws_hub
from app.models.dark_period import DarkPeriod
from app.schemas.surveillance import DarkPeriodResponse

router = APIRouter(prefix="/api/v1/ais", tags=["AIS & Kinematic Simulation"])


@router.get("/live")
def get_live_ais(db: Session = Depends(get_db)):
    """Retrieve the current live AIS telemetry snapshot for all fleet vessels."""
    return ais_service.simulate_telemetry_step(db)


@router.post("/simulate")
async def trigger_ais_simulation_step(db: Session = Depends(get_db)):
    """
    Triggers one synthetic AIS kinematic simulation step:
    - Moves underway vessels along their heading
    - Adds GPS jitter for anchored vessels
    - Records breadcrumbs into Track table
    - Broadcasts live update to connected WebSocket clients.
    """
    telemetry = ais_service.simulate_telemetry_step(db)
    await ws_hub.broadcast("vessel_telemetry", {"vessels": telemetry})
    return {
        "status": "success",
        "updated_vessels_count": len(telemetry),
        "telemetry": telemetry
    }


# Phase 3: dark periods
@router.get("/gaps", response_model=List[DarkPeriodResponse])
def list_ais_gaps(
    vessel_id: Optional[int] = None,
    min_duration_seconds: Optional[float] = None,
    severity: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(DarkPeriod)
    if vessel_id is not None:
        query = query.filter(DarkPeriod.vessel_id == vessel_id)
    if min_duration_seconds is not None:
        query = query.filter(DarkPeriod.duration_seconds >= min_duration_seconds)
    if severity:
        query = query.filter(DarkPeriod.severity == severity.upper())
    return query.order_by(DarkPeriod.start_time.desc()).all()


@router.get("/gaps/{gap_id}", response_model=DarkPeriodResponse)
def get_ais_gap(gap_id: int, db: Session = Depends(get_db)):
    gap = db.query(DarkPeriod).filter(DarkPeriod.id == gap_id).first()
    if not gap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "AIS_GAP_NOT_FOUND", "message": f"AIS gap {gap_id} not found."},
        )
    return gap
