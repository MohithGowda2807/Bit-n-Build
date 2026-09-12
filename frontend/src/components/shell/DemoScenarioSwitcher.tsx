import React, { useEffect, useState } from 'react';
import { DemoScenario } from '../../types';
import { fetchSimulationScenarios, loadSimulationScenario } from '../../services/api';

interface DemoScenarioSwitcherProps {
  onScenarioLoaded?: (scenarioId: string, result: any) => void;
  onNavigateDomain?: (domain: string) => void;
}

export const DemoScenarioSwitcher: React.FC<DemoScenarioSwitcherProps> = ({
  onScenarioLoaded,
  onNavigateDomain
}) => {
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSimulationScenarios().then(setScenarios).catch(() => {});
  }, []);

  const handleSelectScenario = async (scenario: DemoScenario) => {
    setLoading(true);
    setActiveScenarioId(scenario.id);
    try {
      const res = await loadSimulationScenario(scenario.id);
      onScenarioLoaded?.(scenario.id, res);

      // Auto switch to appropriate domain view for optimal demonstration
      if (scenario.category === 'preservation') {
        onNavigateDomain?.('cleanup');
      } else if (scenario.category === 'surveillance') {
        onNavigateDomain?.('surveillance');
      } else if (scenario.category === 'routing') {
        onNavigateDomain?.('logistics');
      }
      setIsOpen(false);
    } catch (err) {
      console.warn('Fallback scenario activation:', err);
      if (scenario.category === 'preservation') onNavigateDomain?.('cleanup');
      else if (scenario.category === 'surveillance') onNavigateDomain?.('surveillance');
      else onNavigateDomain?.('logistics');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative font-mono text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-emerald-500/30 border border-cyan-500/50 hover:border-cyan-400 text-white font-bold flex items-center space-x-2 shadow-lg shadow-cyan-950/40 transition cursor-pointer"
        title="1-Click Presentation Demo Scenarios"
      >
        <span className="animate-pulse">🎬</span>
        <span className="tracking-wider uppercase text-[11px]">
          {activeScenarioId ? `Demo: ${activeScenarioId.replace(/_/g, ' ')}` : 'Demo Scenarios'}
        </span>
        <span className="text-slate-400 text-[9px]">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl p-3.5 z-[2000] space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
              Select Turnkey Scenario
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
              1-Click Presentation
            </span>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
            {scenarios.map(s => {
              const isSelected = s.id === activeScenarioId;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectScenario(s)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-[11px] truncate">{s.title}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase bg-slate-800 text-cyan-300 border border-slate-700 shrink-0 ml-1">
                      {s.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              );
            })}
          </div>

          {loading && (
            <div className="text-center text-[10px] text-cyan-400 animate-pulse pt-1">
              Initializing scenario state & telemetries...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
