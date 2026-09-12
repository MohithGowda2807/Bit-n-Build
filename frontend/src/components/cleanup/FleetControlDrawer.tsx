import React from 'react';
import { CleanupUnit } from '../../types';
import { sendFleetCommand } from '../../services/api';

interface FleetControlDrawerProps {
  units: CleanupUnit[];
  selectedUnitId?: number | null;
  onSelectUnit: (unit: CleanupUnit) => void;
  onRefreshFleet: () => void;
}

export const FleetControlDrawer: React.FC<FleetControlDrawerProps> = ({
  units,
  selectedUnitId,
  onSelectUnit,
  onRefreshFleet
}) => {
  const handleCommand = async (unitId: number, command: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await sendFleetCommand(unitId, command);
      onRefreshFleet();
    } catch (err) {
      console.warn('Command simulation fallback:', err);
      onRefreshFleet();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'collecting':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-semibold">Collecting</span>;
      case 'transit':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-semibold">In Transit</span>;
      case 'returning':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase font-semibold">Returning</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600 uppercase font-semibold">Idle</span>;
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-base">🚤</span>
          <span className="font-bold text-white uppercase tracking-wider text-xs">
            Autonomous Fleet Status ({units.length})
          </span>
        </div>
        <span className="text-[10px] text-cyan-400 font-semibold">LIVE TELEMETRY</span>
      </div>

      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {units.map(unit => {
          const isSelected = unit.id === selectedUnitId;
          return (
            <div
              key={unit.id}
              onClick={() => onSelectUnit(unit)}
              className={`p-3 rounded-xl border cursor-pointer transition ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md shadow-cyan-950 text-white'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-100">{unit.unit_name}</span>
                  <span className="text-[10px] text-slate-400">({unit.unit_type.replace('_', ' ')})</span>
                </div>
                {getStatusBadge(unit.status)}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 py-1">
                <div>
                  <span className="text-slate-500">Speed:</span>{' '}
                  <span className="text-slate-200">{unit.speed_knots} kn</span>
                </div>
                <div>
                  <span className="text-slate-500">Heading:</span>{' '}
                  <span className="text-slate-200">{unit.heading_deg}°</span>
                </div>
                <div>
                  <span className="text-slate-500">Range:</span>{' '}
                  <span className="text-slate-200">{unit.max_range_nm} NM</span>
                </div>
              </div>

              {/* Battery and payload bars */}
              <div className="space-y-1.5 mt-2">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>Battery</span>
                    <span className="font-bold text-emerald-400">{Math.round(unit.battery_pct)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${unit.battery_pct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>Payload</span>
                    <span className="font-bold text-cyan-400">
                      {unit.current_load_kg} / {unit.capacity_kg} kg
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (unit.current_load_kg / unit.capacity_kg) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick control actions */}
              <div className="flex items-center space-x-1.5 mt-3 pt-2 border-t border-slate-800/80">
                <button
                  onClick={(e) => handleCommand(unit.id, 'hold', e)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-300 rounded border border-slate-700 transition"
                  title="Hold Position"
                >
                  ⏸ Hold
                </button>
                <button
                  onClick={(e) => handleCommand(unit.id, 'return_to_base', e)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-purple-300 rounded border border-slate-700 transition"
                  title="Return to Base"
                >
                  ↩ Return
                </button>
                <button
                  onClick={(e) => handleCommand(unit.id, 'resume', e)}
                  className="px-2 py-1 bg-cyan-900/40 hover:bg-cyan-800/60 text-[10px] text-cyan-200 rounded border border-cyan-700/50 transition flex-1 text-center font-bold"
                  title="Resume Autonomous Sortie"
                >
                  ▶ Resume
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
