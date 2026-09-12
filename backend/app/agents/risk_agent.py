import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.voyage import Voyage
from app.services.risk.engine import risk_engine

logger = logging.getLogger("oceansentinel.risk_agent")


class RiskAgent:
    """
    Phase 2 Safety & Risk Assessment Agent.
    Evaluates active voyage corridors against incoming environmental hazards.
    Emits ROUTE_AT_RISK events when route safety thresholds are breached.
    """
    def __init__(self, agent_id: str = "agent-risk-01"):
        self.agent_id = agent_id
        self.last_run = datetime.utcnow()
        self.status = "idle"

    def evaluate_voyage(self, voyage: Voyage, db: Session) -> Optional[Dict[str, Any]]:
        self.status = "running"
        self.last_run = datetime.utcnow()

        if not voyage.route:
            self.status = "idle"
            return None

        assessment = risk_engine.assess_route_risk(voyage.route, db, voyage.vessel)

        event = None
        if assessment.requires_rerouting or assessment.is_critical:
            event = {
                "event_type": "ROUTE_AT_RISK",
                "source": "risk_agent",
                "timestamp": datetime.utcnow().isoformat(),
                "payload": {
                    "voyage_id": voyage.id,
                    "route_id": voyage.route_id,
                    "risk_score": assessment.overall_score,
                    "risk_level": assessment.risk_level,
                    "is_critical": assessment.is_critical,
                    "primary_threat": assessment.primary_threat,
                    "intersecting_storms_count": len(assessment.active_storms_intersecting)
                }
            }
            logger.warning(f"RiskAgent flagged ROUTE_AT_RISK for Voyage {voyage.id} (Score {assessment.overall_score})")

        self.status = "idle"
        return event


risk_agent = RiskAgent()
