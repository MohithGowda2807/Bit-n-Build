import json
import datetime
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.vessel import Vessel
from app.models.track import Track
from app.models.debris import Debris
from app.models.alert import Alert
from app.models.mission import Mission
from app.models.incident import Incident
from app.models.port import Port
from app.models.marine_zone import MarineZone
from app.models.route import Route, RouteSegment
from app.models.voyage import Voyage
from app.models.route_version import RouteVersion

SEED_VESSELS: List[Dict[str, Any]] = [
    {
        "vessel_identifier": "IMO-9432810",
        "name": "MV Ocean Star",
        "mmsi": "563092000",
        "callsign": "9V8210",
        "vessel_type": "container",
        "length_m": 294.0,
        "width_m": 32.2,
        "draft_m": 12.5,
        "max_speed_knots": 21.0,
        "cruise_speed_knots": 16.0,
        "speed_knots": 0.0,
        "fuel_capacity_liters": 1200000.0,
        "fuel_consumption_rate": 180.0,
        "cargo_capacity_tonnes": 55000.0,
        "current_fuel_liters": 850000.0,
        "latitude": 18.9438,
        "longitude": 72.8364,
        "heading": 165.0,
        "destination": "Port of Colombo",
        "eta": "2026-09-14 10:00 UTC",
        "status": "docked"
    },
    {
        "vessel_identifier": "IMO-9812401",
        "name": "Sentinel Neptune",
        "mmsi": "470123000",
        "callsign": "A6E401",
        "vessel_type": "tanker",
        "length_m": 333.0,
        "width_m": 60.0,
        "draft_m": 21.0,
        "max_speed_knots": 17.0,
        "cruise_speed_knots": 14.0,
        "speed_knots": 0.0,
        "fuel_capacity_liters": 1500000.0,
        "fuel_consumption_rate": 210.0,
        "cargo_capacity_tonnes": 160000.0,
        "current_fuel_liters": 1100000.0,
        "latitude": 25.0113,
        "longitude": 55.0617,
        "heading": 120.0,
        "destination": "Port of Singapore",
        "eta": "2026-09-18 16:30 UTC",
        "status": "docked"
    },
    {
        "vessel_identifier": "IMO-9654213",
        "name": "Pacific Pioneer",
        "mmsi": "419900213",
        "callsign": "VTBA",
        "vessel_type": "bulk_carrier",
        "length_m": 225.0,
        "width_m": 32.2,
        "draft_m": 14.5,
        "max_speed_knots": 16.0,
        "cruise_speed_knots": 13.5,
        "speed_knots": 12.8,
        "fuel_capacity_liters": 950000.0,
        "fuel_consumption_rate": 145.0,
        "cargo_capacity_tonnes": 75000.0,
        "current_fuel_liters": 620000.0,
        "latitude": 6.9497,
        "longitude": 79.8428,
        "heading": 90.0,
        "destination": "Port Klang",
        "eta": "2026-09-15 08:00 UTC",
        "status": "underway"
    },
    {
        "vessel_identifier": "IMO-9347120",
        "name": "Atlantic Trader",
        "mmsi": "235071200",
        "callsign": "2GTH5",
        "vessel_type": "cargo",
        "length_m": 190.0,
        "width_m": 28.5,
        "draft_m": 10.2,
        "max_speed_knots": 18.0,
        "cruise_speed_knots": 14.5,
        "speed_knots": 15.2,
        "fuel_capacity_liters": 800000.0,
        "fuel_consumption_rate": 130.0,
        "cargo_capacity_tonnes": 32000.0,
        "current_fuel_liters": 540000.0,
        "latitude": 1.29027,
        "longitude": 103.851959,
        "heading": 270.0,
        "destination": "Jawaharlal Nehru Port",
        "eta": "2026-09-17 14:00 UTC",
        "status": "underway"
    },
    {
        "vessel_identifier": "IMO-9845012",
        "name": "RV Discovery",
        "mmsi": "232008450",
        "callsign": "MBDF9",
        "vessel_type": "research",
        "length_m": 99.7,
        "width_m": 18.0,
        "draft_m": 6.5,
        "max_speed_knots": 15.0,
        "cruise_speed_knots": 12.0,
        "speed_knots": 11.4,
        "fuel_capacity_liters": 450000.0,
        "fuel_consumption_rate": 80.0,
        "cargo_capacity_tonnes": 2500.0,
        "current_fuel_liters": 380000.0,
        "latitude": 10.0,
        "longitude": 75.0,
        "heading": 180.0,
        "destination": "Indian Ocean Sanctuary",
        "eta": "2026-09-13 18:00 UTC",
        "status": "underway"
    },
    {
        "vessel_identifier": "IMO-9912044",
        "name": "EcoGuardian Alpha",
        "mmsi": "566991200",
        "callsign": "9V6044",
        "vessel_type": "cleanup",
        "length_m": 65.0,
        "width_m": 14.0,
        "draft_m": 4.2,
        "max_speed_knots": 14.0,
        "cruise_speed_knots": 11.0,
        "speed_knots": 0.0,
        "fuel_capacity_liters": 250000.0,
        "fuel_consumption_rate": 60.0,
        "cargo_capacity_tonnes": 800.0,
        "current_fuel_liters": 210000.0,
        "latitude": 8.5,
        "longitude": 78.0,
        "heading": 45.0,
        "destination": "Gulf of Mannar",
        "eta": "2026-09-12 22:00 UTC",
        "status": "anchored"
    },
    {
        "vessel_identifier": "IMO-9781290",
        "name": "Ocean Defender",
        "mmsi": "419000766",
        "callsign": "VTC4",
        "vessel_type": "patrol",
        "length_m": 88.0,
        "width_m": 13.5,
        "draft_m": 4.0,
        "max_speed_knots": 24.0,
        "cruise_speed_knots": 18.0,
        "speed_knots": 18.0,
        "fuel_capacity_liters": 350000.0,
        "fuel_consumption_rate": 190.0,
        "cargo_capacity_tonnes": 500.0,
        "current_fuel_liters": 290000.0,
        "latitude": 12.0,
        "longitude": 80.0,
        "heading": 210.0,
        "destination": "Chennai Outer Anchorage",
        "eta": "2026-09-13 04:00 UTC",
        "status": "underway"
    },
    {
        "vessel_identifier": "IMO-9556789",
        "name": "Northern Voyager",
        "mmsi": "244123000",
        "callsign": "PDKA",
        "vessel_type": "container",
        "length_m": 366.0,
        "width_m": 48.2,
        "draft_m": 15.5,
        "max_speed_knots": 22.0,
        "cruise_speed_knots": 16.5,
        "speed_knots": 0.0,
        "fuel_capacity_liters": 1400000.0,
        "fuel_consumption_rate": 200.0,
        "cargo_capacity_tonnes": 110000.0,
        "current_fuel_liters": 980000.0,
        "latitude": 51.9244,
        "longitude": 4.4777,
        "heading": 240.0,
        "destination": "Port of Rotterdam",
        "eta": "2026-09-14 12:00 UTC",
        "status": "docked"
    },
    {
        "vessel_identifier": "IMO-9489123",
        "name": "Solar Horizon",
        "mmsi": "413009123",
        "callsign": "BVAX",
        "vessel_type": "research",
        "length_m": 110.0,
        "width_m": 20.0,
        "draft_m": 6.8,
        "max_speed_knots": 16.0,
        "cruise_speed_knots": 13.0,
        "speed_knots": 0.0,
        "fuel_capacity_liters": 500000.0,
        "fuel_consumption_rate": 85.0,
        "cargo_capacity_tonnes": 3000.0,
        "current_fuel_liters": 420000.0,
        "latitude": 31.2304,
        "longitude": 121.4737,
        "heading": 110.0,
        "destination": "East China Sea Station",
        "eta": "2026-09-16 06:00 UTC",
        "status": "docked"
    },
    {
        "vessel_identifier": "IMO-9602441",
        "name": "Blue Tide",
        "mmsi": "601992000",
        "callsign": "ZSCB",
        "vessel_type": "bulk_carrier",
        "length_m": 210.0,
        "width_m": 31.0,
        "draft_m": 13.8,
        "max_speed_knots": 15.5,
        "cruise_speed_knots": 13.0,
        "speed_knots": 0.0,
        "fuel_capacity_liters": 900000.0,
        "fuel_consumption_rate": 140.0,
        "cargo_capacity_tonnes": 68000.0,
        "current_fuel_liters": 710000.0,
        "latitude": -33.9189,
        "longitude": 18.4233,
        "heading": 90.0,
        "destination": "Cape Town Fairway",
        "eta": "2026-09-15 18:00 UTC",
        "status": "docked"
    }
]

