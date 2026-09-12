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

// --- Phase 2 Environmental Intelligence & Dynamic Routing APIs ---

export async function fetchActiveStorms(): Promise<import('../types').Storm[]> {
  const res = await fetch(`${API_BASE}/api/v1/storms/active`);
  if (!res.ok) return [];
  return res.json();
}

export async function injectStormScenario(scenario_preset: string = 'bay_of_bengal_cyclone'): Promise<import('../types').Storm[]> {
  const res = await fetch(`${API_BASE}/api/v1/simulation/scenarios/inject-storm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_preset })
  });
  if (!res.ok) throw new Error('Failed to inject storm scenario');
  return res.json();
}

export async function resetEnvironment(): Promise<{ message: string; storms_cleared: number }> {
  const res = await fetch(`${API_BASE}/api/v1/simulation/scenarios/reset-environment`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to reset environment');
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode })
  });
  if (!res.ok) throw new Error('Failed to set operating mode');
  const data = await res.json();
  return data.mode;
}

export async function triggerCommandCycle(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/simulation/cycle`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to trigger commander cycle');
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
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
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

export async function approveCleanupMission(missionId: number, decision: 'approved' | 'rejected'): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/missions/${missionId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision })
  });
  if (!res.ok) throw new Error('Failed to approve/reject mission');
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
    const res = await fetch(`${API_BASE}/api/v1/simulation/scenarios`);
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

