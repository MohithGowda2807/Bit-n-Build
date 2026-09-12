from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.port import Port
from app.schemas.port import PortResponse
from app.services.routing.geometry import haversine_distance

router = APIRouter(prefix="/api/v1/ports", tags=["Ports"])


@router.get("", response_model=List[PortResponse])
def list_ports(country: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Port)
    if country:
        query = query.filter(Port.country == country)
    return query.all()


@router.get("/nearest", response_model=PortResponse)
def get_nearest_port(latitude: float, longitude: float, db: Session = Depends(get_db)):
    ports = db.query(Port).all()
    if not ports:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NO_PORTS_FOUND", "message": "No ports configured."}
        )
    nearest = min(
        ports,
        key=lambda p: haversine_distance(latitude, longitude, p.latitude, p.longitude)
    )
    return nearest


@router.get("/{port_id}", response_model=PortResponse)
def get_port(port_id: int, db: Session = Depends(get_db)):
    port = db.query(Port).filter(Port.id == port_id).first()
    if not port:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "PORT_NOT_FOUND", "message": f"Port with ID {port_id} not found."}
        )
    return port
