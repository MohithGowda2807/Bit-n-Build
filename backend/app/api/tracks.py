from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.track import Track
from app.models.vessel import Vessel
from app.schemas.track import TrackResponse, TrackCreate

router = APIRouter(prefix="/api/v1", tags=["Tracks & AIS Telemetry"])


@router.get("/tracks", response_model=List[TrackResponse])
def get_recent_tracks(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Retrieve recent track history across all monitored vessels."""
    return db.query(Track).order_by(Track.timestamp.desc()).limit(limit).all()


@router.get("/vessels/{vessel_id}/tracks", response_model=List[TrackResponse])
def get_vessel_tracks(
    vessel_id: int,
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Retrieve historical track breadcrumbs for a specific vessel."""
    vessel = db.query(Vessel).filter(Vessel.id == vessel_id).first()
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")

    tracks = db.query(Track).filter(
        Track.vessel_id == vessel_id
    ).order_by(Track.timestamp.desc()).limit(limit).all()

    # Return in chronological order for map polyline rendering
    return list(reversed(tracks))


@router.post("/tracks", response_model=TrackResponse, status_code=201)
def create_track_point(track_in: TrackCreate, db: Session = Depends(get_db)):
    """Record a new AIS telemetry breadcrumb."""
    vessel = db.query(Vessel).filter(Vessel.id == track_in.vessel_id).first()
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")

    track = Track(**track_in.model_dump())
    db.add(track)

    # Update vessel current coordinates
    vessel.latitude = track.latitude
    vessel.longitude = track.longitude
    vessel.speed_knots = track.speed_knots
    vessel.heading = track.heading
    vessel.status = track.status

    db.commit()
    db.refresh(track)
    return track
