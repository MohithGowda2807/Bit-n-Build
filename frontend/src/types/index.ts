export interface Vessel {
  id: number;
  vessel_identifier: string;
  name: string;
  mmsi?: string;
  callsign?: string;
  imo_number?: string | null;
  flag?: string | null;
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
  cluster_id?: string | null;
  estimated_mass_kg?: number;
  estimated_volume_m3?: number;
  confidence?: number;
  drift_heading_deg?: number;
  drift_speed_knots?: number;
  target_species_threatened?: string;
  environmental_risk_score?: number;
  nearest_mpa_distance_nm?: number;
}

export interface CleanupUnit {
  id: number;
  unit_name: string;
  unit_type: 'asv_skimmer' | 'autonomous_drone' | 'robotic_interceptor' | 'collection_boom';
  latitude: number;
  longitude: number;
  heading_deg: number;
  speed_knots: number;
  battery_pct: number;
  max_range_nm: number;
  capacity_kg: number;
  current_load_kg: number;
  status: 'idle' | 'transit' | 'collecting' | 'returning' | 'maintenance' | 'docked';
  assigned_mission_id?: number | null;
  operator_override?: string | null;
  last_ping?: string;
}

export interface DebrisCluster {
  cluster_id: string;
  center_lat: number;
  center_lon: number;
  member_count: number;
  total_mass_kg: number;
  mean_severity: number;
  risk_level: string;
  debris_ids: number[];
}

export interface DebrisDriftForecast {
  debris_id: number;
  forecast_hours: number;
  drift_speed_knots: number;
  drift_heading_deg: number;
  trajectory: Array<{
    hour: number;
    latitude: number;
    longitude: number;
    timestamp: string;
    uncertainty_radius_nm: number;
  }>;
}

export interface ImpactMetrics {
  co2_avoided_tonnes: number;
  fuel_saved_liters: number;
  debris_cleared_kg: number;
  protected_areas_shielded: number;
  dark_vessels_intercepted: number;
  active_cleanup_sorties: number;
  avg_mission_success_rate: number;
}

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'preservation' | 'surveillance' | 'routing';
  threat_level: 'critical' | 'high' | 'medium';
  target_entity: string;
  focus: { latitude: number; longitude: number; zoom: number };
  suggested_unit: string;
  badge_color: string;
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
  sea_state?: number;
  data_freshness_sec?: number;
  is_stale?: boolean;
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
  compliance_report?: string;
  requires_human_approval?: boolean;
  approval_status?: string;
  proposed_action?: string;
  execution_time_ms: number;
  timestamp: string;
}

export interface HumanApprovalRequest {
  mission_id: string;
  decision: 'approve' | 'replan' | 'reject';
  action_notes?: string;
}

export interface HumanApprovalResponse {
  mission_id: string;
  decision: string;
  approval_status: string;
  action_result: string;
  execution_timestamp: string;
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

export interface Storm {
  id: number;
  name: string;
  storm_type: string;
  severity: 'low' | 'moderate' | 'high' | 'critical' | string;
  center_latitude: number;
  center_longitude: number;
  radius_km: number;
  wind_speed_knots: number;
  movement_direction_deg: number;
  movement_speed_knots: number;
  is_active: boolean;
  source: string;
  created_at: string;
}

export interface RouteVersion {
  id: number;
  voyage_id: number;
  version_number: number;
  route_id: number;
  trigger_event: string;
  change_reason?: string;
  risk_score: number;
  fuel_liters: number;
  eta_hours: number;
  co2_kg: number;
  risk_reduction_pct?: number;
  fuel_change_pct?: number;
  eta_change_hours?: number;
  explanation_json?: string;
  status: string;
  created_at: string;
}

export interface RecalculateRouteResponse {
  voyage_id: number;
  previous_route_id: number;
  new_route_id: number;
  version_number: number;
  risk_reduction_pct: number;
  fuel_change_pct: number;
  eta_change_hours: number;
  reasons: string[];
  tradeoffs: Record<string, any>;
  route_geojson: string;
  applied: boolean;
  mode: string;
}

