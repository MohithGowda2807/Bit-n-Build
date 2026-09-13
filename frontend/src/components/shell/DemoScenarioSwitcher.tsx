import React, { useEffect, useState, useRef } from 'react';
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
 const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 fetchSimulationScenarios().then(setScenarios).catch(() => {});
  }, []);

 useEffect(() => {
 const handleClickOutside = (e: MouseEvent) => {
 if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
 setIsOpen(false);
      }
    };
 if (isOpen) {
 document.addEventListener('mousedown', handleClickOutside);
    }
 return () => {
 document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

 const handleSelectScenario = async (scenario: DemoScenario) => {
 setLoading(true);
 setActiveScenarioId(scenario.id);
 try {
 let res: any = null;
 try {
 res = await loadSimulationScenario(scenario.id);
      } catch (err) {
 console.warn('Backend scenario activation notice:', err);
      }

 onScenarioLoaded?.(scenario.id, res);

      // Dispatch global window event with complete scenario focus and metadata
 if (typeof window !== 'undefined') {
 window.dispatchEvent(new CustomEvent('triton:scenario-activated', {
 detail: { scenario, result: res }
        }));
      }

      // Auto switch to appropriate domain view for optimal presentation
 if (scenario.category === 'preservation') {
 onNavigateDomain?.('cleanup');
      } else if (scenario.category === 'surveillance') {
 onNavigateDomain?.('surveillance');
      } else if (scenario.category === 'routing') {
 onNavigateDomain?.('logistics');
      }
 setIsOpen(false);
    } finally {
 setLoading(false);
    }
  };

 return (
    <div ref={containerRef} className="relative font-mono text-xs">
      <button
 onClick={() => setIsOpen(!isOpen)}
 className="px-3 py-1.5 rounded-full border border-os-signal hover:border-os-silver text-white font-bold flex items-center space-x-2 transition cursor-pointer"
 title="1-Click Presentation Demo Scenarios"
      >
        <span className="tracking-wider uppercase text-[11px] truncate max-w-[150px]" title={activeScenarioId ? activeScenarioId.replace(/_/g, ' ') : undefined}>
          {activeScenarioId ? `Demo: ${activeScenarioId.replace(/_/g, ' ')}` : 'Demo Scenarios'}
        </span>
        <span className="text-os-ash text-[9px]">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-84 bg-os-panel border border-os-pewter rounded-panel p-3.5 z-[3000] space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-os-pewter">
            <span className="text-[10px] text-os-signal font-bold uppercase tracking-widest">
 Select Turnkey Scenario
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-os-raised border border-os-signal text-os-signal font-bold">
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
 className={`p-2.5 rounded-row border cursor-pointer transition ${
 isSelected
                      ? 'bg-os-raised border-os-signal text-white'
                      : 'bg-os-void border-os-pewter hover:border-os-pewter text-os-fog'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[11px] truncate">{s.title}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase bg-os-raised text-os-signal border border-os-pewter shrink-0 ml-1">
                      {s.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-os-ash font-sans mt-1 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              );
            })}
          </div>

          {loading && (
            <div className="text-center text-[10px] text-os-signal animate-pulse pt-1">
 Initializing scenario state & telemetries...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
