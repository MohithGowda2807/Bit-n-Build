import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


class Vessel(Base):
    __tablename__ = "vessels"

    id = Column(Integer, primary_key=True, index=True)
    vessel_identifier = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    mmsi = Column(String(20), unique=True, index=True, nullable=True)
    callsign = Column(String(20), nullable=True)
    vessel_type = Column(String(50), nullable=False)  # container, tanker, bulk_carrier, cargo, research, cleanup, patrol, other
    # MMSI and IMO are distinct identifiers and must never be conflated.
    imo_number = Column(String(7), unique=True, index=True, nullable=True)
    flag = Column(String(3), nullable=True)  # ISO country code
    length_m = Column(Float, nullable=False, default=100.0)
    width_m = Column(Float, nullable=False, default=20.0)
    draft_m = Column(Float, nullable=False, default=8.0)
    max_speed_knots = Column(Float, nullable=False, default=20.0)
    cruise_speed_knots = Column(Float, nullable=False, default=14.0)
    speed_knots = Column(Float, nullable=False, default=0.0)
    fuel_capacity_liters = Column(Float, nullable=False, default=500000.0)
    fuel_consumption_rate = Column(Float, nullable=False, default=150.0)  # base liters per hour at reference speed
    cargo_capacity_tonnes = Column(Float, nullable=False, default=10000.0)
    current_fuel_liters = Column(Float, nullable=False, default=350000.0)
    latitude = Column(Float, nullable=False, default=0.0)
    longitude = Column(Float, nullable=False, default=0.0)
    heading = Column(Float, nullable=False, default=0.0)
    destination = Column(String(100), nullable=True)
    eta = Column(String(50), nullable=True)
    status = Column(String(50), nullable=False, default="docked")  # docked, underway, anchored, maintenance
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    voyages = relationship("Voyage", back_populates="vessel", cascade="all, delete-orphan")
    tracks = relationship("Track", back_populates="vessel", cascade="all, delete-orphan", order_by="Track.timestamp.desc()")
    alerts = relationship("Alert", back_populates="vessel", cascade="all, delete-orphan")
    missions = relationship("Mission", back_populates="vessel")
