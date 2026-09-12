import React, { useState } from 'react';
import { injectStormScenario, resetEnvironment, setOperatingMode, triggerCommandCycle } from '../../services/api';
import { Storm } from '../../types';

interface ScenarioControlBarProps {
  activeStorms: Storm[];
  operatingMode: string;
  onStormsChanged: (storms: Storm[]) => void;
  onModeChanged: (mode: string) => void;
  onCycleExecuted?: (result: any) => void;
}

export const ScenarioControlBar: React.FC<ScenarioControlBarProps> = ({
  activeStorms,
  operatingMode,
  onStormsChanged,
  onModeChanged,
  onCycleExecuted
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('bay_of_bengal_cyclone');
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showMsg = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleInject = async () => {
    try {
      setLoading(true);
      const storms = await injectStormScenario(selectedPreset);
      onStormsChanged(storms);
      showMsg(`Injected: ${storms[0]?.name || 'Storm'}`);
      // Auto run cycle after injection to let agents respond immediately
      const cycleRes = await triggerCommandCycle();
      if (onCycleExecuted) onCycleExecuted(cycleRes);
    } catch (err: any) {
      showMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await resetEnvironment();
      onStormsChanged([]);
      showMsg('Ocean reset to calm conditions');
      const cycleRes = await triggerCommandCycle();
      if (onCycleExecuted) onCycleExecuted(cycleRes);
    } catch (err: any) {
      showMsg(`Reset failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = async (newMode: string) => {
    try {
      const mode = await setOperatingMode(newMode);
      onModeChanged(mode);
      showMsg(`Operating mode: ${mode.toUpperCase()}`);
    } catch (err: any) {
      showMsg(`Failed to set mode: ${err.message}`);
    }
  };

  const handleManualCycle = async () => {
    try {
      setLoading(true);
      const res = await triggerCommandCycle();
      if (onCycleExecuted) onCycleExecuted(res);
      showMsg(`Cycle run: ${res.environmental_routing?.routes_recalculated || 0} routes rerouted`);
    } catch (err: any) {
      showMsg(`Cycle failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800/90 px-4 py-2 flex items-center justify-between gap-4 shadow-lg shrink-0 z-30 overflow-x-auto whitespace-nowrap os-scrollbar">
      {/* Left: Agent Mode Segmented Controller */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Agent Mode:</span>
        <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
          {(['advisory', 'semi_autonomous', 'autonomous'] as const).map(m => (
            <button
              key={m}
              onClick={() => handleModeToggle(m)}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all cursor-pointer ${
                operatingMode === m
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {m === 'semi_autonomous' ? 'Semi-Auto' : m === 'autonomous' ? 'Autonomous' : 'Advisory'}
            </button>
          ))}
        </div>
      </div>

      {/* Middle: Environmental Hazard Preset Injector */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Hazard:</span>
        <select
          value={selectedPreset}
          onChange={e => setSelectedPreset(e.target.value)}
          className="bg-slate-950 text-slate-200 border border-slate-800 text-xs font-mono rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500 max-w-[210px] sm:max-w-[260px] truncate"
        >
          <option value="bay_of_bengal_cyclone" className="bg-[#121620] text-white">🌀 Cyclone Vardah</option>
          <option value="malacca_squall" className="bg-[#121620] text-white">⛈️ Sumatra Squall</option>
          <option value="arabian_sea_monsoon" className="bg-[#121620] text-white">🌊 Arabian Sea Monsoon</option>
          <option value="pacific_typhoon" className="bg-[#121620] text-white">🌪️ Super Typhoon Rai</option>
          <option value="atlantic_hurricane" className="bg-[#121620] text-white">🌀 Hurricane Lee</option>
          <option value="southern_ocean_gale" className="bg-[#121620] text-white">🌊 Southern Ocean Gale</option>
        </select>
        <button
          onClick={handleInject}
          disabled={loading}
          className="bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-mono font-bold px-3 py-1 rounded-lg shadow-sm flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
          title="Inject environmental hazard into ocean model"
        >
          <span>⚡</span>
          <span>Inject Hazard</span>
        </button>
        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-semibold px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
          title="Reset environmental hazards"
        >
          <span>↺ Clear</span>
        </button>
      </div>

      {/* Right: Manual Loop Trigger & State Badge */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={handleManualCycle}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-mono font-bold px-3 py-1 rounded-lg shadow-md shadow-cyan-950/40 flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
        >
          <span className={loading ? 'animate-spin' : ''}>🔄</span>
          <span>Run Commander Loop</span>
        </button>

        {activeStorms.length > 0 ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-700/80 text-rose-300 font-mono text-xs font-bold animate-pulse">
            <span>⚠️</span>
            <span>{activeStorms.length} Storm{activeStorms.length > 1 ? 's' : ''} Active</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 font-mono text-xs font-bold">
            <span>✓</span>
            <span>Ocean Calm</span>
          </div>
        )}

        {statusMessage && (
          <span className="text-xs font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/80 max-w-[220px] truncate">
            {statusMessage}
          </span>
        )}
      </div>
    </div>
  );
};
