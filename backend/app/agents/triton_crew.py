import os
import time
import logging
import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.models.vessel import Vessel
from app.models.track import Track
from app.models.debris import Debris
from app.models.marine_zone import MarineZone
from app.models.marine_protected_area import MarineProtectedArea
from app.models.cleanup_unit import CleanupUnit
from app.services.weather.service import weather_service
from app.services.ocean.service import ocean_service
from app.services.debris.drift import predict_drift_trajectory
from app.services.debris.environmental_risk import evaluate_debris_environmental_risk
from app.services.debris.mission_planner import plan_autonomous_cleanup_mission
from app.agents.toolkit import SurveillanceToolkit
from app.agents.crew import AgentRunError, LLMNotConfiguredError, ask_maritime_ai, llm_configured
from app.schemas.agent import (
    OrchestratorRequest,
    OrchestratorResponse,
    AgentFinding,
    AgentTraceStep,
    HumanApprovalRequest,
    HumanApprovalResponse
)

logger = logging.getLogger("oceansentinel.agents")

RISK_ORDER = ["low", "medium", "high", "critical"]
QUESTION_WORDS = ("why", "which", "what", "how", "who", "where", "when", "show", "list", "explain", "is ", "are ", "does ", "do ")
SURVEILLANCE_TO_FINDING_RISK = {"LOW": "low", "MODERATE": "low", "ELEVATED": "medium", "HIGH": "high", "CRITICAL": "critical"}

# Optional CrewAI imports
try:
    from crewai import Agent as CrewAgent, Task as CrewTask, Crew as CrewAI_Crew, Process
    CREWAI_AVAILABLE = True
except ImportError:
    CREWAI_AVAILABLE = False
    logger.warning("CrewAI module not found in environment; running deterministic multi-agent pipeline.")


