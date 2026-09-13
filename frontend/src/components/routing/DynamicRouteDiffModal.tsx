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
    <div className="fixed inset-0 z-[2000] bg-os-void/80 flex items-center justify-center p-4">
      <div className="bg-os-panel border border-os-steel rounded-panel w-full max-w-lg overflow-hidden flex flex-col os-reveal">
        {/* Header */}
        <div className="px-6 py-4 border-b border-os-steel flex items-center justify-between bg-os-raised">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-input bg-risk-critical/20 border border-risk-critical flex items-center justify-center text-risk-critical">
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
 className="w-8 h-8 rounded-input hover:bg-os-overlay text-os-ash hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3.5 rounded-row bg-os-void/80 border border-os-steel">
            <span className="text-xs font-mono uppercase font-semibold text-os-ash">Execution Status</span>
            {diff.applied ? (
              <span className="px-3 py-1 rounded-input bg-os-raised border border-os-clear text-os-clear font-mono text-xs font-bold">
                ✓ AUTO-COMMITTED TO VOYAGE
              </span>
            ) : (
              <span className="px-3 py-1 rounded-input bg-os-raised border border-risk-moderate text-risk-moderate font-mono text-xs font-bold">
 PENDING OPERATOR APPROVAL
              </span>
            )}
          </div>

          {/* Differential Metrics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-row bg-os-void/80 border border-os-steel flex flex-col">
              <span className="text-[10px] font-mono text-os-ash uppercase font-semibold">Risk Reduction</span>
              <span className="text-2xl font-bold text-os-clear font-mono mt-1">
                {diff.risk_reduction_pct > 0 ? `-${diff.risk_reduction_pct}%` : '0%'}
              </span>
              <span className="text-[11px] text-os-slate mt-0.5">Hazard Clearance</span>
            </div>
            <div className="p-3.5 rounded-row bg-os-void/80 border border-os-steel flex flex-col">
              <span className="text-[10px] font-mono text-os-ash uppercase font-semibold">Fuel Delta</span>
              <span className="text-2xl font-bold text-risk-moderate font-mono mt-1">
                {diff.fuel_change_pct >= 0 ? `+${diff.fuel_change_pct}%` : `${diff.fuel_change_pct}%`}
              </span>
              <span className="text-[11px] text-os-slate mt-0.5">Avoidance Penalty</span>
            </div>
            <div className="p-3.5 rounded-row bg-os-void/80 border border-os-steel flex flex-col">
              <span className="text-[10px] font-mono text-os-ash uppercase font-semibold">ETA Impact</span>
              <span className="text-2xl font-bold text-os-signal font-mono mt-1">
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
                <li key={i} className="text-xs text-os-fog flex items-start gap-2.5 bg-os-void/70 p-3 rounded-input border border-os-steel">
                  <span className="text-risk-moderate font-bold mt-0.5">▸</span>
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-os-steel flex items-center justify-end gap-3 bg-os-raised">
          <button
 onClick={onClose}
 className="px-4 py-2 text-xs font-mono font-medium text-os-fog hover:text-white rounded-input hover:bg-os-overlay transition"
          >
 Dismiss
          </button>
          {!diff.applied && onAccept && (
            <button
 onClick={() => { onAccept(); onClose(); }}
 className="px-4 py-2 text-xs font-mono font-bold bg-os-clear hover:bg-os-clear text-white rounded-input transition"
            >
 Approve & Deploy Route
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
