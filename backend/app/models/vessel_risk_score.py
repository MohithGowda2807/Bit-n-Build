import json
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from app.database import Base
from app.utils_time import utcnow


class VesselRiskScore(Base):
    """One risk assessment for a vessel. History is kept; the newest row is the current risk."""

    __tablename__ = "vessel_risk_scores"

    id = Column(Integer, primary_key=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=False, index=True)
    score = Column(Float, nullable=False)
    level = Column(String(10), nullable=False, index=True)
    factors_json = Column(Text, nullable=False, default="[]")
    computed_at = Column(DateTime, nullable=False, default=utcnow, index=True)

    @property
    def factors(self) -> list:
        return json.loads(self.factors_json or "[]")
