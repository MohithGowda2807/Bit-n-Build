import json
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.vessel import Vessel
from app.models.port import Port
from app.models.marine_zone import MarineZone

SEED_VESSELS: List[Dict[str, Any]] = [
    {
        "vessel_identifier": "IMO-9432810",
        "name": "MV Ocean Star",
        "vessel_type": "container",
        "length_m": 294.0,
        "width_m": 32.2,
        "draft_m": 12.5,
        "max_speed_knots": 21.0,
        "cruise_speed_knots": 16.0,
        "fuel_capacity_liters": 1200000.0,
        "fuel_consumption_rate": 180.0,
        "cargo_capacity_tonnes": 55000.0,
        "current_fuel_liters": 850000.0,
        "latitude": 18.9438,
        "longitude": 72.8364,
        "heading": 165.0,
        "status": "docked"
    },
    {
        "vessel_identifier": "IMO-9812401",
        "name": "Sentinel Neptune",
        "vessel_type": "tanker",
        "length_m": 333.0,
        "width_m": 60.0,
        "draft_m": 21.0,
        "max_speed_knots": 17.0,
        "cruise_speed_knots": 14.0,
        "fuel_capacity_liters": 1500000.0,
        "fuel_consumption_rate": 210.0,
        "cargo_capacity_tonnes": 160000.0,
        "current_fuel_liters": 1100000.0,
        "latitude": 25.0113,
        "longitude": 55.0617,
        "heading": 120.0,
        "status": "docked"
    },
    {
        "vessel_identifier": "IMO-9654213",
        "name": "Pacific Pioneer",
        "vessel_type": "bulk_carrier",
        "length_m": 225.0,
        "width_m": 32.2,
        "draft_m": 14.5,
        "max_speed_knots": 16.0,
        "cruise_speed_knots": 13.5,
        "fuel_capacity_liters": 950000.0,
        "fuel_consumption_rate": 145.0,
        "cargo_capacity_tonnes": 75000.0,
        "current_fuel_liters": 620000.0,
        "latitude": 6.9497,
        "longitude": 79.8428,
        "heading": 90.0,
        "status": "docked"
    },
    {
        "vessel_identifier": "IMO-9347120",
        "name": "Atlantic Trader",
        "vessel_type": "cargo",
        "length_m": 190.0,
        "width_m": 28.5,
        "draft_m": 10.2,
        "max_speed_knots": 18.0,
        "cruise_speed_knots": 14.5,
        "fuel_capacity_liters": 800000.0,
        "fuel_consumption_rate": 130.0,
        "cargo_capacity_tonnes": 32000.0,
        "current_fuel_liters": 540000.0,
        "latitude": 1.29027,
        "longitude": 103.851959,
        "heading": 270.0,
        "status": "underway"
    },
    {
        "vessel_identifier": "IMO-9845012",
        "name": "RV Discovery",
        "vessel_type": "research",
        "length_m": 99.7,
        "width_m": 18.0,
        "draft_m": 6.5,
        "max_speed_knots": 15.0,
        "cruise_speed_knots": 12.0,
        "fuel_capacity_liters": 450000.0,
        "fuel_consumption_rate": 80.0,
        "cargo_capacity_tonnes": 2500.0,
        "current_fuel_liters": 380000.0,
        "latitude": 10.0,
        "longitude": 75.0,
        "heading": 180.0,
        "status": "underway"
    },
    {
        "vessel_identifier": "IMO-9912044",
        "name": "EcoGuardian Alpha",
        "vessel_type": "cleanup",
        "length_m": 65.0,
        "width_m": 14.0,
        "draft_m": 4.2,
        "max_speed_knots": 14.0,
        "cruise_speed_knots": 11.0,
        "fuel_capacity_liters": 250000.0,
        "fuel_consumption_rate": 60.0,
        "cargo_capacity_tonnes": 800.0,
        "current_fuel_liters": 210000.0,
        "latitude": 8.5,
        "longitude": 78.0,
        "heading": 45.0,
        "status": "anchored"
    },
    {
        "vessel_identifier": "IMO-9781290",
        "name": "Ocean Defender",
        "vessel_type": "patrol",
        "length_m": 88.0,
        "width_m": 13.5,
        "draft_m": 4.0,
        "max_speed_knots": 24.0,
        "cruise_speed_knots": 18.0,
        "fuel_capacity_liters": 350000.0,
        "fuel_consumption_rate": 190.0,
        "cargo_capacity_tonnes": 500.0,
        "current_fuel_liters": 290000.0,
        "latitude": 12.0,
        "longitude": 80.0,
        "heading": 210.0,
        "status": "underway"
    },
    {
        "vessel_identifier": "IMO-9556789",
        "name": "Northern Voyager",
        "vessel_type": "container",
        "length_m": 366.0,
        "width_m": 48.2,
        "draft_m": 15.5,
        "max_speed_knots": 22.0,
        "cruise_speed_knots": 16.5,
        "fuel_capacity_liters": 1400000.0,
        "fuel_consumption_rate": 200.0,
        "cargo_capacity_tonnes": 110000.0,
        "current_fuel_liters": 980000.0,
        "latitude": 51.9244,
        "longitude": 4.4777,
        "heading": 240.0,
        "status": "docked"
    },
    {
        "vessel_identifier": "IMO-9489123",
        "name": "Solar Horizon",
        "vessel_type": "research",
        "length_m": 110.0,
        "width_m": 20.0,
        "draft_m": 6.8,
        "max_speed_knots": 16.0,
        "cruise_speed_knots": 13.0,
        "fuel_capacity_liters": 500000.0,
        "fuel_consumption_rate": 85.0,
        "cargo_capacity_tonnes": 3000.0,
        "current_fuel_liters": 420000.0,
        "latitude": 31.2304,
        "longitude": 121.4737,
        "heading": 110.0,
        "status": "docked"
    },
    {
        "vessel_identifier": "IMO-9602441",
        "name": "Blue Tide",
        "vessel_type": "bulk_carrier",
        "length_m": 210.0,
        "width_m": 31.0,
        "draft_m": 13.8,
        "max_speed_knots": 15.5,
        "cruise_speed_knots": 13.0,
        "fuel_capacity_liters": 900000.0,
        "fuel_consumption_rate": 140.0,
        "cargo_capacity_tonnes": 68000.0,
        "current_fuel_liters": 710000.0,
        "latitude": -33.9189,
        "longitude": 18.4233,
        "heading": 90.0,
        "status": "docked"
    }
]