SEED_PORTS: List[Dict[str, Any]] = [
    # Southeast & East Asia
    {"name": "Singapore Port", "country": "Singapore", "latitude": 1.29027, "longitude": 103.851959, "capacity": 37000, "congestion_level": 32.0, "status": "operational"},
    {"name": "Port of Shanghai", "country": "China", "latitude": 31.2304, "longitude": 121.4737, "capacity": 47000, "congestion_level": 55.0, "status": "operational"},
    {"name": "Port of Ningbo-Zhoushan", "country": "China", "latitude": 29.8683, "longitude": 121.5440, "capacity": 31000, "congestion_level": 42.0, "status": "operational"},
    {"name": "Port of Shenzhen", "country": "China", "latitude": 22.5431, "longitude": 114.0579, "capacity": 28000, "congestion_level": 38.0, "status": "operational"},
    {"name": "Port of Guangzhou", "country": "China", "latitude": 23.1291, "longitude": 113.2644, "capacity": 24000, "congestion_level": 35.0, "status": "operational"},
    {"name": "Port of Qingdao", "country": "China", "latitude": 36.0671, "longitude": 120.3826, "capacity": 23000, "congestion_level": 30.0, "status": "operational"},
    {"name": "Port of Tianjin", "country": "China", "latitude": 38.9858, "longitude": 117.7460, "capacity": 20000, "congestion_level": 28.0, "status": "operational"},
    {"name": "Port of Hong Kong", "country": "Hong Kong", "latitude": 22.3193, "longitude": 114.1694, "capacity": 18000, "congestion_level": 26.0, "status": "operational"},
    {"name": "Port of Kaohsiung", "country": "Taiwan", "latitude": 22.6163, "longitude": 120.2810, "capacity": 15000, "congestion_level": 24.0, "status": "operational"},
    {"name": "Port of Busan", "country": "South Korea", "latitude": 35.1028, "longitude": 129.0403, "capacity": 22000, "congestion_level": 32.0, "status": "operational"},
    {"name": "Port of Tokyo", "country": "Japan", "latitude": 35.6190, "longitude": 139.7960, "capacity": 14000, "congestion_level": 22.0, "status": "operational"},
    {"name": "Port of Yokohama", "country": "Japan", "latitude": 35.4437, "longitude": 139.6380, "capacity": 11000, "congestion_level": 19.0, "status": "operational"},
    {"name": "Port Klang", "country": "Malaysia", "latitude": 2.9999, "longitude": 101.3928, "capacity": 13500, "congestion_level": 34.0, "status": "operational"},
    {"name": "Port of Tanjung Pelepas", "country": "Malaysia", "latitude": 1.3610, "longitude": 103.5490, "capacity": 12000, "congestion_level": 27.0, "status": "operational"},
    {"name": "Port of Jakarta (Tanjung Priok)", "country": "Indonesia", "latitude": -6.1042, "longitude": 106.8833, "capacity": 8500, "congestion_level": 40.0, "status": "operational"},
    {"name": "Port of Surabaya", "country": "Indonesia", "latitude": -7.1982, "longitude": 112.7335, "capacity": 5500, "congestion_level": 22.0, "status": "operational"},
    {"name": "Port of Manila", "country": "Philippines", "latitude": 14.5995, "longitude": 120.9842, "capacity": 5000, "congestion_level": 36.0, "status": "operational"},
    {"name": "Port of Laem Chabang (Bangkok)", "country": "Thailand", "latitude": 13.0827, "longitude": 100.8833, "capacity": 8000, "congestion_level": 25.0, "status": "operational"},
    {"name": "Port of Ho Chi Minh City", "country": "Vietnam", "latitude": 10.7626, "longitude": 106.6602, "capacity": 7500, "congestion_level": 30.0, "status": "operational"},

    # Australia & Oceania
    {"name": "Port of Sydney", "country": "Australia", "latitude": -33.8500, "longitude": 151.2600, "capacity": 9500, "congestion_level": 22.0, "status": "operational"},
    {"name": "Port of Melbourne", "country": "Australia", "latitude": -37.8409, "longitude": 144.9312, "capacity": 11000, "congestion_level": 25.0, "status": "operational"},
    {"name": "Port of Brisbane", "country": "Australia", "latitude": -27.3833, "longitude": 153.1667, "capacity": 7000, "congestion_level": 18.0, "status": "operational"},
    {"name": "Fremantle Port (Perth)", "country": "Australia", "latitude": -32.0518, "longitude": 115.7439, "capacity": 6000, "congestion_level": 15.0, "status": "operational"},
    {"name": "Port of Darwin", "country": "Australia", "latitude": -12.4700, "longitude": 130.8500, "capacity": 3500, "congestion_level": 12.0, "status": "operational"},
    {"name": "Port of Adelaide", "country": "Australia", "latitude": -34.8000, "longitude": 138.5000, "capacity": 4000, "congestion_level": 14.0, "status": "operational"},
    {"name": "Port of Newcastle", "country": "Australia", "latitude": -32.9167, "longitude": 151.7833, "capacity": 5500, "congestion_level": 16.0, "status": "operational"},
    {"name": "Port Hedland", "country": "Australia", "latitude": -20.3167, "longitude": 118.5833, "capacity": 6500, "congestion_level": 20.0, "status": "operational"},
    {"name": "Port of Auckland", "country": "New Zealand", "latitude": -36.8485, "longitude": 174.7633, "capacity": 4500, "congestion_level": 15.0, "status": "operational"},
    {"name": "Port of Wellington", "country": "New Zealand", "latitude": -41.2865, "longitude": 174.7762, "capacity": 3500, "congestion_level": 12.0, "status": "operational"},

    # South Asia & Indian Ocean
    {"name": "Jawaharlal Nehru Port (Mumbai)", "country": "India", "latitude": 18.9438, "longitude": 72.8364, "capacity": 12000, "congestion_level": 45.0, "status": "operational"},
    {"name": "Port of Chennai", "country": "India", "latitude": 13.0827, "longitude": 80.2707, "capacity": 8500, "congestion_level": 32.0, "status": "operational"},
    {"name": "Port of Cochin (Kochi)", "country": "India", "latitude": 9.9312, "longitude": 76.2673, "capacity": 5500, "congestion_level": 20.0, "status": "operational"},
    {"name": "Port of Kolkata / Haldia", "country": "India", "latitude": 22.0300, "longitude": 88.0800, "capacity": 6000, "congestion_level": 38.0, "status": "operational"},
    {"name": "Port of Visakhapatnam", "country": "India", "latitude": 17.6868, "longitude": 83.2185, "capacity": 7500, "congestion_level": 28.0, "status": "operational"},
    {"name": "Port of Mundra", "country": "India", "latitude": 22.8389, "longitude": 69.7028, "capacity": 11000, "congestion_level": 34.0, "status": "operational"},
    {"name": "Port of Colombo", "country": "Sri Lanka", "latitude": 6.9497, "longitude": 79.8428, "capacity": 10000, "congestion_level": 25.0, "status": "operational"},
    {"name": "Port of Hambantota", "country": "Sri Lanka", "latitude": 6.1246, "longitude": 81.1185, "capacity": 5000, "congestion_level": 14.0, "status": "operational"},
    {"name": "Port of Chittagong", "country": "Bangladesh", "latitude": 22.3384, "longitude": 91.8317, "capacity": 7000, "congestion_level": 48.0, "status": "operational"},
    {"name": "Port of Karachi", "country": "Pakistan", "latitude": 24.8607, "longitude": 66.9905, "capacity": 6500, "congestion_level": 35.0, "status": "operational"},
    {"name": "Port of Port Louis", "country": "Mauritius", "latitude": -20.1609, "longitude": 57.5012, "capacity": 3000, "congestion_level": 15.0, "status": "operational"},

    # Middle East
    {"name": "Port of Jebel Ali (Dubai)", "country": "United Arab Emirates", "latitude": 25.0113, "longitude": 55.0617, "capacity": 18000, "congestion_level": 28.0, "status": "operational"},
    {"name": "Port of Salalah", "country": "Oman", "latitude": 16.9444, "longitude": 54.0044, "capacity": 6500, "congestion_level": 18.0, "status": "operational"},
    {"name": "King Abdulaziz Port (Dammam)", "country": "Saudi Arabia", "latitude": 26.4344, "longitude": 50.1033, "capacity": 7500, "congestion_level": 25.0, "status": "operational"},
    {"name": "Jeddah Islamic Port", "country": "Saudi Arabia", "latitude": 21.4858, "longitude": 39.1925, "capacity": 8000, "congestion_level": 30.0, "status": "operational"},
    {"name": "Port of Hamad (Doha)", "country": "Qatar", "latitude": 25.2861, "longitude": 51.5332, "capacity": 4500, "congestion_level": 20.0, "status": "operational"},
    {"name": "Port of Aden", "country": "Yemen", "latitude": 12.7855, "longitude": 45.0187, "capacity": 3500, "congestion_level": 22.0, "status": "operational"},

    # Europe & Mediterranean
    {"name": "Port of Rotterdam", "country": "Netherlands", "latitude": 51.9244, "longitude": 4.4777, "capacity": 25000, "congestion_level": 20.0, "status": "operational"},
    {"name": "Port of Antwerp-Bruges", "country": "Belgium", "latitude": 51.2194, "longitude": 4.4025, "capacity": 21000, "congestion_level": 24.0, "status": "operational"},
    {"name": "Port of Hamburg", "country": "Germany", "latitude": 53.5511, "longitude": 9.9937, "capacity": 16000, "congestion_level": 26.0, "status": "operational"},
    {"name": "Port of Felixstowe", "country": "United Kingdom", "latitude": 51.9634, "longitude": 1.3511, "capacity": 9000, "congestion_level": 25.0, "status": "operational"},
    {"name": "Port of Southampton", "country": "United Kingdom", "latitude": 50.9097, "longitude": -1.4044, "capacity": 6500, "congestion_level": 18.0, "status": "operational"},
    {"name": "Port of Le Havre", "country": "France", "latitude": 49.4944, "longitude": 0.1079, "capacity": 7000, "congestion_level": 21.0, "status": "operational"},
    {"name": "Port of Algeciras", "country": "Spain", "latitude": 36.1408, "longitude": -5.4562, "capacity": 11500, "congestion_level": 24.0, "status": "operational"},
    {"name": "Port of Valencia", "country": "Spain", "latitude": 39.4699, "longitude": -0.3763, "capacity": 10000, "congestion_level": 28.0, "status": "operational"},
    {"name": "Port of Barcelona", "country": "Spain", "latitude": 41.3851, "longitude": 2.1734, "capacity": 8500, "congestion_level": 22.0, "status": "operational"},
    {"name": "Port of Genoa", "country": "Italy", "latitude": 44.4056, "longitude": 8.9463, "capacity": 7000, "congestion_level": 23.0, "status": "operational"},
    {"name": "Port of Piraeus (Athens)", "country": "Greece", "latitude": 37.9429, "longitude": 23.6469, "capacity": 10500, "congestion_level": 27.0, "status": "operational"},
    {"name": "Port of Istanbul", "country": "Turkey", "latitude": 41.0082, "longitude": 28.9784, "capacity": 6000, "congestion_level": 32.0, "status": "operational"},
    {"name": "Port of Gothenburg", "country": "Sweden", "latitude": 57.7089, "longitude": 11.9746, "capacity": 4500, "congestion_level": 14.0, "status": "operational"},

    # Americas
    {"name": "Port of Los Angeles", "country": "United States", "latitude": 33.7432, "longitude": -118.2673, "capacity": 16000, "congestion_level": 40.0, "status": "operational"},
    {"name": "Port of Long Beach", "country": "United States", "latitude": 33.7701, "longitude": -118.1937, "capacity": 15000, "congestion_level": 38.0, "status": "operational"},
    {"name": "Port of Oakland (San Francisco)", "country": "United States", "latitude": 37.8044, "longitude": -122.2712, "capacity": 7500, "congestion_level": 25.0, "status": "operational"},
    {"name": "Port of Seattle", "country": "United States", "latitude": 47.6062, "longitude": -122.3321, "capacity": 6500, "congestion_level": 20.0, "status": "operational"},
    {"name": "Port of Vancouver", "country": "Canada", "latitude": 49.2827, "longitude": -123.1207, "capacity": 8500, "congestion_level": 26.0, "status": "operational"},
    {"name": "Port of New York & New Jersey", "country": "United States", "latitude": 40.6892, "longitude": -74.0445, "capacity": 14000, "congestion_level": 35.0, "status": "operational"},
    {"name": "Port of Savannah", "country": "United States", "latitude": 32.0809, "longitude": -81.0912, "capacity": 9500, "congestion_level": 30.0, "status": "operational"},
    {"name": "Port of Houston", "country": "United States", "latitude": 29.7604, "longitude": -95.3698, "capacity": 11000, "congestion_level": 32.0, "status": "operational"},
    {"name": "Port of Miami", "country": "United States", "latitude": 25.7617, "longitude": -80.1918, "capacity": 5500, "congestion_level": 22.0, "status": "operational"},
    {"name": "Port of New Orleans", "country": "United States", "latitude": 29.9511, "longitude": -90.0715, "capacity": 6000, "congestion_level": 24.0, "status": "operational"},
    {"name": "Port of Balboa (Panama Pacific)", "country": "Panama", "latitude": 8.9580, "longitude": -79.5664, "capacity": 8500, "congestion_level": 42.0, "status": "operational"},
    {"name": "Port of Colon (Panama Atlantic)", "country": "Panama", "latitude": 9.3598, "longitude": -79.9015, "capacity": 9000, "congestion_level": 44.0, "status": "operational"},
    {"name": "Port of Santos", "country": "Brazil", "latitude": -23.9608, "longitude": -46.3331, "capacity": 8000, "congestion_level": 30.0, "status": "operational"},
    {"name": "Port of Rio de Janeiro", "country": "Brazil", "latitude": -22.9068, "longitude": -43.1729, "capacity": 5500, "congestion_level": 24.0, "status": "operational"},
    {"name": "Port of Buenos Aires", "country": "Argentina", "latitude": -34.6037, "longitude": -58.3816, "capacity": 4500, "congestion_level": 22.0, "status": "operational"},
    {"name": "Port of Callao (Lima)", "country": "Peru", "latitude": -12.0565, "longitude": -77.1356, "capacity": 5000, "congestion_level": 25.0, "status": "operational"},
    {"name": "Port of Valparaiso", "country": "Chile", "latitude": -33.0472, "longitude": -71.6127, "capacity": 4000, "congestion_level": 18.0, "status": "operational"},
    {"name": "Port of Cartagena", "country": "Colombia", "latitude": 10.3910, "longitude": -75.4794, "capacity": 6000, "congestion_level": 20.0, "status": "operational"},

    # Africa
    {"name": "Port of Cape Town", "country": "South Africa", "latitude": -33.9189, "longitude": 18.4233, "capacity": 6500, "congestion_level": 18.0, "status": "operational"},
    {"name": "Port of Durban", "country": "South Africa", "latitude": -29.8587, "longitude": 31.0218, "capacity": 8500, "congestion_level": 36.0, "status": "operational"},
    {"name": "Port Said (Suez Canal)", "country": "Egypt", "latitude": 31.2653, "longitude": 32.3019, "capacity": 9000, "congestion_level": 60.0, "status": "operational"},
    {"name": "Port of Alexandria", "country": "Egypt", "latitude": 31.2001, "longitude": 29.9187, "capacity": 7000, "congestion_level": 35.0, "status": "operational"},
    {"name": "Port of Casablanca", "country": "Morocco", "latitude": 33.5731, "longitude": -7.5898, "capacity": 6000, "congestion_level": 22.0, "status": "operational"},
    {"name": "Port of Tangier Med", "country": "Morocco", "latitude": 35.8872, "longitude": -5.5034, "capacity": 12000, "congestion_level": 28.0, "status": "operational"},
    {"name": "Port of Djibouti", "country": "Djibouti", "latitude": 11.5721, "longitude": 43.1456, "capacity": 5500, "congestion_level": 24.0, "status": "operational"},
    {"name": "Port of Mombasa", "country": "Kenya", "latitude": -4.0435, "longitude": 39.6682, "capacity": 5000, "congestion_level": 30.0, "status": "operational"},
    {"name": "Port of Dar es Salaam", "country": "Tanzania", "latitude": -6.7924, "longitude": 39.2083, "capacity": 4500, "congestion_level": 34.0, "status": "operational"},
    {"name": "Port of Lagos (Apapa)", "country": "Nigeria", "latitude": 6.4474, "longitude": 3.3607, "capacity": 5500, "congestion_level": 52.0, "status": "operational"}
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

SEED_DEBRIS: List[Dict[str, Any]] = [
    {
        "latitude": 5.82,
        "longitude": 80.65,
        "debris_type": "plastic_patch",
        "estimated_mass_kg": 1200.0,
        "estimated_volume_m3": 4.0,
        "estimated_size_m2": 2400.0,
        "density_category": "high",
        "severity": 78.5,
        "clean_up_priority": "high",
        "status": "detected",
        "source": "satellite_sentinel2",
        "description": "Dense micro-and-macro-plastic gyre accumulation off southern Sri Lanka shipping lane."
    },
    {
        "latitude": 4.12,
        "longitude": 99.45,
        "debris_type": "ghost_net",
        "estimated_mass_kg": 1450.0,
        "estimated_volume_m3": 3.2,
        "estimated_size_m2": 850.0,
        "density_category": "critical",
        "severity": 92.0,
        "clean_up_priority": "urgent",
        "status": "monitoring",
        "source": "vessel_report",
        "description": "Submerged monofilament nylon ghost net cluster entangling local marine fauna."
    },
    {
        "latitude": 11.25,
        "longitude": 74.30,
        "debris_type": "container_hazard",
        "estimated_mass_kg": 8500.0,
        "estimated_volume_m3": 67.0,
        "estimated_size_m2": 180.0,
        "density_category": "critical",
        "severity": 95.0,
        "clean_up_priority": "urgent",
        "status": "dispatch_scheduled",
        "source": "synthetic_radar",
        "description": "Semi-submerged 40ft shipping container adrift, posing immediate collision danger to shallow drafts."
    },
    {
        "latitude": 1.45,
        "longitude": 104.20,
        "debris_type": "chemical_slick",
        "estimated_mass_kg": 3200.0,
        "estimated_volume_m3": 3.5,
        "estimated_size_m2": 1500.0,
        "density_category": "medium",
        "severity": 68.0,
        "clean_up_priority": "medium",
        "status": "detected",
        "source": "coastal_patrol",
        "description": "Degraded hydrocarbon sheen with surfactant foam accumulation near eastern Singapore anchorage."
    },
    {
        "latitude": 7.80,
        "longitude": 78.90,
        "debris_type": "microplastic_cluster",
        "estimated_mass_kg": 750.0,
        "estimated_volume_m3": 2.0,
        "estimated_size_m2": 5200.0,
        "density_category": "medium",
        "severity": 54.0,
        "clean_up_priority": "medium",
        "status": "monitoring",
        "source": "buoy_sensor_array",
        "description": "Diffuse particulate convergence along equatorial tidal front."
    }
]

SEED_ALERTS: List[Dict[str, Any]] = [
    {
        "alert_type": "zone_incursion",
        "severity": "critical",
        "message": "Vessel trajectory projected within 1.5nm of Sri Lanka Cetacean Sanctuary boundary.",
        "details": "Automated alert generated by Compliance Agent. Recommended speed reduction to < 10 kts.",
        "acknowledged": False,
        "status": "active"
    },
    {
        "alert_type": "debris_proximity",
        "severity": "warning",
        "message": "Submerged ghost net hazard detected 4.2nm east of Malacca Strait northbound track.",
        "details": "Reported by Debris Sentinel Agent. Notice to Mariners broadcast recommended.",
        "acknowledged": False,
        "status": "active"
    },
    {
        "alert_type": "weather_warning",
        "severity": "warning",
        "message": "Monsoon swell approaching Arabian Sea corridor; significant wave height > 3.8m.",
        "details": "Advisory issued for container feeder vessels with draft < 8m.",
        "acknowledged": True,
        "status": "investigating"
    }
]

SEED_MISSIONS: List[Dict[str, Any]] = [
    {
        "mission_name": "Operation OceanSweep - Sri Lanka South",
        "mission_type": "debris_cleanup",
        "status": "active",
        "priority": "high",
        "target_lat": 5.82,
        "target_lon": 80.65,
        "parameters": json.dumps({"target_material": "plastic_patch", "containment_boom_m": 400})
    },
    {
        "mission_name": "Biosphere Sanctuary Patrol Alpha",
        "mission_type": "patrol",
        "status": "active",
        "priority": "urgent",
        "target_lat": 8.0,
        "target_lon": 77.5,
        "parameters": json.dumps({"target_zone": "Gulf of Mannar Biosphere Reserve", "inspection_target": "illegal_trawling"})
    },
    {
        "mission_name": "Monsoon Environmental Survey",
        "mission_type": "survey",
        "status": "pending",
        "priority": "medium",
        "target_lat": 10.0,
        "target_lon": 75.0,
        "parameters": json.dumps({"scientific_lead": "RV Discovery", "instruments": ["CTD", "HydrophoneArray"]})
    }
]

SEED_INCIDENTS: List[Dict[str, Any]] = [
    {
        "title": "Adrift Shipping Container Sighting",
        "incident_type": "debris_hazard",
        "severity": "severe",
        "location_lat": 11.25,
        "location_lon": 74.30,
        "description": "Partially submerged steel container sighted adrift by coastal feeder ship.",
        "status": "contained"
    },
    {
        "title": "Minor Bunker Sheen in Anchorage",
        "incident_type": "oil_spill",
        "severity": "minor",
        "location_lat": 1.45,
        "location_lon": 104.20,
        "description": "Small localized sheen observed during refueling operation. Absorbent pads deployed.",
        "status": "under_investigation"
    }
]


def seed_database(db: Session):
    """Seed initial deterministic dataset if tables are empty."""
    now = datetime.datetime.now(datetime.timezone.utc)

    # 1. Vessels
    if db.query(Vessel).count() == 0:
        for v_data in SEED_VESSELS:
            db.add(Vessel(**v_data))
        db.commit()

    # 2. Ports (upsert any missing ports so all global ports are available)
    existing_port_names = {p[0] for p in db.query(Port.name).all()}
    for p_data in SEED_PORTS:
        if p_data["name"] not in existing_port_names:
            db.add(Port(**p_data))
    db.commit()

    # 3. Marine Zones
    if db.query(MarineZone).count() == 0:
        for z_data in SEED_ZONES:
            db.add(MarineZone(**z_data))
        db.commit()

    # 4. Debris
    if db.query(Debris).count() == 0:
        for d_data in SEED_DEBRIS:
            db.add(Debris(**d_data))
        db.commit()

    # 5. Alerts
    if db.query(Alert).count() == 0:
        for a_data in SEED_ALERTS:
            db.add(Alert(**a_data))
        db.commit()

    # 6. Missions
    if db.query(Mission).count() == 0:
        for m_data in SEED_MISSIONS:
            db.add(Mission(**m_data))
        db.commit()

    # 7. Incidents
    if db.query(Incident).count() == 0:
        for i_data in SEED_INCIDENTS:
            db.add(Incident(**i_data))
        db.commit()

    # 8. Seed realistic historical track breadcrumbs for underway vessels
    if db.query(Track).count() == 0:
        underway_vessels = db.query(Vessel).filter(Vessel.status == "underway").all()
        for vessel in underway_vessels:
            # Generate 8 historical breadcrumbs tracing back along heading
            base_lat = vessel.latitude
            base_lon = vessel.longitude

            for step in range(8, 0, -1):
                # Offset in opposite direction of heading
                dist_deg = (step * 0.15)
                t_lat = base_lat - (dist_deg * 0.8)
                t_lon = base_lon - (dist_deg * 0.8)
                ts = now - datetime.timedelta(minutes=step * 20)

                db.add(Track(
                    vessel_id=vessel.id,
                    latitude=round(t_lat, 6),
                    longitude=round(t_lon, 6),
                    speed_knots=round(max(8.0, vessel.speed_knots - step * 0.2), 1),
                    heading=vessel.heading,
                    status="underway",
                    timestamp=ts
                ))
            # Current point
            db.add(Track(
                vessel_id=vessel.id,
                latitude=vessel.latitude,
                longitude=vessel.longitude,
                speed_knots=vessel.speed_knots,
                heading=vessel.heading,
                status="underway",
                timestamp=now
            ))
        db.commit()

    # 9. Baseline Route, Voyage #1, and RouteVersion #1 for Lineage History
    if db.query(Voyage).count() == 0:
        vessel1 = db.query(Vessel).filter(Vessel.id == 1).first()
        if vessel1:
            baseline_coords = [
                [72.8364, 18.9438],
                [73.0, 15.0],
                [75.0, 10.0],
                [77.5, 6.0],
                [80.5, 5.7],
                [85.0, 5.5],
                [90.0, 5.5],
                [95.5, 5.5],
                [98.0, 4.0],
                [101.3, 2.8],
                [103.8520, 1.2903]
            ]
            init_route = Route(
                name="Baseline Commercial Corridor (Mumbai → Singapore)",
                origin_lat=18.9438,
                origin_lon=72.8364,
                destination_lat=1.2903,
                destination_lon=103.8520,
                distance_km=4230.5,
                estimated_time_hours=145.0,
                estimated_fuel_liters=185000.0,
                estimated_co2_kg=577200.0,
                estimated_cost=157250.0,
                risk_score=24.0,
                environmental_score=82.0,
                optimization_score=88.5,
                optimization_mode="balanced",
                geometry_geojson=json.dumps({"type": "LineString", "coordinates": baseline_coords}),
                created_at=now - datetime.timedelta(hours=12)
            )
            db.add(init_route)
            db.commit()
            db.refresh(init_route)

            init_voyage = Voyage(
                id=1,
                vessel_id=vessel1.id,
                route_id=init_route.id,
                status="active",
                departure_time=now - datetime.timedelta(hours=12),
                estimated_arrival=now + datetime.timedelta(hours=133),
                starting_fuel=vessel1.current_fuel_liters,
                estimated_fuel=init_route.estimated_fuel_liters,
                fuel_saved=0.0,
                co2_estimated=init_route.estimated_co2_kg,
                created_at=now - datetime.timedelta(hours=12)
            )
            db.add(init_voyage)
            db.commit()
            db.refresh(init_voyage)

            init_version = RouteVersion(
                voyage_id=init_voyage.id,
                version_number=1,
                route_id=init_route.id,
                trigger_event="INITIAL_OPTIMIZATION",
                change_reason="Initial baseline multi-objective voyage corridor planned and approved by Fleet Command.",
                risk_score=24.0,
                fuel_liters=185000.0,
                eta_hours=145.0,
                co2_kg=577200.0,
                risk_reduction_pct=0.0,
                fuel_change_pct=0.0,
                eta_change_hours=0.0,
                explanation_json=json.dumps({
                    "reasons": ["Optimal deep-water shipping fairway avoiding coastal shallows and heavy nearshore traffic."],
                    "tradeoffs": {"safety_gain_points": 0, "fuel_delta_pct": 0, "distance_delta_km": 0}
                }),
                status="active",
                created_at=now - datetime.timedelta(hours=12)
            )
            db.add(init_version)
            db.commit()
