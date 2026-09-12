import React, { useEffect, useMemo, useState } from 'react';
import { Vessel } from '../../types';
import { fetchSurveillanceEvents } from '../../services/surveillance';
import { buildTimeline, TimelineEntry } from '../../design/timeline';
import { formatClock } from '../../design/format';
import { riskColor } from '../../design/risk';
import { describeEvent, FeedEvent } from './EventsPanel';
import { EventBadge, Eyebrow, GhostLink, Mono, Panel } from '../ui/primitives';

interface Props {
  vessel: Vessel;
  vessels: Vessel[];
  /** Live feed entries already on screen; merged with the stored history. */
  liveEvents: FeedEvent[];
  onBack: () => void;
}

const DOT_TONE: Record<string, string> = {
  FISHING_PATTERN: 'CRITICAL', ZONE_ENTRY: 'HIGH', AIS_GAP_DETECTED: 'ELEVATED', LOITERING: 'ELEVATED',
  VESSEL_RENDEZVOUS: 'MODERATE', HIGH_RISK_VESSEL: 'CRITICAL', CASE_CREATED: 'CRITICAL', BEHAVIOR_DEVIATION: 'MODERATE',
};

export const TimelinePanel: React.FC<Props> = ({ vessel, vessels, liveEvents, onBack }) => {
  const [stored, setStored] = useState<FeedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSurveillanceEvents(200, vessel.id)
      .then(rows => setStored(rows.map(ev => ({
        key: `db-${ev.id}`, event_type: ev.event_type, vessel_id: ev.vessel_id, timestamp: ev.timestamp,
        payload: { ...ev.payload, score: ev.score, other_vessel_id: ev.other_vessel_id }, zone_name: ev.zone_name,
      }))))
      .catch(() => setStored([]))
      .finally(() => setLoading(false));
  }, [vessel.id]);

  const entries: TimelineEntry[] = useMemo(
    () => buildTimeline([...stored, ...liveEvents.filter(e => e.vessel_id === vessel.id)]),
    [stored, liveEvents, vessel.id],
  );
  const nameOf = (id: number | null) => vessels.find(v => v.id === id)?.name ?? (id ? `Vessel ${id}` : 'Fleet');
  const first = entries[0]?.timestamp;
  const last = entries[entries.length - 1]?.timestamp;

  return (
    <Panel className="w-[376px] h-full p-6 flex flex-col gap-5 overflow-hidden">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Eyebrow>Timeline · vessel {vessel.id}</Eyebrow>
          <GhostLink className="text-[13px]" onClick={onBack}>← Vessel</GhostLink>
        </div>
        <span className="text-2xl font-bold text-white tracking-tight leading-[1.33]">{vessel.name}</span>
        <Mono className="text-xs text-os-ash">
          {entries.length} detections{first && last ? ` · ${formatClock(first)} to ${formatClock(last)}` : ''}
        </Mono>
      </div>

      <div className="flex-1 min-h-0 overflow-auto pr-1">
        {loading && entries.length === 0 && <span className="text-sm text-os-fog">Loading history…</span>}
        {!loading && entries.length === 0 && <span className="text-sm text-os-fog">Nothing has been detected for this vessel.</span>}
        <ol className="relative flex flex-col">
          {entries.map((e, i) => {
            const tone = riskColor((DOT_TONE[e.event_type] ?? 'LOW') as any);
            return (
              <li key={e.key} className="relative flex gap-3 pl-1">
                <div className="flex flex-col items-center shrink-0 w-3">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-[5px] ${e.hourBoundary ? '' : 'opacity-80'}`}
                    style={{ background: tone, boxShadow: `0 0 0 2px #15171b` }} />
                  {i < entries.length - 1 && <span className="w-px flex-1 bg-os-steel" />}
                </div>
                <div className={`flex flex-col gap-1 flex-1 min-w-0 pb-4 ${e.hourBoundary && i > 0 ? 'pt-2' : ''}`}>
                  <div className="flex items-center gap-2">
                    <Mono className={`text-xs ${e.hourBoundary ? 'text-white font-medium' : 'text-os-slate'}`}>{formatClock(e.timestamp)}</Mono>
                    <EventBadge type={e.event_type} />
                  </div>
                  <span className="text-[13px] leading-normal text-os-fog">{describeEvent(e, nameOf(e.vessel_id))}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <span className="text-[13px] leading-normal text-os-slate">
        Detections in the order they happened. Hour marks are in white; the map trail and dashed gaps show the same story in space.
      </span>
    </Panel>
  );
};
