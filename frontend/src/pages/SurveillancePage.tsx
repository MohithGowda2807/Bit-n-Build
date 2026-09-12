import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { Vessel } from '../types';
import {
  DarkPeriod, FishingZone, InvestigationCase, LiveSurveillanceEvent, ProtectedArea, ReplayStep, ScenarioInfo, VesselBaseline, VesselRisk, VesselRiskSummary,
} from '../types/surveillance';
import { splitTrackAtGaps, TrackSegment } from '../design/track';
import { darkSpans, timeProgress } from '../design/replay';
import { formatClock } from '../design/format';

const OPEN_STATUSES = new Set(['OPEN', 'UNDER_REVIEW', 'ESCALATED']);

function prettyScenario(name: string): string {
  return name.toLowerCase().replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

interface Props {
  initialSelectedId?: number | null;
  onOpenCase: (caseId: number) => void;
}

export const SurveillancePage: React.FC<Props> = ({ initialSelectedId = null, onOpenCase }) => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [fishingZones, setFishingZones] = useState<FishingZone[]>([]);
  const [protectedAreas, setProtectedAreas] = useState<ProtectedArea[]>([]);
  const [risks, setRisks] = useState<VesselRiskSummary[]>([]);
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioInfo[]>([]);
  const [scenario, setScenario] = useState('DARK_FISHING_COMPOSITE');
  const [running, setRunning] = useState(false);
  const [streaming, setStreaming] = useState(telemetry.connected);

  const [basemap, setBasemap] = useState<Basemap>('night');
  const [layers, setLayers] = useState<LayerState>({ vessels: true, trails: true, zones: true, gaps: true });

  const [selectedId, setSelectedId] = useState<number | null>(initialSelectedId);
  const [panel, setPanel] = useState<'vessel' | 'analyst' | 'timeline'>('vessel');
  const [analystQuestion, setAnalystQuestion] = useState<string | undefined>(undefined);
  const [replay, setReplay] = useState<ReplayState | null>(null);
  const [replayPositions, setReplayPositions] = useState<Map<number, [number, number]>>(new Map());
  const [risk, setRisk] = useState<VesselRisk | null>(null);
  const [baseline, setBaseline] = useState<VesselBaseline | null>(null);
  const [segments, setSegments] = useState<TrackSegment[]>([]);
  const [gaps, setGaps] = useState<DarkPeriod[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const riskByVessel = useMemo(() => new Map(risks.map(r => [r.vessel_id, r])), [risks]);
  const openCases = useMemo(() => cases.filter(c => OPEN_STATUSES.has(c.status)), [cases]);
  const selected = useMemo(() => vessels.find(v => v.id === selectedId) ?? null, [vessels, selectedId]);

  const loadFleet = useCallback(async () => {
    const [v, r, c, e] = await Promise.all([
      fetchVessels(), fetchRiskList(), fetchInvestigations(), fetchSurveillanceEvents(40),
    ]);
    setVessels(v);
    setRisks(r);
    setCases(c);
    setEvents(e.map(ev => ({
      key: `db-${ev.id}`, event_type: ev.event_type, vessel_id: ev.vessel_id, timestamp: ev.timestamp,
      payload: { ...ev.payload, score: ev.score, other_vessel_id: ev.other_vessel_id }, zone_name: ev.zone_name,
    })));
    return r;
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
      setRisk(riskDetail);
      setBaseline(vesselBaseline);
      setGaps(vesselGaps);
      setSegments(splitTrackAtGaps(track, vesselGaps));
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFleet().catch(() => {});
    fetchFishingZones().then(setFishingZones).catch(() => {});
    fetchProtectedAreas().then(setProtectedAreas).catch(() => {});
    fetchScenarios().then(setScenarios).catch(() => {});
  }, [loadFleet]);

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
        fetchInvestigations().then(setCases).catch(() => {});
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
    } finally {
      setRunning(false);
    }
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
      setReplay({ scenario, simTime: null, step: 0, totalSteps: 0, progress: 0, done: true, startTime: null, endTime: null, darkWindows: [] });
    } finally {
      setRunning(false);
    }
  };

  const exitReplay = () => { setReplay(null); setReplayPositions(new Map()); };

  const toggleLayer = (k: keyof LayerState) => setLayers(l => ({ ...l, [k]: !l[k] }));
  const rightInset = panel === 'analyst' ? 472 : selected ? 408 : 16;

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

      {/* Layer chips and scenario runner */}
      <div className="absolute left-[352px] top-4 z-[1000] flex items-center gap-2 os-reveal">
        <FilterPill active={layers.vessels} onClick={() => toggleLayer('vessels')}>Vessels</FilterPill>
        <FilterPill active={layers.trails} onClick={() => toggleLayer('trails')}>Trails</FilterPill>
        <FilterPill active={layers.zones} onClick={() => toggleLayer('zones')}>Zones</FilterPill>
        <FilterPill active={layers.gaps} onClick={() => toggleLayer('gaps')}>AIS gaps</FilterPill>
        <span className="w-px h-6 bg-os-pewter mx-1" />
        <select
          value={scenario}
          onChange={e => setScenario(e.target.value)}
          className="os-mono text-xs bg-os-raised text-os-fog border border-os-pewter rounded-input px-2.5 py-1.5 focus:outline-none"
        >
          {(scenarios.length ? scenarios.map(s => s.name) : [scenario]).map(name => (
            <option key={name} value={name}>{prettyScenario(name)}</option>
          ))}
        </select>
        <PrimaryPill className="!py-1.5 !px-4 text-[13px]" onClick={onRunScenario} disabled={running}>
          {running ? 'Running…' : 'Run scenario'}
        </PrimaryPill>
        <OutlinePill className="!py-1.5 !px-4 text-[13px]" onClick={onReplay} disabled={running || (!!replay && !replay.done)}>Replay</OutlinePill>
      </div>

      {/* Basemap: Chart keeps the light chart look, Night is the surveillance default. */}
      <div className="absolute z-[1000] flex gap-2" style={{ right: rightInset, bottom: replay ? 88 : 16 }}>
        {(['night', 'chart'] as Basemap[]).map(b => (
          <FilterPill key={b} active={basemap === b} onClick={() => setBasemap(b)}>{b === 'night' ? 'Night' : 'Chart'}</FilterPill>
        ))}
      </div>

      <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-4">
        <Watchlist risks={risks} vessels={vessels} openCases={openCases} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      <div className="absolute left-4 bottom-4 z-[1000]">
        <EventsPanel events={events} vessels={vessels} streaming={streaming} onSelectVessel={setSelectedId} />
      </div>

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
        <div className="absolute bottom-4 z-[1000]" style={{ left: 352, right: rightInset }}>
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
