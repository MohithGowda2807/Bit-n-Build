from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.voyage import Voyage
from app.models.route import Route
from app.models.vessel import Vessel

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])


@router.get("/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    total_voyages = db.query(Voyage).count()
    active_voyages = db.query(Voyage).filter(Voyage.status == "active").count()
    total_vessels = db.query(Vessel).count()

    total_distance = db.query(func.sum(Route.distance_km)).scalar() or 0.0
    total_fuel = db.query(func.sum(Route.estimated_fuel_liters)).scalar() or 0.0
    total_co2 = db.query(func.sum(Route.estimated_co2_kg)).scalar() or 0.0
    total_cost = db.query(func.sum(Route.estimated_cost)).scalar() or 0.0

    # Calculate baseline fuel saved based on differences
    routes_count = db.query(Route).count()
    avg_eta_hours = (db.query(func.avg(Route.estimated_time_hours)).scalar() or 0.0)

    return {
        "total_voyages": total_voyages,
        "active_voyages": active_voyages,
        "total_vessels": total_vessels,
        "total_routes_optimized": routes_count,
        "total_distance_km": round(float(total_distance), 1),
        "total_fuel_liters": round(float(total_fuel), 1),
        "total_co2_kg": round(float(total_co2), 1),
        "total_estimated_cost_usd": round(float(total_cost), 2),
        "average_eta_hours": round(float(avg_eta_hours), 1)
    }
