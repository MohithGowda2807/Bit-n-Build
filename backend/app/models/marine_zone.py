from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from app.database import Base


class MarineZone(Base):
    __tablename__ = "marine_zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, nullable=False)
    zone_type = Column(String(50), index=True, nullable=False)  # protected_area, shipping_lane, fishing_zone, restricted_area, environmental_zone, port_zone
    geometry_geojson = Column(Text, nullable=False)  # GeoJSON Polygon / MultiPolygon string
    risk_level = Column(Float, default=10.0)  # 0 - 100
    restricted = Column(Boolean, default=False)
    description = Column(String(255), nullable=True)
