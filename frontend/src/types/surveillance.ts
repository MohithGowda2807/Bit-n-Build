/** Phase 3 surveillance API shapes (backend/app/schemas/surveillance.py). */

export type RiskLevelName = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface VesselRiskSummary {
  vessel_id: number;
  score: number;
  level: RiskLevelName;
  computed_at: string;
  top_factor: string | null;
}

export interface RiskFactor {
  type: string;
  score: number;
  explanation: string;
  event_ids: number[];
}

export interface Evidence {
  id: number;
  event_id: number | null;
  evidence_type: string;
  factor_type: string;
  strength: number;
  confidence: number;
  source: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  description: string;
}

export interface VesselRisk {
  vessel_id: number;
  risk_score_id: number;
  score: number;
  level: RiskLevelName;
  factors: RiskFactor[];
  computed_at: string;
  evidence: Evidence[];
}

export interface AISPosition {
  id: number;
  vessel_id: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed_over_ground: number | null;
  course_over_ground: number | null;
  heading: number | null;
  navigation_status: string | null;
  source: string;
}

export interface DarkPeriod {
  id: number;
  vessel_id: number;
  start_time: string;
  end_time: string | null;
  duration_seconds: number;
  last_latitude: number;
  last_longitude: number;
  reappearance_latitude: number | null;
  reappearance_longitude: number | null;
  estimated_distance_km: number | null;
  severity: string;
}

export interface SurveillanceEvent {
  id: number;
  event_type: string;
  vessel_id: number;
  other_vessel_id: number | null;
  zone_kind: string | null;
  zone_id: number | null;
  zone_name: string | null;
  timestamp: string;
  latitude: number;
  longitude: number;
  score: number | null;
  confidence: number;
  source: string;
  payload: Record<string, any>;
}

export interface GeoPolygon {
  type: string;
  coordinates: number[][][];
}

export interface FishingZone {
  id: number;
  name: string;
  zone_type: 'AUTHORIZED_FISHING' | 'RESTRICTED_FISHING' | 'SEASONAL_FISHING' | 'NO_FISHING' | string;
  jurisdiction: string | null;
  geometry: GeoPolygon;
}

export interface ProtectedArea {
  id: number;
  name: string;
  protection_level: string;
  authority: string | null;
  rules: string | null;
  geometry: GeoPolygon;
}

export interface InvestigationCase {
  id: number;
  vessel_id: number;
  risk_score: number;
  risk_level: RiskLevelName;
  status: 'OPEN' | 'UNDER_REVIEW' | 'ESCALATED' | 'RESOLVED' | 'DISMISSED';
  assigned_to: string | null;
  summary: string;
  dismissed_reason: string | null;
  agent_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvestigationCaseDetail extends InvestigationCase {
  vessel: { id: number; name: string; vessel_type: string; mmsi: string | null; flag: string | null };
  evidence_snapshot: Record<string, any>[];
  audit_log: { timestamp: string; action: string; actor: string; role?: string | null; note: string | null }[];
}

export interface ScenarioInfo {
  name: string;
  vessel_count: number;
  duration_minutes: number;
}

export interface SimulationRunResult {
  scenario: string;
  start_time: string;
  end_time: string;
  vessels_created: number;
  positions_added: number;
  dark_periods_added: number;
  events_added: number;
  cases_opened: number;
  reset: boolean;
}

/** Live messages on /ws/telemetry. */
export interface LiveSurveillanceEvent {
  event_type: string;
  source: string;
  timestamp: string;
  vessel_id: number | null;
  payload: Record<string, any>;
}

export interface ReplayStep {
  scenario: string;
  sim_time: string;
  step: number;
  total_steps: number;
  progress: number;
  vessels: { mmsi: string; vessel_id: number | null; latitude: number; longitude: number; speed_knots: number; course: number }[];
}

export interface ReplayStart {
  status: string;
  scenario: string;
  steps: number;
  step_seconds: number;
  start_time: string;
  end_time: string;
  dark_windows: { mmsi: string; name: string; start: number; end: number }[];
}

export interface BehaviorProfile {
  source: 'HISTORICAL' | 'LEARNED';
  point_count: number;
  hours_observed: number;
  average_speed: number;
  speed_stddev: number;
  course_change_rate_deg_per_hour: number;
  gap_count: number;
  common_cells: string[];
  window_start: string | null;
  window_end: string | null;
  last_updated: string;
}

export interface BehaviorDeviation {
  score: number;
  speed_z: number;
  baseline_speed: number;
  recent_speed: number;
  turning_ratio: number;
  new_gaps: number;
  explanation: string;
  timestamp: string;
}

export interface VesselBaseline {
  vessel_id: number;
  profile: BehaviorProfile;
  deviation: BehaviorDeviation | null;
}
