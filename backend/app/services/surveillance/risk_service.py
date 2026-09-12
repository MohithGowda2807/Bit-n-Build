"""Persist risk assessments, their evidence, and open or update investigation cases."""
import json
from dataclasses import dataclass
from typing import Dict, List, Optional

from sqlalchemy.orm import Session

from app.config import settings
from app.events.publisher import Event, EventPublisher, get_publisher
from app.models.evidence import Evidence
from app.models.investigation_case import DISMISS_REASONS, InvestigationCase
from app.models.surveillance_event import SurveillanceEvent
from app.models.vessel import Vessel
from app.models.vessel_risk_score import VesselRiskScore
from app.services.surveillance.risk import RiskAssessment, assess_risk

EVIDENCE_TYPE_FOR_EVENT = {"AIS_GAP_DETECTED": "AIS_GAP"}


@dataclass
class AssessmentSummary:
    vessels_assessed: int = 0
    cases_opened: int = 0
    cases_updated: int = 0


def _minutes(seconds: Optional[float]) -> int:
    return int(round((seconds or 0) / 60.0))


def describe_event(event: SurveillanceEvent) -> str:
    p = event.payload
    if event.event_type == "AIS_GAP_DETECTED":
        return f"AIS gap of {_minutes(p.get('duration_seconds'))} minutes starting {event.timestamp.isoformat()}"
    if event.event_type == "ZONE_ENTRY":
        return f"Entered {event.zone_name} ({p.get('zone_type')})"
    if event.event_type == "ZONE_EXIT":
        return f"Left {event.zone_name} after {_minutes(p.get('dwell_seconds'))} minutes"
    if event.event_type == "VESSEL_RENDEZVOUS":
        kind = p.get("interaction_type", "RENDEZVOUS").replace("_", " ").lower()
        return f"{kind.capitalize()} with vessel {event.other_vessel_id}, closest {p.get('minimum_distance_km')} km"
    return f"{event.event_type.replace('_', ' ').capitalize()} score {event.score:.0f}/100"


