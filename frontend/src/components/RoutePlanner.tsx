import React, { useState } from 'react';
import { Ship, Navigation, Anchor, Sliders, Play, MapPin, Sparkles } from 'lucide-react';
import { Vessel, Port, Coordinate, OptimizationWeights } from '../types';

interface RoutePlannerProps {
  vessels: Vessel[];
  ports: Port[];
  selectedVesselId: number | null;
  onSelectVessel: (id: number) => void;
  origin: Coordinate | null;
  destination: Coordinate | null;
  onSetOrigin: (coord: Coordinate) => void;
  onSetDestination: (coord: Coordinate) => void;
  mapSelectionMode: 'origin' | 'destination' | null;
  onToggleMapSelection: (mode: 'origin' | 'destination' | null) => void;
  optimizationMode: string;
  onChangeMode: (mode: string) => void;
  customWeights: OptimizationWeights;
  onChangeWeights: (weights: OptimizationWeights) => void;
  onOptimize: () => void;
  isLoading: boolean;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  vessels,
  ports,
  selectedVesselId,
  onSelectVessel,
  origin,
  destination,
  onSetOrigin,
  onSetDestination,
  mapSelectionMode,
  onToggleMapSelection,
  optimizationMode,
  onChangeMode,
  customWeights,
  onChangeWeights,
  onOptimize,
  isLoading
}) => {
  const [showSliders, setShowSliders] = useState(false);

  const selectedVessel = vessels.find(v => v.id === selectedVesselId) || vessels[0];

  // Predefined scenario helper
  const loadScenario = (origPortName: string, destPortName: string) => {
    const orig = ports.find(p => p.name.includes(origPortName));
    const dest = ports.find(p => p.name.includes(destPortName));
    if (orig && dest) {
      onSetOrigin({ latitude: orig.latitude, longitude: orig.longitude });
      onSetDestination({ latitude: dest.latitude, longitude: dest.longitude });
    }
  };

  return (
    <div className="bg-[#09152b] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <Navigation className="h-5 w-5 text-cyan-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
            Mission Route Planner
          </h2>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => loadScenario("Mumbai", "Singapore")}
            className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2 py-1 rounded transition"
            title="Load Flagship Demo Scenario"
          >
            Mumbai → Singapore
          </button>
          <button
            onClick={() => loadScenario("Dubai", "Mumbai")}
            className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition"
          >
            Dubai → Mumbai
          </button>
        </div>
      </div>

      {/* Vessel Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
          <Ship className="h-3.5 w-3.5 text-cyan-400" />
          <span>ASSIGNED VESSEL</span>
        </label>
        <select
          value={selectedVesselId || ''}
          onChange={e => onSelectVessel(Number(e.target.value))}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          {vessels.map(v => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.vessel_type}) — Cruise: {v.cruise_speed_knots} kts | Fuel: {(v.current_fuel_liters / 1000).toFixed(0)}k L
            </option>
          ))}
        </select>
        {selectedVessel && (
          <div className="text-[11px] font-mono text-slate-500 flex justify-between px-1">
            <span>Type: {selectedVessel.vessel_type}</span>
            <span>Rate: {selectedVessel.fuel_consumption_rate} L/h</span>
            <span>Cargo: {selectedVessel.cargo_capacity_tonnes.toLocaleString()} t</span>
          </div>
        )}
      </div>

      {/* Origin & Destination Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Origin */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
              <Anchor className="h-3.5 w-3.5 text-emerald-400" />
              <span>ORIGIN</span>
            </label>
            <button
              onClick={() => onToggleMapSelection(mapSelectionMode === 'origin' ? null : 'origin')}
              className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center space-x-1 transition ${
                mapSelectionMode === 'origin'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="h-3 w-3" />
              <span>Map Click</span>
            </button>
          </div>
          <select
            onChange={e => {
              const p = ports.find(port => port.id === Number(e.target.value));
              if (p) onSetOrigin({ latitude: p.latitude, longitude: p.longitude });
            }}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select origin port...</option>
            {ports.map(p => (
              <option key={`orig-${p.id}`} value={p.id}>
                {p.name} ({p.country})
              </option>
            ))}
          </select>
          {origin && (
            <div className="text-[11px] font-mono text-emerald-400 px-1">
              Lat: {origin.latitude.toFixed(4)}, Lon: {origin.longitude.toFixed(4)}
            </div>
          )}
        </div>

        {/* Destination */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
              <Anchor className="h-3.5 w-3.5 text-rose-400" />
              <span>DESTINATION</span>
            </label>
            <button
              onClick={() => onToggleMapSelection(mapSelectionMode === 'destination' ? null : 'destination')}
              className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center space-x-1 transition ${
                mapSelectionMode === 'destination'
                  ? 'bg-rose-500 text-black font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="h-3 w-3" />
              <span>Map Click</span>
            </button>
          </div>
          <select
            onChange={e => {
              const p = ports.find(port => port.id === Number(e.target.value));
              if (p) onSetDestination({ latitude: p.latitude, longitude: p.longitude });
            }}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select destination port...</option>
            {ports.map(p => (
              <option key={`dest-${p.id}`} value={p.id}>
                {p.name} ({p.country})
              </option>
            ))}
          </select>
          {destination && (
            <div className="text-[11px] font-mono text-rose-400 px-1">
              Lat: {destination.latitude.toFixed(4)}, Lon: {destination.longitude.toFixed(4)}
            </div>
          )}
        </div>
      </div>

      {/* Optimization Mode Presets */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono text-slate-400">OPTIMIZATION OBJECTIVE</label>
          <button
            onClick={() => setShowSliders(!showSliders)}
            className="text-[11px] font-mono text-cyan-400 flex items-center space-x-1 hover:underline"
          >
            <Sliders className="h-3 w-3" />
            <span>{showSliders ? 'Hide Weights' : 'Tune Weights'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'fuel_efficient', label: 'Fuel Efficient', desc: 'Min consumption' },
            { id: 'fastest', label: 'Fastest', desc: 'Min ETA' },
            { id: 'green', label: 'Green', desc: 'Min CO₂ & Zones' },
            { id: 'balanced', label: 'Balanced', desc: 'Multi-objective' },
          ].map(m => {
            const isActive = optimizationMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onChangeMode(m.id)}
                className={`px-3 py-2 rounded-lg text-left transition border ${
                  isActive
                    ? 'bg-cyan-950 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className={`text-xs font-bold font-mono ${isActive ? 'text-cyan-400' : ''}`}>
                  {m.label}
                </div>
                <div className="text-[10px] text-slate-500">{m.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Custom Weight Sliders */}
        {showSliders && (
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 space-y-2.5 mt-2">
            <div className="text-[11px] font-mono text-cyan-300 font-semibold mb-1">Weight Allocation:</div>
            {(['fuel', 'time', 'safety', 'environment'] as (keyof OptimizationWeights)[]).map(key => (
              <div key={key} className="flex items-center justify-between space-x-3 text-xs font-mono">
                <span className="capitalize text-slate-400 w-24">{key}:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={customWeights[key] || 0}
                  onChange={e => {
                    onChangeWeights({
                      ...customWeights,
                      [key]: parseFloat(e.target.value)
                    });
                    onChangeMode('custom');
                  }}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white w-10 text-right">
                  {Math.round((customWeights[key] || 0) * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={onOptimize}
        disabled={isLoading || !origin || !destination}
        className={`w-full py-3 rounded-lg font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg ${
          isLoading || !origin || !destination
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
        }`}
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            <span>Calculating A* Route Optimization...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Generate Optimized Route</span>
          </>
        )}
      </button>
    </div>
  );
};
