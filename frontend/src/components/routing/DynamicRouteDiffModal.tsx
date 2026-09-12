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
    <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-os-raised border border-os-pewter rounded-panel w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-os-pewter flex items-center justify-between bg-os-deep/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <h3 className="text-base font-semibold text-white">Dynamic Route Recalculation</h3>
              <p className="text-xs text-os-ash font-mono">
                Voyage #{diff.voyage_id} · Version {diff.version_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-os-ash hover:text-white text-lg font-mono px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-input bg-os-deep border border-os-pewter">
            <span className="text-xs font-mono uppercase text-os-ash">Execution Status:</span>
            {diff.applied ? (
              <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono text-xs font-semibold">
                ✓ AUTO-APPLIED TO VOYAGE
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded bg-yellow-950 border border-yellow-700 text-yellow-300 font-mono text-xs font-semibold">
                PENDING OPERATOR APPROVAL
              </span>
            )}
          </div>

          {/* Differential Metrics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-input bg-os-deep border border-os-pewter flex flex-col">
              <span className="text-[11px] font-mono text-os-ash uppercase">Risk Reduction</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1">
                {diff.risk_reduction_pct > 0 ? `-${diff.risk_reduction_pct}%` : '0%'}
              </span>
              <span className="text-[10px] text-os-slate mt-0.5">Hazard Clearance</span>
            </div>

            <div className="p-3 rounded-input bg-os-deep border border-os-pewter flex flex-col">
              <span className="text-[11px] font-mono text-os-ash uppercase">Fuel Delta</span>
              <span className="text-lg font-bold text-amber-300 font-mono mt-1">
                {diff.fuel_change_pct >= 0 ? `+${diff.fuel_change_pct}%` : `${diff.fuel_change_pct}%`}
              </span>
              <span className="text-[10px] text-os-slate mt-0.5">Avoidance Penalty</span>
            </div>

            <div className="p-3 rounded-input bg-os-deep border border-os-pewter flex flex-col">
              <span className="text-[11px] font-mono text-os-ash uppercase">ETA Impact</span>
              <span className="text-lg font-bold text-sky-300 font-mono mt-1">
                {diff.eta_change_hours >= 0 ? `+${diff.eta_change_hours}h` : `${diff.eta_change_hours}h`}
              </span>
              <span className="text-[10px] text-os-slate mt-0.5">Travel Time</span>
            </div>
          </div>

          {/* Reasons List */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-os-ash mb-2">Agent Rationale & Triggers:</h4>
            <ul className="space-y-1.5">
              {diff.reasons.map((r, i) => (
                <li key={i} className="text-xs text-os-fog flex items-start gap-2 bg-os-deep/60 p-2.5 rounded border border-os-pewter/60">
                  <span className="text-yellow-400 mt-0.5">▸</span>
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-os-pewter flex items-center justify-end gap-3 bg-os-deep/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-os-ash hover:text-white transition"
          >
            Dismiss
          </button>
          {!diff.applied && onAccept && (
            <button
              onClick={() => { onAccept(); onClose(); }}
              className="px-4 py-2 text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition shadow"
            >
              Approve & Deploy New Route
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
