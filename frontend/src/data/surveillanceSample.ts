/** Sample surveillance data for when the API is unreachable. Never shown as live data: the page marks it as sample. */
import { Vessel } from '../types';
import { DarkPeriod, FishingZone, InvestigationCase, ProtectedArea, ScenarioInfo, VesselRisk, VesselRiskSummary } from '../types/surveillance';
import { FeedEvent } from '../components/surveillance/EventsPanel';
import { TrackSegment } from '../design/track';

export const SCENARIO_LABELS: Record<string, string> = {
  DARK_FISHING_COMPOSITE: 'Dark Fishing & Rendezvous',
  AIS_GAP: 'AIS Transponder Blackout',
  MPA_INTRUSION: 'Marine Sanctuary Intrusion',
  SUSPICIOUS_FISHING: 'Suspicious Zig-Zag Trawling',
  VESSEL_RENDEZVOUS: 'Offshore Ship Rendezvous',
  LOITERING: 'Anomalous Loitering',
  TRANSIT_ANOMALY: 'Course Deviation Anomaly',
  NORMAL_VESSEL: 'Commercial Cargo Transit',
};

export const DEFAULT_SURVEILLANCE_SCENARIOS: ScenarioInfo[] = [
  { name: 'DARK_FISHING_COMPOSITE', vessel_count: 2, duration_minutes: 240 },
  { name: 'AIS_GAP', vessel_count: 1, duration_minutes: 240 },
  { name: 'MPA_INTRUSION', vessel_count: 1, duration_minutes: 240 },
  { name: 'SUSPICIOUS_FISHING', vessel_count: 1, duration_minutes: 180 },
  { name: 'VESSEL_RENDEZVOUS', vessel_count: 2, duration_minutes: 160 },
  { name: 'LOITERING', vessel_count: 1, duration_minutes: 180 },
  { name: 'TRANSIT_ANOMALY', vessel_count: 1, duration_minutes: 240 },
  { name: 'NORMAL_VESSEL', vessel_count: 1, duration_minutes: 240 },
];

