import React, { useEffect, useMemo, useState } from 'react';
import { InvestigationCaseDetail } from '../types/surveillance';
import {
  analyzeCase, assignCase, dismissCase, escalateCase, fetchInvestigation, fetchVesselAisTrack, fetchAisGaps, resolveCase,
} from '../services/surveillance';
import { formatClock } from '../design/format';
import { riskColor } from '../design/risk';
import { splitTrackAtGaps, TrackSegment } from '../design/track';
import { renderMarkdownLite } from '../design/markdownLite';
import {
  Eyebrow, FactorBar, GhostLink, InfoBadge, Mono, OutlinePill, Panel, PrimaryPill, RiskBadge, RiskNumber, factorTone,
} from '../components/ui/primitives';

const DISMISS_REASONS = [
  ['AIS_EQUIPMENT_FAILURE', 'AIS equipment failure'],
  ['COVERAGE_ISSUE', 'Coverage issue'],
  ['AUTHORIZED_ACTIVITY', 'Authorized activity'],
  ['WEATHER_DISRUPTION', 'Weather'],
  ['DATA_ERROR', 'Data error'],
  ['UNKNOWN', 'Unknown'],
] as const;

const STATUS_LABEL: Record<string, string> = {
  OPEN: 'Open', UNDER_REVIEW: 'Under review', ESCALATED: 'Escalated', RESOLVED: 'Resolved', DISMISSED: 'Dismissed',
};

const EVIDENCE_TONE: Record<string, string> = {
  FISHING_PATTERN: 'CRITICAL', LOITERING: 'ELEVATED', ZONE_ENTRY: 'HIGH', ZONE_EXIT: 'LOW',
  AIS_GAP: 'ELEVATED', VESSEL_RENDEZVOUS: 'MODERATE',
};
const EVIDENCE_LABEL: Record<string, string> = {
  FISHING_PATTERN: 'Fishing', LOITERING: 'Loiter', ZONE_ENTRY: 'Zone', ZONE_EXIT: 'Zone', AIS_GAP: 'AIS gap', VESSEL_RENDEZVOUS: 'Meet',
};

interface Props {
  caseId: number;
  onBack: () => void;
  onShowOnMap: (vesselId: number) => void;
}

/** Small static track sketch for the case card: observed white, estimated dashed amber. */
const TrackSketch: React.FC<{ segments: TrackSegment[] }> = ({ segments }) => {
  const pts = segments.flatMap(s => s.points);
  if (pts.length < 2) return <div className="h-[200px] flex items-center justify-center text-xs text-os-slate">No track stored</div>;
  const lats = pts.map(p => p[0]); const lons = pts.map(p => p[1]);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats), minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const w = 320, h = 200, pad = 18;
  const sx = (lon: number) => pad + ((lon - minLon) / Math.max(maxLon - minLon, 1e-6)) * (w - 2 * pad);
  const sy = (lat: number) => h - pad - ((lat - minLat) / Math.max(maxLat - minLat, 1e-6)) * (h - 2 * pad);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      {segments.map((s, i) => s.points.length > 1 && (
        <polyline key={i} fill="none" points={s.points.map(p => `${sx(p[1])},${sy(p[0])}`).join(' ')}
          stroke={s.kind === 'observed' ? '#ffffff' : '#e2a33a'} strokeWidth="1.5" strokeDasharray={s.kind === 'observed' ? undefined : '4 6'} />
      ))}
      <circle cx={sx(pts[pts.length - 1][1])} cy={sy(pts[pts.length - 1][0])} r="5" fill="#f0483e" stroke="#0e1012" strokeWidth="2" />
    </svg>
  );
};

