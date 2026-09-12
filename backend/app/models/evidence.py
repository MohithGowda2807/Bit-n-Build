from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from app.database import Base
from app.utils_time import utcnow

EVIDENCE_TYPES = (
    "AIS_GAP", "ZONE_ENTRY", "ZONE_EXIT", "LOITERING", "FISHING_PATTERN",
    "COURSE_ANOMALY", "SPEED_ANOMALY", "VESSEL_RENDEZVOUS", "REAPPEARANCE", "ROUTE_DEVIATION",
)


class Evidence(Base):
    """One explainable item behind a risk score, tied to the event it came from."""

    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=False, index=True)
    risk_score_id = Column(Integer, ForeignKey("vessel_risk_scores.id"), nullable=False, index=True)
    event_id = Column(Integer, ForeignKey("surveillance_events.id"), nullable=True)
    evidence_type = Column(String(30), nullable=False)
    factor_type = Column(String(30), nullable=False)
    strength = Column(Float, nullable=False)  # points the parent factor contributed
    confidence = Column(Float, nullable=False)
    source = Column(String(30), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=utcnow)

    def as_dict(self) -> dict:
        return {
            "id": self.id,
            "event_id": self.event_id,
            "evidence_type": self.evidence_type,
            "factor_type": self.factor_type,
            "strength": self.strength,
            "confidence": self.confidence,
            "source": self.source,
            "timestamp": self.timestamp.isoformat(),
            "latitude": self.latitude,
            "longitude": self.longitude,
            "description": self.description,
        }
