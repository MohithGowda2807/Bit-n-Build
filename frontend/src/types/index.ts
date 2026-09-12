export interface Vessel {
  id: number;
  vessel_identifier: string;
  name: string;
  vessel_type: string;
  length_m: number;
  width_m: number;
  draft_m: number;
  max_speed_knots: number;
  cruise_speed_knots: number;
  fuel_capacity_liters: number;
  fuel_consumption_rate: number;
  cargo_capacity_tonnes: number;
  current_fuel_liters: number;
  latitude: number;
  longitude: number;
  heading: number;
  status: string;
}

export interface Port {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  capacity: number;
  congestion_level: number;
  status: string;
}

export interface MarineZone {
  id: number;
  name: string;
  zone_type: string;
  geometry_geojson: string;
  risk_level: number;
  restricted: boolean;
  description?: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface OptimizationWeights {
  fuel: number;
  time: number;
  safety: number;
  environment: number;
  cost?: number;
}

export interface GeoJSONGeometry {
  type: string;
  coordinates: [number, number][]; // [lon, lat]
}

export interface RouteSegment {
  sequence_number: number;
  start_lat: number;
  start_lon: number;
  end_lat: number;
  end_lon: number;
  distance_km: number;
  estimated_speed_knots: number;
  estimated_fuel_liters: number;
  estimated_time_hours: number;
}

export interface RouteDetail {
  id?: number;
  name: string;
  optimization_mode: string;
  distance_km: number;
  estimated_time_hours: number;
  estimated_fuel_liters: number;
  estimated_co2_kg: number;
  estimated_cost: number;
  risk_score: number;
  environmental_score: number;
  optimization_score: number;
  fuel_saved_liters: number;
  co2_avoided_kg: number;
  eta: string;
  geometry: GeoJSONGeometry;
  segments?: RouteSegment[];
}

export interface RouteExplanation {
  recommendation: string;
  reasons: string[];
  tradeoffs: string[];
  baseline_mode: string;
  savings_percentage_fuel: number;
  savings_percentage_co2: number;
}

export interface RouteComparisonItem {
  name: string;
  mode: string;
  distance_km: number;
  fuel_liters: number;
  time_hours: number;
  co2_kg: number;
  cost: number;
  risk_score: number;
  optimization_score: number;
  is_recommended: boolean;
}

export interface RouteOptimizeResponse {
  recommended_route: RouteDetail;
  alternatives: RouteDetail[];
  comparison: RouteComparisonItem[];
  explanation: RouteExplanation;
}

export interface AnalyticsSummary {
  total_voyages: number;
  active_voyages: number;
  total_vessels: number;
  total_routes_optimized: number;
  total_distance_km: number;
  total_fuel_liters: number;
  total_co2_kg: number;
  total_estimated_cost_usd: number;
  average_eta_hours: number;
}
