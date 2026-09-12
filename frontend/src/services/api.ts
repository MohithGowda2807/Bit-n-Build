import {
  Vessel,
  VesselTrack,
  Debris,
  WeatherData,
  OceanCurrentData,
  Alert,
  Mission,
  Incident,
  AgentFinding,
  OrchestratorResponse,
  HumanApprovalRequest,
  HumanApprovalResponse,
  Port,
  MarineZone,
  RouteOptimizeResponse,
  AnalyticsSummary,
  Coordinate,
  OptimizationWeights
} from '../types';

import { session } from './session';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/** Message from a FastAPI error body, falling back to the given text. */
async function failure(res: Response, fallback: string): Promise<Error> {
  const body = await res.json().catch(() => ({}));
  const detail = body?.detail;
  return new Error((typeof detail === 'string' ? detail : detail?.message) || fallback);
}

export async function fetchHealth(): Promise<any> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch health');
  return res.json();
}

export async function fetchVessels(): Promise<Vessel[]> {
  const res = await fetch(`${API_BASE}/api/v1/vessels`);
  if (!res.ok) throw new Error('Failed to fetch vessels');
  return res.json();
}

export async function fetchVesselTracks(vesselId: number): Promise<VesselTrack[]> {
  const res = await fetch(`${API_BASE}/api/v1/vessels/${vesselId}/tracks`);
  if (!res.ok) throw new Error('Failed to fetch vessel tracks');
  return res.json();
}

export async function fetchDebris(): Promise<Debris[]> {
  const res = await fetch(`${API_BASE}/api/v1/debris`);
  if (!res.ok) throw new Error('Failed to fetch debris');
  return res.json();
}

export async function fetchPorts(): Promise<Port[]> {
  const res = await fetch(`${API_BASE}/api/v1/ports`);
  if (!res.ok) throw new Error('Failed to fetch ports');
  return res.json();
}

