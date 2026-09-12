import React from 'react';
import { Vessel } from '../../types';
import { formatClock, formatDuration, formatKm } from '../../design/format';
import { EventBadge, Mono, Panel } from '../ui/primitives';

export interface FeedEvent {
  key: string;
  event_type: string;
  vessel_id: number | null;
  timestamp: string;
  payload: Record<string, any>;
  zone_name?: string | null;
}

interface Props {
  events: FeedEvent[];
  vessels: Vessel[];
  streaming: boolean;
  onSelectVessel: (vesselId: number) => void;
}

export function describeEvent(e: FeedEvent, vesselName: string): React.ReactNode {
  const p = e.payload || {};
  switch (e.event_type) {
    case 'AIS_GAP_DETECTED':
      return <>{vesselName} dark for <Mono>{formatDuration(p.duration_seconds ?? 0)}</Mono></>;
    case 'ZONE_ENTRY':
      return <>{vesselName} entered {e.zone_name ?? p.zone_name ?? 'a zone'}</>;
    case 'ZONE_EXIT':
      return <>{vesselName} left {e.zone_name ?? p.zone_name ?? 'a zone'}{p.dwell_seconds ? <> after <Mono>{formatDuration(p.dwell_seconds)}</Mono></> : null}</>;
    case 'FISHING_PATTERN':
      return <>{vesselName} fishing-like, <Mono>{Math.round(p.score ?? 0)}/100</Mono></>;
    case 'LOITERING':
      return <>{vesselName} loitering, <Mono>{Math.round(p.score ?? 0)}/100</Mono></>;
    case 'VESSEL_RENDEZVOUS':
      return <>{vesselName} met another vessel{p.minimum_distance_km ? <> within <Mono>{formatKm(p.minimum_distance_km)}</Mono></> : null}</>;
    case 'HIGH_RISK_VESSEL':
      return <>{vesselName} scored <Mono>{Math.round(p.score ?? 0)}</Mono> {p.level?.toLowerCase()}</>;
    case 'CASE_CREATED':
      return <>Case opened for {vesselName}</>;
    default:
      return <>{vesselName} · {(e.event_type || '').replace(/_/g, ' ').toLowerCase()}</>;
  }
}

export const EventsPanel: React.FC<Props> = ({ events, vessels, streaming, onSelectVessel }) => {
  const nameOf = (id: number | null) => vessels.find(v => v.id === id)?.name ?? (id ? `Vessel ${id}` : 'Fleet');
  return (
    <Panel className="w-[320px] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium text-white">Events</span>
        <span className="os-eyebrow flex items-center gap-1.5" style={{ color: streaming ? '#2fae6e' : '#566171' }}>
          <span className={`w-1.5 h-1.5 rounded-full ${streaming ? 'os-live-dot' : ''}`} style={{ background: streaming ? '#2fae6e' : '#566171' }} />
          {streaming ? 'Streaming' : 'Paused'}
        </span>
      </div>
      {events.length === 0 ? (
        <span className="text-sm text-os-fog py-2">Nothing detected yet.</span>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[168px] overflow-hidden">
          {events.slice(0, 6).map(e => (
            <button key={e.key} onClick={() => e.vessel_id && onSelectVessel(e.vessel_id)} className="flex items-center gap-2.5 text-left">
              <Mono className="text-xs text-os-slate w-10 shrink-0">{formatClock(e.timestamp)}</Mono>
              <EventBadge type={e.event_type} />
              <span className="text-[13px] text-os-fog truncate">{describeEvent(e, nameOf(e.vessel_id))}</span>
            </button>
          ))}
        </div>
      )}
    </Panel>
  );
};
