import datetime
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from app.database import Base


class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id", ondelete="CASCADE"), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed_knots = Column(Float, nullable=False, default=0.0)
    heading = Column(Float, nullable=False, default=0.0)
    status = Column(String(50), nullable=False, default="underway")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    vessel = relationship("Vessel", back_populates="tracks")
