import React from 'react';
import { HelpCircle, Check, ArrowUpRight, Shield, Zap } from 'lucide-react';
import { RouteExplanation } from '../types';

interface ExplanationPanelProps {
  explanation: RouteExplanation | null;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ explanation }) => {
  if (!explanation) return null;

  return (
    <div className="bg-[#09152b] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <HelpCircle className="h-5 w-5 text-cyan-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
            Autonomous Decision Intelligence: Why This Route?
          </h2>
        </div>
        <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
          {explanation.recommendation}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Advantages */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span>PRIMARY ADVANTAGES</span>
          </div>
          <div className="space-y-2">
            {explanation.reasons.map((reason, idx) => (
              <div
                key={`reason-${idx}`}
                className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 flex items-start space-x-2.5 text-xs font-mono text-slate-200"
              >
                <div className="h-4 w-4 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3" />
                </div>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Tradeoffs */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1.5">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>OPERATIONAL TRADEOFFS</span>
          </div>
          <div className="space-y-2">
            {explanation.tradeoffs.length > 0 ? (
              explanation.tradeoffs.map((tradeoff, idx) => (
                <div
                  key={`tradeoff-${idx}`}
                  className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 flex items-start space-x-2.5 text-xs font-mono text-slate-300"
                >
                  <div className="h-4 w-4 rounded-full bg-amber-950 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold">!</span>
                  </div>
                  <span>{tradeoff}</span>
                </div>
              ))
            ) : (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 text-xs font-mono text-slate-400">
                No negative operational tradeoffs detected against baseline parameters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
