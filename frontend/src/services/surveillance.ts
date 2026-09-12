import {
  AISPosition, DarkPeriod, Evidence, FishingZone, InvestigationCase, InvestigationCaseDetail, ProtectedArea,
  Heatmap, ReplayStart, ScenarioInfo, SimulationRunResult, SurveillanceEvent, VesselBaseline, VesselRisk, VesselRiskSummary,
} from '../types/surveillance';

import { API_BASE } from './api';
import { session } from './session';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: session.headers() });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail?.detail?.message || `${path} failed with ${res.status}`);
  }
  return res.json();
}

async function postJson<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...session.headers() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail?.detail?.message || `${path} failed with ${res.status}`);
  }
  return res.json();
}

export const fetchRiskList = (minScore = 0) =>
  getJson<VesselRiskSummary[]>(`/api/v1/surveillance/risk?min_score=${minScore}`);

export const fetchVesselRisk = (vesselId: number) => getJson<VesselRisk>(`/api/v1/vessels/${vesselId}/risk`);

export const fetchVesselBaseline = (vesselId: number) => getJson<VesselBaseline>(`/api/v1/vessels/${vesselId}/baseline`);

export const fetchVesselAisTrack = (vesselId: number) => getJson<AISPosition[]>(`/api/v1/vessels/${vesselId}/track`);

export const fetchAisGaps = (vesselId?: number) =>
  getJson<DarkPeriod[]>(`/api/v1/ais/gaps${vesselId ? `?vessel_id=${vesselId}` : ''}`);

export const fetchSurveillanceEvents = (limit = 40, vesselId?: number) =>
  getJson<SurveillanceEvent[]>(`/api/v1/surveillance/events?limit=${limit}${vesselId ? `&vessel_id=${vesselId}` : ''}`);

export const fetchHeatmap = (cellDegrees = 0.25) => getJson<Heatmap>(`/api/v1/surveillance/heatmap?cell_degrees=${cellDegrees}`);

export const fetchFishingZones = () => getJson<FishingZone[]>('/api/v1/fishing/zones');

export const fetchProtectedAreas = () => getJson<ProtectedArea[]>('/api/v1/fishing/protected-areas');

export const fetchInvestigations = (status?: string) =>
  getJson<InvestigationCase[]>(`/api/v1/investigations${status ? `?status=${status}` : ''}`);

export const fetchInvestigation = (caseId: number) => getJson<InvestigationCaseDetail>(`/api/v1/investigations/${caseId}`);

export const fetchScenarios = () => getJson<ScenarioInfo[]>('/api/v1/simulation/scenarios');

export const runScenario = (scenario: string, reset = true) =>
  postJson<SimulationRunResult>('/api/v1/simulation/run', { scenario, reset });

export const startReplay = (scenario: string, stepSeconds = 0.5) =>
  postJson<ReplayStart>('/api/v1/simulation/replay', { scenario, step_seconds: stepSeconds });

export const resetSimulation = () => postJson<{ vessels_removed: number }>('/api/v1/simulation/reset');

export const assignCase = (caseId: number, assignee: string, actor = 'operator') =>
  postJson<InvestigationCaseDetail>(`/api/v1/investigations/${caseId}/assign`, { assignee, actor });

export const escalateCase = (caseId: number, note?: string, actor = 'operator') =>
  postJson<InvestigationCaseDetail>(`/api/v1/investigations/${caseId}/escalate`, { actor, note });

export const resolveCase = (caseId: number, note?: string, actor = 'operator') =>
  postJson<InvestigationCaseDetail>(`/api/v1/investigations/${caseId}/resolve`, { actor, note });

export const dismissCase = (caseId: number, reason: string, note?: string, actor = 'operator') =>
  postJson<InvestigationCaseDetail>(`/api/v1/investigations/${caseId}/dismiss`, { reason, actor, note });

export const analyzeCase = (caseId: number) => postJson<InvestigationCaseDetail>(`/api/v1/investigations/${caseId}/analyze`);

export const askAnalyst = (question: string) =>
  postJson<{ question: string; answer: string; provider: string; model: string }>('/api/v1/assistant/ask', { question });

export const fetchAssistantStatus = () =>
  getJson<{ llm_configured: boolean; model: string; providers: { name: string; model: string; configured: boolean }[] }>(
    '/api/v1/assistant/status',
  );

export type { Evidence };

/** Phase 1 alerts: PATCH /api/v1/alerts/{id}/ack */
export async function acknowledgeAlert(alertId: number): Promise<{ acknowledged: boolean }> {
  const res = await fetch(`${API_BASE}/api/v1/alerts/${alertId}/ack`, { method: 'PATCH', headers: session.headers() });
  if (!res.ok) throw new Error(`acknowledge failed with ${res.status}`);
  return res.json();
}
