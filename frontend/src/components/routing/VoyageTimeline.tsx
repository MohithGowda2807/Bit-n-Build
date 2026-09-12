import React from 'react';
import { RouteVersion } from '../../types';

interface VoyageTimelineProps {
  versions: RouteVersion[];
  onSelectVersion?: (version: RouteVersion) => void;
}

export const VoyageTimeline: React.FC<VoyageTimelineProps> = ({ versions, onSelectVersion }) => {
  if (!versions || versions.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-3.5 bg-os-void/80 rounded-xl border border-os-border">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-os-ash">Voyage Lineage (Audit)</span>
        <span className="text-[10px] font-mono text-os-slate">{versions.length} Version{versions.length > 1 ? 's' : ''}</span>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        {versions.map((ver, idx) => {
          const isActive = ver.status === 'active';
          return (
            <div
              key={ver.id}
              onClick={() => onSelectVersion && onSelectVersion(ver)}
              className={`p-2.5 rounded-lg border transition cursor-pointer flex flex-col gap-1.5 ${
                isActive
                  ? 'bg-blue-600/10 border-blue-500/60 shadow-sm'
                  : 'bg-os-surface/40 border-os-border hover:border-os-silver/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-white">
                  v{ver.version_number} · {ver.trigger_event.replace(/_/g, ' ')}
                </span>
                {isActive && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                    ACTIVE
                  </span>
                )}
              </div>

              {ver.change_reason && (
                <p className="text-[11px] text-os-ash line-clamp-2 leading-relaxed">
                  {ver.change_reason}
                </p>
              )}

              <div className="flex items-center gap-3 text-[10px] font-mono text-os-slate mt-1">
                <span>Risk: <b className="text-os-fog">{ver.risk_score.toFixed(0)}/100</b></span>
                <span>Fuel: <b className="text-os-fog">{(ver.fuel_liters / 1000).toFixed(1)}k L</b></span>
                <span>ETA: <b className="text-os-fog">{ver.eta_hours.toFixed(1)}h</b></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
