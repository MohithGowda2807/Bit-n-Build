import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    mission_name = Column(String(150), nullable=False)
    mission_type = Column(String(50), nullable=False)  # patrol, debris_cleanup, escort, inspection, survey, rescue
    status = Column(String(50), nullable=False, default="pending")  # pending, active, completed, cancelled, aborted
    assigned_vessel_id = Column(Integer, ForeignKey("vessels.id", ondelete="SET NULL"), nullable=True, index=True)
    priority = Column(String(50), nullable=False, default="medium")  # low, medium, high, urgent
    target_lat = Column(Float, nullable=True)
    target_lon = Column(Float, nullable=True)
    origin_lat = Column(Float, nullable=True)
    origin_lon = Column(Float, nullable=True)
    waypoints_json = Column(Text, nullable=True)  # JSON list of coordinates/waypoints
    target_debris_ids = Column(Text, nullable=True)  # JSON list of debris cluster IDs
    estimated_duration_hours = Column(Float, nullable=True)
    estimated_energy_kwh = Column(Float, nullable=True)
    collected_kg = Column(Float, nullable=False, default=0.0)
    target_kg = Column(Float, nullable=False, default=500.0)
    approval_status = Column(String(50), nullable=False, default="approved")  # pending_approval, approved, rejected
    parameters = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    vessel = relationship("Vessel", back_populates="missions")
    cleanup_units = relationship("CleanupUnit", back_populates="mission", foreign_keys="CleanupUnit.assigned_mission_id")
