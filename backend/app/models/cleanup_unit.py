import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class CleanupUnit(Base):
    __tablename__ = "cleanup_units"

    id = Column(Integer, primary_key=True, index=True)
    unit_name = Column(String(100), nullable=False, unique=True)
    unit_type = Column(String(50), nullable=False, default="asv_skimmer")  # asv_skimmer, autonomous_drone, towed_boom, robotic_interceptor
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    heading_deg = Column(Float, nullable=False, default=0.0)
    speed_knots = Column(Float, nullable=False, default=8.0)
    battery_pct = Column(Float, nullable=False, default=100.0)
    max_range_nm = Column(Float, nullable=False, default=120.0)
    capacity_kg = Column(Float, nullable=False, default=1500.0)
    current_load_kg = Column(Float, nullable=False, default=0.0)
    status = Column(String(50), nullable=False, default="idle")  # idle, transit, collecting, returning, docked, maintenance
    assigned_mission_id = Column(Integer, ForeignKey("missions.id", ondelete="SET NULL"), nullable=True)
    home_port_id = Column(Integer, ForeignKey("ports.id", ondelete="SET NULL"), nullable=True)
    operator_override = Column(String(50), nullable=True)  # hold, return_home, manual
    # Simulation progress that must survive between ticks (the simulator is rebuilt from this row each tick).
    current_waypoint_index = Column(Integer, nullable=False, default=0)
    collection_timer_hours = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    mission = relationship("Mission", foreign_keys=[assigned_mission_id], back_populates="cleanup_units")
    home_port = relationship("Port", foreign_keys=[home_port_id])