export const CasePage: React.FC<Props> = ({ caseId, onBack, onShowOnMap }) => {
  const [detail, setDetail] = useState<InvestigationCaseDetail | null>(null);
  const [segments, setSegments] = useState<TrackSegment[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvestigation(caseId).then(d => {
      setDetail(d);
      Promise.all([fetchVesselAisTrack(d.vessel_id), fetchAisGaps(d.vessel_id)])
        .then(([track, gaps]) => setSegments(splitTrackAtGaps(track, gaps))).catch(() => {});
    }).catch(e => setError(String(e.message || e)));
  }, [caseId]);

  const factors = useMemo(() => {
    if (!detail) return [];
    const byFactor = new Map<string, number>();
    for (const e of detail.evidence_snapshot) byFactor.set(e.factor_type, e.strength);
    return Array.from(byFactor, ([type, score]) => ({ type, score })).sort((a, b) => b.score - a.score);
  }, [detail]);

  const act = async (label: string, fn: () => Promise<InvestigationCaseDetail>) => {
    setBusy(label); setError(null);
    try { setDetail(await fn()); } catch (e: any) { setError(e.message || 'Action failed'); } finally { setBusy(null); }
  };

  if (error && !detail) return <div className="p-8 text-os-fog">Could not load case {caseId}: {error}</div>;
  if (!detail) return <div className="p-8 text-os-slate">Loading case…</div>;

  const closed = detail.status === 'RESOLVED' || detail.status === 'DISMISSED';
  const evidence = [...detail.evidence_snapshot].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="h-14 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium">
          <button onClick={onBack} className="text-os-fog hover:text-white">Surveillance</button>
          <span className="text-os-slate">/</span>
          <span className="text-os-fog">Investigations</span>
          <span className="text-os-slate">/</span>
          <span className="text-white">Case {detail.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <OutlinePill className="!py-2 !px-[18px]" disabled={closed || !!busy} onClick={() => act('escalate', () => escalateCase(detail.id))}>Escalate</OutlinePill>
          <OutlinePill className="!py-2 !px-[18px]" disabled={closed || !!busy || !reason}
            onClick={() => reason && act('dismiss', () => dismissCase(detail.id, reason))}>Dismiss</OutlinePill>
          <PrimaryPill className="!py-2 !px-[18px]" disabled={closed || !!busy} onClick={() => act('resolve', () => resolveCase(detail.id))}>Resolve case</PrimaryPill>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-12 gap-4 px-4 pb-4">
        <Panel className="col-span-4 p-6 flex flex-col gap-[22px] overflow-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <InfoBadge tone={closed ? 'muted' : 'info'}>{STATUS_LABEL[detail.status]}</InfoBadge>
              <Eyebrow>Case {detail.id} · opened {formatClock(detail.created_at)}</Eyebrow>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight leading-[1.33]">{detail.vessel.name}</span>
            <Mono className="text-xs text-os-ash">
              {detail.vessel.vessel_type} · MMSI {detail.vessel.mmsi ?? '—'} · flag {detail.vessel.flag ?? '—'}
            </Mono>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-baseline gap-3">
              <RiskNumber score={detail.risk_score} size="display" />
              <RiskBadge level={detail.risk_level} />
            </div>
            <FactorBar factors={factors} />
            <div className="os-mono flex justify-between text-[11px] text-os-slate">
              {factors.map(f => <span key={f.type}>{f.type.split('_')[0].toLowerCase()} {f.score}</span>)}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Eyebrow>Assigned to</Eyebrow>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-input bg-os-raised border border-os-pewter">
              <span className="w-6 h-6 rounded-full bg-os-overlay flex items-center justify-center text-[11px] font-bold text-white">
                {(detail.assigned_to ?? '?').charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-medium text-white">{detail.assigned_to ?? 'Unassigned'}</span>
              {!detail.assigned_to && !closed && (
                <GhostLink className="ml-auto text-[13px]" disabled={!!busy} onClick={() => act('assign', () => assignCase(detail.id, 'analyst.a'))}>Assign to me</GhostLink>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Eyebrow>Summary</Eyebrow>
            <span className="text-[15px] leading-relaxed text-os-fog">{detail.summary}</span>
          </div>

          {!closed && (
            <div className="flex flex-col gap-2.5 mt-auto">
              <Eyebrow>Dismiss reason</Eyebrow>
              <div className="flex flex-wrap gap-1.5">
                {DISMISS_REASONS.map(([value, label]) => (
                  <button key={value} onClick={() => setReason(reason === value ? null : value)}
                    className={`text-xs font-medium px-3 py-1 rounded-pill transition-colors ${
                      reason === value ? 'bg-os-signal text-white' : 'text-os-fog border border-os-pewter hover:text-white'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {detail.dismissed_reason && (
            <div className="flex flex-col gap-1 mt-auto"><Eyebrow>Dismissed as</Eyebrow><span className="text-sm text-os-fog">{detail.dismissed_reason.replace(/_/g, ' ').toLowerCase()}</span></div>
          )}
          {error && <span className="text-xs" style={{ color: '#f0483e' }}>{error}</span>}
        </Panel>

        <div className="col-span-5 flex flex-col gap-4 min-h-0">
          <Panel className="p-6 flex flex-col gap-4 flex-1 min-h-0 overflow-auto">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-white">Evidence</span>
              <Mono className="text-xs text-os-slate">snapshot frozen at {formatClock(detail.created_at)}</Mono>
            </div>
            <div className="flex flex-col">
              {evidence.map((e, i) => (
                <div key={e.id ?? i} className={`grid grid-cols-[56px_72px_minmax(0,1fr)_48px] gap-3 items-center py-3 ${i < evidence.length - 1 ? 'border-b border-os-raised' : ''}`}>
                  <Mono className="text-xs text-os-slate">{formatClock(e.timestamp)}</Mono>
                  <span className="os-eyebrow text-center px-1.5 py-[3px] rounded-badge"
                    style={{ background: `${riskColor(EVIDENCE_TONE[e.evidence_type] as any ?? 'LOW')}1f`, color: riskColor(EVIDENCE_TONE[e.evidence_type] as any ?? 'LOW') }}>
                    {EVIDENCE_LABEL[e.evidence_type] ?? e.evidence_type.toLowerCase()}
                  </span>
                  <span className="text-[15px] leading-normal text-os-fog">{e.description}</span>
                  <Mono className="text-[13px] text-right" style={{ color: riskColor(factorTone(e.factor_type)) }}>+{Math.round(e.strength)}</Mono>
                </div>
              ))}
              {evidence.length === 0 && <span className="text-sm text-os-fog py-2">No evidence was frozen for this case.</span>}
            </div>
          </Panel>

          <Panel className="p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-white">Analyst narrative</span>
              {detail.agent_summary ? <InfoBadge>Agent</InfoBadge> : (
                <GhostLink className="text-[13px]" disabled={!!busy} onClick={() => act('analyze', () => analyzeCase(detail.id))}>
                  {busy === 'analyze' ? 'Writing…' : 'Generate narrative →'}
                </GhostLink>
              )}
            </div>
            {detail.agent_summary ? (
              <div className="text-[15px] leading-relaxed text-os-fog max-h-56 overflow-auto pr-1">{renderMarkdownLite(detail.agent_summary)}</div>
            ) : (
              <span className="text-sm text-os-ash">The investigation crew reads the evidence and writes a headline, benign explanations to rule out, and a recommended action.</span>
            )}
          </Panel>
        </div>

        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          <Panel className="overflow-hidden flex flex-col">
            <div className="relative bg-[#10141a]">
              <TrackSketch segments={segments} />
              <span className="absolute left-4 top-3.5 text-[13px] font-medium text-white">Track snapshot</span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <GhostLink className="text-sm" onClick={() => onShowOnMap(detail.vessel_id)}>Open on map →</GhostLink>
            </div>
          </Panel>
          <Panel className="p-6 flex flex-col gap-3.5 flex-1 min-h-0 overflow-auto">
            <span className="text-lg font-medium text-white">Audit log</span>
            <div className="flex flex-col gap-3">
              {detail.audit_log.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <Mono className="text-xs text-os-slate w-10 shrink-0">{formatClock(a.timestamp)}</Mono>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[13px] font-medium text-white">{a.action.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())}</span>
                    <span className="text-xs text-os-ash truncate">{a.actor}{a.note ? ` · ${a.note}` : ''}</span>
                  </div>
                </div>
              ))}
            </div>
            <span className="text-[13px] leading-normal text-os-slate mt-auto">Every decision is logged with who made it and why. Dismissals feed the false-positive dataset.</span>
          </Panel>
        </div>
      </div>
    </div>
  );
};

