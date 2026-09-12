from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.ais.service import ais_service
from app.services.websocket.hub import ws_hub

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
