import React from 'react';
import { RecalculateRouteResponse } from '../../types';

interface DynamicRouteDiffModalProps {
  diff: RecalculateRouteResponse | null;
  onClose: () => void;
  onAccept?: () => void;
}

export const DynamicRouteDiffModal: React.FC<DynamicRouteDiffModalProps> = ({
  diff,
  onClose,
  onAccept
}) => {
  if (!diff) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-os-card border border-os-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col os-reveal">
        {/* Header */}
        <div className="px-6 py-4 border-b border-os-border flex items-center justify-between bg-os-surface/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              ⚡
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Dynamic Route Recalculation</h3>
              <p className="text-xs text-os-ash font-mono">
                Voyage #{diff.voyage_id} · Route Lineage Version {diff.version_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-os-ash hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-os-void/80 border border-os-border">
            <span className="text-xs font-mono uppercase font-semibold text-os-ash">Execution Status</span>
            {diff.applied ? (
              <span className="px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 font-mono text-xs font-bold">
                ✓ AUTO-COMMITTED TO VOYAGE
              </span>
            ) : (
              <span className="px-3 py-1 rounded-md bg-amber-950/80 border border-amber-700/80 text-amber-300 font-mono text-xs font-bold">
                PENDING OPERATOR APPROVAL
              </span>
            )}
          </div>

          {/* Differential Metrics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-os-void/80 border border-os-border flex flex-col">
              <span className="text-[10px] font-mono text-os-ash uppercase font-semibold">Risk Reduction</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                {diff.risk_reduction_pct > 0 ? `-${diff.risk_reduction_pct}%` : '0%'}
              </span>
              <span className="text-[11px] text-os-slate mt-0.5">Hazard Clearance</span>
            </div>

            <div className="p-3.5 rounded-xl bg-os-void/80 border border-os-border flex flex-col">
              <span className="text-[10px] font-mono text-os-ash uppercase font-semibold">Fuel Delta</span>
              <span className="text-2xl font-bold text-amber-400 font-mono mt-1">
                {diff.fuel_change_pct >= 0 ? `+${diff.fuel_change_pct}%` : `${diff.fuel_change_pct}%`}
              </span>
              <span className="text-[11px] text-os-slate mt-0.5">Avoidance Penalty</span>
            </div>

            <div className="p-3.5 rounded-xl bg-os-void/80 border border-os-border flex flex-col">
              <span className="text-[10px] font-mono text-os-ash uppercase font-semibold">ETA Impact</span>
              <span className="text-2xl font-bold text-sky-400 font-mono mt-1">
                {diff.eta_change_hours >= 0 ? `+${diff.eta_change_hours}h` : `${diff.eta_change_hours}h`}
              </span>
              <span className="text-[11px] text-os-slate mt-0.5">Travel Duration</span>
            </div>
          </div>

          {/* Reasons List */}
          <div>
            <h4 className="text-xs font-mono uppercase font-semibold tracking-wider text-os-ash mb-2.5">Commander Rationale & Triggers:</h4>
            <ul className="space-y-2">
              {diff.reasons.map((r, i) => (
                <li key={i} className="text-xs text-os-fog flex items-start gap-2.5 bg-os-void/70 p-3 rounded-lg border border-os-border/70">
                  <span className="text-amber-400 font-bold mt-0.5">▸</span>
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-os-border flex items-center justify-end gap-3 bg-os-surface/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-medium text-os-fog hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            Dismiss
          </button>
          {!diff.applied && onAccept && (
            <button
              onClick={() => { onAccept(); onClose(); }}
              className="px-4 py-2 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shadow-md shadow-emerald-600/20"
            >
              Approve & Deploy Route
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
