import React, { useMemo, useState } from 'react';
import { Vessel } from '../../types';
import { InvestigationCase, VesselRiskSummary } from '../../types/surveillance';
import { Eyebrow, FilterPill, GhostLink, Mono, Panel, RiskBadge, RiskNumber } from '../ui/primitives';

type Filter = 'all' | 'high' | 'cases';

interface Props {
  risks: VesselRiskSummary[];
  vessels: Vessel[];
  openCases: InvestigationCase[];
  selectedId: number | null;
  onSelect: (vesselId: number) => void;
}

export const Watchlist: React.FC<Props> = ({ risks, vessels, openCases, selectedId, onSelect }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState(false);
  const byId = useMemo(() => new Map(vessels.map(v => [v.id, v])), [vessels]);
  const caseVesselIds = useMemo(() => new Set(openCases.map(c => c.vessel_id)), [openCases]);

  const rows = useMemo(() => {
    const filtered = risks.filter(r =>
      filter === 'all' ? true : filter === 'high' ? r.score > 60 : caseVesselIds.has(r.vessel_id));
    return expanded ? filtered : filtered.slice(0, 5);
  }, [risks, filter, expanded, caseVesselIds]);

  return (
    <Panel className="w-[320px] p-5 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium text-white">Watchlist</span>
        <Mono className="text-xs text-os-slate">sorted by risk</Mono>
      </div>
      <div className="flex gap-1.5">
        <FilterPill size="sm" active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterPill>
        <FilterPill size="sm" active={filter === 'high'} onClick={() => setFilter('high')}>High and above</FilterPill>
        <FilterPill size="sm" active={filter === 'cases'} onClick={() => setFilter('cases')}>Cases</FilterPill>
      </div>

      {rows.length === 0 ? (
        <div className="py-6 flex flex-col gap-2">
          <span className="text-sm text-os-fog">No assessed vessels yet.</span>
          <span className="text-xs text-os-ash">Run a scenario to ingest AIS and score the fleet.</span>
        </div>
      ) : (
        <div className="flex flex-col">
          {rows.map((r, i) => {
            const v = byId.get(r.vessel_id);
            const isSelected = r.vessel_id === selectedId;
            return (
              <button
                key={r.vessel_id}
                onClick={() => onSelect(r.vessel_id)}
                className={`flex items-center gap-3 h-14 text-left transition-colors ${
                  isSelected
                    ? 'bg-os-raised rounded-row px-3 -mx-3 shadow-[inset_2px_0_0_#007afc]'
                    : `${i < rows.length - 1 ? 'border-b border-os-raised' : ''} hover:bg-os-raised/50`
                }`}
              >
                <RiskNumber score={r.score} className="w-11 shrink-0" />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-sm font-medium text-white truncate">{v?.name ?? `Vessel ${r.vessel_id}`}</span>
                  <span className="text-xs text-os-ash truncate">{r.top_factor ?? 'No contributing factors'}</span>
                </div>
                <RiskBadge level={r.level} />
              </button>
            );
          })}
        </div>
      )}

      {risks.length > 5 && (
        <GhostLink className="text-[13px] text-left" onClick={() => setExpanded(e => !e)}>
          {expanded ? 'Show fewer' : `All ${risks.length} assessed vessels →`}
        </GhostLink>
      )}
      {risks.length === 0 && <Eyebrow>Awaiting AIS</Eyebrow>}
    </Panel>
  );
};
