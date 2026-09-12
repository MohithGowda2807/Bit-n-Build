import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.database import Base


class Debris(Base):
    __tablename__ = "debris"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    debris_type = Column(String(100), nullable=False)  # plastic_patch, ghost_net, container_hazard, chemical_slick, microplastic_cluster
    estimated_size_m2 = Column(Float, nullable=False, default=100.0)
    density_category = Column(String(50), nullable=False, default="medium")  # low, medium, high, critical
    severity = Column(Float, nullable=False, default=50.0)  # 0.0 - 100.0
    detected_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    status = Column(String(50), nullable=False, default="detected")  # detected, monitoring, dispatch_scheduled, cleared
    clean_up_priority = Column(String(50), nullable=False, default="medium")  # low, medium, high, urgent
    source = Column(String(100), nullable=False, default="synthetic_sensor")  # satellite, synthetic_sensor, vessel_report, buoy
    description = Column(Text, nullable=True)
