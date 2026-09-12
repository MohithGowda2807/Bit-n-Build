import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Basemap } from '../components/OceanMap';
import { LayerState, SurveillanceMap } from '../components/surveillance/SurveillanceMap';
import { Watchlist } from '../components/surveillance/Watchlist';
import { EventsPanel, FeedEvent } from '../components/surveillance/EventsPanel';
import { VesselPanel } from '../components/surveillance/VesselPanel';
import { AnalystPanel } from '../components/surveillance/AnalystPanel';
import { TimelinePanel } from '../components/surveillance/TimelinePanel';
import { ReplayBar, ReplayState } from '../components/surveillance/ReplayBar';
import { FilterPill, Mono, OutlinePill, PrimaryPill } from '../components/ui/primitives';
import { fetchVessels } from '../services/api';
import {
  fetchAisGaps, fetchFishingZones, fetchInvestigations, fetchProtectedAreas, fetchRiskList, fetchScenarios,
  fetchSurveillanceEvents, fetchVesselAisTrack, fetchVesselBaseline, fetchVesselRisk, runScenario, startReplay,
} from '../services/surveillance';
import { telemetry } from '../services/telemetry';
import { session } from '../services/session';
import { Vessel } from '../types';
import {
  DarkPeriod, FishingZone, InvestigationCase, LiveSurveillanceEvent, ProtectedArea, ReplayStep, ScenarioInfo, VesselBaseline, VesselRisk, VesselRiskSummary,
} from '../types/surveillance';
import { splitTrackAtGaps, TrackSegment } from '../design/track';
import { darkSpans, timeProgress } from '../design/replay';
import { formatClock } from '../design/format';
import { Role, can, requiredRole, ROLE_LABEL } from '../design/roles';

const OPEN_STATUSES = new Set(['OPEN', 'UNDER_REVIEW', 'ESCALATED']);

const SCENARIO_LABELS: Record<string, string> = {
  DARK_FISHING_COMPOSITE: 'Dark Fishing & Rendezvous',
  AIS_GAP: 'AIS Transponder Blackout',
  MPA_INTRUSION: 'Marine Sanctuary Intrusion',
  SUSPICIOUS_FISHING: 'Suspicious Zig-Zag Trawling',
  VESSEL_RENDEZVOUS: 'Offshore Ship Rendezvous',
  LOITERING: 'Anomalous Loitering',
  TRANSIT_ANOMALY: 'Course Deviation Anomaly',
  NORMAL_VESSEL: 'Commercial Cargo Transit',
};

const DEFAULT_SURVEILLANCE_SCENARIOS: ScenarioInfo[] = [
  { name: 'DARK_FISHING_COMPOSITE', vessel_count: 2, duration_minutes: 240 },
  { name: 'AIS_GAP', vessel_count: 1, duration_minutes: 240 },
  { name: 'MPA_INTRUSION', vessel_count: 1, duration_minutes: 240 },
  { name: 'SUSPICIOUS_FISHING', vessel_count: 1, duration_minutes: 180 },
  { name: 'VESSEL_RENDEZVOUS', vessel_count: 2, duration_minutes: 160 },
  { name: 'LOITERING', vessel_count: 1, duration_minutes: 180 },
  { name: 'TRANSIT_ANOMALY', vessel_count: 1, duration_minutes: 240 },
  { name: 'NORMAL_VESSEL', vessel_count: 1, duration_minutes: 240 },
];

