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
    <div className="bg-os-raised/95 backdrop-blur border border-os-pewter rounded-panel px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
      {/* Left: Mode Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase font-mono tracking-wider text-os-ash">Agent Mode:</span>
        <div className="inline-flex rounded-input bg-os-deep p-0.5 border border-os-pewter">
          {(['advisory', 'semi_autonomous', 'autonomous'] as const).map(m => (
            <button
              key={m}
              onClick={() => handleModeToggle(m)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                operatingMode === m
                  ? 'bg-blue-600 text-white font-semibold shadow'
                  : 'text-os-ash hover:text-white'
              }`}
            >
              {m === 'semi_autonomous' ? 'Semi-Auto' : m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Middle: Scenario Preset Injection */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase font-mono tracking-wider text-os-ash">Hazard Injection:</span>
        <select
          value={selectedPreset}
          onChange={e => setSelectedPreset(e.target.value)}
          className="bg-os-deep border border-os-pewter text-white text-xs font-mono rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option value="bay_of_bengal_cyclone">🌀 Cyclone Vardah (Bay of Bengal / Malacca)</option>
          <option value="malacca_squall">⛈️ Sumatra Squall (Malacca Strait Choke)</option>
          <option value="arabian_sea_monsoon">🌊 Monsoon Depression (Arabian Sea / Gulf)</option>
        </select>
        <button
          onClick={handleInject}
          disabled={loading}
          className="bg-red-700 hover:bg-red-600 text-white text-xs font-mono px-3 py-1.5 rounded transition disabled:opacity-50 flex items-center gap-1 font-semibold"
        >
          <span>⚡</span> Inject Storm
        </button>
        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-os-slate/40 hover:bg-os-slate/60 text-os-fog text-xs font-mono px-2.5 py-1.5 rounded border border-os-pewter transition"
        >
          Reset Calm
        </button>
      </div>

      {/* Right: Manual Cycle & Active Storms Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleManualCycle}
          disabled={loading}
          className="bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-mono px-3 py-1.5 rounded transition disabled:opacity-50 flex items-center gap-1"
        >
          <span>🔄</span> Run Agent Cycle
        </button>

        {activeStorms.length > 0 ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/80 border border-red-800 text-red-300 font-mono text-xs animate-pulse">
            <span>⚠️</span>
            <span>{activeStorms.length} Active Storm{activeStorms.length > 1 ? 's' : ''}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-mono text-xs">
            <span>✓</span>
            <span>Seas Normal</span>
          </div>
        )}

        {statusMessage && (
          <span className="text-xs font-mono text-yellow-300 animate-fade-in">{statusMessage}</span>
        )}
      </div>
    </div>
  );
};
