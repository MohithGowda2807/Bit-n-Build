import math
import random
import logging
import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.vessel import Vessel
from app.models.track import Track
from app.services.websocket.hub import ws_hub

logger = logging.getLogger("oceansentinel.ais")


class AISService:
    """
    AIS Data Integration Service with Synthetic Fallback.
    Supports external AIS API ingestion (when configured) and high-fidelity
    synthetic kinematic simulation (dead reckoning, noise, drift, track persistence).
    """

    def __init__(self, external_api_url: Optional[str] = None, api_key: Optional[str] = None):
        self.external_api_url = external_api_url
        self.api_key = api_key

    def fetch_external_ais(self) -> List[Dict[str, Any]]:
        """Placeholder for external live AIS aggregator API."""
        if not self.external_api_url:
            return []
        # When external endpoint is configured, fetch here
        return []

    def simulate_telemetry_step(self, db: Session) -> List[Dict[str, Any]]:
        """
        Advances all vessels by a realistic kinematic step:
        - Updates vessel latitude/longitude based on speed and heading
        - Injects realistic heading variance and speed jitter
        - Persists breadcrumb in Track table
        - Returns updated telemetry list
        """
        vessels = db.query(Vessel).all()
        updated_telemetry = []
        now = datetime.datetime.utcnow()

        for vessel in vessels:
            if (vessel.vessel_identifier or "").startswith("MMSI-"):
                continue  # Phase 3 scenario vessel: driven by scripted AIS, not by this kinematic model
            if vessel.status in ["docked", "anchored", "maintenance"]:
                # Station-keeping small GPS jitter
                jitter_lat = (random.random() - 0.5) * 0.0001
                jitter_lon = (random.random() - 0.5) * 0.0001
                vessel.latitude = round(vessel.latitude + jitter_lat, 6)
                vessel.longitude = round(vessel.longitude + jitter_lon, 6)
                vessel.speed_knots = 0.0
            else:
                # Underway: compute realistic kinematic displacement (approx 5-minute simulated step)
                speed = max(5.0, min(vessel.max_speed_knots, vessel.speed_knots + (random.random() - 0.5) * 0.5))
                vessel.speed_knots = round(speed, 1)

                # Minor heading wandering (+/- 2 degrees)
                vessel.heading = (vessel.heading + (random.random() - 0.5) * 4.0) % 360.0

                # 1 knot ~ 1.852 km/h. For 5 mins = 0.0833 hours.
                dist_km = (vessel.speed_knots * 1.852) * (5.0 / 60.0)
                # 1 deg lat ~ 111 km
                delta_lat = (dist_km * math.cos(math.radians(vessel.heading))) / 111.0
                cos_lat = max(0.01, math.cos(math.radians(vessel.latitude)))
                delta_lon = (dist_km * math.sin(math.radians(vessel.heading))) / (111.0 * cos_lat)

                vessel.latitude = round(max(-85.0, min(85.0, vessel.latitude + delta_lat)), 6)
                vessel.longitude = round(((vessel.longitude + delta_lon + 180.0) % 360.0) - 180.0, 6)

            # Record track breadcrumb
            track = Track(
                vessel_id=vessel.id,
                latitude=vessel.latitude,
                longitude=vessel.longitude,
                speed_knots=vessel.speed_knots,
                heading=round(vessel.heading, 1),
                status=vessel.status,
                timestamp=now
            )
            db.add(track)

            telemetry_data = {
                "id": vessel.id,
                "vessel_identifier": vessel.vessel_identifier,
                "name": vessel.name,
                "mmsi": vessel.mmsi,
                "vessel_type": vessel.vessel_type,
                "latitude": vessel.latitude,
                "longitude": vessel.longitude,
                "speed_knots": vessel.speed_knots,
                "heading": round(vessel.heading, 1),
                "status": vessel.status,
                "timestamp": now.isoformat()
            }
            updated_telemetry.append(telemetry_data)

        db.commit()
        return updated_telemetry


ais_service = AISService()