// Sample dataset shown only when the backend cannot be reached (Render free tier sleeps); the page labels it as sample data.
export const FALLBACK_VESSELS: Vessel[] = [
  {
    id: 101,
    vessel_identifier: 'VSL-101',
    name: 'FV Sagar Kanya',
    mmsi: '419000801',
    vessel_type: 'FISHING',
    flag: 'IN',
    length_m: 48,
    width_m: 10,
    draft_m: 4.5,
    max_speed_knots: 13,
    cruise_speed_knots: 9,
    speed_knots: 3.2,
    fuel_capacity_liters: 30000,
    fuel_consumption_rate: 55,
    cargo_capacity_tonnes: 150,
    current_fuel_liters: 22000,
    latitude: 12.32,
    longitude: 72.32,
    heading: 145,
    status: 'UNDERWAY',
    destination: 'Silent Bank',
    eta: '2026-09-13T04:00:00Z',
  },
  {
    id: 102,
    vessel_identifier: 'VSL-102',
    name: 'MV Grey Broker',
    mmsi: '353000802',
    vessel_type: 'CARGO',
    flag: 'PA',
    length_m: 135,
    width_m: 22,
    draft_m: 7.8,
    max_speed_knots: 16,
    cruise_speed_knots: 12,
    speed_knots: 0.8,
    fuel_capacity_liters: 95000,
    fuel_consumption_rate: 120,
    cargo_capacity_tonnes: 8500,
    current_fuel_liters: 71000,
    latitude: 12.325,
    longitude: 72.325,
    heading: 180,
    status: 'MOORED',
    destination: 'High Seas Corridor',
    eta: '2026-09-13T06:00:00Z',
  },
  {
    id: 103,
    vessel_identifier: 'VSL-103',
    name: 'FV Silent Tide',
    mmsi: '419000201',
    vessel_type: 'FISHING',
    flag: 'IN',
    length_m: 36,
    width_m: 8,
    draft_m: 3.8,
    max_speed_knots: 12,
    cruise_speed_knots: 8,
    speed_knots: 7.4,
    fuel_capacity_liters: 20000,
    fuel_consumption_rate: 40,
    cargo_capacity_tonnes: 90,
    current_fuel_liters: 14000,
    latitude: 12.25,
    longitude: 72.25,
    heading: 45,
    status: 'UNDERWAY',
    destination: 'Mangalore Deep',
    eta: '2026-09-13T08:00:00Z',
  },
  {
    id: 104,
    vessel_identifier: 'VSL-104',
    name: 'MV Steady Course',
    mmsi: '353000101',
    vessel_type: 'CARGO',
    flag: 'PA',
    length_m: 190,
    width_m: 28,
    draft_m: 9.5,
    max_speed_knots: 18,
    cruise_speed_knots: 14,
    speed_knots: 12.8,
    fuel_capacity_liters: 180000,
    fuel_consumption_rate: 190,
    cargo_capacity_tonnes: 22000,
    current_fuel_liters: 140000,
    latitude: 12.4,
    longitude: 70.4,
    heading: 60,
    status: 'UNDERWAY',
    destination: 'Mumbai High',
    eta: '2026-09-13T12:00:00Z',
  },
  {
    id: 105,
    vessel_identifier: 'VSL-105',
    name: 'FV Boundary Runner',
    mmsi: '419000401',
    vessel_type: 'FISHING',
    flag: 'IN',
    length_m: 42,
    width_m: 9,
    draft_m: 4.0,
    max_speed_knots: 13,
    cruise_speed_knots: 9,
    speed_knots: 4.1,
    fuel_capacity_liters: 24000,
    fuel_consumption_rate: 48,
    cargo_capacity_tonnes: 110,
    current_fuel_liters: 17500,
    latitude: 13.5,
    longitude: 71.5,
    heading: 90,
    status: 'UNDERWAY',
    destination: 'Sentinel Reef',
    eta: '2026-09-13T10:00:00Z',
  },
];

export const FALLBACK_RISKS: VesselRiskSummary[] = [
  {
    vessel_id: 101,
    score: 88,
    level: 'CRITICAL',
    top_factor: 'AIS blackout (60m) inside protected buffer',
    computed_at: new Date().toISOString(),
  },
  {
    vessel_id: 102,
    score: 74,
    level: 'HIGH',
    top_factor: 'Offshore rendezvous with dark vessel',
    computed_at: new Date().toISOString(),
  },
  {
    vessel_id: 103,
    score: 62,
    level: 'HIGH',
    top_factor: 'AIS transponder deactivated for 60m',
    computed_at: new Date().toISOString(),
  },
  {
    vessel_id: 105,
    score: 54,
    level: 'ELEVATED',
    top_factor: 'Near Sentinel Reef Marine Protected Area',
    computed_at: new Date().toISOString(),
  },
  {
    vessel_id: 104,
    score: 12,
    level: 'LOW',
    top_factor: 'Nominal commercial corridor transit',
    computed_at: new Date().toISOString(),
  },
];

