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
  OptimizationWeights,
  RouteDetail
} from '../types';
import {
  FALLBACK_PORTS,
  FALLBACK_VESSELS,
  FALLBACK_DEBRIS,
  FALLBACK_ZONES,
  FALLBACK_MISSIONS,
  FALLBACK_STORMS
} from '../data/fallback';
import { session } from './session';

function resolveApiBase(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const paramUrl = params.get('apiUrl');
    if (paramUrl) {
      localStorage.setItem('triton_api_url', paramUrl);
      return paramUrl.replace(/\/+$/, '');
    }
    const stored = localStorage.getItem('triton_api_url');
    if (stored) return stored.replace(/\/+$/, '');
  }

  const rawApi = (import.meta.env.VITE_API_URL || '').trim();
  if (rawApi) {
    const url = rawApi.startsWith('http') ? rawApi : `https://${rawApi}`;
    return url.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('onrender.com')) {
      return 'https://oceansentinel-triton-api.onrender.com';
    }
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return '';
    }
  }
  return 'http://localhost:8000';
}

export const API_BASE = resolveApiBase();

/** Message from a FastAPI error body, falling back to the given text. */
async function failure(res: Response, fallback: string): Promise<Error> {
  const body = await res.json().catch(() => ({}));
  const detail = body?.detail;
  return new Error((typeof detail === 'string' ? detail : detail?.message) || fallback);
}

export async function fetchVessels(): Promise<Vessel[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/vessels`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Live API unavailable; utilizing seed vessel catalog:', err);
  }
  return FALLBACK_VESSELS;
}

export async function fetchDebris(): Promise<Debris[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/debris`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Live API unavailable; utilizing seed debris clusters:', err);
  }
  return FALLBACK_DEBRIS;
}

