import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base


class EnvironmentalObservation(Base):
    """
    Environmental observation snapshot across oceanic coordinates.
    Stores atmospheric and hydrodynamic telemetry for spatial indexing and historical tracking.
    """
    __tablename__ = "environmental_observations"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    wind_speed_knots = Column(Float, nullable=False)
    wind_direction_deg = Column(Float, nullable=False)
    wave_height_m = Column(Float, nullable=False)
    wave_period_s = Column(Float, nullable=False, default=6.0)
    visibility_nm = Column(Float, nullable=False, default=10.0)
    pressure_hpa = Column(Float, nullable=False, default=1013.25)
    current_speed_knots = Column(Float, nullable=False, default=0.5)
    current_direction_deg = Column(Float, nullable=False, default=0.0)
    sea_surface_temp_c = Column(Float, nullable=False, default=26.0)
    sea_state = Column(Integer, nullable=False, default=1)  # 0 to 5 Douglas scale
    risk_score = Column(Float, nullable=False, default=0.0)
    source = Column(String(100), default="synthetic-deterministic-marine")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
