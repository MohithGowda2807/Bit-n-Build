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
    <div className="w-full bg-os-card/95 backdrop-blur-md border-b border-os-border/80 px-6 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md shrink-0 z-30">
      {/* Left: Mode Selector */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] uppercase font-mono font-semibold tracking-wider text-os-ash">Agent Mode</span>
        <div className="inline-flex rounded-lg bg-os-void/80 p-0.5 border border-os-border/80">
          {(['advisory', 'semi_autonomous', 'autonomous'] as const).map(m => (
            <button
              key={m}
              onClick={() => handleModeToggle(m)}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                operatingMode === m
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-os-fog hover:text-white hover:bg-white/5'
              }`}
            >
              {m === 'semi_autonomous' ? 'Semi-Auto' : m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Middle: Scenario Preset Injection */}
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] uppercase font-mono font-semibold tracking-wider text-os-ash">Scenario</span>
        <select
          value={selectedPreset}
          onChange={e => setSelectedPreset(e.target.value)}
          className="bg-os-void text-white border border-os-border text-xs font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[320px] truncate"
        >
          <option value="bay_of_bengal_cyclone" className="bg-[#121620] text-white">🌀 Cyclone Vardah (Bay of Bengal / Malacca)</option>
          <option value="malacca_squall" className="bg-[#121620] text-white">⛈️ Sumatra Squall (Malacca Strait Choke)</option>
          <option value="arabian_sea_monsoon" className="bg-[#121620] text-white">🌊 Monsoon Depression (Arabian Sea / Gulf)</option>
        </select>
        <button
          onClick={handleInject}
          disabled={loading}
          className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <span>⚡</span> Inject Hazard
        </button>
        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-os-surface hover:bg-os-border/80 text-os-fog hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-os-border transition"
        >
          Clear Ocean
        </button>
      </div>

      {/* Right: Manual Cycle & Active Storms Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleManualCycle}
          disabled={loading}
          className="bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <span>🔄</span> Run Commander Loop
        </button>

        {activeStorms.length > 0 ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-800 text-rose-300 font-mono text-xs font-medium animate-pulse">
            <span>⚠️</span>
            <span>{activeStorms.length} Active Storm{activeStorms.length > 1 ? 's' : ''}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/70 border border-emerald-800 text-emerald-300 font-mono text-xs font-medium">
            <span>✓</span>
            <span>Ocean Calm</span>
          </div>
        )}

        {statusMessage && (
          <span className="text-xs font-mono text-amber-300 animate-fade-in px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/80">{statusMessage}</span>
        )}
      </div>
    </div>
  );
};
