import {
  Vessel,
  Port,
  MarineZone,
  RouteOptimizeResponse,
  AnalyticsSummary,
  Coordinate,
  OptimizationWeights
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

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