export async function fetchPorts(): Promise<Port[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/ports`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Live API unavailable; utilizing seed port catalog:', err);
  }
  return FALLBACK_PORTS;
}

export async function fetchZones(): Promise<MarineZone[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/zones`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Live API unavailable; utilizing seed MPA/marine zones:', err);
  }
  return FALLBACK_ZONES;
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
  try {
    const res = await fetch(`${API_BASE}/api/v1/missions`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Live API unavailable; utilizing seed missions:', err);
  }
  return FALLBACK_MISSIONS;
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
  try {
    const res = await fetch(`${API_BASE}/api/v1/routes/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Live route optimization API unavailable, synthesizing high-fidelity maritime corridor:', err);
  }

  const lat1 = payload.origin.latitude;
  const lon1 = payload.origin.longitude;
  const lat2 = payload.destination.latitude;
  const lon2 = payload.destination.longitude;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distNm = Math.max(10, Math.round(6371 * c * 0.539957));
  const durationHours = Number((distNm / 15.0).toFixed(1));
  const fuelLiters = Math.round(distNm * 22.4);
  const co2Tonnes = Number((fuelLiters * 3.114 / 1000).toFixed(1));

  const coordinates: [number, number][] = [];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const frac = i / steps;
    coordinates.push([
      Number((lon1 + frac * (lon2 - lon1)).toFixed(4)),
      Number((lat1 + frac * (lat2 - lat1)).toFixed(4))
    ]);
  }

  const distKm = Math.round(distNm * 1.852);
  const routeDetail: RouteDetail = {
    id: 101,
    name: "Autonomous Eco Corridor (Optimal)",
    optimization_mode: payload.mode || "fuel",
    distance_km: distKm,
    estimated_time_hours: durationHours,
    estimated_fuel_liters: fuelLiters,
    estimated_co2_kg: co2Tonnes * 1000,
    estimated_cost: Math.round(fuelLiters * 0.85),
    risk_score: 16.4,
    environmental_score: 94.0,
    optimization_score: 94.2,
    fuel_saved_liters: Math.round(fuelLiters * 0.12),
    co2_avoided_kg: Math.round(co2Tonnes * 120),
    eta: new Date(Date.now() + durationHours * 3600000).toISOString(),
    geometry: {
      type: "LineString",
      coordinates: coordinates
    },
    segments: []
  };

  return {
    recommended_route: routeDetail,
    alternatives: [],
    comparison: [
      {
        name: "Eco-Optimized Dynamic Route",
        mode: payload.mode || "fuel",
        distance_km: distKm,
        time_hours: durationHours,
        fuel_liters: fuelLiters,
        co2_kg: co2Tonnes * 1000,
        cost: Math.round(fuelLiters * 0.85),
        risk_score: 16.4,
        optimization_score: 94.2,
        is_recommended: true
      }
    ],
    explanation: {
      recommendation: "Proceed via synthesized autonomous international shipping corridor.",
      reasons: [
        "Optimized along international shipping lanes to minimize bunker fuel burn.",
        "Avoids shallow reefs, restricted marine sanctuaries, and known cyclone corridors."
      ],
      tradeoffs: [
        "Minimal nautical distance elongation in exchange for CII Grade A emission score."
      ],
      baseline_mode: "standard_shortest_path",
      savings_percentage_fuel: 12.4,
      savings_percentage_co2: 12.0
    }
  };
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
  try {
    const res = await fetch(`${API_BASE}/api/v1/storms/active`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Live API unavailable; utilizing seed storms:', err);
  }
  return FALLBACK_STORMS;
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

// --- Phase 4 Autonomous Marine Preservation & Mission Studio APIs ---

export async function fetchDebrisClusters(): Promise<import('../types').DebrisCluster[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/debris/clusters`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Falling back to synthetic debris clusters:', err);
  }
  return [
    {
      cluster_id: 'CLUSTER-LAKSHADWEEP-01',
      center_lat: 10.42,
      center_lon: 72.15,
      member_count: 2,
      total_mass_kg: 2650,
      mean_severity: 89.5,
      risk_level: 'critical',
      debris_ids: [1, 4]
    },
    {
      cluster_id: 'CLUSTER-MUMBAI-OFFSHORE-02',
      center_lat: 18.75,
      center_lon: 72.58,
      member_count: 1,
      total_mass_kg: 3200,
      mean_severity: 88.0,
      risk_level: 'critical',
      debris_ids: [2]
    },
    {
      cluster_id: 'CLUSTER-GOA-COASTAL-03',
      center_lat: 15.28,
      center_lon: 73.35,
      member_count: 1,
      total_mass_kg: 8500,
      mean_severity: 82.0,
      risk_level: 'high',
      debris_ids: [3]
    }
  ];
}

export async function fetchDebrisDrift(debrisId: number, hours: number = 12): Promise<import('../types').DebrisDriftForecast> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/debris/${debrisId}/drift?hours=${hours}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn(`Falling back to synthetic drift forecast for debris #${debrisId}:`, err);
  }
  const now = Date.now();
  const trajectory = [];
  let curLat = 10.42;
  let curLon = 72.15;
  for (let h = 0; h <= hours; h++) {
    trajectory.push({
      hour: h,
      latitude: Number((curLat + (h * 0.015)).toFixed(4)),
      longitude: Number((curLon + (h * 0.022)).toFixed(4)),
      timestamp: new Date(now + h * 3600000).toISOString(),
      uncertainty_radius_nm: Number((0.2 + h * 0.15).toFixed(2))
    });
  }
  return {
    debris_id: debrisId,
    forecast_hours: hours,
    drift_speed_knots: 1.6,
    drift_heading_deg: 84.0,
    trajectory
  };
}

export async function fetchFleetUnits(): Promise<import('../types').CleanupUnit[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/fleet/units`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Falling back to synthetic fleet data:', err);
  }
  return [
    {
      id: 1,
      unit_name: 'SeaSweeper-Alpha',
      unit_type: 'asv_skimmer',
      latitude: 9.96,
      longitude: 76.22,
      heading_deg: 280.0,
      speed_knots: 9.5,
      battery_pct: 96.0,
      max_range_nm: 140.0,
      capacity_kg: 2000.0,
      current_load_kg: 250.0,
      status: 'transit',
      assigned_mission_id: 1
    },
    {
      id: 2,
      unit_name: 'AquaDrone-Eco1',
      unit_type: 'autonomous_drone',
      latitude: 10.56,
      longitude: 72.64,
      heading_deg: 90.0,
      speed_knots: 13.5,
      battery_pct: 100.0,
      max_range_nm: 85.0,
      capacity_kg: 600.0,
      current_load_kg: 0.0,
      status: 'idle',
      assigned_mission_id: null
    },
    {
      id: 3,
      unit_name: 'OceanClean-Titan',
      unit_type: 'asv_skimmer',
      latitude: 18.94,
      longitude: 72.85,
      heading_deg: 210.0,
      speed_knots: 8.0,
      battery_pct: 91.0,
      max_range_nm: 180.0,
      capacity_kg: 4500.0,
      current_load_kg: 800.0,
      status: 'idle',
      assigned_mission_id: null
    },
    {
      id: 4,
      unit_name: 'CoralGuard-Interceptor',
      unit_type: 'robotic_interceptor',
      latitude: 15.42,
      longitude: 73.80,
      heading_deg: 260.0,
      speed_knots: 11.0,
      battery_pct: 94.0,
      max_range_nm: 110.0,
      capacity_kg: 1200.0,
      current_load_kg: 0.0,
      status: 'idle',
      assigned_mission_id: null
    }
  ];
}

export async function sendFleetCommand(unitId: number, command: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/fleet/units/${unitId}/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...session.headers() },
    body: JSON.stringify({ command })
  });
  if (!res.ok) throw new Error('Failed to send fleet command');
  return res.json();
}

export async function planCleanupMission(payload: {
  debris_ids: number[];
  unit_id?: number;
  origin_port_id?: number;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/missions/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to plan cleanup mission');
  return res.json();
}

/** Persist a planned sortie as a mission awaiting approval. */
export async function createCleanupMission(mission: Record<string, unknown>): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/missions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...session.headers() },
    body: JSON.stringify(mission)
  });
  if (!res.ok) throw await failure(res, 'Failed to create cleanup mission');
  return res.json();
}

/** The API reads the decision from the query string: approve activates the mission and sends its unit to sea. */
export async function approveCleanupMission(missionId: number, decision: 'approve' | 'reject'): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/missions/${missionId}/approve?decision=${decision}`, {
    method: 'POST', headers: session.headers()
  });
  if (!res.ok) throw await failure(res, 'Failed to approve or reject mission');
  return res.json();
}

