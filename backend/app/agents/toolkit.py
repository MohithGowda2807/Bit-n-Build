"""Deterministic, JSON-friendly lookups the agents and the query interface call.

The LLM never invents vessel observations: every fact it reports comes from
one of these functions. Unknown ids return an error dict instead of raising so
an agent can recover and explain.
"""
from datetime import timedelta
from typing import Callable, Dict, List, Optional

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.ais_position import AISPosition
from app.models.dark_period import DarkPeriod
from app.models.evidence import Evidence
from app.models.investigation_case import InvestigationCase
from app.models.surveillance_event import SurveillanceEvent
from app.models.vessel import Vessel
from app.models.vessel_risk_score import VesselRiskScore

MAX_TRACK_POINTS = 50
ZONE_EVENT_TYPES = ("ZONE_ENTRY", "ZONE_EXIT")


def _iso(value) -> Optional[str]:
    return value.isoformat() if value else None


class SurveillanceToolkit:
    def __init__(self, session_factory: Callable[[], Session]):
        self._session_factory = session_factory

    @property
    def db(self) -> Session:
        return self._session_factory()

    # Vessels

    def search_vessels(self, query: str, limit: int = 20) -> List[Dict]:
        pattern = f"%{query.strip()}%"
        rows = (
            self.db.query(Vessel)
            .filter(or_(Vessel.name.ilike(pattern), Vessel.mmsi.ilike(pattern),
                        Vessel.imo_number.ilike(pattern), Vessel.vessel_identifier.ilike(pattern)))
            .order_by(Vessel.id).limit(limit).all()
        )
        return [self._vessel_summary(v) for v in rows]

    def get_vessel(self, vessel_id: int) -> Dict:
        vessel = self.db.get(Vessel, vessel_id)
        if not vessel:
            return {"error": f"Vessel {vessel_id} not found"}
        return self._vessel_summary(vessel)

    def get_vessel_track(self, vessel_id: int, hours: float = 24) -> Dict:
        if not self.db.get(Vessel, vessel_id):
            return {"error": f"Vessel {vessel_id} not found"}
        query = self.db.query(AISPosition).filter_by(vessel_id=vessel_id)
        latest = query.order_by(AISPosition.timestamp.desc()).first()
        if not latest:
            return {"vessel_id": vessel_id, "point_count": 0, "points": []}
        rows = (
            query.filter(AISPosition.timestamp >= latest.timestamp - timedelta(hours=hours))
            .order_by(AISPosition.timestamp).all()
        )
        step = max(1, len(rows) // MAX_TRACK_POINTS)
        sampled = rows[::step][:MAX_TRACK_POINTS]
        return {
            "vessel_id": vessel_id,
            "point_count": len(rows),
            "start_time": _iso(rows[0].timestamp),
            "end_time": _iso(rows[-1].timestamp),
            "points": [{
                "timestamp": _iso(p.timestamp), "latitude": p.latitude, "longitude": p.longitude,
                "speed_knots": p.speed_over_ground, "course": p.course_over_ground,
            } for p in sampled],
        }

    # Detections

    def get_ais_gaps(self, vessel_id: int) -> List[Dict]:
        rows = self.db.query(DarkPeriod).filter_by(vessel_id=vessel_id).order_by(DarkPeriod.start_time).all()
        return [{
            "id": g.id, "start_time": _iso(g.start_time), "end_time": _iso(g.end_time),
            "duration_minutes": round(g.duration_seconds / 60), "severity": g.severity,
            "last_position": [g.last_latitude, g.last_longitude],
            "reappearance_position": [g.reappearance_latitude, g.reappearance_longitude] if g.reappearance_latitude else None,
            "estimated_distance_km": g.estimated_distance_km,
        } for g in rows]

    def get_zone_events(self, vessel_id: int) -> List[Dict]:
        rows = (
            self.db.query(SurveillanceEvent)
            .filter(SurveillanceEvent.vessel_id == vessel_id, SurveillanceEvent.event_type.in_(ZONE_EVENT_TYPES))
            .order_by(SurveillanceEvent.timestamp).all()
        )
        return [self._event_summary(e) for e in rows]

    def get_events(self, vessel_id: int) -> List[Dict]:
        rows = self.db.query(SurveillanceEvent).filter_by(vessel_id=vessel_id).order_by(SurveillanceEvent.timestamp).all()
        return [self._event_summary(e) for e in rows]

    # Risk

    def get_risk(self, vessel_id: int) -> Dict:
        risk = self._latest_risk(vessel_id)
        if not risk:
            return {"error": f"No risk assessment for vessel {vessel_id}"}
        return {"vessel_id": vessel_id, "score": risk.score, "level": risk.level,
                "computed_at": _iso(risk.computed_at), "factors": risk.factors}

    def get_evidence(self, vessel_id: int) -> List[Dict]:
        risk = self._latest_risk(vessel_id)
        if not risk:
            return []
        rows = self.db.query(Evidence).filter_by(risk_score_id=risk.id).order_by(Evidence.strength.desc()).all()
        return [e.as_dict() for e in rows]

    def list_high_risk_vessels(self, min_score: float = 60) -> List[Dict]:
        latest_ids = self.db.query(func.max(VesselRiskScore.id)).group_by(VesselRiskScore.vessel_id).scalar_subquery()
        rows = (
            self.db.query(VesselRiskScore)
            .filter(VesselRiskScore.id.in_(latest_ids), VesselRiskScore.score >= min_score)
            .order_by(VesselRiskScore.score.desc()).all()
        )
        return [{
            "vessel_id": r.vessel_id, "score": r.score, "level": r.level,
            "top_factor": r.factors[0]["explanation"] if r.factors else None,
            **{k: v for k, v in self._vessel_summary(self.db.get(Vessel, r.vessel_id)).items() if k in ("name", "mmsi", "vessel_type")},
        } for r in rows]

    # Cases

    def get_investigation_case(self, case_id: int) -> Dict:
        case = self.db.get(InvestigationCase, case_id)
        if not case:
            return {"error": f"Investigation case {case_id} not found"}
        return {
            "id": case.id, "status": case.status, "risk_score": case.risk_score, "risk_level": case.risk_level,
            "assigned_to": case.assigned_to, "summary": case.summary, "dismissed_reason": case.dismissed_reason,
            "created_at": _iso(case.created_at), "vessel": self._vessel_summary(self.db.get(Vessel, case.vessel_id)),
            "evidence_snapshot": case.evidence_snapshot, "audit_log": case.audit_log,
        }

    def list_open_cases(self, limit: int = 20) -> List[Dict]:
        rows = (
            self.db.query(InvestigationCase)
            .filter(InvestigationCase.status.notin_(("RESOLVED", "DISMISSED")))
            .order_by(InvestigationCase.risk_score.desc()).limit(limit).all()
        )
        return [{"id": c.id, "vessel_id": c.vessel_id, "status": c.status, "risk_score": c.risk_score,
                 "risk_level": c.risk_level, "summary": c.summary} for c in rows]

    # Helpers

    def _latest_risk(self, vessel_id: int) -> Optional[VesselRiskScore]:
        return (
            self.db.query(VesselRiskScore).filter_by(vessel_id=vessel_id)
            .order_by(VesselRiskScore.computed_at.desc(), VesselRiskScore.id.desc()).first()
        )

    def _vessel_summary(self, vessel: Vessel) -> Dict:
        risk = self._latest_risk(vessel.id)
        return {
            "id": vessel.id, "name": vessel.name, "vessel_type": vessel.vessel_type, "mmsi": vessel.mmsi,
            "imo_number": vessel.imo_number, "flag": vessel.flag, "status": vessel.status,
            "latitude": vessel.latitude, "longitude": vessel.longitude, "heading": vessel.heading,
            "risk_score": risk.score if risk else None, "risk_level": risk.level if risk else None,
        }

    @staticmethod
    def _event_summary(event: SurveillanceEvent) -> Dict:
        return {
            "id": event.id, "event_type": event.event_type, "timestamp": _iso(event.timestamp),
            "latitude": event.latitude, "longitude": event.longitude, "score": event.score,
            "confidence": event.confidence, "zone_kind": event.zone_kind, "zone_name": event.zone_name,
            "other_vessel_id": event.other_vessel_id, "details": event.payload,
        }

    # Phase 4 Marine Preservation & Autonomous Fleet Tools

    def list_debris_hazards(self, min_severity: float = 40.0, limit: int = 20) -> List[Dict]:
        """Lists active debris clusters sorted by severity and environmental risk."""
        from app.models.debris import Debris
        rows = (
            self.db.query(Debris)
            .filter(Debris.severity >= min_severity)
            .order_by(Debris.severity.desc())
            .limit(limit).all()
        )
        return [{
            "id": d.id, "debris_type": d.debris_type, "latitude": d.latitude, "longitude": d.longitude,
            "severity": d.severity, "estimated_mass_kg": d.estimated_mass_kg, "priority": d.clean_up_priority,
            "status": d.status, "target_species_threatened": d.target_species_threatened,
            "environmental_risk_score": d.environmental_risk_score, "nearest_mpa_distance_nm": d.nearest_mpa_distance_nm
        } for d in rows]

    def get_debris_drift_forecast(self, debris_id: int, hours: int = 24) -> Dict:
        """Calculates forward leeway drift and checks against Marine Protected Areas."""
        from app.models.debris import Debris
        from app.models.marine_protected_area import MarineProtectedArea
        from app.models.marine_zone import MarineZone
        from app.services.debris.drift import predict_drift_trajectory
        from app.services.debris.environmental_risk import evaluate_debris_environmental_risk

        debris = self.db.get(Debris, debris_id)
        if not debris:
            return {"error": f"Debris {debris_id} not found"}

        trajectory = predict_drift_trajectory(
            start_lat=debris.latitude,
            start_lon=debris.longitude,
            forecast_hours=hours,
            current_speed_knots=debris.drift_speed_knots or 1.4,
            current_heading_deg=debris.drift_heading_deg or 82.0,
            debris_type=debris.debris_type
        )

        mpas = [{"name": m.name, "geometry_geojson": m.geometry_geojson} for m in self.db.query(MarineProtectedArea).all()]
        zones = [{"name": z.name, "geometry_geojson": z.geometry_geojson} for z in self.db.query(MarineZone).filter_by(zone_type="shipping_lane").all()]

        risk_eval = evaluate_debris_environmental_risk(
            debris_lat=debris.latitude,
            debris_lon=debris.longitude,
            debris_type=debris.debris_type,
            estimated_mass_kg=debris.estimated_mass_kg,
            trajectory=trajectory,
            mpas=mpas,
            shipping_zones=zones
        )

        return {
            "debris_id": debris.id,
            "debris_type": debris.debris_type,
            "start_coords": [debris.latitude, debris.longitude],
            "drift_speed_knots": debris.drift_speed_knots or 1.4,
            "drift_heading_deg": debris.drift_heading_deg or 82.0,
            "forecast_hours": hours,
            "environmental_risk": risk_eval,
            "trajectory_sample": trajectory[::max(1, len(trajectory) // 8)]
        }

    def list_cleanup_fleet(self) -> List[Dict]:
        """Lists autonomous cleanup units (ASVs and marine drones) with live battery and payload status."""
        from app.models.cleanup_unit import CleanupUnit
        units = self.db.query(CleanupUnit).order_by(CleanupUnit.id).all()
        return [{
            "id": u.id, "unit_name": u.unit_name, "unit_type": u.unit_type,
            "latitude": u.latitude, "longitude": u.longitude, "speed_knots": u.speed_knots,
            "battery_pct": u.battery_pct, "capacity_kg": u.capacity_kg, "current_load_kg": u.current_load_kg,
            "status": u.status, "assigned_mission_id": u.assigned_mission_id
        } for u in units]

    def plan_cleanup_mission_tool(self, debris_ids: List[int], unit_id: Optional[int] = None) -> Dict:
        """Generates an optimal autonomous cleanup mission with VRP waypoint routing and battery budget."""
        from app.models.debris import Debris
        from app.models.cleanup_unit import CleanupUnit
        from app.services.debris.mission_planner import plan_autonomous_cleanup_mission

        # Select unit
        if unit_id:
            unit = self.db.get(CleanupUnit, unit_id)
        else:
            unit = self.db.query(CleanupUnit).filter(CleanupUnit.status.in_(["idle", "docked"])).first()
            if not unit:
                unit = self.db.query(CleanupUnit).first()

        if not unit:
            return {"error": "No autonomous cleanup units registered in fleet"}

        debris_list = self.db.query(Debris).filter(Debris.id.in_(debris_ids)).all()
        if not debris_list:
            return {"error": "None of the specified debris IDs exist"}

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
        } for d in debris_list]

        plan = plan_autonomous_cleanup_mission(unit_dict, debris_dicts)
        return plan
