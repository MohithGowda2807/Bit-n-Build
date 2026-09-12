import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Voyage(Base):
    __tablename__ = "voyages"

    id = Column(Integer, primary_key=True, index=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=False, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False, index=True)
    status = Column(String(50), default="planned")  # planned, active, completed, cancelled
    departure_time = Column(DateTime, default=datetime.datetime.utcnow)
    estimated_arrival = Column(DateTime, nullable=True)
    actual_arrival = Column(DateTime, nullable=True)
    starting_fuel = Column(Float, nullable=False, default=0.0)
    estimated_fuel = Column(Float, nullable=False, default=0.0)
    fuel_saved = Column(Float, nullable=False, default=0.0)
    co2_estimated = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    vessel = relationship("Vessel", back_populates="voyages")
    route = relationship("Route", back_populates="voyages")