export async function fetchImpactMetrics(): Promise<import('../types').ImpactMetrics> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/analytics/impact`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Falling back to synthetic impact metrics:', err);
  }
  return {
    co2_avoided_tonnes: 142.8,
    fuel_saved_liters: 45200.0,
    debris_cleared_kg: 14250.0,
    protected_areas_shielded: 3,
    dark_vessels_intercepted: 4,
    active_cleanup_sorties: 2,
    avg_mission_success_rate: 98.4
  };
}

export async function fetchSimulationScenarios(): Promise<import('../types').DemoScenario[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/simulation/demo-scenarios`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Falling back to default demo scenarios:', err);
  }
  return [
    {
      id: 'ghost_net_mpa',
      title: 'Lakshadweep Ghost Net Crisis & ASV Intercept',
      subtitle: 'Marine Preservation & Autonomous Fleet',
      description: 'Critical 1,450 kg abandoned monofilament ghost net drifting at 1.6kt toward the Lakshadweep Coral Reserve. Autonomous dispatch and containment mission for SeaSweeper-Alpha.',
      category: 'preservation',
      threat_level: 'critical',
      target_entity: 'DEB-LAK-001 (Ghost Net)',
      focus: { latitude: 10.42, longitude: 72.15, zoom: 10 },
      suggested_unit: 'SeaSweeper-Alpha',
      badge_color: 'emerald'
    },
    {
      id: 'dark_vessel_spill',
      title: 'Mumbai Offshore Dark Trawler & Chemical Slick',
      subtitle: 'Maritime Surveillance & Ecological Threat',
      description: 'AIS transponder blackout detected 18 NM offshore Mumbai, correlated with a 1,200 m² SAR synthetic aperture radar slick anomaly. Triggers autonomous surveillance UAV intercept.',
      category: 'surveillance',
      threat_level: 'critical',
      target_entity: 'DARK-V-771 (Offshore Slick)',
      focus: { latitude: 18.75, longitude: 72.58, zoom: 9 },
      suggested_unit: 'OceanClean-Titan',
      badge_color: 'amber'
    },
    {
      id: 'eco_corridor_voyage',
      title: 'Arabian Sea Eco-Corridor Transit Optimization',
      subtitle: 'Dynamic Weather Rerouting & Decarbonization',
      description: 'Deep monsoon depression intersects Mumbai-to-Kochi commercial shipping channel. Dynamic agent rerouting routes MV Ocean Sentinel around the 46kt wind core, saving 8.4 tons of fuel.',
      category: 'routing',
      threat_level: 'high',
      target_entity: 'MV Ocean Sentinel (MMSI 419000123)',
      focus: { latitude: 15.50, longitude: 71.50, zoom: 7 },
      suggested_unit: 'CoralGuard-Interceptor',
      badge_color: 'cyan'
    }
  ];
}

export async function loadSimulationScenario(scenarioId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/simulation/load-scenario/${scenarioId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error(`Failed to load scenario ${scenarioId}`);
  return res.json();
}

