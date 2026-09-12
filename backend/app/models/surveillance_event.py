import json
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from app.database import Base
from app.utils_time import utcnow

EVENT_TYPES = (
    "AIS_GAP_DETECTED", "ZONE_ENTRY", "ZONE_EXIT", "LOITERING",
    "FISHING_PATTERN", "VESSEL_RENDEZVOUS", "COURSE_ANOMALY", "SPEED_ANOMALY", "ROUTE_DEVIATION",
)


class SurveillanceEvent(Base):
    """One detected behavioral event for a vessel. Evidence and risk are built from these."""

    __tablename__ = "surveillance_events"

    id = Column(Integer, primary_key=True)
    event_type = Column(String(30), nullable=False, index=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=False, index=True)
    other_vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=True)
    zone_kind = Column(String(30), nullable=True)  # FISHING_ZONE or MARINE_PROTECTED_AREA
    zone_id = Column(Integer, nullable=True)
    zone_name = Column(String(100), nullable=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    score = Column(Float, nullable=True)  # detector score 0-100 where applicable
    confidence = Column(Float, nullable=False, default=1.0)
    source = Column(String(30), nullable=False, default="AIS")
    payload_json = Column(Text, nullable=False, default="{}")
    created_at = Column(DateTime, nullable=False, default=utcnow)

    @classmethod
    def from_detected(cls, event) -> "SurveillanceEvent":
        return cls(
            event_type=event.event_type,
            vessel_id=event.vessel_id,
            other_vessel_id=event.other_vessel_id,
            zone_kind=event.zone_kind,
            zone_id=event.zone_id,
            zone_name=event.zone_name,
            timestamp=event.timestamp,
            latitude=event.latitude,
            longitude=event.longitude,
            score=event.score,
            confidence=event.confidence,
            source=event.source,
            payload_json=json.dumps(event.payload),
        )

    @property
    def payload(self) -> dict:
        return json.loads(self.payload_json or "{}")