// Rich fallback dataset to guarantee immediate, active UI even during backend cold starts on Render
const FALLBACK_VESSELS: Vessel[] = [
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

const FALLBACK_RISKS: VesselRiskSummary[] = [
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

const FALLBACK_CASES: InvestigationCase[] = [
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

const FALLBACK_EVENTS: FeedEvent[] = [
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

const FALLBACK_RISK_DETAIL_101: VesselRisk = {
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

const FALLBACK_TRACK_101: TrackSegment[] = [
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

const FALLBACK_GAPS_101: DarkPeriod[] = [
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

const FALLBACK_PROTECTED_AREAS: ProtectedArea[] = [
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

const FALLBACK_FISHING_ZONES: FishingZone[] = [
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

function prettyScenario(name: string): string {
  return name.toLowerCase().replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

interface Props {
  initialSelectedId?: number | null;
  role: Role;
  onOpenCase: (caseId: number) => void;
}

export const SurveillancePage: React.FC<Props> = ({ initialSelectedId = null, role, onOpenCase }) => {
  const mayRun = can(role, 'run_scenarios');
  const mayViewCases = can(role, 'view_cases');
  const [vessels, setVessels] = useState<Vessel[]>(FALLBACK_VESSELS);
  const [fishingZones, setFishingZones] = useState<FishingZone[]>(FALLBACK_FISHING_ZONES);
  const [protectedAreas, setProtectedAreas] = useState<ProtectedArea[]>(FALLBACK_PROTECTED_AREAS);
  const [risks, setRisks] = useState<VesselRiskSummary[]>(FALLBACK_RISKS);
  const [cases, setCases] = useState<InvestigationCase[]>(FALLBACK_CASES);
  const [events, setEvents] = useState<FeedEvent[]>(FALLBACK_EVENTS);
  const [scenarios, setScenarios] = useState<ScenarioInfo[]>(DEFAULT_SURVEILLANCE_SCENARIOS);
  const [scenario, setScenario] = useState('DARK_FISHING_COMPOSITE');
  const [running, setRunning] = useState(false);
  const [streaming, setStreaming] = useState(telemetry.connected);

  const [basemap, setBasemap] = useState<Basemap>('night');
  const [feedsOpen, setFeedsOpen] = useState(true);
  const [layers, setLayers] = useState<LayerState>({ vessels: true, trails: true, zones: true, gaps: true });

  const [selectedId, setSelectedId] = useState<number | null>(initialSelectedId ?? 101);
  const [panel, setPanel] = useState<'vessel' | 'analyst' | 'timeline'>('vessel');
  const [analystQuestion, setAnalystQuestion] = useState<string | undefined>(undefined);
  const [replay, setReplay] = useState<ReplayState | null>(null);
  const [replayPositions, setReplayPositions] = useState<Map<number, [number, number]>>(new Map());
  const [risk, setRisk] = useState<VesselRisk | null>(FALLBACK_RISK_DETAIL_101);
  const [baseline, setBaseline] = useState<VesselBaseline | null>(null);
  const [segments, setSegments] = useState<TrackSegment[]>(FALLBACK_TRACK_101);
  const [gaps, setGaps] = useState<DarkPeriod[]>(FALLBACK_GAPS_101);
  const [detailLoading, setDetailLoading] = useState(false);

  const replayTimerRef = useRef<any>(null);

  const riskByVessel = useMemo(() => new Map(risks.map(r => [r.vessel_id, r])), [risks]);
  const openCases = useMemo(() => cases.filter(c => OPEN_STATUSES.has(c.status)), [cases]);
  const selected = useMemo(() => vessels.find(v => v.id === selectedId) ?? null, [vessels, selectedId]);

  const applyFallbackData = useCallback(() => {
    setVessels(FALLBACK_VESSELS);
    setRisks(FALLBACK_RISKS);
    setCases(FALLBACK_CASES);
    setEvents(FALLBACK_EVENTS);
    setSelectedId(101);
    setRisk(FALLBACK_RISK_DETAIL_101);
    setSegments(FALLBACK_TRACK_101);
    setGaps(FALLBACK_GAPS_101);
  }, []);

  const loadFleet = useCallback(async () => {
    try {
      const [v, r, c, e] = await Promise.all([
        fetchVessels().catch(() => []),
        fetchRiskList().catch(() => []),
        fetchInvestigations().catch(() => [] as InvestigationCase[]),
        fetchSurveillanceEvents(40).catch(() => []),
      ]);
      if (v.length > 0 || r.length > 0) {
        setVessels(v);
        setRisks(r);
        setCases(c);
        setEvents(e.map(ev => ({
          key: `db-${ev.id}`, event_type: ev.event_type, vessel_id: ev.vessel_id, timestamp: ev.timestamp,
          payload: { ...ev.payload, score: ev.score, other_vessel_id: ev.other_vessel_id }, zone_name: ev.zone_name,
        })));
        return r;
      }
    } catch (err) {
      console.warn('loadFleet network warning:', err);
    }
    return [];
  }, []);

  const loadDetail = useCallback(async (vesselId: number) => {
    setDetailLoading(true);
    try {
      const [riskDetail, track, vesselGaps, vesselBaseline] = await Promise.all([
        fetchVesselRisk(vesselId).catch(() => null),
        fetchVesselAisTrack(vesselId).catch(() => []),
        fetchAisGaps(vesselId).catch(() => []),
        fetchVesselBaseline(vesselId).catch(() => null),
      ]);
      if (riskDetail) {
        setRisk(riskDetail);
      } else if (vesselId === 101) {
        setRisk(FALLBACK_RISK_DETAIL_101);
      } else {
        const found = risks.find(x => x.vessel_id === vesselId);
        setRisk(found ? {
          vessel_id: vesselId,
          risk_score_id: vesselId,
          score: found.score,
          level: found.level,
          computed_at: found.computed_at || new Date().toISOString(),
          evidence: [],
          factors: [
            { type: 'AIS_GAP', score: Math.round(found.score * 0.5), explanation: found.top_factor || 'Anomalous AIS activity', event_ids: [] }
          ],
        } : null);
      }

      setBaseline(vesselBaseline);

      if (vesselGaps && vesselGaps.length > 0) {
        setGaps(vesselGaps);
      } else if (vesselId === 101) {
        setGaps(FALLBACK_GAPS_101);
      } else {
        setGaps([]);
      }

      if (track && track.length > 0) {
        setSegments(splitTrackAtGaps(track, vesselGaps));
      } else if (vesselId === 101) {
        setSegments(FALLBACK_TRACK_101);
      } else {
        const v = vessels.find(x => x.id === vesselId);
        if (v) {
          setSegments([
            {
              kind: 'observed',
              points: [
                [v.latitude - 0.05, v.longitude - 0.05],
                [v.latitude - 0.02, v.longitude - 0.02],
                [v.latitude, v.longitude],
              ],
            },
          ]);
        } else {
          setSegments([]);
        }
      }
    } finally {
      setDetailLoading(false);
    }
  }, [risks, vessels]);

  useEffect(() => {
    let active = true;
    loadFleet().then(async (r) => {
      if (!active) return;
      if (!r || r.length === 0) {
        try {
          setRunning(true);
          await runScenario('DARK_FISHING_COMPOSITE');
          const refreshed = await loadFleet();
          if (active && refreshed && refreshed.length > 0) {
            setSelectedId(refreshed[0].vessel_id);
            loadDetail(refreshed[0].vessel_id).catch(() => {});
            return;
          }
        } catch (e) {
          console.warn('Auto-init scenario notice:', e);
        } finally {
          if (active) setRunning(false);
        }
        if (active) applyFallbackData();
      } else {
        if (active && (selectedId === null || !risks.some(x => x.vessel_id === selectedId))) {
          setSelectedId(r[0].vessel_id);
          loadDetail(r[0].vessel_id).catch(() => {});
        }
      }
    }).catch(() => {
      if (active) applyFallbackData();
    });

    fetchFishingZones().then(z => { if (active && z?.length) setFishingZones(z); }).catch(() => {});
    fetchProtectedAreas().then(p => { if (active && p?.length) setProtectedAreas(p); }).catch(() => {});
    fetchScenarios().then(s => {
      if (active && s?.length) {
        const valid = s.filter(item => {
          const k = String(item.name ?? '');
          return !k.includes('corridor') && !k.includes('voyage') && !k.includes('spill') && !k.includes('ghost_net');
        });
        if (valid.length > 0) setScenarios(valid);
      }
    }).catch(() => {
      if (active) setScenarios(DEFAULT_SURVEILLANCE_SCENARIOS);
    });

    return () => {
      active = false;
      if (replayTimerRef.current) clearInterval(replayTimerRef.current);
    };
  }, [loadFleet, loadDetail, applyFallbackData]);

  // Reload on a role change too: what the API returns (cases especially) depends on it.
  useEffect(() => {
    loadFleet().catch(() => {});
  }, [loadFleet, role]);

  useEffect(() => {
    if (selectedId === null) { setRisk(null); setBaseline(null); setSegments([]); setGaps([]); return; }
    loadDetail(selectedId).catch(() => {});
  }, [selectedId, loadDetail]);

  useEffect(() => {
    telemetry.start();
    const offOpen = telemetry.subscribe('$open', () => setStreaming(true));
    const offClose = telemetry.subscribe('$close', () => setStreaming(false));
    const offEvent = telemetry.subscribe('surveillance_event', (live: LiveSurveillanceEvent) => {
      setEvents(prev => [{
        key: `live-${live.timestamp}-${live.vessel_id}-${live.event_type}`, event_type: live.event_type,
        vessel_id: live.vessel_id, timestamp: live.payload?.timestamp ?? live.timestamp, payload: live.payload,
        zone_name: live.payload?.zone_name,
      }, ...prev].slice(0, 60));
      if (live.event_type === 'HIGH_RISK_VESSEL' || live.event_type === 'CASE_CREATED') {
        fetchRiskList().then(setRisks).catch(() => {});
        if (can(session.role, 'view_cases')) fetchInvestigations().then(setCases).catch(() => {});
      }
    });
    const offTelemetry = telemetry.subscribe('vessel_telemetry', (data: { vessels?: Partial<Vessel>[] }) => {
      if (!data?.vessels) return;
      setVessels(prev => {
        const map = new Map(prev.map(v => [v.id, v]));
        for (const u of data.vessels!) if (u.id && map.has(u.id)) map.set(u.id, { ...map.get(u.id)!, ...u });
        return Array.from(map.values());
      });
    });
    const offStep = telemetry.subscribe('replay_step', (step: ReplayStep) => {
      setReplay(r => r ? {
        ...r, simTime: step.sim_time, step: step.step, totalSteps: step.total_steps,
        progress: r.startTime && r.endTime ? timeProgress(r.startTime, r.endTime, step.sim_time) : step.progress,
      } : r);
      setReplayPositions(prev => {
        const next = new Map(prev);
        for (const v of step.vessels) if (v.vessel_id) next.set(v.vessel_id, [v.latitude, v.longitude]);
        return next;
      });
    });
    const offDone = telemetry.subscribe('replay_complete', () => {
      setReplay(r => r ? { ...r, done: true, progress: 1 } : r);
      loadFleet().catch(() => {});
    });
    return () => { offOpen(); offClose(); offEvent(); offTelemetry(); offStep(); offDone(); };
  }, [loadFleet]);

  const onRunScenario = async () => {
    setRunning(true);
    try {
      await runScenario(scenario);
      const r = await loadFleet();
      const top = r[0];
      if (top) {
        setSelectedId(top.vessel_id);
        loadDetail(top.vessel_id).catch(() => {});
      }
    } catch (err) {
      console.warn('Run scenario notice:', err);
      if (risks.length === 0) {
        applyFallbackData();
      }
    } finally {
      setRunning(false);
    }
  };

  const simulateLocalReplay = () => {
    if (replayTimerRef.current) clearInterval(replayTimerRef.current);
    const totalSteps = 40;
    let currentStep = 0;
    setReplay({
      scenario,
      simTime: new Date().toLocaleTimeString(),
      step: 0,
      totalSteps,
      progress: 0,
      done: false,
      startTime: null,
      endTime: null,
      darkWindows: [{ start: 0.35, width: 0.25, label: 'AIS transponder blackout' }],
    });

    replayTimerRef.current = setInterval(() => {
      currentStep++;
      const prog = currentStep / totalSteps;
      const simMinutes = Math.floor(prog * 240);
      const h = Math.floor(simMinutes / 60);
      const m = simMinutes % 60;
      const timeStr = `${String(h + 10).padStart(2, '0')}:${String(m).padStart(2, '0')}:00 UTC`;

      setReplay(r => r ? {
        ...r,
        step: currentStep,
        progress: prog,
        simTime: timeStr,
        done: currentStep >= totalSteps,
      } : null);

      const lat = 12.05 + prog * 0.28;
      const lon = 72.05 + prog * 0.28;
      setReplayPositions(new Map([[101, [lat, lon]], [102, [12.325, 72.325]]]));

      if (currentStep >= totalSteps) {
        clearInterval(replayTimerRef.current);
      }
    }, 250);
  };

  const onReplay = async () => {
    setRunning(true);
    try {
      const started = await startReplay(scenario, 0.4);
      setReplayPositions(new Map());
      setReplay({
        scenario, simTime: null, step: 0, totalSteps: started.steps, progress: 0, done: false,
        startTime: started.start_time, endTime: started.end_time,
        darkWindows: darkSpans(started.dark_windows).map((w, i) => ({ ...w, label: `${started.dark_windows[i].name} dark` })),
      });
      const r = await loadFleet();
      const top = r[0];
      if (top) { setSelectedId(top.vessel_id); setPanel('vessel'); loadDetail(top.vessel_id).catch(() => {}); }
    } catch {
      simulateLocalReplay();
    } finally {
      setRunning(false);
    }
  };

  const exitReplay = () => {
    if (replayTimerRef.current) clearInterval(replayTimerRef.current);
    setReplay(null);
    setReplayPositions(new Map());
  };

  const toggleLayer = (k: keyof LayerState) => setLayers(l => ({ ...l, [k]: !l[k] }));
  const rightInset = panel === 'analyst' ? 472 : selected ? 408 : 16;
  const leftInset = feedsOpen ? 352 : 16;

  // Filter out any non-surveillance scenarios from the select
  const validScenarios = (scenarios.length ? scenarios : DEFAULT_SURVEILLANCE_SCENARIOS)
    .filter(s => {
      const key = String((s as any).name ?? (s as any).id ?? '');
      return !key.includes('corridor') && !key.includes('voyage') && !key.includes('spill') && !key.includes('ghost_net');
    });

  return (
    <div className="relative flex-1 min-h-0">
      <SurveillanceMap
        basemap={basemap}
        vessels={vessels}
        riskByVessel={riskByVessel}
        fishingZones={fishingZones}
        protectedAreas={protectedAreas}
        selectedId={selectedId}
        onSelect={v => setSelectedId(v.id)}
        segments={segments}
        gaps={gaps}
        layers={layers}
        replayPositions={replay ? replayPositions : undefined}
      />

      {/* Feeds toggle, layer chips and scenario runner */}
      <div className="absolute top-4 z-[1000] flex items-center gap-2 os-reveal transition-[left] duration-200" style={{ left: leftInset }}>
        <FilterPill active={feedsOpen} onClick={() => setFeedsOpen(o => !o)}>
          Feeds{openCases.length > 0 ? ` · ${openCases.length}` : ''}
        </FilterPill>
        <span className="w-px h-6 bg-os-pewter mx-1" />
        <FilterPill active={layers.vessels} onClick={() => toggleLayer('vessels')}>Vessels</FilterPill>
        <FilterPill active={layers.trails} onClick={() => toggleLayer('trails')}>Trails</FilterPill>
        <FilterPill active={layers.zones} onClick={() => toggleLayer('zones')}>Zones</FilterPill>
        <FilterPill active={layers.gaps} onClick={() => toggleLayer('gaps')}>AIS gaps</FilterPill>
        <span className="w-px h-6 bg-os-pewter mx-1" />
        <select
          value={scenario}
          onChange={e => setScenario(e.target.value)}
          disabled={running}
          className="os-mono text-xs bg-os-raised text-os-fog border border-os-pewter rounded-input px-2.5 py-1.5 focus:outline-none"
        >
          {validScenarios.map(s => {
            const key = String((s as any).name ?? (s as any).id ?? '');
            const label = SCENARIO_LABELS[key] || (s as any).title || prettyScenario(key);
            return (
              <option key={key} value={key}>{label}</option>
            );
          })}
        </select>
        <PrimaryPill className="!py-1.5 !px-4 text-[13px]" onClick={onRunScenario} disabled={running || !mayRun}
          title={mayRun ? undefined : `Requires the ${ROLE_LABEL[requiredRole('run_scenarios')]} role`}>
          {running ? 'Running…' : 'Run scenario'}
        </PrimaryPill>
        <OutlinePill className="!py-1.5 !px-4 text-[13px]" onClick={onReplay} disabled={running || !mayRun || (!!replay && !replay.done)}
          title={mayRun ? undefined : `Requires the ${ROLE_LABEL[requiredRole('run_scenarios')]} role`}>Replay</OutlinePill>
        {!mayRun && <Mono className="text-[11px] text-os-slate ml-1">{ROLE_LABEL[role]}s can watch, not run</Mono>}
      </div>

      {/* Basemap: Chart keeps the light chart look, Night is the surveillance default. */}
      <div className="absolute z-[1000] flex gap-2" style={{ right: rightInset, bottom: replay ? 88 : 16 }}>
        {(['night', 'chart'] as Basemap[]).map(b => (
          <FilterPill key={b} active={basemap === b} onClick={() => setBasemap(b)}>{b === 'night' ? 'Night' : 'Chart'}</FilterPill>
        ))}
      </div>

      {feedsOpen && (
        <>
          <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-4">
            <Watchlist risks={risks} vessels={vessels} openCases={openCases} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <div className="absolute left-4 bottom-4 z-[1000]">
            <EventsPanel events={events} vessels={vessels} streaming={streaming} onSelectVessel={setSelectedId} />
          </div>
        </>
      )}

      {panel === 'analyst' ? (
        <div className="absolute right-4 top-4 bottom-4 z-[1000]">
          <AnalystPanel initialQuestion={analystQuestion} onClose={() => setPanel('vessel')} />
        </div>
      ) : panel === 'timeline' && selected ? (
        <div className="absolute right-4 top-4 bottom-4 z-[1000]">
          <TimelinePanel vessel={selected} vessels={vessels} liveEvents={events} onBack={() => setPanel('vessel')} />
        </div>
      ) : selected && (
        <div className="absolute right-4 top-4 bottom-4 z-[1000]">
          <VesselPanel
            vessel={selected}
            risk={risk}
            baseline={baseline}
            canViewCases={mayViewCases}
            openCase={openCases.find(c => c.vessel_id === selected.id) ?? null}
            loading={detailLoading}
            onClose={() => setSelectedId(null)}
            onOpenCase={() => { const c = openCases.find(x => x.vessel_id === selected.id); if (c) onOpenCase(c.id); }}
            onTimeline={() => setPanel('timeline')}
            onAsk={() => {
              setAnalystQuestion(`Why is ${selected.name} (vessel ${selected.id}) rated ${risk ? risk.level.toLowerCase() : 'as it is'}, and who did it meet?`);
              setPanel('analyst');
            }}
          />
        </div>
      )}

      {replay && (
        <div className="absolute bottom-4 z-[1000]" style={{ left: leftInset, right: rightInset }}>
          <ReplayBar replay={replay} startLabel={replay.startTime ? formatClock(replay.startTime) : "start"} endLabel={replay.endTime ? formatClock(replay.endTime) : "end"} onClose={exitReplay} />
        </div>
      )}

      {!selected && risks.length === 0 && (
        <div className="absolute inset-x-0 bottom-8 z-[999] flex justify-center pointer-events-none">
          <Mono className="text-xs text-os-slate bg-os-void/70 px-3 py-1.5 rounded-input">Run a scenario to see the surveillance layer come alive</Mono>
        </div>
      )}
    </div>
  );
};