SEED_PORTS: List[Dict[str, Any]] = [
    {"name": "Singapore Port", "country": "Singapore", "latitude": 1.29027, "longitude": 103.851959, "capacity": 37000, "congestion_level": 32.0, "status": "operational"},
    {"name": "Jawaharlal Nehru Port (Mumbai)", "country": "India", "latitude": 18.9438, "longitude": 72.8364, "capacity": 12000, "congestion_level": 45.0, "status": "operational"},
    {"name": "Port of Colombo", "country": "Sri Lanka", "latitude": 6.9497, "longitude": 79.8428, "capacity": 10000, "congestion_level": 25.0, "status": "operational"},
    {"name": "Port of Jebel Ali (Dubai)", "country": "United Arab Emirates", "latitude": 25.0113, "longitude": 55.0617, "capacity": 18000, "congestion_level": 28.0, "status": "operational"},
    {"name": "Port of Rotterdam", "country": "Netherlands", "latitude": 51.9244, "longitude": 4.4777, "capacity": 25000, "congestion_level": 20.0, "status": "operational"},
    {"name": "Port of Shanghai", "country": "China", "latitude": 31.2304, "longitude": 121.4737, "capacity": 47000, "congestion_level": 55.0, "status": "operational"},
    {"name": "Port of Los Angeles", "country": "United States", "latitude": 33.7432, "longitude": -118.2673, "capacity": 16000, "congestion_level": 40.0, "status": "operational"},
    {"name": "Port Said (Suez Canal)", "country": "Egypt", "latitude": 31.2653, "longitude": 32.3019, "capacity": 9000, "congestion_level": 60.0, "status": "operational"},
    {"name": "Port of Santos", "country": "Brazil", "latitude": -23.9608, "longitude": -46.3331, "capacity": 8000, "congestion_level": 30.0, "status": "operational"},
    {"name": "Port of Cape Town", "country": "South Africa", "latitude": -33.9189, "longitude": 18.4233, "capacity": 6500, "congestion_level": 18.0, "status": "operational"}
]

