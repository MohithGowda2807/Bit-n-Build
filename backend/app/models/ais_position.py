from app.utils_time import utcnow
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Index
from app.database import Base


class AISPosition(Base):
    """One raw AIS observation. Kept immutable for evidence and audit."""

    __tablename__ = "ais_positions"

    id = Column(Integer, primary_key=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed_over_ground = Column(Float, nullable=True)  # knots
    course_over_ground = Column(Float, nullable=True)  # degrees
    heading = Column(Float, nullable=True)
    navigation_status = Column(String(30), nullable=True)
    rate_of_turn = Column(Float, nullable=True)
    draught = Column(Float, nullable=True)
    destination = Column(String(100), nullable=True)
    eta = Column(DateTime, nullable=True)
    source = Column(String(30), nullable=False, default="AIS")  # AIS, SIMULATION, SATELLITE
    received_at = Column(DateTime, nullable=False, default=utcnow)

    __table_args__ = (
        Index("ix_ais_positions_vessel_time", "vessel_id", "timestamp"),
    )
