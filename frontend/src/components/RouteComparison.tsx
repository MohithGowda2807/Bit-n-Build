import React from 'react';
import { Table, CheckCircle2, ArrowRight } from 'lucide-react';
import { RouteComparisonItem } from '../types';

interface RouteComparisonProps {
  comparison: RouteComparisonItem[];
  selectedAlternativeIndex: number | null;
  onSelectAlternative: (index: number | null) => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  comparison,
  selectedAlternativeIndex,
  onSelectAlternative
}) => {
  if (!comparison || comparison.length === 0) return null;

  return (
    <div className="bg-[#09152b] border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
      <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
        <Table className="h-5 w-5 text-cyan-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
          Candidate Route Comparison Matrix
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="pb-2 font-semibold">CANDIDATE</th>
              <th className="pb-2 font-semibold">MODE</th>
              <th className="pb-2 font-semibold">DISTANCE</th>
              <th className="pb-2 font-semibold">FUEL (L)</th>
              <th className="pb-2 font-semibold">ETA (H)</th>
              <th className="pb-2 font-semibold">CO₂ (T)</th>
              <th className="pb-2 font-semibold">SCORE</th>
              <th className="pb-2 font-semibold text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {comparison.map((item, idx) => {
              const isRecommended = item.is_recommended;
              const isSelectedAlt = !isRecommended && selectedAlternativeIndex === (idx - 1);

              return (
                <tr
                  key={`comp-${idx}`}
                  className={`transition ${
                    isRecommended
                      ? 'bg-cyan-950/40 text-cyan-200'
                      : isSelectedAlt
                      ? 'bg-purple-950/40 text-purple-200'
                      : 'hover:bg-slate-900/50 text-slate-300'
                  }`}
                >
                  <td className="py-2.5 font-bold flex items-center space-x-1.5">
                    {isRecommended && <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />}
                    <span>{item.name}</span>
                  </td>
                  <td className="py-2.5 uppercase text-[10px] text-slate-400">{item.mode}</td>
                  <td className="py-2.5">{item.distance_km.toLocaleString()} km</td>
                  <td className="py-2.5 text-amber-300">{Math.round(item.fuel_liters).toLocaleString()} L</td>
                  <td className="py-2.5">{item.time_hours.toFixed(1)} h</td>
                  <td className="py-2.5 text-teal-300">{(item.co2_kg / 1000).toFixed(1)} t</td>
                  <td className="py-2.5 font-bold">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                      {item.optimization_score.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    {isRecommended ? (
                      <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-bold">
                        RECOMMENDED
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectAlternative(isSelectedAlt ? null : (idx - 1))}
                        className={`text-[10px] px-2 py-1 rounded flex items-center space-x-1 ml-auto transition ${
                          isSelectedAlt
                            ? 'bg-purple-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{isSelectedAlt ? 'Viewing' : 'Inspect'}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
