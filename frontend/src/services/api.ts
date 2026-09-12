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

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
