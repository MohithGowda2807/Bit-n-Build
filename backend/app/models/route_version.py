import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class RouteVersion(Base):
    """
    Route versioning entity tracking dynamic replanning iterations for voyages.
    Preserves full lineage (v1 -> v2 -> v3) and metrics differentials.
    """
    __tablename__ = "route_versions"

    id = Column(Integer, primary_key=True, index=True)
    voyage_id = Column(Integer, ForeignKey("voyages.id"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False, default=1)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    parent_version_id = Column(Integer, ForeignKey("route_versions.id"), nullable=True)
    trigger_event = Column(String(100), default="INITIAL_OPTIMIZATION")
    change_reason = Column(Text, nullable=True)
    risk_score = Column(Float, nullable=False, default=0.0)
    fuel_liters = Column(Float, nullable=False, default=0.0)
    eta_hours = Column(Float, nullable=False, default=0.0)
    co2_kg = Column(Float, nullable=False, default=0.0)
    risk_reduction_pct = Column(Float, nullable=True, default=0.0)
    fuel_change_pct = Column(Float, nullable=True, default=0.0)
    eta_change_hours = Column(Float, nullable=True, default=0.0)
    explanation_json = Column(Text, nullable=True)
    status = Column(String(50), default="active")  # active, superseded, rejected, proposed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    voyage = relationship("Voyage", backref="versions")
    route = relationship("Route")
