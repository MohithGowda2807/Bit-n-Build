import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    mission_name = Column(String(150), nullable=False)
    mission_type = Column(String(50), nullable=False)  # patrol, debris_cleanup, escort, inspection, survey, rescue
    status = Column(String(50), nullable=False, default="pending")  # pending, active, completed, cancelled
    assigned_vessel_id = Column(Integer, ForeignKey("vessels.id", ondelete="SET NULL"), nullable=True, index=True)
    priority = Column(String(50), nullable=False, default="medium")  # low, medium, high, urgent
    target_lat = Column(Float, nullable=True)
    target_lon = Column(Float, nullable=True)
    parameters = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    vessel = relationship("Vessel", back_populates="missions")