class RiskService:
    def __init__(self, db: Session, case_threshold: Optional[int] = None, alert_threshold: Optional[int] = None,
                 publisher: Optional[EventPublisher] = None):
        self.db = db
        self.case_threshold = settings.RISK_CASE_THRESHOLD if case_threshold is None else case_threshold
        self.alert_threshold = settings.RISK_ALERT_THRESHOLD if alert_threshold is None else alert_threshold
        self.publisher = publisher or get_publisher()

    # Assessment

    def assess_all(self) -> AssessmentSummary:
        summary = AssessmentSummary()
        vessel_ids = [row[0] for row in self.db.query(SurveillanceEvent.vessel_id).distinct().all()]
        for vessel in self.db.query(Vessel).filter(Vessel.id.in_(vessel_ids)).all():
            self.assess_vessel(vessel, summary)
        self.db.commit()
        return summary

    def assess_vessel(self, vessel: Vessel, summary: Optional[AssessmentSummary] = None) -> VesselRiskScore:
        summary = summary or AssessmentSummary()
        events = self.db.query(SurveillanceEvent).filter_by(vessel_id=vessel.id).all()
        assessment = assess_risk(vessel.vessel_type, events)

        risk = VesselRiskScore(
            vessel_id=vessel.id, score=assessment.score, level=assessment.level,
            factors_json=json.dumps([{
                "type": f.factor_type, "score": f.score, "explanation": f.explanation, "event_ids": f.event_ids,
            } for f in assessment.factors]),
        )
        self.db.add(risk)
        self.db.flush()
        evidence = self._store_evidence(vessel, risk, assessment, {e.id: e for e in events})
        summary.vessels_assessed += 1

        if assessment.score > self.alert_threshold:
            self.publisher.publish(Event(
                event_type="HIGH_RISK_VESSEL", source="risk_engine", vessel_id=vessel.id,
                payload={"score": assessment.score, "level": assessment.level, "factors": risk.factors},
            ))
        if assessment.score > self.case_threshold:
            self._open_or_update_case(vessel, risk, assessment, evidence, summary)
        self.db.flush()
        return risk

    def latest_for(self, vessel_id: int) -> Optional[VesselRiskScore]:
        return (
            self.db.query(VesselRiskScore).filter_by(vessel_id=vessel_id)
            .order_by(VesselRiskScore.computed_at.desc(), VesselRiskScore.id.desc()).first()
        )

    def _store_evidence(self, vessel: Vessel, risk: VesselRiskScore, assessment: RiskAssessment,
                        events: Dict[int, SurveillanceEvent]) -> List[Evidence]:
        rows: List[Evidence] = []
        for factor in assessment.factors:
            for event_id in factor.event_ids:
                event = events[event_id]
                rows.append(Evidence(
                    vessel_id=vessel.id, risk_score_id=risk.id, event_id=event.id,
                    evidence_type=EVIDENCE_TYPE_FOR_EVENT.get(event.event_type, event.event_type),
                    factor_type=factor.factor_type, strength=factor.score, confidence=event.confidence,
                    source=event.source, timestamp=event.timestamp,
                    latitude=event.latitude, longitude=event.longitude, description=describe_event(event),
                ))
        self.db.add_all(rows)
        self.db.flush()
        return rows

    # Cases

    def _open_or_update_case(self, vessel: Vessel, risk: VesselRiskScore, assessment: RiskAssessment,
                             evidence: List[Evidence], summary: AssessmentSummary) -> InvestigationCase:
        case = self.open_case_for(vessel.id)
        if case:
            case.risk_score, case.risk_level, case.risk_score_id = assessment.score, assessment.level, risk.id
            case.summary = self._summary(vessel, assessment)
            case.add_audit("RISK_UPDATED", "risk_engine", f"score {assessment.score}")
            summary.cases_updated += 1
            return case
        case = InvestigationCase(
            vessel_id=vessel.id, risk_score_id=risk.id, risk_score=assessment.score, risk_level=assessment.level,
            summary=self._summary(vessel, assessment),
            evidence_snapshot_json=json.dumps([e.as_dict() for e in evidence]),
        )
        case.add_audit("CASE_CREATED", "risk_engine", f"score {assessment.score}")
        self.db.add(case)
        self.db.flush()
        summary.cases_opened += 1
        self.publisher.publish(Event(
            event_type="CASE_CREATED", source="risk_engine", vessel_id=vessel.id,
            payload={"case_id": case.id, "risk_score": assessment.score, "risk_level": assessment.level,
                     "summary": case.summary},
        ))
        return case

    def open_case_for(self, vessel_id: int) -> Optional[InvestigationCase]:
        return (
            self.db.query(InvestigationCase)
            .filter(InvestigationCase.vessel_id == vessel_id, InvestigationCase.status.notin_(("RESOLVED", "DISMISSED")))
            .order_by(InvestigationCase.id.desc()).first()
        )

    @staticmethod
    def _summary(vessel: Vessel, assessment: RiskAssessment) -> str:
        identity = f"{vessel.name} ({vessel.vessel_type}, MMSI {vessel.mmsi or 'unknown'})"
        reasons = "; ".join(f.explanation for f in assessment.factors)
        return f"{identity} scored {assessment.score}/100 ({assessment.level}). {reasons}."

    def _case(self, case_id: int) -> InvestigationCase:
        case = self.db.get(InvestigationCase, case_id)
        if case is None:
            raise LookupError(f"Investigation case {case_id} not found")
        return case

    def assign_case(self, case_id: int, assignee: str, actor: str) -> InvestigationCase:
        case = self._case(case_id)
        case.assigned_to = assignee
        if case.status == "OPEN":
            case.status = "UNDER_REVIEW"
        case.add_audit("CASE_ASSIGNED", actor, assignee)
        self.db.commit()
        return case

    def escalate_case(self, case_id: int, actor: str, note: Optional[str] = None) -> InvestigationCase:
        case = self._case(case_id)
        case.status = "ESCALATED"
        case.add_audit("CASE_ESCALATED", actor, note)
        self.db.commit()
        return case

    def resolve_case(self, case_id: int, actor: str, note: Optional[str] = None) -> InvestigationCase:
        case = self._case(case_id)
        case.status = "RESOLVED"
        case.add_audit("CASE_RESOLVED", actor, note)
        self.db.commit()
        return case

    def dismiss_case(self, case_id: int, reason: str, actor: str, note: Optional[str] = None) -> InvestigationCase:
        if reason not in DISMISS_REASONS:
            raise ValueError(f"Unknown dismissal reason '{reason}'. Choose from {DISMISS_REASONS}")
        case = self._case(case_id)
        case.status = "DISMISSED"
        case.dismissed_reason = reason
        case.add_audit("CASE_DISMISSED", actor, note or reason)
        self.db.commit()
        return case
