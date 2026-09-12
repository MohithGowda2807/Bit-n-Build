from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.debris import Debris
from app.schemas.debris import DebrisResponse, DebrisCreate, DebrisUpdate

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


@router.get("/{debris_id}", response_model=DebrisResponse)
def get_debris(debris_id: int, db: Session = Depends(get_db)):
    """Retrieve details for a single debris cluster."""
    item = db.query(Debris).filter(Debris.id == debris_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Debris not found")
    return item


@router.post("", response_model=DebrisResponse, status_code=201)
def report_debris(debris_in: DebrisCreate, db: Session = Depends(get_db)):
    """Report a new marine debris detection."""
    data = debris_in.model_dump()
    debris = Debris(**data)
    db.add(debris)
    db.commit()
    db.refresh(debris)
    return debris


@router.patch("/{debris_id}", response_model=DebrisResponse)
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
