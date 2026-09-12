export interface Vessel {
  id: number;
  vessel_identifier: string;
  name: string;
  mmsi?: string;
  callsign?: string;
  vessel_type: string;
  length_m: number;
  width_m: number;
  draft_m: number;
  max_speed_knots: number;
  cruise_speed_knots: number;
  speed_knots: number;
  fuel_capacity_liters: number;
  fuel_consumption_rate: number;
  cargo_capacity_tonnes: number;
  current_fuel_liters: number;
  latitude: number;
  longitude: number;
  heading: number;
  destination?: string;
  eta?: string;
  status: string;
}

export interface VesselTrack {
  id: number;
  vessel_id: number;
  latitude: number;
  longitude: number;
  speed_knots: number;
  heading: number;
  status: string;
  timestamp: string;
}

export interface Debris {
  id: number;
  latitude: number;
  longitude: number;
  debris_type: string;
  estimated_size_m2: number;
  density_category: string;
  severity: number;
  clean_up_priority: string;
  status: string;
  source: string;
  description?: string;
  detected_at: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  temperature_c: number;
  wind_speed_knots: number;
  wind_direction_deg: number;
  wave_height_m: number;
  visibility_nm: number;
  pressure_hpa: number;
  conditions: string;
  source: string;
  timestamp: string;
}

export interface OceanCurrentData {
  latitude: number;
  longitude: number;
  current_speed_knots: number;
  current_direction_deg: number;
  sea_surface_temp_c: number;
  salinity_psu: number;
  tidal_state: string;
  source: string;
  timestamp: string;
}

export interface Alert {
  id: number;
  alert_type: string;
  severity: string;
  vessel_id?: number;
  message: string;
  details?: string;
  acknowledged: boolean;
  status: string;
  timestamp: string;
}

export interface Mission {
  id: number;
  mission_name: string;
  mission_type: string;
  status: string;
  assigned_vessel_id?: number;
  priority: string;
  target_lat?: number;
  target_lon?: number;
  parameters?: string;
  created_at: string;
}

export interface Incident {
  id: number;
  title: string;
  incident_type: string;
  severity: string;
  location_lat: number;
  location_lon: number;
  description?: string;
  status: string;
  reported_at: string;
}

export interface AgentFinding {
  agent_name: string;
  role: string;
  status: string;
  summary: string;
  risk_level: string;
  details: Record<string, any>;
}

export interface OrchestratorResponse {
  mission_id: string;
  query: string;
  status: string;
  orchestrator_decision: string;
  recommendations: string[];
  agent_findings: AgentFinding[];
  execution_time_ms: number;
  timestamp: string;
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
