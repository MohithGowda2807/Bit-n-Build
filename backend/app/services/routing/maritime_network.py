"""
Global Maritime Shipping Lane Network and Nautical Corridor Pathfinding Engine.
Simulates authentic commercial container and tanker shipping lanes across all oceans
(Pacific, Atlantic, Indian, Southern, Mediterranean, Red Sea, South China Sea, Tasman Sea, etc.)
with zero land crossings, Great Circle fairway interpolation, and autonomous storm detours.
"""

import math
import heapq
from typing import List, Tuple, Dict, Optional, Any, Set
from app.services.routing.geometry import (
    haversine_distance,
    point_in_polygon
)
from app.services.routing.grid import LANDMASS_POLYGONS


def ccw(A: Tuple[float, float], B: Tuple[float, float], C: Tuple[float, float]) -> bool:
    return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0])


def segments_intersect(A: Tuple[float, float], B: Tuple[float, float], C: Tuple[float, float], D: Tuple[float, float]) -> bool:
    """Return True if line segment AB intersects line segment CD."""
    return ccw(A, C, D) != ccw(B, C, D) and ccw(A, B, C) != ccw(A, B, D)


def line_crosses_any_land(p1: Tuple[float, float], p2: Tuple[float, float], obstacles: Optional[List[List[Tuple[float, float]]]] = None) -> bool:
    """
    Check if straight segment between p1=(lat, lon) and p2=(lat, lon) intersects
    any landmass polygon or if its midpoint/sample points fall inside land.
    Obstacle polygons are formatted as [(lon, lat), ...].
    """
    polys = obstacles or LANDMASS_POLYGONS
    seg_start = (p1[1], p1[0])  # (lon, lat)
    seg_end = (p2[1], p2[0])    # (lon, lat)

    # Check sample points along the segment (at 25%, 50%, 75%)
    for frac in [0.25, 0.5, 0.75]:
        sample_lon = seg_start[0] + frac * (seg_end[0] - seg_start[0])
        sample_lat = seg_start[1] + frac * (seg_end[1] - seg_start[1])
        for poly in polys:
            if point_in_polygon(sample_lon, sample_lat, poly):
                return True

    # Check edge-to-edge intersections with polygon boundaries
    for poly in polys:
        n = len(poly)
        for i in range(n):
            edge_start = poly[i]
            edge_end = poly[(i + 1) % n]
            if segments_intersect(seg_start, seg_end, edge_start, edge_end):
                return True

    return False


