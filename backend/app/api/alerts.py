from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import require
from app.models.alert import Alert
from app.models.mission import Mission
from app.models.incident import Incident
from app.schemas.alert import AlertResponse, AlertCreate
from app.schemas.mission import MissionResponse, MissionCreate
from app.schemas.incident import IncidentResponse, IncidentCreate

router = APIRouter(prefix="/api/v1", tags=["Operations, Missions & Alerts"])


# --- ALERTS ---
@router.get("/alerts", response_model=List[AlertResponse])
def list_alerts(
    status: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """List operational and environmental alerts."""
    q = db.query(Alert)
    if status:
        q = q.filter(Alert.status == status)
    if severity:
        q = q.filter(Alert.severity == severity)
    return q.order_by(Alert.timestamp.desc()).all()


@router.post("/alerts", response_model=AlertResponse, status_code=201)
def create_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
    """Create a new alert."""
    alert = Alert(**alert_in.model_dump())
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


@router.patch("/alerts/{alert_id}/ack", response_model=AlertResponse)
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    """Acknowledge an active alert."""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.acknowledged = True
    alert.status = "investigating"
    db.commit()
    db.refresh(alert)
    return alert


# --- MISSIONS ---
@router.get("/missions", response_model=List[MissionResponse])
def list_missions(
    status: Optional[str] = Query(None),
    mission_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """List fleet and environmental cleanup missions."""
    q = db.query(Mission)
    if status:
        q = q.filter(Mission.status == status)
    if mission_type:
        q = q.filter(Mission.mission_type == mission_type)
    return q.order_by(Mission.created_at.desc()).all()


@router.post("/missions", response_model=MissionResponse, status_code=201, dependencies=[Depends(require("OPERATOR"))])
def create_mission(mission_in: MissionCreate, db: Session = Depends(get_db)):
    """Dispatch or queue a new mission."""
    mission = Mission(**mission_in.model_dump())
    db.add(mission)
    db.commit()
    db.refresh(mission)
    return mission


# --- INCIDENTS ---
@router.get("/incidents", response_model=List[IncidentResponse])
def list_incidents(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """List maritime incidents and hazards."""
    q = db.query(Incident)
    if status:
        q = q.filter(Incident.status == status)
    return q.order_by(Incident.reported_at.desc()).all()


@router.post("/incidents", response_model=IncidentResponse, status_code=201)
def report_incident(incident_in: IncidentCreate, db: Session = Depends(get_db)):
    """Log a new maritime incident."""
    incident = Incident(**incident_in.model_dump())
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident
