import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from app.database import Base


class Storm(Base):
    """
    Active meteorological storm entity.
    Used by the Risk Engine and Dynamic Routing to detect hazards and calculate avoidance detours.
    """
    __tablename__ = "storms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    storm_type = Column(String(50), default="cyclone")  # cyclone, tropical_storm, depression, gale, typhoon
    severity = Column(String(50), default="high")  # low, moderate, high, critical
    center_latitude = Column(Float, nullable=False)
    center_longitude = Column(Float, nullable=False)
    radius_km = Column(Float, nullable=False, default=150.0)
    wind_speed_knots = Column(Float, nullable=False, default=45.0)
    movement_direction_deg = Column(Float, nullable=False, default=45.0)
    movement_speed_knots = Column(Float, nullable=False, default=10.0)
    forecast_time = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    source = Column(String(100), default="marine-meteorological-center")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
