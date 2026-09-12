import React from 'react';
import { RouteVersion } from '../../types';

interface VoyageTimelineProps {
 versions: RouteVersion[];
 onSelectVersion?: (version: RouteVersion) => void;
}

export const VoyageTimeline: React.FC<VoyageTimelineProps> = ({ versions, onSelectVersion }) => {
 if (!versions || versions.length === 0) {
 return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-os-void/60 rounded-row border border-dashed border-os-steel text-os-ash gap-2">
        <span className="text-2xl">📜</span>
        <span className="text-xs font-mono font-semibold text-os-fog">No Lineage History Yet</span>
        <p className="text-[11px] text-os-ash max-w-[240px] leading-relaxed">
 Calculate a route or trigger Autonomous Storm Avoidance to record immutable route versions.
        </p>
      </div>
    );
  }

 return (
    <div className="flex flex-col gap-2.5 p-3.5 bg-os-void/80 rounded-row border border-os-steel">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">Voyage Audit Lineage</span>
        <span className="text-[10px] font-mono text-os-signal px-1.5 py-0.5 rounded bg-os-raised border border-os-signal">
          {versions.length} Version{versions.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        {versions.map((ver) => {
 const isActive = ver.status === 'active';
 return (
            <div
 key={ver.id}
 onClick={() => onSelectVersion && onSelectVersion(ver)}
 className={`p-3 rounded-input border transition cursor-pointer flex flex-col gap-1.5 ${
 isActive
                  ? 'bg-os-raised border-os-signal'
                  : 'bg-os-raised border-os-steel hover:border-os-silver'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-os-signal/30 text-os-signal border border-os-signal text-[10px]">
 v{ver.version_number}
                  </span>
                  <span>{ver.trigger_event.replace(/_/g, ' ')}</span>
                </span>
                {isActive ? (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-os-raised text-os-clear border border-os-clear">
 ACTIVE
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-os-ash bg-os-raised border border-os-pewter">
 SUPERSEDED
                  </span>
                )}
              </div>

              {ver.change_reason && (
                <p className="text-[11px] text-os-fog line-clamp-2 leading-relaxed">
                  {ver.change_reason}
                </p>
              )}

              {/* Differentials if available */}
              {(ver.risk_reduction_pct !== 0 || ver.fuel_change_pct !== 0) && (
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {ver.risk_reduction_pct !== undefined && ver.risk_reduction_pct !== 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
 ver.risk_reduction_pct > 0
                        ? 'bg-os-raised text-os-clear border border-os-clear'
                        : 'bg-os-raised text-risk-critical border border-risk-critical'
                    }`}>
 Risk {ver.risk_reduction_pct > 0 ? `-${ver.risk_reduction_pct}%` : `+${Math.abs(ver.risk_reduction_pct)}%`}
                    </span>
                  )}
                  {ver.fuel_change_pct !== undefined && ver.fuel_change_pct !== 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-os-raised text-os-fog border border-os-pewter font-semibold">
 Fuel {ver.fuel_change_pct > 0 ? `+${ver.fuel_change_pct}%` : `${ver.fuel_change_pct}%`}
                    </span>
                  )}
                  {ver.eta_change_hours !== undefined && ver.eta_change_hours !== 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-os-raised text-os-fog border border-os-pewter font-semibold">
 ETA {ver.eta_change_hours > 0 ? `+${ver.eta_change_hours}h` : `${ver.eta_change_hours}h`}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 text-[10px] font-mono text-os-ash mt-1 pt-1 border-t border-os-steel">
                <span>Risk: <b className="text-white">{ver.risk_score.toFixed(0)}/100</b></span>
                <span>Fuel: <b className="text-white">{(ver.fuel_liters / 1000).toFixed(1)}k L</b></span>
                <span>ETA: <b className="text-white">{ver.eta_hours.toFixed(1)}h</b></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