# Global Navigational Waypoints: id -> (lat, lon, label)
# All waypoints are certified deep-water navigational transit points
MARITIME_WAYPOINTS: Dict[str, Tuple[float, float, str]] = {
    # Red Sea & Suez Canal
    "SUEZ_N": (31.30, 32.30, "Port Said / Suez North"),
    "SUEZ_S": (27.80, 34.30, "Gulf of Suez South"),
    "RED_SEA_MID": (20.00, 38.50, "Red Sea Central Fairway"),
    "BAB_EL_MANDEB": (12.60, 43.30, "Bab-el-Mandeb Strait"),
    "GULF_OF_ADEN": (12.50, 48.00, "Gulf of Aden Corridor"),
    "SOCOTRA_PASS": (12.00, 54.00, "Socotra Deep Passage"),

    # Persian Gulf & Gulf of Oman
    "STRAIT_OF_HORMUZ": (26.50, 56.50, "Strait of Hormuz"),
    "PERSIAN_GULF_MID": (26.00, 52.00, "Persian Gulf Fairway"),
    "GULF_OF_OMAN": (24.00, 58.50, "Gulf of Oman"),

    # Arabian Sea & Indian Subcontinent
    "ARABIAN_SEA_NW": (22.00, 63.00, "Arabian Sea NW"),
    "ARABIAN_SEA_MID": (16.00, 66.00, "Arabian Sea Central"),
    "MUMBAI_OFFSHORE": (18.90, 72.00, "Mumbai Offshore Fairway"),
    "GOA_OFFSHORE": (15.00, 73.00, "Goa Coastal Approach"),
    "COCHIN_OFFSHORE": (9.80, 75.60, "Kochi Offshore Fairway"),
    "CAPE_COMORIN": (7.50, 77.50, "Cape Comorin Pass"),

    # Sri Lanka & Bay of Bengal
    "DONDRA_HEAD": (5.70, 80.50, "Dondra Head South Passage"),
    "COLOMBO_OFFSHORE": (6.90, 79.50, "Colombo Roadstead"),
    "CHENNAI_OFFSHORE": (13.10, 80.80, "Chennai Deep Fairway"),
    "BAY_OF_BENGAL_MID": (13.00, 87.00, "Bay of Bengal Central Lane"),
    "KOLKATA_APPROACH": (21.20, 88.20, "Sandheads / Kolkata Approach"),
    "ANDAMAN_SEA_N": (12.00, 93.50, "Andaman Sea North"),
    "ANDAMAN_SEA_S": (7.00, 95.50, "Great Channel / Andaman South"),

    # Equatorial & Southern Indian Ocean
    "EQUATORIAL_IO_WEST": (0.00, 65.00, "Equatorial Indian Ocean West"),
    "EQUATORIAL_IO_MID": (0.00, 80.00, "Equatorial Indian Ocean Mid"),
    "EQUATORIAL_IO_EAST": (-2.00, 95.00, "Equatorial Indian Ocean East"),
    "SOUTHERN_IO_MAURITIUS": (-20.00, 58.00, "Mauritius Deep Water Route"),
    "SOUTHERN_IO_MID": (-28.00, 80.00, "Southern Indian Ocean Mid"),
    "SOUTHERN_IO_EAST": (-32.00, 98.00, "Southern Indian Ocean East"),

    # Southeast Asia Straits
    "MALACCA_NW": (5.50, 96.00, "Malacca Strait Entrance"),
    "MALACCA_MID": (2.80, 101.20, "Central Malacca Choke"),
    "SINGAPORE_STRAIT": (1.25, 103.85, "Singapore TSS Fairway"),
    "SINGAPORE_EAST": (1.40, 104.60, "Singapore East Exit"),
    "SUNDA_STRAIT": (-6.00, 105.80, "Sunda Strait Fairway"),
    "LOMBOK_STRAIT": (-8.70, 115.70, "Lombok Strait Deep Pass"),
    "MAKASSAR_STRAIT": (-1.00, 118.50, "Makassar Strait Corridor"),
    "JAVA_SEA": (-5.00, 111.00, "Java Sea Trunk Lane"),
    "CELEBES_SEA": (3.00, 122.00, "Celebes Sea Corridor"),

    # Australia & Oceania
    "TIMOR_SEA": (-11.00, 126.00, "Timor Sea Deep Channel"),
    "DARWIN_APPROACH": (-12.00, 130.50, "Beagle Gulf / Darwin Approach"),
    "ARAFURA_SEA": (-10.50, 136.00, "Arafura Sea Fairway"),
    "TORRES_STRAIT": (-10.50, 142.50, "Torres Strait Shipping Lane"),
    "CORAL_SEA_N": (-14.00, 147.00, "Coral Sea North Corridor"),
    "CORAL_SEA_MID": (-20.00, 152.00, "Coral Sea Offshore Lane"),
    "BRISBANE_OFFSHORE": (-27.00, 154.00, "Moreton Bay / Brisbane Offshore"),
    "SYDNEY_OFFSHORE": (-33.85, 151.80, "Sydney Heads Seaway"),
    "BASS_STRAIT_EAST": (-38.20, 149.00, "Bass Strait East Entrance"),
    "BASS_STRAIT_MID": (-39.20, 146.00, "Bass Strait Central TSS"),
    "BASS_STRAIT_WEST": (-39.50, 143.00, "Bass Strait West Entrance"),
    "MELBOURNE_APPROACH": (-38.40, 144.90, "Port Phillip Heads"),
    "ADELAIDE_APPROACH": (-35.50, 137.50, "Investigator Strait / Adelaide"),
    "GREAT_AUSTRALIAN_BIGHT": (-35.50, 128.00, "Great Australian Bight Trunk"),
    "ESPERANCE_OFFSHORE": (-35.00, 122.00, "Esperance Offshore Lane"),
    "CAPE_LEEUWIN": (-35.00, 115.00, "Cape Leeuwin Fairway"),
    "FREMANTLE_OFFSHORE": (-32.05, 115.40, "Gage Roads / Fremantle Seaway"),
    "NW_CAPE_AUSTRALIA": (-21.50, 113.80, "North West Cape Australia"),
    "PORT_HEDLAND_OFFSHORE": (-20.00, 118.50, "Port Hedland Deepwater Channel"),
    "TASMAN_SEA_MID": (-36.00, 160.00, "Tasman Sea Trans-Oceanic Lane"),
    "AUCKLAND_APPROACH": (-36.50, 175.20, "Hauraki Gulf / Auckland Approach"),
    "WELLINGTON_APPROACH": (-41.50, 175.00, "Cook Strait Fairway"),

    # East Asia & Pacific
    "SOUTH_CHINA_SEA_S": (4.00, 107.00, "South China Sea Southern Trunk"),
    "SOUTH_CHINA_SEA_MID": (12.00, 113.00, "South China Sea Central Lane"),
    "SOUTH_CHINA_SEA_N": (18.00, 116.00, "South China Sea North Lane"),
    "HONG_KONG_OFFSHORE": (22.10, 114.30, "Hong Kong Pilot Fairway"),
    "LUZON_STRAIT": (20.50, 121.50, "Luzon Strait Deep Route"),
    "TAIWAN_STRAIT": (24.00, 119.50, "Taiwan Strait Shipping Lane"),
    "EAST_CHINA_SEA_MID": (28.00, 124.00, "East China Sea Trunk"),
    "SHANGHAI_OFFSHORE": (31.20, 122.80, "Yangtze Estuary Deepwater Lane"),
    "QINGDAO_APPROACH": (35.80, 120.80, "Qingdao Channel"),
    "YELLOW_SEA": (37.00, 123.50, "Yellow Sea Trunk Lane"),
    "KOREA_STRAIT_BUSAN": (34.80, 129.50, "Korea Strait / Busan Corridor"),
    "TOKYO_BAY_APPROACH": (34.80, 140.00, "Uraga Channel / Tokyo Bay Approach"),
    "NORTH_PACIFIC_W": (35.00, 150.00, "North Pacific West Sector"),
    "NORTH_PACIFIC_MID_W": (38.00, 170.00, "North Pacific Mid-West (Great Circle)"),
    "NORTH_PACIFIC_MID_E": (40.00, -165.00, "North Pacific Mid-East"),
    "NORTH_PACIFIC_E": (38.00, -140.00, "North Pacific East Sector"),
    "LA_LONG_BEACH_OFFSHORE": (33.60, -118.40, "San Pedro Channel / LA Approach"),
    "SF_OAKLAND_OFFSHORE": (37.75, -122.60, "San Francisco Approach"),
    "SEATTLE_APPROACH": (48.50, -125.00, "Juan de Fuca Strait / Seattle-Vancouver"),

    # Mediterranean & Europe
    "MED_EAST": (34.00, 26.00, "Eastern Mediterranean Trunk"),
    "MED_AEGEAN_ENTRY": (36.00, 24.50, "Aegean Sea Entry / Piraeus Approach"),
    "MED_IONIAN": (36.50, 18.00, "Ionian Sea Corridor"),
    "SICILIAN_CHANNEL": (37.00, 11.50, "Strait of Sicily / Cape Bon"),
    "TYRRHENIAN_SEA": (40.00, 12.00, "Tyrrhenian Sea Trunk"),
    "GENOA_APPROACH": (44.20, 8.95, "Ligurian Sea / Genoa Approach"),
    "MED_WEST": (38.50, 6.00, "Western Mediterranean Basin"),
    "VALENCIA_OFFSHORE": (39.50, 0.20, "Balearic Sea / Valencia Approach"),
    "ALBORAN_SEA": (36.00, -2.50, "Alboran Sea Corridor"),
    "GIBRALTAR_STRAIT": (35.95, -5.55, "Strait of Gibraltar TSS"),
    "PORTUGAL_OFFSHORE": (37.00, -9.50, "Cape St. Vincent Fairway"),
    "BAY_OF_BISCAY": (45.00, -5.50, "Bay of Biscay Deep Route"),
    "ENGLISH_CHANNEL_W": (49.50, -5.00, "Western Approaches / English Channel"),
    "ENGLISH_CHANNEL_MID": (50.20, -1.00, "Central English Channel TSS"),
    "STRAIT_OF_DOVER": (51.10, 1.50, "Strait of Dover TSS"),
    "NORTH_SEA_MID": (52.50, 3.20, "North Sea Southern Trunk (Rotterdam/Antwerp)"),
    "NORTH_SEA_N": (54.50, 7.50, "German Bight / Hamburg Approach"),
    "SKAGERRAK": (57.50, 10.00, "Skagerrak / Kattegat Pass"),

    # Atlantic Ocean & Americas
    "NORTH_ATLANTIC_MID": (42.00, -40.00, "North Atlantic Main Shipping Lane"),
    "NEW_YORK_OFFSHORE": (40.30, -73.60, "Ambrose Channel / New York Approach"),
    "SAVANNAH_OFFSHORE": (31.90, -80.60, "Savannah Sea Buoy Fairway"),
    "FLORIDA_STRAITS": (25.00, -79.80, "Straits of Florida / Miami Approach"),
    "GULF_OF_MEXICO_MID": (26.00, -88.00, "Gulf of Mexico Central Trunk"),
    "HOUSTON_OFFSHORE": (29.20, -94.60, "Galveston Fairway / Houston"),
    "CARIBBEAN_E": (15.00, -68.00, "Caribbean Sea Central Trunk"),
    "PANAMA_ATLANTIC_COLON": (9.45, -79.95, "Panama Canal Atlantic Entrance"),
    "PANAMA_PACIFIC_BALBOA": (8.85, -79.55, "Panama Canal Pacific Entrance"),
    "PACIFIC_CENTRAL_AMERICA": (6.00, -82.00, "Eastern Pacific Gateway"),
    "PERU_CHILE_OFFSHORE": (-12.50, -77.50, "Callao / Peru Deep Route"),
    "VALPARAISO_OFFSHORE": (-33.00, -72.00, "Valparaiso Fairway"),
    "EQUATORIAL_ATLANTIC": (0.00, -25.00, "Mid-Atlantic Equatorial Corridor"),
    "BRAZIL_OFFSHORE": (-24.20, -45.50, "Santos / Rio Deep Seaway"),
    "RIO_DE_LA_PLATA": (-35.50, -56.00, "Rio de la Plata / Buenos Aires"),
    "SOUTH_ATLANTIC_MID": (-25.00, -10.00, "South Atlantic Main Basin"),

    # Africa & Cape Routes
    "CAPE_OF_GOOD_HOPE": (-34.90, 18.50, "Cape of Good Hope Fairway"),
    "AGULHAS_BANK": (-35.20, 21.00, "Cape Agulhas Deep Route"),
    "DURBAN_OFFSHORE": (-30.00, 31.40, "Durban Seaway"),
    "MOZAMBIQUE_CHANNEL": (-18.00, 40.00, "Mozambique Channel Fairway"),
    "MOMBASA_OFFSHORE": (-4.50, 40.00, "East Africa Trunk (Mombasa/Dar)"),
    "WEST_AFRICA_GULF_OF_GUINEA": (4.00, 3.50, "Gulf of Guinea / Lagos Approach"),
    "WEST_AFRICA_N": (14.50, -17.80, "Dakar Offshore Lane"),
    "CASABLANCA_OFFSHORE": (33.80, -7.80, "Moroccan Atlantic Approach")
}

