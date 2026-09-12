import logging
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.models.voyage import Voyage
from app.agents.weather_agent import weather_agent
from app.agents.risk_agent import risk_agent
from app.agents.route_agent import route_agent
from app.agents.commander_hook import run_surveillance_cycle, CycleSummary

logger = logging.getLogger("oceansentinel.commander")


class MaritimeCommander:
    """
    Central Maritime Commander Autonomous Orchestrator.
    Perceives oceanic telemetry, delegates to specialist agents (Weather, Risk, Route, Surveillance),
    resolves conflicts, and executes autonomous re-routing or human approval gates.
    """
    def __init__(self):
        self.mode: str = "autonomous"  # advisory, semi_autonomous, autonomous
        self.agent_id: str = "agent-commander-00"
        self.last_cycle_time: datetime = datetime.utcnow()

    def set_mode(self, mode: str):
        if mode in ("advisory", "semi_autonomous", "autonomous"):
            self.mode = mode
            logger.info(f"Maritime Commander operating mode switched to: {mode}")

    def get_mode(self) -> str:
        return self.mode

    def run_environmental_cycle(self, db: Session) -> Dict[str, Any]:
        """
        Executes one environmental monitoring & dynamic re-routing cycle:
        1. Weather Agent scans for storm disturbances.
        2. Risk Agent evaluates all active voyages against hazard fields.
        3. Route Agent recalculates paths if a voyage is flagged ROUTE_AT_RISK.
        4. Commander updates voyages according to operating mode.
        """
        self.last_cycle_time = datetime.utcnow()
        weather_events = weather_agent.scan_for_hazards(db)

        # Query all active or planned voyages
        voyages = db.query(Voyage).filter(Voyage.status.in_(["planned", "active"])).all()

        voyages_evaluated = 0
        routes_at_risk = 0
        routes_recalculated = 0
        recalculation_details = []

        for v in voyages:
            voyages_evaluated += 1
            risk_event = risk_agent.evaluate_voyage(v, db)
            if risk_event:
                routes_at_risk += 1
                threat = risk_event["payload"].get("primary_threat", "Environmental Hazard")

                # Delegate to Route Optimization Agent
                try:
                    recalc_res = route_agent.plan_recalculation(
                        voyage_id=v.id,
                        reason=f"HAZARD_AVOIDANCE: {threat}",
                        mode=self.mode,
                        db=db,
                        candidate_profile="safest"
                    )
                    routes_recalculated += 1
                    recalculation_details.append({
                        "voyage_id": v.id,
                        "previous_route_id": recalc_res["previous_route_id"],
                        "new_route_id": recalc_res["new_route_id"],
                        "version": recalc_res["version_number"],
                        "risk_reduction_pct": recalc_res["risk_reduction_pct"],
                        "applied": recalc_res["applied"]
                    })
                except Exception as e:
                    logger.error(f"Commander failed to recalculate voyage {v.id}: {e}")

        return {
            "timestamp": datetime.utcnow().isoformat(),
            "mode": self.mode,
            "storms_detected": len(weather_events),
            "voyages_evaluated": voyages_evaluated,
            "routes_at_risk": routes_at_risk,
            "routes_recalculated": routes_recalculated,
            "recalculations": recalculation_details
        }

    def run_full_command_cycle(self, db: Session) -> Dict[str, Any]:
        """
        Unified multi-domain command cycle executing both Environmental Routing (Phase 2)
        and Maritime Surveillance (Phase 3).
        """
        env_summary = self.run_environmental_cycle(db)
        surv_summary = run_surveillance_cycle(db)

        return {
            "status": "success",
            "operating_mode": self.mode,
            "environmental_routing": env_summary,
            "surveillance": surv_summary.as_dict()
        }


maritime_commander = MaritimeCommander()
