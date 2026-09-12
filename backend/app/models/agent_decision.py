import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.database import Base


class AgentDecisionLog(Base):
    """
    Audit log for autonomous multi-agent decisions.
    Records why actions were taken, which agent triggered them, and what inputs were evaluated.
    """
    __tablename__ = "agent_decisions"

    id = Column(Integer, primary_key=True, index=True)
    agent_name = Column(String(50), nullable=False, index=True)
    action = Column(String(100), nullable=False)
    trigger_event = Column(String(100), nullable=True)
    target_id = Column(String(100), nullable=True)
    input_payload = Column(Text, nullable=True)
    decision_payload = Column(Text, nullable=True)
    reason = Column(Text, nullable=True)
    confidence = Column(Float, nullable=False, default=1.0)
    mode = Column(String(50), default="autonomous")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