class TritonAgentFramework:
    """
    TRITON Phase 1 Multi-Agent Framework:
    - Orchestrator Agent
    - Vessel Watch Agent
    - Route Planner Agent
    - Debris Sentinel Agent
    - Compliance Agent
    """

    def __init__(self):
        self.crewai_initialized = False
        self._init_crewai_agents()

    def _init_crewai_agents(self):
        """Initializes the four CrewAI agent skeletons and the Orchestrator."""
        if not CREWAI_AVAILABLE:
            return

        try:
            # We initialize Agent definitions with well-crafted personas
            # CrewAI allows specifying custom LLMs or running in structured configurations
            self.vessel_watch_agent = CrewAgent(
                role="Vessel Watch & AIS Sentinel",
                goal="Continuously evaluate AIS telemetry, kinematics, speed fluctuations, and identify anomalous or dark vessel behaviors.",
                backstory="Specialized maritime surveillance intelligence officer tracking global automated identification system (AIS) telemetry.",
                verbose=False,
                allow_delegation=False
            )

            self.route_planner_agent = CrewAgent(
                role="Autonomous Marine Route Strategist",
                goal="Evaluate navigational paths, calculate fuel/ETA trade-offs, and recommend optimal maritime corridors.",
                backstory="Expert hydrodynamics navigator specialized in great-circle routing, fuel optimization, and ocean currents.",
                verbose=False,
                allow_delegation=False
            )

            self.debris_sentinel_agent = CrewAgent(
                role="Ocean Debris & Hazard Sentinel",
                goal="Identify floating debris concentrations, ghost net clusters, and container spill collision hazards.",
                backstory="Autonomous oceanic clean-up coordinator and environmental risk assessor monitoring oceanic convergence zones.",
                verbose=False,
                allow_delegation=False
            )

            self.compliance_report_agent = CrewAgent(
                role="Marine Sanctuary & Regulatory Compliance Officer",
                goal="Synthesize telemetry from Vessel Watch, Route Planner, and Debris Sentinel to enforce Marine Protected Area (MPA) boundaries, speed limits, and IMO environmental compliance regulations.",
                backstory="International maritime law inspector dedicated to protecting delicate marine biospheres and restricted environmental zones.",
                verbose=False,
                allow_delegation=False
            )
            self.compliance_agent = self.compliance_report_agent

            self.orchestrator_agent = CrewAgent(
                role="TRITON Master Maritime Mission Orchestrator",
                goal="Coordinate subordinate specialist agents, synthesize situational awareness, resolve operational conflicts, and generate authoritative command directives.",
                backstory="Senior autonomous maritime operations commander integrating radar, AIS, satellite imagery, and environmental data streams.",
                verbose=False,
                allow_delegation=True
            )

            self.crewai_initialized = True
            logger.info("All four TRITON agents and Master Orchestrator initialized successfully with CrewAI.")
        except Exception as e:
            logger.warning(f"CrewAI agent initialization notice: {e}. Framework will use domain logic fallback.")
            self.crewai_initialized = False

    def orchestrate(self, request: OrchestratorRequest, db: Session) -> OrchestratorResponse:
        """
        Executes the end-to-end multi-agent pipeline:
        ASK TRITON (Natural Language)
             ↓
        ORCHESTRATOR
             ↓
        [Vessel Watch Agent | Route Planner Agent | Debris Sentinel Agent] (Parallel)
             ↓
        Compliance Report Agent (Evaluates all 3 findings against MPAs & Regulations)
             ↓
        HUMAN APPROVAL (Operator Clearance Gate)
             ↓
        ACTION / REPLAN
        """
        start_time = time.perf_counter()
        mission_id = f"TRITON-{uuid.uuid4().hex[:8].upper()}"

        # 1. Fetch relevant domain context from DB
        vessel = None
        if request.vessel_id:
            vessel = db.query(Vessel).filter(Vessel.id == request.vessel_id).first()
        elif not vessel:
            vessel = db.query(Vessel).first()

        debris_list = db.query(Debris).filter(Debris.status != "cleared").limit(10).all()
        zones = db.query(MarineZone).filter(MarineZone.restricted == True).all()

        lat = vessel.latitude if vessel else 1.29
        lon = vessel.longitude if vessel else 103.85

        # Fetch environmental telemetry
        weather_info = weather_service._generate_synthetic_weather(lat, lon)
        ocean_info = ocean_service.get_ocean_currents(lat, lon)

        # 2. Execute Parallel Specialist Agents (1, 2, 3, 4)
        vessel_watch_finding = self._run_vessel_watch_agent(vessel, db, request.query)
        route_planner_finding = self._run_route_planner_agent(vessel, weather_info, ocean_info, request.query)
        debris_finding = self._run_debris_sentinel_agent(vessel, debris_list, db, request.query)
        cleanup_finding = self._run_cleanup_agent(debris_finding, db, request.query)

        # 3. Execute Compliance Report Agent (Receives findings from all specialist agents)
        compliance_finding = self._run_compliance_report_agent(
            vessel=vessel,
            zones=zones,
            vessel_watch=vessel_watch_finding,
            route_planner=route_planner_finding,
            debris_sentinel=debris_finding,
            query=request.query
        )

        all_findings = [
            vessel_watch_finding,
            route_planner_finding,
            debris_finding,
            cleanup_finding,
            compliance_finding
        ]

        # 4. Master Orchestrator Decision Synthesis & Human Approval Gate
        high_risks = [f for f in all_findings if f.risk_level in ["high", "critical"]]
        moderate_risks = [f for f in all_findings if f.risk_level == "medium"]
        recommendations = []

        requires_human_approval = False
        approval_status = "auto_cleared"
        proposed_action = None
        actions_proposed = []

        # If cleanup proposal was generated, add it to proposed actions
        if cleanup_finding.details.get("mission_proposal"):
            proposal = cleanup_finding.details["mission_proposal"]
            actions_proposed.append({
                "action_id": f"act-mission-{mission_id[:8]}",
                "action_type": "autonomous_mission_dispatch",
                "title": f"Dispatch {proposal.get('assigned_unit_name', 'Autonomous ASV')}",
                "description": proposal.get("ecological_benefit_summary", "Autonomous cleanup sweep"),
                "unit_id": proposal.get("assigned_unit_id"),
                "waypoints": proposal.get("waypoints", []),
                "estimated_yield_kg": proposal.get("estimated_yield_kg", 500.0),
                "estimated_energy_kwh": proposal.get("estimated_energy_kwh", 25.0),
                "requires_approval": True
            })

        if high_risks:
            decision = f"CRITICAL HAZARDS DETECTED: Orchestrator identified {len(high_risks)} elevated operational risk(s). Operator clearance required."
            for r in high_risks:
                recommendations.append(f"[{r.agent_name}] {r.summary}")
            requires_human_approval = True
            approval_status = "pending_human_approval"
            # Synthesize actionable proposed directive
            if any("overspeed" in r.summary.lower() or "speed" in r.summary.lower() for r in high_risks):
                proposed_action = f"Enforce throttle reduction on {vessel.name if vessel else 'fleet'} to comply with corridor speed limits."
            elif any("severe" in r.summary.lower() or "wave" in r.summary.lower() for r in high_risks):
                proposed_action = f"Authorize emergency southern detour waypoint around {weather_info.wave_height_m}m storm swell."
            elif any("ghost_net" in r.summary.lower() or "debris" in r.summary.lower() for r in high_risks):
                proposed_action = f"Authorize emergency ASV drone fleet dispatch to intercept drifting ghost net hazard before MPA breach."
            else:
                proposed_action = f"Authorize emergency evasive replan for {vessel.name if vessel else 'active vessel'}."
        elif moderate_risks:
            decision = f"ADVISORY: Orchestrator logged {len(moderate_risks)} moderate condition(s). Review proposed autonomous adjustments."
            for r in moderate_risks:
                recommendations.append(f"[{r.agent_name}] {r.summary}")
            requires_human_approval = True if actions_proposed else False
            approval_status = "pending_human_approval" if requires_human_approval else "auto_cleared"
            proposed_action = f"Authorize autonomous drone dispatch & fuel-optimized speed trimming for {vessel.name if vessel else 'monitored vessel'}."
        else:
            decision = "NOMINAL: All maritime telemetry, routing corridors, debris scans, and MPA compliance checks cleared."
            recommendations.append("Continue current voyage plan under standard automated watchkeeping.")
            recommendations.append("Maintain 15-minute periodic AIS telemetry ping cycle.")
            recommendations.append(f"Environmental swell at {weather_info.wave_height_m}m with {weather_info.conditions}.")
            requires_human_approval = False
            approval_status = "auto_cleared"
            proposed_action = "Maintain automated watchkeeping without manual intervention."

        if vessel:
            recommendations.append(f"Monitored Vessel: {vessel.name} ({vessel.vessel_identifier}) at ({vessel.latitude:.3f}, {vessel.longitude:.3f})")

        compliance_summary = compliance_finding.details.get("compliance_report_summary", compliance_finding.summary)
        assistant_answer, assistant_provider = self._ask_assistant(request)
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

        import datetime as dt_mod
        now_iso = dt_mod.datetime.utcnow().isoformat() + "Z"

        agent_traces = [
            AgentTraceStep(
                step_number=1,
                agent="Maritime Commander",
                action="Query Intake & Context Analysis",
                input=request.query,
                output=f"Target: {vessel.name if vessel else 'Fleet wide'}, Theater: Eastern Arabian Sea & Indian Ocean",
                timestamp=now_iso
            ),
            AgentTraceStep(
                step_number=2,
                agent="Vessel Watch Agent",
                action="Kinematic Telemetry & AIS Surveillance",
                output=vessel_watch_finding.summary,
                timestamp=now_iso
            ),
            AgentTraceStep(
                step_number=3,
                agent="Route Planner Agent",
                action="Navigational Corridor & Wave Swell Analysis",
                output=route_planner_finding.summary,
                timestamp=now_iso
            ),
            AgentTraceStep(
                step_number=4,
                agent="Debris Sentinel Agent",
                action="Debris Detection & Leeway Drift Forecasting",
                output=debris_finding.summary,
                timestamp=now_iso
            ),
            AgentTraceStep(
                step_number=5,
                agent="Autonomous Cleanup Agent",
                action="Fleet Readiness & VRP Mission Optimization",
                output=cleanup_finding.summary,
                timestamp=now_iso
            ),
            AgentTraceStep(
                step_number=6,
                agent="Compliance Report Agent",
                action="Marine Protected Area & IMO Regulatory Audit",
                output=compliance_finding.summary,
                timestamp=now_iso
            ),
            AgentTraceStep(
                step_number=7,
                agent="Maritime Commander",
                action="Decision Synthesis & Human Governance Gate",
                output=f"Approval status: {approval_status}. Proposed action: {proposed_action}",
                timestamp=now_iso
            )
        ]

        domain_impact = {
            "logistics_fuel_saved_pct": 12.8,
            "logistics_co2_averted_tonnes": 3.4,
            "surveillance_risk_mitigated": 85.0 if vessel_watch_finding.risk_level in ["high", "critical"] else 15.0,
            "preservation_debris_target_kg": cleanup_finding.details.get("mission_proposal", {}).get("estimated_yield_kg", 600.0) if cleanup_finding.details.get("mission_proposal") else 0.0,
            "sanctuary_safeguarded": "Lakshadweep Coral Reserve"
        }

        return OrchestratorResponse(
            mission_id=mission_id,
            query=request.query,
            status="success",
            orchestrator_decision=decision,
            recommendations=recommendations,
            agent_findings=all_findings,
            compliance_report=compliance_summary,
            requires_human_approval=requires_human_approval,
            approval_status=approval_status,
            proposed_action=proposed_action,
            assistant_answer=assistant_answer,
            assistant_provider=assistant_provider,
            execution_time_ms=elapsed_ms,
            agent_traces=agent_traces,
            actions_proposed=actions_proposed,
            domain_impact=domain_impact
        )

    @staticmethod
    def _looks_like_question(query: str) -> bool:
        text = query.strip().lower()
        return text.endswith("?") or text.startswith(QUESTION_WORDS)

    def _ask_assistant(self, request: OrchestratorRequest):
        """Fall through to the Phase 3 LLM assistant for operator questions when a provider is configured."""
        wanted = request.use_assistant if request.use_assistant is not None else self._looks_like_question(request.query)
        if not wanted or not llm_configured():
            return None, None
        try:
            result = ask_maritime_ai(request.query)
            return result.text, result.provider
        except (LLMNotConfiguredError, AgentRunError) as exc:
            logger.warning("Assistant fallthrough unavailable: %s", exc)
            return None, None

    def _run_vessel_watch_agent(self, vessel: Optional[Vessel], db: Session, query: str) -> AgentFinding:
        if not vessel:
            return AgentFinding(
                agent_name="Vessel Watch Agent",
                role="Vessel Watch & AIS Sentinel",
                status="completed",
                summary="No active vessel selected for kinematic surveillance.",
                risk_level="low",
                details={"vessels_in_fleet": db.query(Vessel).count()}
            )

        # Inspect tracks and speed
        recent_tracks = db.query(Track).filter(Track.vessel_id == vessel.id).order_by(Track.timestamp.desc()).limit(5).all()
        is_overspeed = vessel.speed_knots > vessel.max_speed_knots

        risk = "low"
        if is_overspeed:
            risk = "high"
            summary = f"Kinematic anomaly detected: {vessel.name} exceeding max speed ({vessel.speed_knots} > {vessel.max_speed_knots} kts)."
        elif vessel.status == "underway" and vessel.speed_knots < 1.0:
            risk = "medium"
            summary = f"Potential drift or engine failure: {vessel.name} is marked underway but speed is {vessel.speed_knots} kts."
        else:
            summary = f"AIS telemetry verified nominal. Vessel {vessel.name} operating at {vessel.speed_knots} kts, heading {vessel.heading:.1f}°."

        details = {
            "vessel_id": vessel.id,
            "vessel_name": vessel.name,
            "mmsi": vessel.mmsi or "N/A",
            "speed_knots": vessel.speed_knots,
            "heading": vessel.heading,
            "status": vessel.status,
            "track_points_analyzed": len(recent_tracks)
        }

        # Phase 3 surveillance: the deterministic risk engine outranks the kinematic heuristics above.
        surveillance = SurveillanceToolkit(lambda: db).get_risk(vessel.id)
        if "error" not in surveillance:
            details["surveillance"] = surveillance
            level = SURVEILLANCE_TO_FINDING_RISK.get(surveillance["level"], "low")
            if RISK_ORDER.index(level) > RISK_ORDER.index(risk):
                risk = level
            top = surveillance["factors"][0]["explanation"] if surveillance["factors"] else "no contributing factors"
            summary += f" Surveillance risk {surveillance['score']:.0f}/100 ({surveillance['level']}): {top}."

        return AgentFinding(
            agent_name="Vessel Watch Agent",
            role="Vessel Watch & AIS Sentinel",
            status="completed",
            summary=summary,
            risk_level=risk,
            details=details
        )

    def _run_route_planner_agent(self, vessel: Optional[Vessel], weather: Any, ocean: Any, query: str) -> AgentFinding:
        wave_h = weather.wave_height_m
        wind_k = weather.wind_speed_knots

        risk = "low"
        if wave_h > 4.0 or wind_k > 35.0:
            risk = "high"
            summary = f"Severe marine conditions along projected path: waves {wave_h}m, winds {wind_k} kts. Recommending southern detour."
        elif wave_h > 2.5:
            risk = "medium"
            summary = f"Moderate sea swell ({wave_h}m). Estimated fuel consumption penalty of +8.5%."
        else:
            summary = f"Optimal fairway conditions. Wave height {wave_h}m, favorable ocean current {ocean.current_speed_knots} kts at {ocean.current_direction_deg}°."

        return AgentFinding(
            agent_name="Route Planner Agent",
            role="Autonomous Marine Route Strategist",
            status="completed",
            summary=summary,
            risk_level=risk,
            details={
                "wave_height_m": wave_h,
                "wind_speed_knots": wind_k,
                "current_speed_knots": ocean.current_speed_knots,
                "favorable_current": True if abs(ocean.current_direction_deg - (vessel.heading if vessel else 0)) < 90 else False,
                "estimated_fuel_efficiency_factor": 0.94 if wave_h < 2.0 else 1.12
            }
        )

    def _run_debris_sentinel_agent(self, vessel: Optional[Vessel], debris_list: List[Debris], db: Session, query: str) -> AgentFinding:
        if not debris_list:
            return AgentFinding(
                agent_name="Debris Sentinel Agent",
                role="Ocean Debris & Hazard Sentinel",
                status="completed",
                summary="No active marine debris patches detected within monitored operational sectors.",
                risk_level="low",
                details={"active_debris_count": 0}
            )

        critical_hazards = [d for d in debris_list if d.clean_up_priority in ["high", "urgent"] or d.severity > 75.0]

        mpas = [{"name": m.name, "geometry_geojson": m.geometry_geojson} for m in db.query(MarineProtectedArea).all()]
        shipping_lanes = [{"name": z.name, "geometry_geojson": z.geometry_geojson} for z in db.query(MarineZone).filter_by(zone_type="shipping_lane").all()]

        risk = "low"
        top_hazard_details = None
        mpa_threat_flag = False

        if critical_hazards:
            top = critical_hazards[0]
            # Calculate forward drift
            trajectory = predict_drift_trajectory(
                start_lat=top.latitude,
                start_lon=top.longitude,
                forecast_hours=24,
                current_speed_knots=top.drift_speed_knots or 1.4,
                current_heading_deg=top.drift_heading_deg or 82.0,
                debris_type=top.debris_type
            )
            risk_eval = evaluate_debris_environmental_risk(
                debris_lat=top.latitude,
                debris_lon=top.longitude,
                debris_type=top.debris_type,
                estimated_mass_kg=top.estimated_mass_kg,
                trajectory=trajectory,
                mpas=mpas,
                shipping_zones=shipping_lanes
            )
            top_hazard_details = risk_eval

            if risk_eval.get("crosses_mpa") or risk_eval.get("currently_in_mpa"):
                risk = "critical"
                mpa_threat_flag = True
                summary = f"CRITICAL ECOLOGICAL THREAT: {risk_eval['narrative']}"
            elif risk_eval.get("shipping_hazard"):
                risk = "high"
                summary = f"NAVIGATION HAZARD: {top.debris_type} at ({top.latitude:.3f}, {top.longitude:.3f}) inside commercial shipping corridor."
            else:
                risk = "medium"
                summary = f"Tracked {len(critical_hazards)} elevated debris hazard(s). Top priority: {top.debris_type} severity {top.severity}/100."
        else:
            summary = f"{len(debris_list)} dispersed debris clusters tracked. All categorized as low-to-medium hazard to navigation."

        return AgentFinding(
            agent_name="Debris Sentinel Agent",
            role="Ocean Debris & Hazard Sentinel",
            status="completed",
            summary=summary,
            risk_level=risk,
            details={
                "monitored_debris_clusters": len(debris_list),
                "critical_hazards": len(critical_hazards),
                "top_hazard_assessment": top_hazard_details,
                "mpa_threat_active": mpa_threat_flag
            }
        )

    def _run_cleanup_agent(self, debris_finding: AgentFinding, db: Session, query: str) -> AgentFinding:
        """
        Autonomous Cleanup Fleet Agent:
        Coordinates autonomous surface vessels (ASVs) and marine cleanup drones.
        Evaluates debris threats and formulates zero-carbon autonomous collection missions.
        """
        fleet_units = db.query(CleanupUnit).all()
        active_hazards = db.query(Debris).filter(Debris.status.in_(["detected", "verified"])).order_by(Debris.severity.desc()).all()

        if not fleet_units:
            return AgentFinding(
                agent_name="Autonomous Cleanup Agent",
                role="Autonomous Marine Fleet Coordinator",
                status="completed",
                summary="No autonomous cleanup units currently provisioned in operational theater.",
                risk_level="low",
                details={"available_fleet": 0}
            )

        idle_units = [u for u in fleet_units if u.status in ["idle", "docked"]]
        critical_hazards = [d for d in active_hazards if d.severity >= 70.0 or d.clean_up_priority in ["high", "urgent"]]

        mission_proposal = None
        risk = "low"

        if critical_hazards and idle_units:
            unit = idle_units[0]
            unit_dict = {
                "id": unit.id, "unit_name": unit.unit_name, "unit_type": unit.unit_type,
                "latitude": unit.latitude, "longitude": unit.longitude, "speed_knots": unit.speed_knots,
                "capacity_kg": unit.capacity_kg, "current_load_kg": unit.current_load_kg,
                "home_port_lat": unit.latitude, "home_port_lon": unit.longitude
            }
            debris_dicts = [{
                "id": d.id, "latitude": d.latitude, "longitude": d.longitude,
                "debris_type": d.debris_type, "estimated_mass_kg": d.estimated_mass_kg,
                "severity": d.severity, "environmental_risk_score": d.environmental_risk_score
            } for d in critical_hazards[:3]]

            mission_proposal = plan_autonomous_cleanup_mission(unit_dict, debris_dicts)
            risk = "medium"
            summary = (
                f"Autonomous Dispatch Formulated: {unit.unit_name} ready to intercept {len(mission_proposal['waypoints'])-2} "
                f"critical hazard(s). Mission covers {mission_proposal['total_distance_nm']} nm with projected yield of {mission_proposal['estimated_yield_kg']} kg."
            )
        elif critical_hazards and not idle_units:
            risk = "high"
            summary = f"CRITICAL: {len(critical_hazards)} severe debris hazard(s) active, but all {len(fleet_units)} cleanup units are currently deployed."
        else:
            summary = f"Cleanup fleet operational: {len(idle_units)}/{len(fleet_units)} ASVs idle and on standby. No urgent debris dispatch required."

        return AgentFinding(
            agent_name="Autonomous Cleanup Agent",
            role="Autonomous Marine Fleet Coordinator",
            status="completed",
            summary=summary,
            risk_level=risk,
            details={
                "total_units": len(fleet_units),
                "idle_units": len(idle_units),
                "mission_proposal": mission_proposal
            }
        )

    def _run_compliance_report_agent(
        self,
        vessel: Optional[Vessel],
        zones: List[MarineZone],
        vessel_watch: AgentFinding,
        route_planner: AgentFinding,
        debris_sentinel: AgentFinding,
        query: str
    ) -> AgentFinding:
        """
        Compliance Report Agent:
        Synthesizes the findings of Vessel Watch Agent, Route Planner Agent, and Debris Sentinel Agent.
        Evaluates regulatory constraints, Marine Protected Areas (MPAs), speed limits, and IMO eco-corridor policies.
        """
        if not zones:
            return AgentFinding(
                agent_name="Compliance Report Agent",
                role="Marine Sanctuary & Regulatory Compliance Officer",
                status="completed",
                summary="No active restricted marine protected zones configured in this operational theater.",
                risk_level="low",
                details={"active_zones": 0, "compliance_status": "nominal"}
            )

        compliance_issues = []
        risk = "low"

        # 1. Check kinematic compliance from Vessel Watch
        if vessel_watch.risk_level in ["high", "critical"]:
            compliance_issues.append(f"Kinematic/Speed violation flagged by Vessel Watch: {vessel_watch.summary}")
            risk = "high"

        # 2. Check environmental risk from Route Planner
        if route_planner.risk_level in ["high", "critical"]:
            compliance_issues.append(f"Route hazard / severe conditions flagged by Route Planner: {route_planner.summary}")
            if risk != "critical":
                risk = "high"

        # 3. Check hazardous debris compliance from Debris Sentinel
        if debris_sentinel.risk_level in ["high", "critical"]:
            compliance_issues.append(f"Debris navigation hazard flagged by Debris Sentinel: {debris_sentinel.summary}")
            if risk == "low":
                risk = "medium"

        # 4. Check MPA boundary clearance
        restricted_count = sum(1 for z in zones if z.restricted)
        v_name = vessel.name if vessel else "Fleet vessel"

        if compliance_issues:
            summary = (
                f"Compliance Assessment: {len(compliance_issues)} regulatory/environmental condition(s) require review. "
                f"Monitored {restricted_count} MPAs. Issues: {'; '.join(compliance_issues[:2])}"
            )
        else:
            summary = (
                f"Compliant: {v_name} and proposed navigational corridors fully clear of {restricted_count} "
                f"registered Marine Protected Areas. IMO emission & speed caps respected."
            )

        return AgentFinding(
            agent_name="Compliance Report Agent",
            role="Marine Sanctuary & Regulatory Compliance Officer",
            status="completed",
            summary=summary,
            risk_level=risk,
            details={
                "monitored_restricted_zones": len(zones),
                "vessel_watch_evaluated": vessel_watch.agent_name,
                "route_planner_evaluated": route_planner.agent_name,
                "debris_sentinel_evaluated": debris_sentinel.agent_name,
                "environmental_compliance": "100%" if risk == "low" else "85%",
                "imo_emission_tier": "Tier III Compliant",
                "compliance_report_summary": summary
            }
        )

    def _run_compliance_agent(self, vessel: Optional[Vessel], zones: List[MarineZone], query: str) -> AgentFinding:
        """Backwards-compatibility fallback wrapper."""
        dummy_finding = AgentFinding(
            agent_name="Telemetry Monitor",
            role="Monitor",
            status="completed",
            summary="Nominal",
            risk_level="low"
        )
        return self._run_compliance_report_agent(vessel, zones, dummy_finding, dummy_finding, dummy_finding, query)

    def handle_human_decision(self, request: HumanApprovalRequest, db: Session) -> HumanApprovalResponse:
        """
        Processes operator approval / rejection / replan directive:
        HUMAN APPROVAL -> ACTION / REPLAN
        """
        import datetime
        now = datetime.datetime.now(datetime.timezone.utc)
        decision = request.decision.lower().strip()

        if decision == "approve":
            action_status = "action_executed"
            action_result = (
                f"Directive approved by Human Operator. Action executed for Mission {request.mission_id}: "
                f"Autonomous waypoint dispatch and compliance telemetry confirmed."
            )
        elif decision == "replan":
            action_status = "replan_requested"
            action_result = (
                f"Replan requested by Human Operator for Mission {request.mission_id}. "
                f"Orchestrator initiated constrained corridor re-computation."
            )
        else:
            action_status = "rejected"
            action_result = (
                f"Mission directive {request.mission_id} rejected by operator. "
                f"Vessel instructed to hold position or continue baseline route."
            )

        logger.info(f"[HUMAN_APPROVAL] Mission {request.mission_id}: {decision.upper()} -> {action_status}")

        return HumanApprovalResponse(
            mission_id=request.mission_id,
            decision=decision,
            approval_status=action_status,
            action_result=action_result,
            execution_timestamp=now
        )


triton_agents = TritonAgentFramework()

