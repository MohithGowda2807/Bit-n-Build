import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=True)
    origin_lat = Column(Float, nullable=False)
    origin_lon = Column(Float, nullable=False)
    destination_lat = Column(Float, nullable=False)
    destination_lon = Column(Float, nullable=False)
    distance_km = Column(Float, nullable=False)
    estimated_time_hours = Column(Float, nullable=False)
    estimated_fuel_liters = Column(Float, nullable=False)
    estimated_co2_kg = Column(Float, nullable=False)
    estimated_cost = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False, default=0.0)
    environmental_score = Column(Float, nullable=False, default=100.0)
    optimization_score = Column(Float, nullable=False, default=0.0)
    optimization_mode = Column(String(50), default="balanced")
    geometry_geojson = Column(Text, nullable=False)  # GeoJSON LineString coordinates [[lon, lat], ...]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    segments = relationship("RouteSegment", back_populates="route", cascade="all, delete-orphan", order_by="RouteSegment.sequence_number")
    voyages = relationship("Voyage", back_populates="route")


class RouteSegment(Base):
    __tablename__ = "route_segments"

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    sequence_number = Column(Integer, nullable=False)
    start_lat = Column(Float, nullable=False)
    start_lon = Column(Float, nullable=False)
    end_lat = Column(Float, nullable=False)
    end_lon = Column(Float, nullable=False)
    distance_km = Column(Float, nullable=False)
    estimated_speed_knots = Column(Float, nullable=False)
    estimated_fuel_liters = Column(Float, nullable=False)
    estimated_time_hours = Column(Float, nullable=False)

    route = relationship("Route", back_populates="segments")
