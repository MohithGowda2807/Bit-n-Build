from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.marine_zone import MarineZone
from app.schemas.marine_zone import MarineZoneResponse

router = APIRouter(prefix="/api/v1/zones", tags=["Marine Zones"])


@router.get("", response_model=List[MarineZoneResponse])
def list_zones(zone_type: Optional[str] = None, restricted: Optional[bool] = None, db: Session = Depends(get_db)):
    query = db.query(MarineZone)
    if zone_type:
        query = query.filter(MarineZone.zone_type == zone_type)
    if restricted is not None:
        query = query.filter(MarineZone.restricted == restricted)
    return query.all()


@router.get("/{zone_id}", response_model=MarineZoneResponse)
def get_zone(zone_id: int, db: Session = Depends(get_db)):
    zone = db.query(MarineZone).filter(MarineZone.id == zone_id).first()
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "ZONE_NOT_FOUND", "message": f"Marine zone with ID {zone_id} not found."}
        )
    return zone
