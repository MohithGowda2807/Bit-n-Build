from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.investigation_case import DISMISS_REASONS, InvestigationCase
from app.models.vessel import Vessel
from app.schemas.surveillance import (
    AssignRequest, CaseActionRequest, DismissRequest, InvestigationCaseDetail, InvestigationCaseResponse,
)
from app.services.surveillance.risk_service import RiskService
from app.agents.crew import AgentRunError, LLMNotConfiguredError, investigate_vessel, llm_configured
from app.api.assistant import agent_failed, llm_unavailable
from app.security import Principal, require

router = APIRouter(prefix="/api/v1/investigations", tags=["Investigations"])


def _detail(db: Session, case: InvestigationCase) -> InvestigationCaseDetail:
    vessel = db.get(Vessel, case.vessel_id)
    return InvestigationCaseDetail(
        id=case.id, vessel_id=case.vessel_id, risk_score=case.risk_score, risk_level=case.risk_level,
        status=case.status, assigned_to=case.assigned_to, summary=case.summary,
        dismissed_reason=case.dismissed_reason, agent_summary=case.agent_summary,
        created_at=case.created_at, updated_at=case.updated_at,
        vessel=vessel, evidence_snapshot=case.evidence_snapshot, audit_log=case.audit_log,
    )


def _load(db: Session, case_id: int) -> InvestigationCase:
    case = db.get(InvestigationCase, case_id)
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "CASE_NOT_FOUND", "message": f"Investigation case {case_id} not found."},
        )
    return case


@router.get("/dismiss-reasons", response_model=List[str])
def list_dismiss_reasons():
    return list(DISMISS_REASONS)


@router.get("", response_model=List[InvestigationCaseResponse], dependencies=[Depends(require("ANALYST"))])
def list_cases(case_status: Optional[str] = Query(None, alias="status"), vessel_id: Optional[int] = None,
               db: Session = Depends(get_db)):
    query = db.query(InvestigationCase)
    if case_status:
        query = query.filter(InvestigationCase.status == case_status.upper())
    if vessel_id is not None:
        query = query.filter(InvestigationCase.vessel_id == vessel_id)
    return query.order_by(InvestigationCase.risk_score.desc(), InvestigationCase.id.desc()).all()


@router.get("/{case_id}", response_model=InvestigationCaseDetail, dependencies=[Depends(require("ANALYST"))])
def get_case(case_id: int, db: Session = Depends(get_db)):
    return _detail(db, _load(db, case_id))


@router.post("/{case_id}/assign", response_model=InvestigationCaseDetail)
def assign_case(case_id: int, payload: AssignRequest, db: Session = Depends(get_db),
                who: Principal = Depends(require("OPERATOR"))):
    _load(db, case_id)
    return _detail(db, RiskService(db).assign_case(case_id, payload.assignee, who.name or payload.actor, who.role))


@router.post("/{case_id}/escalate", response_model=InvestigationCaseDetail)
def escalate_case(case_id: int, payload: CaseActionRequest, db: Session = Depends(get_db),
                  who: Principal = Depends(require("OPERATOR"))):
    _load(db, case_id)
    return _detail(db, RiskService(db).escalate_case(case_id, who.name or payload.actor, payload.note, who.role))


@router.post("/{case_id}/resolve", response_model=InvestigationCaseDetail)
def resolve_case(case_id: int, payload: CaseActionRequest, db: Session = Depends(get_db),
                 who: Principal = Depends(require("OPERATOR"))):
    _load(db, case_id)
    return _detail(db, RiskService(db).resolve_case(case_id, who.name or payload.actor, payload.note, who.role))


@router.post("/{case_id}/dismiss", response_model=InvestigationCaseDetail)
def dismiss_case(case_id: int, payload: DismissRequest, db: Session = Depends(get_db),
                 who: Principal = Depends(require("OPERATOR"))):
    _load(db, case_id)
    if payload.reason not in DISMISS_REASONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "UNKNOWN_DISMISS_REASON", "message": f"Unknown reason '{payload.reason}'.",
                    "allowed": list(DISMISS_REASONS)},
        )
    return _detail(db, RiskService(db).dismiss_case(case_id, payload.reason, who.name or payload.actor, payload.note, who.role))


@router.post("/{case_id}/analyze", response_model=InvestigationCaseDetail)
def analyze_case(case_id: int, db: Session = Depends(get_db), who: Principal = Depends(require("ANALYST"))):
    """Run the CrewAI investigation crew on the case's vessel and store its narrative on the case."""
    case = _load(db, case_id)
    if not llm_configured():
        raise llm_unavailable()
    try:
        result = investigate_vessel(case.vessel_id)
    except LLMNotConfiguredError:
        raise llm_unavailable()
    except AgentRunError as exc:
        raise agent_failed(exc)
    case.agent_summary = result.text
    case.add_audit("AGENT_ANALYSIS", "investigation_agent", f"narrative generated by {result.provider} ({result.model}) for {who.actor}", who.role)
    db.commit()
    return _detail(db, case)