SEED_ZONES: List[Dict[str, Any]] = [
    {
        "name": "Malacca Strait Traffic Separation Corridor",
        "zone_type": "shipping_lane",
        "geometry_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[98.5, 4.5], [101.5, 2.5], [103.8, 1.2], [103.5, 0.8], [100.8, 2.0], [98.0, 4.0], [98.5, 4.5]]]
        }),
        "risk_level": 22.0,
        "restricted": False,
        "description": "High-density maritime traffic separation lane connecting Indian Ocean and South China Sea."
    },
    {
        "name": "Sri Lanka Whale & Coral Marine Sanctuary",
        "zone_type": "protected_area",
        "geometry_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[79.8, 5.8], [81.5, 5.8], [81.5, 5.0], [79.8, 5.0], [79.8, 5.8]]]
        }),
        "risk_level": 85.0,
        "restricted": True,
        "description": "Critical cetacean breeding corridor and marine biodiversity reserve. Strict speed and emission controls."
    },
    {
        "name": "Arabian Sea High-Risk Navigation Zone",
        "zone_type": "restricted_area",
        "geometry_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[58.0, 15.0], [64.0, 15.0], [64.0, 12.0], [58.0, 12.0], [58.0, 15.0]]]
        }),
        "risk_level": 65.0,
        "restricted": False,
        "description": "Historical piracy alert and seasonal monsoon swell advisory zone."
    },
    {
        "name": "Bay of Bengal Monsoon Research Area",
        "zone_type": "environmental_zone",
        "geometry_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[85.0, 15.0], [90.0, 15.0], [90.0, 11.0], [85.0, 11.0], [85.0, 15.0]]]
        }),
        "risk_level": 40.0,
        "restricted": False,
        "description": "Continuous scientific buoy monitoring and storm genesis tracking area."
    },
    {
        "name": "Suez Red Sea Transit Lane",
        "zone_type": "shipping_lane",
        "geometry_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[32.0, 30.0], [34.0, 27.0], [36.0, 24.0], [35.0, 24.0], [33.0, 27.0], [31.5, 30.0], [32.0, 30.0]]]
        }),
        "risk_level": 35.0,
        "restricted": False,
        "description": "Designated transit corridor for commercial container vessels passing into Red Sea."
    },
    {
        "name": "Gulf of Mannar Biosphere Reserve",
        "zone_type": "protected_area",
        "geometry_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[78.5, 9.4], [79.5, 9.4], [79.5, 8.8], [78.5, 8.8], [78.5, 9.4]]]
        }),
        "risk_level": 90.0,
        "restricted": True,
        "description": "UNESCO Biosphere reserve comprising 21 islands with endangered dugongs and coral reefs."
    }
]


def seed_database(db: Session):
    """Seed initial deterministic dataset if tables are empty."""
    if db.query(Vessel).count() == 0:
        for v_data in SEED_VESSELS:
            db.add(Vessel(**v_data))
        db.commit()

    if db.query(Port).count() == 0:
        for p_data in SEED_PORTS:
            db.add(Port(**p_data))
        db.commit()

    if db.query(MarineZone).count() == 0:
        for z_data in SEED_ZONES:
            db.add(MarineZone(**z_data))
        db.commit()
