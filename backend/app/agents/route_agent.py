import logging
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.services.routing.service import routing_service

logger = logging.getLogger("oceansentinel.route_agent")


class RouteOptimizationAgent:
    """
    Phase 2 Route Planning & Dynamic Detour Agent.
    Formulates safe, weather-aware alternative maritime corridors and computes trade-offs.
    """
    def __init__(self, agent_id: str = "agent-route-01"):
        self.agent_id = agent_id
        self.last_run = datetime.utcnow()
        self.status = "idle"

    def plan_recalculation(
        self,
        voyage_id: int,
        reason: str,
        mode: str,
        db: Session,
        candidate_profile: str = "safest"
    ) -> Dict[str, Any]:
        self.status = "running"
        self.last_run = datetime.utcnow()

        result = routing_service.recalculate_voyage_route(
            voyage_id=voyage_id,
            reason=reason,
            mode=mode,
            db=db,
            candidate_profile=candidate_profile
        )

        self.status = "idle"
        logger.info(f"RouteOptimizationAgent generated new route for Voyage {voyage_id} (Version {result.get('version_number')})")
        return result


route_agent = RouteOptimizationAgent()
