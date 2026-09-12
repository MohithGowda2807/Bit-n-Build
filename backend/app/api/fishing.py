import json
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.fishing_zone import FishingZone
from app.models.marine_protected_area import MarineProtectedArea
from app.models.surveillance_event import SurveillanceEvent
from app.schemas.surveillance import FishingZoneResponse, ProtectedAreaResponse, SurveillanceEventResponse

router = APIRouter(prefix="/api/v1/fishing", tags=["Fishing"])


def _with_geometry(row, schema):
    data = {column.name: getattr(row, column.name) for column in row.__table__.columns}
    data["geometry"] = json.loads(data.pop("geometry_geojson"))
    return schema(**data)


@router.get("/zones", response_model=List[FishingZoneResponse])
def list_fishing_zones(zone_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(FishingZone)
    if zone_type:
        query = query.filter(FishingZone.zone_type == zone_type.upper())
    return [_with_geometry(z, FishingZoneResponse) for z in query.order_by(FishingZone.id).all()]


@router.get("/protected-areas", response_model=List[ProtectedAreaResponse])
def list_protected_areas(db: Session = Depends(get_db)):
    return [_with_geometry(a, ProtectedAreaResponse) for a in db.query(MarineProtectedArea).order_by(MarineProtectedArea.id).all()]


@router.get("/events", response_model=List[SurveillanceEventResponse])
def list_fishing_events(vessel_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(SurveillanceEvent).filter(SurveillanceEvent.event_type == "FISHING_PATTERN")
    if vessel_id is not None:
        query = query.filter(SurveillanceEvent.vessel_id == vessel_id)
    return query.order_by(SurveillanceEvent.timestamp.desc()).all()
