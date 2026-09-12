import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    incident_type = Column(String(100), nullable=False)  # oil_spill, collision, grounding, illegal_fishing, debris_hazard, equipment_failure
    severity = Column(String(50), nullable=False, default="moderate")  # minor, moderate, severe, catastrophic
    location_lat = Column(Float, nullable=False)
    location_lon = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="reported")  # reported, under_investigation, contained, closed
    reported_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    resolved_at = Column(DateTime, nullable=True)