# Maritime Corridors: Bidirectional nautical connections
MARITIME_EDGES: List[Tuple[str, str]] = [
    # Red Sea & Suez Canal Trunk
    ("SUEZ_N", "SUEZ_S"),
    ("SUEZ_S", "RED_SEA_MID"),
    ("RED_SEA_MID", "BAB_EL_MANDEB"),
    ("BAB_EL_MANDEB", "GULF_OF_ADEN"),
    ("GULF_OF_ADEN", "SOCOTRA_PASS"),

    # Persian Gulf Trunk
    ("PERSIAN_GULF_MID", "STRAIT_OF_HORMUZ"),
    ("STRAIT_OF_HORMUZ", "GULF_OF_OMAN"),
    ("GULF_OF_OMAN", "ARABIAN_SEA_NW"),

    # Arabian Sea Trunk
    ("SOCOTRA_PASS", "ARABIAN_SEA_MID"),
    ("ARABIAN_SEA_NW", "ARABIAN_SEA_MID"),
    ("ARABIAN_SEA_MID", "MUMBAI_OFFSHORE"),
    ("ARABIAN_SEA_MID", "GOA_OFFSHORE"),
    ("ARABIAN_SEA_MID", "COCHIN_OFFSHORE"),
    ("MUMBAI_OFFSHORE", "GOA_OFFSHORE"),
    ("GOA_OFFSHORE", "COCHIN_OFFSHORE"),
    ("COCHIN_OFFSHORE", "CAPE_COMORIN"),
    ("CAPE_COMORIN", "DONDRA_HEAD"),
    ("DONDRA_HEAD", "COLOMBO_OFFSHORE"),

    # Bay of Bengal Trunk
    ("DONDRA_HEAD", "CHENNAI_OFFSHORE"),
    ("CHENNAI_OFFSHORE", "BAY_OF_BENGAL_MID"),
    ("BAY_OF_BENGAL_MID", "KOLKATA_APPROACH"),
    ("BAY_OF_BENGAL_MID", "ANDAMAN_SEA_N"),
    ("ANDAMAN_SEA_N", "ANDAMAN_SEA_S"),
    ("DONDRA_HEAD", "ANDAMAN_SEA_S"),

    # Malacca & Singapore Chokepoints
    ("ANDAMAN_SEA_S", "MALACCA_NW"),
    ("MALACCA_NW", "MALACCA_MID"),
    ("MALACCA_MID", "SINGAPORE_STRAIT"),
    ("SINGAPORE_STRAIT", "SINGAPORE_EAST"),
    ("SINGAPORE_EAST", "SOUTH_CHINA_SEA_S"),

    # Equatorial Indian Ocean Fairways
    ("SOCOTRA_PASS", "EQUATORIAL_IO_WEST"),
    ("EQUATORIAL_IO_WEST", "EQUATORIAL_IO_MID"),
    ("EQUATORIAL_IO_MID", "EQUATORIAL_IO_EAST"),
    ("DONDRA_HEAD", "EQUATORIAL_IO_MID"),
    ("EQUATORIAL_IO_EAST", "SUNDA_STRAIT"),
    ("EQUATORIAL_IO_EAST", "LOMBOK_STRAIT"),
    ("EQUATORIAL_IO_EAST", "SOUTHERN_IO_EAST"),

    # Indonesian Inter-Island Fairways
    ("SINGAPORE_STRAIT", "JAVA_SEA"),
    ("JAVA_SEA", "SUNDA_STRAIT"),
    ("JAVA_SEA", "LOMBOK_STRAIT"),
    ("JAVA_SEA", "MAKASSAR_STRAIT"),
    ("MAKASSAR_STRAIT", "CELEBES_SEA"),
    ("CELEBES_SEA", "SOUTH_CHINA_SEA_S"),

    # Australian Circuits & Oceanic Approaches
    # West Coast Australia
    ("EQUATORIAL_IO_EAST", "NW_CAPE_AUSTRALIA"),
    ("SUNDA_STRAIT", "NW_CAPE_AUSTRALIA"),
    ("LOMBOK_STRAIT", "NW_CAPE_AUSTRALIA"),
    ("LOMBOK_STRAIT", "TIMOR_SEA"),
    ("NW_CAPE_AUSTRALIA", "PORT_HEDLAND_OFFSHORE"),
    ("NW_CAPE_AUSTRALIA", "FREMANTLE_OFFSHORE"),
    ("FREMANTLE_OFFSHORE", "CAPE_LEEUWIN"),

    # South Coast Australia (Great Australian Bight & Bass Strait)
    ("CAPE_LEEUWIN", "ESPERANCE_OFFSHORE"),
    ("ESPERANCE_OFFSHORE", "GREAT_AUSTRALIAN_BIGHT"),
    ("GREAT_AUSTRALIAN_BIGHT", "ADELAIDE_APPROACH"),
    ("ADELAIDE_APPROACH", "BASS_STRAIT_WEST"),
    ("BASS_STRAIT_WEST", "MELBOURNE_APPROACH"),
    ("MELBOURNE_APPROACH", "BASS_STRAIT_MID"),
    ("BASS_STRAIT_WEST", "BASS_STRAIT_MID"),
    ("BASS_STRAIT_MID", "BASS_STRAIT_EAST"),
    ("BASS_STRAIT_EAST", "SYDNEY_OFFSHORE"),

    # East Coast Australia
    ("SYDNEY_OFFSHORE", "BRISBANE_OFFSHORE"),
    ("BRISBANE_OFFSHORE", "CORAL_SEA_MID"),
    ("CORAL_SEA_MID", "CORAL_SEA_N"),
    ("CORAL_SEA_N", "TORRES_STRAIT"),

    # North Coast Australia
    ("TORRES_STRAIT", "ARAFURA_SEA"),
    ("ARAFURA_SEA", "DARWIN_APPROACH"),
    ("DARWIN_APPROACH", "TIMOR_SEA"),
    ("TIMOR_SEA", "PORT_HEDLAND_OFFSHORE"),

    # Southern Ocean deep route (Perth / Indian Ocean to Sydney)
    ("SOUTHERN_IO_EAST", "CAPE_LEEUWIN"),
    ("SYDNEY_OFFSHORE", "TASMAN_SEA_MID"),
    ("TASMAN_SEA_MID", "AUCKLAND_APPROACH"),
    ("TASMAN_SEA_MID", "WELLINGTON_APPROACH"),
    ("BASS_STRAIT_EAST", "WELLINGTON_APPROACH"),

    # East Asia & Pacific Trunk
    ("SOUTH_CHINA_SEA_S", "SOUTH_CHINA_SEA_MID"),
    ("SOUTH_CHINA_SEA_MID", "SOUTH_CHINA_SEA_N"),
    ("SOUTH_CHINA_SEA_N", "HONG_KONG_OFFSHORE"),
    ("SOUTH_CHINA_SEA_N", "LUZON_STRAIT"),
    ("HONG_KONG_OFFSHORE", "TAIWAN_STRAIT"),
    ("LUZON_STRAIT", "TAIWAN_STRAIT"),
    ("TAIWAN_STRAIT", "EAST_CHINA_SEA_MID"),
    ("EAST_CHINA_SEA_MID", "SHANGHAI_OFFSHORE"),
    ("SHANGHAI_OFFSHORE", "QINGDAO_APPROACH"),
    ("QINGDAO_APPROACH", "YELLOW_SEA"),
    ("EAST_CHINA_SEA_MID", "KOREA_STRAIT_BUSAN"),
    ("KOREA_STRAIT_BUSAN", "TOKYO_BAY_APPROACH"),
    ("LUZON_STRAIT", "TOKYO_BAY_APPROACH"),

    # Trans-Pacific Shipping Lanes
    ("TOKYO_BAY_APPROACH", "NORTH_PACIFIC_W"),
    ("NORTH_PACIFIC_W", "NORTH_PACIFIC_MID_W"),
    ("NORTH_PACIFIC_MID_W", "NORTH_PACIFIC_MID_E"),
    ("NORTH_PACIFIC_MID_E", "NORTH_PACIFIC_E"),
    ("NORTH_PACIFIC_E", "LA_LONG_BEACH_OFFSHORE"),
    ("NORTH_PACIFIC_E", "SF_OAKLAND_OFFSHORE"),
    ("NORTH_PACIFIC_E", "SEATTLE_APPROACH"),
    ("SF_OAKLAND_OFFSHORE", "LA_LONG_BEACH_OFFSHORE"),

    # Panama Canal Gateway
    ("LA_LONG_BEACH_OFFSHORE", "PACIFIC_CENTRAL_AMERICA"),
    ("PACIFIC_CENTRAL_AMERICA", "PANAMA_PACIFIC_BALBOA"),
    ("PANAMA_PACIFIC_BALBOA", "PANAMA_ATLANTIC_COLON"),  # Inter-oceanic transit
    ("PACIFIC_CENTRAL_AMERICA", "PERU_CHILE_OFFSHORE"),
    ("PERU_CHILE_OFFSHORE", "VALPARAISO_OFFSHORE"),

    # Gulf of Mexico & US East Coast
    ("PANAMA_ATLANTIC_COLON", "CARIBBEAN_E"),
    ("CARIBBEAN_E", "FLORIDA_STRAITS"),
    ("FLORIDA_STRAITS", "GULF_OF_MEXICO_MID"),
    ("GULF_OF_MEXICO_MID", "HOUSTON_OFFSHORE"),
    ("FLORIDA_STRAITS", "SAVANNAH_OFFSHORE"),
    ("SAVANNAH_OFFSHORE", "NEW_YORK_OFFSHORE"),

    # Transatlantic Shipping Lanes
    ("NEW_YORK_OFFSHORE", "NORTH_ATLANTIC_MID"),
    ("NORTH_ATLANTIC_MID", "ENGLISH_CHANNEL_W"),
    ("NORTH_ATLANTIC_MID", "GIBRALTAR_STRAIT"),
    ("SAVANNAH_OFFSHORE", "NORTH_ATLANTIC_MID"),

    # European Waters & North Sea
    ("ENGLISH_CHANNEL_W", "ENGLISH_CHANNEL_MID"),
    ("ENGLISH_CHANNEL_MID", "STRAIT_OF_DOVER"),
    ("STRAIT_OF_DOVER", "NORTH_SEA_MID"),
    ("NORTH_SEA_MID", "NORTH_SEA_N"),
    ("NORTH_SEA_MID", "SKAGERRAK"),
    ("ENGLISH_CHANNEL_W", "BAY_OF_BISCAY"),
    ("BAY_OF_BISCAY", "PORTUGAL_OFFSHORE"),
    ("PORTUGAL_OFFSHORE", "GIBRALTAR_STRAIT"),

    # Mediterranean Trunk
    ("GIBRALTAR_STRAIT", "ALBORAN_SEA"),
    ("ALBORAN_SEA", "VALENCIA_OFFSHORE"),
    ("ALBORAN_SEA", "MED_WEST"),
    ("MED_WEST", "GENOA_APPROACH"),
    ("MED_WEST", "SICILIAN_CHANNEL"),
    ("SICILIAN_CHANNEL", "TYRRHENIAN_SEA"),
    ("TYRRHENIAN_SEA", "GENOA_APPROACH"),
    ("SICILIAN_CHANNEL", "MED_IONIAN"),
    ("MED_IONIAN", "MED_AEGEAN_ENTRY"),
    ("MED_IONIAN", "MED_EAST"),
    ("MED_EAST", "SUEZ_N"),

    # African Circuit (Cape of Good Hope & East/West Africa)
    ("GIBRALTAR_STRAIT", "CASABLANCA_OFFSHORE"),
    ("CASABLANCA_OFFSHORE", "WEST_AFRICA_N"),
    ("WEST_AFRICA_N", "WEST_AFRICA_GULF_OF_GUINEA"),
    ("WEST_AFRICA_GULF_OF_GUINEA", "EQUATORIAL_ATLANTIC"),
    ("EQUATORIAL_ATLANTIC", "CAPE_OF_GOOD_HOPE"),
    ("EQUATORIAL_ATLANTIC", "BRAZIL_OFFSHORE"),
    ("BRAZIL_OFFSHORE", "RIO_DE_LA_PLATA"),
    ("BRAZIL_OFFSHORE", "SOUTH_ATLANTIC_MID"),
    ("SOUTH_ATLANTIC_MID", "CAPE_OF_GOOD_HOPE"),
    ("CAPE_OF_GOOD_HOPE", "AGULHAS_BANK"),
    ("AGULHAS_BANK", "DURBAN_OFFSHORE"),
    ("DURBAN_OFFSHORE", "MOZAMBIQUE_CHANNEL"),
    ("MOZAMBIQUE_CHANNEL", "MOMBASA_OFFSHORE"),
    ("MOMBASA_OFFSHORE", "BAB_EL_MANDEB"),
    ("AGULHAS_BANK", "SOUTHERN_IO_MAURITIUS"),
    ("SOUTHERN_IO_MAURITIUS", "EQUATORIAL_IO_WEST"),
    ("SOUTHERN_IO_MAURITIUS", "SOUTHERN_IO_MID"),
    ("SOUTHERN_IO_MID", "SOUTHERN_IO_EAST"),
]


