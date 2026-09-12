from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class MarineProtectedArea(Base):
    __tablename__ = "marine_protected_areas"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, index=True)
    geometry_geojson = Column(Text, nullable=False)  # GeoJSON Polygon / MultiPolygon, [lon, lat] order
    protection_level = Column(String(30), nullable=False)  # NO_TAKE, RESTRICTED, MANAGED
    authority = Column(String(100), nullable=True)
    rules = Column(Text, nullable=True)
