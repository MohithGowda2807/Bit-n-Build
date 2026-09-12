import React, { useEffect, useState } from 'react';
import { session } from '../../services/session';
import { Role, can } from '../../design/roles';
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
 // The Malacca squall sits on the seeded Mumbai to Singapore corridor, so it is the preset that visibly reroutes.
 const [selectedPreset, setSelectedPreset] = useState<string>('malacca_squall');
 const [loading, setLoading] = useState<boolean>(false);
 const [statusMessage, setStatusMessage] = useState<string | null>(null);
 const [role, setRole] = useState<Role>(session.role);
 useEffect(() => session.subscribe(setRole), []);
 const mayRun = can(role, 'run_scenarios');
 const mayManage = can(role, 'manage_system');

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
    <div className="w-full bg-os-panel border-b border-os-steel px-6 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 z-30">
      {/* Left: Mode Selector */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] uppercase font-mono font-semibold tracking-wider text-os-ash">Agent Mode</span>
        <div className="inline-flex rounded-input bg-os-void/80 p-0.5 border border-os-steel">
          {(['advisory', 'semi_autonomous', 'autonomous'] as const).map(m => (
            <button
 key={m}
 onClick={() => handleModeToggle(m)}
 disabled={!mayManage}
 title={mayManage ? undefined : 'Requires the Admin role'}
 className={`px-3 py-1 text-xs font-mono rounded-input transition-all disabled:cursor-not-allowed ${
 operatingMode === m
                  ? 'bg-os-signal text-white font-bold'
                  : 'text-os-fog hover:text-white hover:bg-os-overlay'
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
 className="bg-os-void text-white border border-os-steel text-xs font-mono rounded-input px-3 py-1.5 focus:outline-none max-w-[320px] truncate"
        >
          <option value="malacca_squall">Sumatra Squall (Malacca Strait, on the active corridor)</option>
          <option value="bay_of_bengal_cyclone">Cyclone Vardah (Bay of Bengal)</option>
          <option value="arabian_sea_monsoon">Monsoon Depression (Arabian Sea / Gulf)</option>
          <option value="pacific_typhoon">Super Typhoon Rai (Pacific / East Asia)</option>
          <option value="atlantic_hurricane">Hurricane Lee (North Atlantic Trans-oceanic)</option>
          <option value="southern_ocean_gale">Southern Ocean Gale (Australia / Bass Strait)</option>
        </select>
        <button
 onClick={handleInject}
 disabled={loading || !mayRun}
 title={mayRun ? undefined : 'Requires the Operator role'}
 className="bg-risk-critical hover:bg-risk-high text-white text-xs font-semibold px-3 py-1.5 rounded-input flex items-center gap-1.5 transition disabled:opacity-50 disabled:hover:bg-risk-critical"
        >
 Inject hazard
        </button>
        <button
 onClick={handleReset}
 disabled={loading || !mayRun}
 title={mayRun ? undefined : 'Requires the Operator role'}
 className="bg-os-raised hover:bg-os-overlay text-os-fog hover:text-white text-xs font-medium px-3 py-1.5 rounded-input border border-os-steel transition disabled:opacity-50"
        >
 Clear ocean
        </button>
      </div>

      {/* Right: Manual Cycle & Active Storms Status */}
      <div className="flex items-center gap-3">
        <button
 onClick={handleManualCycle}
 disabled={loading || !mayRun}
 title={mayRun ? undefined : 'Requires the Operator role'}
 className="bg-os-signal hover:bg-os-signal-hover text-white text-xs font-semibold px-3 py-1.5 rounded-input flex items-center gap-1.5 transition disabled:opacity-50 disabled:hover:bg-os-signal"
        >
 Run commander loop
        </button>

        {activeStorms.length > 0 ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-input bg-os-raised border border-risk-critical text-risk-critical font-mono text-xs font-medium animate-pulse">
            <span>{activeStorms.length} active storm{activeStorms.length > 1 ? 's' : ''}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-input bg-os-raised border border-os-clear text-os-clear font-mono text-xs font-medium">
            <span>Ocean calm</span>
          </div>
        )}

        {statusMessage && (
          <span className="text-xs font-mono text-risk-moderate animate-fade-in px-2 py-0.5 rounded bg-os-raised border border-risk-moderate">{statusMessage}</span>
        )}
      </div>
    </div>
  );
};