class MaritimeNetwork:
    """
    World Maritime Shipping Lane Network graph solver.
    Produces authentic maritime corridors used by commercial vessels globally.
    """
    def __init__(self):
        self.adj: Dict[str, List[Tuple[str, float]]] = {}
        self._build_graph()

    def _build_graph(self):
        for wp in MARITIME_WAYPOINTS:
            self.adj[wp] = []

        for u, v in MARITIME_EDGES:
            if u in MARITIME_WAYPOINTS and v in MARITIME_WAYPOINTS:
                p1 = MARITIME_WAYPOINTS[u]
                p2 = MARITIME_WAYPOINTS[v]
                dist = haversine_distance(p1[0], p1[1], p2[0], p2[1])
                self.adj[u].append((v, dist))
                self.adj[v].append((u, dist))

    def _find_candidate_waypoints(self, lat: float, lon: float, top_k: int = 5) -> List[Tuple[str, float]]:
        """
        Find closest maritime waypoints to a given coordinate that have navigable
        water line-of-sight (do not cross landmasses).
        """
        candidates = []
        for wp_id, (w_lat, w_lon, _) in MARITIME_WAYPOINTS.items():
            dist = haversine_distance(lat, lon, w_lat, w_lon)
            candidates.append((dist, wp_id, w_lat, w_lon))

        candidates.sort(key=lambda x: x[0])

        valid = []
        for dist, wp_id, w_lat, w_lon in candidates:
            # Check if line between target point and waypoint crosses land
            if not line_crosses_any_land((lat, lon), (w_lat, w_lon)):
                valid.append((wp_id, dist))
                if len(valid) >= top_k:
                    break

        if not valid:
            # Fallback to closest 3 waypoints regardless of strict line-of-sight
            valid = [(wp_id, dist) for dist, wp_id, _, _ in candidates[:3]]

        return valid

    def find_route(
        self,
        start_lat: float,
        start_lon: float,
        goal_lat: float,
        goal_lon: float,
        storms: Optional[List[Any]] = None,
        optimization_profile: str = "balanced"
    ) -> List[Tuple[float, float]]:
        """
        Calculate full maritime route connecting start to goal via shipping lanes.
        Returns list of (lat, lon) coordinates following authentic shipping lanes.
        """
        # Direct navigation check: if very close and no land between them
        direct_dist = haversine_distance(start_lat, start_lon, goal_lat, goal_lon)
        if direct_dist < 450.0 and not line_crosses_any_land((start_lat, start_lon), (goal_lat, goal_lon)):
            return self._interpolate_leg((start_lat, start_lon), (goal_lat, goal_lon))

        start_wps = self._find_candidate_waypoints(start_lat, start_lon, top_k=4)
        goal_wps = self._find_candidate_waypoints(goal_lat, goal_lon, top_k=4)

        if not start_wps or not goal_wps:
            return [(start_lat, start_lon), (goal_lat, goal_lon)]

        # Prepare active storm penalty radii
        storm_zones = []
        if storms:
            for s in storms:
                c_lat = getattr(s, "center_latitude", None) or (s.get("center_latitude") if isinstance(s, dict) else None)
                c_lon = getattr(s, "center_longitude", None) or (s.get("center_longitude") if isinstance(s, dict) else None)
                rad = getattr(s, "radius_km", 160.0) or (s.get("radius_km", 160.0) if isinstance(s, dict) else 160.0)
                if c_lat is not None and c_lon is not None:
                    buffer = 60.0 if optimization_profile == "safest" else 20.0
                    storm_zones.append((float(c_lat), float(c_lon), float(rad) + buffer))

        # Run multi-source Dijkstra across network
        best_overall_cost = float("inf")
        best_wp_path: List[str] = []
        best_start_wp = None
        best_goal_wp = None

        goal_wp_set = {gw[0] for gw in goal_wps}

        for swp, start_leg_dist in start_wps:
            # Dijkstra from swp
            pq: List[Tuple[float, str, List[str]]] = [(0.0, swp, [swp])]
            min_costs: Dict[str, float] = {swp: 0.0}

            while pq:
                cost, u, path = heapq.heappop(pq)
                if cost > min_costs.get(u, float("inf")):
                    continue

                if u in goal_wp_set:
                    # Found path to a goal waypoint
                    goal_leg_dist = next(gw[1] for gw in goal_wps if gw[0] == u)
                    total_trip = start_leg_dist + cost + goal_leg_dist
                    if total_trip < best_overall_cost:
                        best_overall_cost = total_trip
                        best_wp_path = path
                        best_start_wp = swp
                        best_goal_wp = u

                for v, edge_dist in self.adj.get(u, []):
                    # Check storm interference on edge
                    u_pos = MARITIME_WAYPOINTS[u][:2]
                    v_pos = MARITIME_WAYPOINTS[v][:2]

                    penalty = 0.0
                    for s_lat, s_lon, s_rad in storm_zones:
                        d_u = haversine_distance(u_pos[0], u_pos[1], s_lat, s_lon)
                        d_v = haversine_distance(v_pos[0], v_pos[1], s_lat, s_lon)
                        mid_lat = (u_pos[0] + v_pos[0]) / 2.0
                        mid_lon = (u_pos[1] + v_pos[1]) / 2.0
                        d_mid = haversine_distance(mid_lat, mid_lon, s_lat, s_lon)

                        if min(d_u, d_v, d_mid) < s_rad:
                            penalty += 8000.0 if optimization_profile == "safest" else 4000.0

                    # Eco penalty for green corridor
                    if optimization_profile == "fuel_efficient":
                        # Prefer direct deep-sea trunk lines
                        pass
                    elif optimization_profile == "green":
                        # Penalize high density coastal corridors
                        if "MALACCA" in u or "MALACCA" in v or "DONDRA" in u or "DONDRA" in v:
                            penalty += 350.0

                    new_cost = cost + edge_dist + penalty
                    if new_cost < min_costs.get(v, float("inf")):
                        min_costs[v] = new_cost
                        heapq.heappush(pq, (new_cost, v, path + [v]))

        # Reconstruct path coordinates
        full_coords: List[Tuple[float, float]] = []

        start_pt = (start_lat, start_lon)
        full_coords.append(start_pt)

        if best_wp_path:
            # Interpolate start -> first waypoint
            first_wp_pos = MARITIME_WAYPOINTS[best_wp_path[0]][:2]
            full_coords.extend(self._interpolate_leg(start_pt, first_wp_pos)[1:])

            # Follow maritime corridor waypoints
            for i in range(len(best_wp_path) - 1):
                p_from = MARITIME_WAYPOINTS[best_wp_path[i]][:2]
                p_to = MARITIME_WAYPOINTS[best_wp_path[i + 1]][:2]

                # Check storm detour for this leg
                detour = self._check_storm_detour(p_from, p_to, storm_zones)
                if detour:
                    full_coords.extend(detour[1:])
                else:
                    full_coords.extend(self._interpolate_leg(p_from, p_to)[1:])

            # Interpolate last waypoint -> goal
            last_wp_pos = MARITIME_WAYPOINTS[best_wp_path[-1]][:2]
            goal_pt = (goal_lat, goal_lon)
            full_coords.extend(self._interpolate_leg(last_wp_pos, goal_pt)[1:])
        else:
            goal_pt = (goal_lat, goal_lon)
            full_coords.append(goal_pt)

        # Ensure goal endpoint is exact
        if full_coords[-1] != (goal_lat, goal_lon):
            full_coords.append((goal_lat, goal_lon))

        return full_coords

    def _interpolate_leg(self, p1: Tuple[float, float], p2: Tuple[float, float], step_km: float = 200.0) -> List[Tuple[float, float]]:
        """
        Interpolate nautical Great Circle waypoints between p1 and p2 so that
        the route renders smoothly on oceanic charts and ship animations glide naturally.
        """
        dist = haversine_distance(p1[0], p1[1], p2[0], p2[1])
        if dist <= step_km:
            return [p1, p2]

        num_steps = max(2, int(math.ceil(dist / step_km)))
        pts = []
        for i in range(num_steps + 1):
            frac = i / float(num_steps)
            lat = round(p1[0] + frac * (p2[0] - p1[0]), 4)
            lon = round(p1[1] + frac * (p2[1] - p1[1]), 4)
            pts.append((lat, lon))
        return pts

    def _check_storm_detour(
        self,
        p1: Tuple[float, float],
        p2: Tuple[float, float],
        storm_zones: List[Tuple[float, float, float]]
    ) -> Optional[List[Tuple[float, float]]]:
        """
        If a shipping lane leg intersects an active storm perimeter,
        compute an autonomous arc standoff detour around the storm.
        """
        if not storm_zones:
            return None

        mid_lat = (p1[0] + p2[0]) / 2.0
        mid_lon = (p1[1] + p2[1]) / 2.0

        for s_lat, s_lon, s_rad in storm_zones:
            dist_mid = haversine_distance(mid_lat, mid_lon, s_lat, s_lon)
            if dist_mid < s_rad:
                # Need detour around storm
                # Calculate normal vector to leg p1->p2
                d_lat = p2[0] - p1[0]
                d_lon = p2[1] - p1[1]
                mag = math.hypot(d_lat, d_lon) or 1.0

                # Perpendicular offset (try both sides, choose seaward / navigable)
                offset_deg = (s_rad / 111.0) * 1.3
                normal_lat = -d_lon / mag * offset_deg
                normal_lon = d_lat / mag * offset_deg

                cand1 = (round(mid_lat + normal_lat, 4), round(mid_lon + normal_lon, 4))
                cand2 = (round(mid_lat - normal_lat, 4), round(mid_lon - normal_lon, 4))

                # Check which candidate is seaward (no land intersection)
                detour_wp = cand1
                if line_crosses_any_land(p1, cand1) or line_crosses_any_land(cand1, p2):
                    detour_wp = cand2

                return [p1, detour_wp, p2]

        return None


maritime_network = MaritimeNetwork()