export const FALLBACK_CASES: InvestigationCase[] = [
  {
    id: 1,
    vessel_id: 101,
    risk_score: 88,
    risk_level: 'CRITICAL',
    status: 'OPEN',
    assigned_to: 'Operator-Alpha',
    summary: 'Suspected IUU Transshipment & AIS Blackout',
    dismissed_reason: null,
    agent_summary: 'Target disabled transponder for 60 minutes and met with unflagged partner vessel.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const FALLBACK_EVENTS: FeedEvent[] = [
  {
    key: 'fb-ev-1',
    event_type: 'AIS_GAP_DETECTED',
    vessel_id: 101,
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    payload: { duration_seconds: 3600, gap_start: '12:00', gap_end: '13:00' },
  },
  {
    key: 'fb-ev-2',
    event_type: 'ZONE_ENTRY',
    vessel_id: 101,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    payload: { zone_name: 'Silent Bank Seasonal Closure' },
    zone_name: 'Silent Bank Seasonal Closure',
  },
  {
    key: 'fb-ev-3',
    event_type: 'VESSEL_RENDEZVOUS',
    vessel_id: 101,
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    payload: { minimum_distance_km: 0.18, target_vessel_id: 102 },
  },
  {
    key: 'fb-ev-4',
    event_type: 'HIGH_RISK_VESSEL',
    vessel_id: 101,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    payload: { score: 88, level: 'CRITICAL' },
  },
  {
    key: 'fb-ev-5',
    event_type: 'CASE_CREATED',
    vessel_id: 101,
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    payload: { case_id: 1 },
  },
];

export const FALLBACK_RISK_DETAIL_101: VesselRisk = {
  vessel_id: 101,
  risk_score_id: 101,
  score: 88,
  level: 'CRITICAL',
  computed_at: new Date().toISOString(),
  evidence: [],
  factors: [
    { type: 'AIS_GAP', score: 35, explanation: 'Transponder intentionally disabled for 60 minutes during operations', event_ids: [1] },
    { type: 'PROTECTED_AREA', score: 30, explanation: 'Trawling activity detected inside Silent Bank Seasonal Closure', event_ids: [2] },
    { type: 'RENDEZVOUS', score: 23, explanation: 'Slow-speed rendezvous with unflagged cargo vessel MV Grey Broker', event_ids: [3] },
  ],
};

export const FALLBACK_TRACK_101: TrackSegment[] = [
  {
    kind: 'observed',
    points: [
      [12.0, 72.05],
      [12.1, 72.13],
      [12.2, 72.22],
      [12.208, 72.228],
      [12.212, 72.220],
      [12.220, 72.228],
    ],
  },
  {
    kind: 'estimated',
    points: [
      [12.220, 72.228],
      [12.30, 72.30],
    ],
  },
  {
    kind: 'observed',
    points: [
      [12.30, 72.30],
      [12.32, 72.32],
      [12.325, 72.325],
    ],
  },
];

export const FALLBACK_GAPS_101: DarkPeriod[] = [
  {
    id: 1,
    vessel_id: 101,
    start_time: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    end_time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    duration_seconds: 3600,
    last_latitude: 12.22,
    last_longitude: 72.228,
    reappearance_latitude: 12.30,
    reappearance_longitude: 72.30,
    estimated_distance_km: 11.8,
    severity: 'CRITICAL',
  },
];

export const FALLBACK_PROTECTED_AREAS: ProtectedArea[] = [
  {
    id: 1,
    name: 'Sentinel Reef Marine Protected Area',
    geometry: {
      type: 'Polygon',
      coordinates: [[[71.4, 13.4], [71.6, 13.4], [71.6, 13.6], [71.4, 13.6], [71.4, 13.4]]],
    },
    protection_level: 'NO_TAKE',
    authority: 'Demo Marine Authority',
    rules: 'No fishing, anchoring or extraction. Transit permitted.',
  },
];

export const FALLBACK_FISHING_ZONES: FishingZone[] = [
  {
    id: 1,
    name: 'Silent Bank Seasonal Closure',
    geometry: {
      type: 'Polygon',
      coordinates: [[[72.18, 12.18], [72.35, 12.18], [72.35, 12.35], [72.18, 12.35], [72.18, 12.18]]],
    },
    zone_type: 'NO_FISHING',
    jurisdiction: 'Demo Marine Authority',
  },
  {
    id: 2,
    name: 'Restless Shoal Restricted Ground',
    geometry: {
      type: 'Polygon',
      coordinates: [[[71.05, 12.08], [71.2, 12.08], [71.2, 12.2], [71.05, 12.2], [71.05, 12.08]]],
    },
    zone_type: 'RESTRICTED_FISHING',
    jurisdiction: 'Demo Marine Authority',
  },
];
