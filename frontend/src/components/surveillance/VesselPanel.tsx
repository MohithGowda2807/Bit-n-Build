import React from 'react';
import { Vessel } from '../../types';
import { InvestigationCase, VesselRisk } from '../../types/surveillance';
import { formatClock, formatLatLon } from '../../design/format';
import { riskColor } from '../../design/risk';
import { Eyebrow, FactorBar, GhostLink, Mono, OutlinePill, Panel, PrimaryPill, RiskBadge, RiskNumber, factorTone } from '../ui/primitives';

interface Props {
  vessel: Vessel;
  risk: VesselRisk | null;
  openCase: InvestigationCase | null;
  loading: boolean;
  onClose: () => void;
  onOpenCase: () => void;
  onAsk: () => void;
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5" fill="none" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
);

export const VesselPanel: React.FC<Props> = ({ vessel, risk, openCase, loading, onClose, onOpenCase, onAsk }) => {
  const factors = risk?.factors ?? [];
  return (
    <Panel className="w-[376px] h-full p-6 flex flex-col gap-5 overflow-hidden">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Eyebrow>Vessel {vessel.id} · {vessel.vessel_type.toLowerCase()}{vessel.flag ? ` · flag ${vessel.flag}` : ''}</Eyebrow>
          <button onClick={onClose} className="text-os-ash hover:text-white" aria-label="Close"><CloseIcon /></button>
        </div>
        <span className="text-2xl font-bold text-white tracking-tight leading-[1.33]">{vessel.name}</span>
        <Mono className="text-xs text-os-ash">
          {vessel.mmsi ? `MMSI ${vessel.mmsi} · ` : ''}{formatLatLon(vessel.latitude, vessel.longitude)} · {vessel.speed_knots?.toFixed(1) ?? '0.0'} kn · {String(Math.round(vessel.heading)).padStart(3, '0')}°
        </Mono>
      </div>

      {risk ? (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-baseline gap-3">
            <RiskNumber score={risk.score} size="display" />
            <RiskBadge level={risk.level} />
            <Mono className="text-xs text-os-slate ml-auto">computed {formatClock(risk.computed_at)}</Mono>
          </div>
          <FactorBar factors={factors} />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-os-fog">{loading ? 'Assessing…' : 'Not assessed.'}</span>
          {!loading && <span className="text-xs text-os-ash">This vessel has no AIS observations in the surveillance store.</span>}
        </div>
      )}

      <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-auto pr-1">
        {factors.length > 0 && <Eyebrow>Evidence, strongest first</Eyebrow>}
        {factors.map(f => (
          <div key={f.type} className="flex gap-3">
            <Mono className="text-[13px] w-8 shrink-0" style={{ color: riskColor(factorTone(f.type)) }}>+{f.score}</Mono>
            <span className="text-[15px] leading-relaxed text-os-fog">{f.explanation}</span>
          </div>
        ))}
        {risk && (
          <span className="text-[13px] leading-normal text-os-slate mt-1">
            A suspicion indicator for human review. Equipment failure, coverage loss or an authorized transfer would explain parts of this pattern.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <PrimaryPill className="flex-1" onClick={onOpenCase} disabled={!openCase && !(risk && risk.score > 80)}>
            {openCase ? `Case ${openCase.id}` : 'Open case'}
          </PrimaryPill>
          <OutlinePill className="flex-1" disabled>Timeline</OutlinePill>
        </div>
        <GhostLink className="text-center" onClick={onAsk}>Ask the analyst why →</GhostLink>
      </div>
    </Panel>
  );
};
