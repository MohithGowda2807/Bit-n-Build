from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.route import Route
from app.models.voyage import Voyage
from app.schemas.dynamic_routing import VoyageHealthResponse
from app.services.risk.engine import risk_engine

router = APIRouter(prefix="/api/v1/risk", tags=["Maritime Risk Assessment"])


@router.get("/coordinate")
def get_coordinate_risk(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    vessel_type: str = Query(default="container"),
    db: Session = Depends(get_db)
):
    """Assess environmental and storm hazard risk at specific oceanic coordinates."""
    score, factors = risk_engine.assess_coordinate_risk(lat, lon, vessel_type=vessel_type, db=db)
    return {
        "latitude": lat,
        "longitude": lon,
        "risk_score": score,
        "risk_level": risk_engine.get_risk_level(score),
        "factors": [
            {
                "name": f.name,
                "category": f.category,
                "score": f.score,
                "severity": f.severity,
                "description": f.description
            }
            for f in factors
        ]
    }


@router.get("/route/{route_id}")
def get_route_risk(route_id: int, db: Session = Depends(get_db)):
    """Evaluate comprehensive environmental risk along an entire route."""
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    assessment = risk_engine.assess_route_risk(route, db=db)
    return {
        "route_id": route_id,
        "overall_score": assessment.overall_score,
        "risk_level": assessment.risk_level,
        "is_critical": assessment.is_critical,
        "requires_rerouting": assessment.requires_rerouting,
        "primary_threat": assessment.primary_threat,
        "active_storms_intersecting": assessment.active_storms_intersecting,
        "segment_risks": assessment.segment_risks,
        "factors": [
            {
                "name": f.name,
                "category": f.category,
                "score": f.score,
                "severity": f.severity,
                "description": f.description
            }
            for f in assessment.factors
        ]
    }


@router.get("/voyage/{voyage_id}", response_model=VoyageHealthResponse)
def get_voyage_health(voyage_id: int, db: Session = Depends(get_db)):
    """Retrieve holistic voyage health index (Safety, Fuel, Environment, ETA)."""
    voyage = db.query(Voyage).filter(Voyage.id == voyage_id).first()
    if not voyage:
        raise HTTPException(status_code=404, detail="Voyage not found")

    return risk_engine.calculate_voyage_health(voyage, db=db)