export async function fetchZones(): Promise<MarineZone[]> {
  const res = await fetch(`${API_BASE}/api/v1/zones`);
  if (!res.ok) throw new Error('Failed to fetch marine zones');
  return res.json();
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const res = await fetch(`${API_BASE}/api/v1/weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Failed to fetch marine weather');
  return res.json();
}

export async function fetchOceanCurrents(lat: number, lon: number): Promise<OceanCurrentData> {
  const res = await fetch(`${API_BASE}/api/v1/ocean/currents?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Failed to fetch ocean currents');
  return res.json();
}

export async function fetchAlerts(): Promise<Alert[]> {
  const res = await fetch(`${API_BASE}/api/v1/alerts`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function fetchMissions(): Promise<Mission[]> {
  const res = await fetch(`${API_BASE}/api/v1/missions`);
  if (!res.ok) throw new Error('Failed to fetch missions');
  return res.json();
}

export async function fetchIncidents(): Promise<Incident[]> {
  const res = await fetch(`${API_BASE}/api/v1/incidents`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function fetchAgentStatus(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/agents/status`);
  if (!res.ok) throw new Error('Failed to fetch agent status');
  return res.json();
}

export async function dispatchOrchestrator(payload: {
  query: string;
  vessel_id?: number;
  route_id?: number;
  zone_id?: number;
  context?: Record<string, any>;
}): Promise<OrchestratorResponse> {
  const res = await fetch(`${API_BASE}/api/v1/agents/orchestrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail?.message || 'Agent orchestration failed');
  }
  return res.json();
}

export async function submitHumanDecision(payload: HumanApprovalRequest): Promise<HumanApprovalResponse> {
  const res = await fetch(`${API_BASE}/api/v1/agents/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail?.message || 'Human decision submission failed');
  }
  return res.json();
}


export async function triggerAisSimulation(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/ais/simulate`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to trigger AIS simulation');
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsSummary> {
  const res = await fetch(`${API_BASE}/api/v1/analytics/summary`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export interface OptimizePayload {
  vessel_id: number;
  origin: Coordinate;
  destination: Coordinate;
  mode?: string;
  optimization?: OptimizationWeights;
  cargo_weight_tonnes?: number;
  /** false plans a corridor without rewriting the live voyage's route and lineage. */
  record_version?: boolean;
}

export async function optimizeRoute(payload: OptimizePayload): Promise<RouteOptimizeResponse> {
  const res = await fetch(`${API_BASE}/api/v1/routes/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Route optimization failed');
  }
  return res.json();
}

export async function createVoyage(vessel_id: number, route_id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/voyages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vessel_id, route_id })
  });
  if (!res.ok) throw new Error('Failed to create voyage');
  return res.json();
}

// --- Phase 2 Environmental Intelligence & Dynamic Routing APIs ---

/** One stored route as the map draws it; metrics the optimizer response carries but a stored row lacks default to zero. */
export async function fetchRoute(routeId: number): Promise<import('../types').RouteDetail> {
  const res = await fetch(`${API_BASE}/api/v1/routes/${routeId}`);
  if (!res.ok) throw await failure(res, `Route ${routeId} could not be loaded`);
  const r = await res.json();
  return {
    id: r.id, name: r.name, optimization_mode: r.optimization_mode ?? 'safest',
    distance_km: r.distance_km ?? 0, estimated_time_hours: r.estimated_time_hours ?? 0,
    estimated_fuel_liters: r.estimated_fuel_liters ?? 0, estimated_co2_kg: r.estimated_co2_kg ?? 0,
    estimated_cost: r.estimated_cost ?? 0, risk_score: r.risk_score ?? 0, environmental_score: r.environmental_score ?? 0,
    optimization_score: r.optimization_score ?? 0, fuel_saved_liters: 0, co2_avoided_kg: 0, eta: r.eta ?? '',
    // Recalculated routes store a bare coordinate list; the optimizer stores a GeoJSON LineString.
    geometry: Array.isArray(r.geometry) ? { type: 'LineString', coordinates: r.geometry } : r.geometry,
  };
}

export async function fetchActiveStorms(): Promise<import('../types').Storm[]> {
  const res = await fetch(`${API_BASE}/api/v1/storms/active`);
  if (!res.ok) return [];
  return res.json();
}

export async function injectStormScenario(scenario_preset: string = 'bay_of_bengal_cyclone'): Promise<import('../types').Storm[]> {
  const res = await fetch(`${API_BASE}/api/v1/simulation/scenarios/inject-storm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...session.headers() },
    body: JSON.stringify({ scenario_preset })
  });
  if (!res.ok) throw await failure(res, 'Failed to inject storm scenario');
  return res.json();
}

export async function resetEnvironment(): Promise<{ message: string; storms_cleared: number }> {
  const res = await fetch(`${API_BASE}/api/v1/simulation/scenarios/reset-environment`, {
    method: 'POST', headers: session.headers()
  });
  if (!res.ok) throw await failure(res, 'Failed to reset environment');
  return res.json();
}

export async function getOperatingMode(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/v1/simulation/mode`);
  if (!res.ok) return 'autonomous';
  const data = await res.json();
  return data.mode || 'autonomous';
}

export async function setOperatingMode(mode: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/v1/simulation/mode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...session.headers() },
    body: JSON.stringify({ mode })
  });
  if (!res.ok) throw await failure(res, 'Failed to set operating mode');
  const data = await res.json();
  return data.mode;
}

export async function triggerCommandCycle(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/simulation/cycle`, {
    method: 'POST', headers: session.headers()
  });
  if (!res.ok) throw await failure(res, 'Failed to trigger commander cycle');
  return res.json();
}

export async function fetchAgentDecisions(limit: number = 20): Promise<import('../types').AgentDecision[]> {
  const res = await fetch(`${API_BASE}/api/v1/simulation/decisions?limit=${limit}`);
  if (!res.ok) return [];
  return res.json();
}

export async function recalculateVoyageRoute(
  voyage_id: number,
  reason: string = 'ENVIRONMENTAL_HAZARD',
  mode: string = 'autonomous',
  candidate_profile: string = 'safest'
): Promise<import('../types').RecalculateRouteResponse> {
  const res = await fetch(`${API_BASE}/api/v1/routes/recalculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...session.headers() },
    body: JSON.stringify({ voyage_id, reason, mode, candidate_profile })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Route recalculation failed');
  }
  return res.json();
}

export async function fetchVoyageRouteVersions(voyage_id: number): Promise<import('../types').RouteVersion[]> {
  const res = await fetch(`${API_BASE}/api/v1/routes/voyages/${voyage_id}/versions`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchVoyageHealth(voyage_id: number): Promise<import('../types').VoyageHealth> {
  const res = await fetch(`${API_BASE}/api/v1/risk/voyage/${voyage_id}`);
  if (!res.ok) throw new Error('Failed to fetch voyage health');
  return res.json();
}

export async function fetchRouteWeather(route_id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/weather/route/${route_id}`);
  if (!res.ok) throw new Error('Failed to fetch route weather');
  return res.json();
}
