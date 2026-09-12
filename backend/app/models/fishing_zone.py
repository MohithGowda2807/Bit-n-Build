from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base

FISHING_ZONE_TYPES = ("AUTHORIZED_FISHING", "RESTRICTED_FISHING", "SEASONAL_FISHING", "NO_FISHING")


class FishingZone(Base):
    __tablename__ = "fishing_zones"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, index=True)
    geometry_geojson = Column(Text, nullable=False)  # GeoJSON Polygon / MultiPolygon, [lon, lat] order
    zone_type = Column(String(30), nullable=False, index=True)
    jurisdiction = Column(String(50), nullable=True)
    allowed_vessel_types = Column(String(255), nullable=True)  # comma separated normalized types
    active_from = Column(DateTime, nullable=True)
    active_until = Column(DateTime, nullable=True)
