from sqlalchemy import Column, Integer, String, Float
from app.database import Base


class Port(Base):
    __tablename__ = "ports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    country = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity = Column(Integer, default=5000)  # TEU or berths
    congestion_level = Column(Float, default=20.0)  # Percentage (0-100%)
    status = Column(String(50), default="operational")
