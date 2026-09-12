"""Remove surveillance data so a demo scenario can be replayed from a clean slate."""
from dataclasses import dataclass
from typing import Sequence

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.ais_position import AISPosition
from app.models.dark_period import DarkPeriod
from app.models.evidence import Evidence
from app.models.investigation_case import InvestigationCase
from app.models.surveillance_event import SurveillanceEvent
from app.models.vessel import Vessel
from app.models.vessel_risk_score import VesselRiskScore
from app.models.vessel_behavior_profile import VesselBehaviorProfile


@dataclass
class ResetSummary:
    vessels_affected: int = 0
    vessels_removed: int = 0


def reset_vessel_data(db: Session, vessel_ids: Sequence[int]) -> ResetSummary:
    """Delete positions, gaps, events, risk, evidence and cases for the vessels; keep the vessel rows."""
    ids = list(vessel_ids)
    if not ids:
        return ResetSummary()
    db.query(VesselBehaviorProfile).filter(VesselBehaviorProfile.vessel_id.in_(ids)).delete(synchronize_session=False)
    db.query(Evidence).filter(Evidence.vessel_id.in_(ids)).delete(synchronize_session=False)
    db.query(InvestigationCase).filter(InvestigationCase.vessel_id.in_(ids)).delete(synchronize_session=False)
    db.query(VesselRiskScore).filter(VesselRiskScore.vessel_id.in_(ids)).delete(synchronize_session=False)
    db.query(SurveillanceEvent).filter(
        or_(SurveillanceEvent.vessel_id.in_(ids), SurveillanceEvent.other_vessel_id.in_(ids))
    ).delete(synchronize_session=False)
    db.query(DarkPeriod).filter(DarkPeriod.vessel_id.in_(ids)).delete(synchronize_session=False)
    db.query(AISPosition).filter(AISPosition.vessel_id.in_(ids)).delete(synchronize_session=False)
    db.commit()
    return ResetSummary(vessels_affected=len(ids))


def reset_scenario(db: Session, mmsis: Sequence[str]) -> ResetSummary:
    ids = [row[0] for row in db.query(Vessel.id).filter(Vessel.mmsi.in_(list(mmsis))).all()]
    return reset_vessel_data(db, ids)


def reset_all_simulation_data(db: Session) -> ResetSummary:
    """Remove every vessel the simulation created (identifier MMSI-*) together with its data."""
    ids = [row[0] for row in db.query(Vessel.id).filter(Vessel.vessel_identifier.like("MMSI-%")).all()]
    summary = reset_vessel_data(db, ids)
    if ids:
        db.query(Vessel).filter(Vessel.id.in_(ids)).delete(synchronize_session=False)
        db.commit()
    summary.vessels_removed = len(ids)
    return summary
