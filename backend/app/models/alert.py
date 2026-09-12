import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String(100), nullable=False, index=True)
    severity = Column(String(50), nullable=False, default="warning")  # info, warning, critical, emergency
    vessel_id = Column(Integer, ForeignKey("vessels.id", ondelete="SET NULL"), nullable=True, index=True)
    message = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    acknowledged = Column(Boolean, default=False)
    status = Column(String(50), nullable=False, default="active")  # active, investigating, resolved, dismissed
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    vessel = relationship("Vessel", back_populates="alerts")
