import logging
from datetime import datetime
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.services.storm.service import storm_service

logger = logging.getLogger("oceansentinel.weather_agent")


class WeatherAgent:
    """
    Phase 2 Weather & Atmospheric Monitoring Agent.
    Continuously ingests marine meteorology, identifies cyclonic cells / squalls,
    and publishes STORM_DETECTED events to the event bus.
    """
    def __init__(self, agent_id: str = "agent-weather-01"):
        self.agent_id = agent_id
        self.last_run = datetime.utcnow()
        self.status = "idle"

    def scan_for_hazards(self, db: Session) -> List[Dict[str, Any]]:
        self.status = "running"
        self.last_run = datetime.utcnow()
        active_storms = storm_service.get_active_storms(db)

        events = []
        for s in active_storms:
            events.append({
                "event_type": "STORM_DETECTED",
                "source": "weather_agent",
                "timestamp": datetime.utcnow().isoformat(),
                "payload": {
                    "storm_id": s.id,
                    "storm_name": s.name,
                    "severity": s.severity,
                    "center": [s.center_latitude, s.center_longitude],
                    "radius_km": s.radius_km,
                    "wind_speed_knots": s.wind_speed_knots
                }
            })

        self.status = "idle"
        logger.info(f"WeatherAgent scanned: {len(active_storms)} active storm disturbances detected.")
        return events


weather_agent = WeatherAgent()
