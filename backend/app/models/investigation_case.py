import json
from typing import Optional
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from app.database import Base
from app.utils_time import utcnow

CASE_STATUSES = ("OPEN", "UNDER_REVIEW", "ESCALATED", "RESOLVED", "DISMISSED")
CLOSED_STATUSES = ("RESOLVED", "DISMISSED")
DISMISS_REASONS = (
    "AIS_EQUIPMENT_FAILURE", "COVERAGE_ISSUE", "AUTHORIZED_ACTIVITY",
    "WEATHER_DISRUPTION", "DATA_ERROR", "UNKNOWN",
)


class InvestigationCase(Base):
    """A high-risk vessel escalated for human review, with the evidence frozen at creation."""

    __tablename__ = "investigation_cases"

    id = Column(Integer, primary_key=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=False, index=True)
    risk_score_id = Column(Integer, ForeignKey("vessel_risk_scores.id"), nullable=False)
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String(10), nullable=False)
    status = Column(String(20), nullable=False, default="OPEN", index=True)
    assigned_to = Column(String(100), nullable=True)
    summary = Column(Text, nullable=False)
    evidence_snapshot_json = Column(Text, nullable=False, default="[]")
    dismissed_reason = Column(String(40), nullable=True)
    agent_summary = Column(Text, nullable=True)  # narrative produced by the Investigation Agent
    audit_json = Column(Text, nullable=False, default="[]")
    created_at = Column(DateTime, nullable=False, default=utcnow)
    updated_at = Column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    @property
    def evidence_snapshot(self) -> list:
        return json.loads(self.evidence_snapshot_json or "[]")

    @property
    def audit_log(self) -> list:
        return json.loads(self.audit_json or "[]")

    @property
    def is_open(self) -> bool:
        return self.status not in CLOSED_STATUSES

    def add_audit(self, action: str, actor: str, note: Optional[str] = None) -> None:
        entries = self.audit_log
        entries.append({"timestamp": utcnow().isoformat(), "action": action, "actor": actor, "note": note})
        self.audit_json = json.dumps(entries)
