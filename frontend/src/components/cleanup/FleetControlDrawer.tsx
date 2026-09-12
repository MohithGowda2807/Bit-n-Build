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
 return <span className="text-[10px] px-2 py-0.5 rounded-full bg-risk-moderate/20 text-risk-moderate border border-risk-moderate uppercase font-semibold">Collecting</span>;
 case 'transit':
 return <span className="text-[10px] px-2 py-0.5 rounded-full bg-os-clear/20 text-os-clear border border-os-clear uppercase font-semibold">In Transit</span>;
 case 'returning':
 return <span className="text-[10px] px-2 py-0.5 rounded-full bg-os-signal/20 text-os-signal border border-os-signal uppercase font-semibold">Returning</span>;
 default:
 return <span className="text-[10px] px-2 py-0.5 rounded-full bg-os-raised text-os-fog border border-os-pewter uppercase font-semibold">Idle</span>;
    }
  };

 return (
    <div className="bg-os-panel border border-os-pewter rounded-panel p-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-os-pewter mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-base">🚤</span>
          <span className="font-bold text-white uppercase tracking-wider text-xs">
 Autonomous Fleet Status ({units.length})
          </span>
        </div>
        <span className="text-[10px] text-os-signal font-semibold">LIVE TELEMETRY</span>
      </div>

      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {units.map(unit => {
 const isSelected = unit.id === selectedUnitId;
 return (
            <div
 key={unit.id}
 onClick={() => onSelectUnit(unit)}
 className={`p-3 rounded-row border cursor-pointer transition ${
 isSelected
                  ? 'bg-os-raised border-os-signal text-white'
                  : 'bg-os-void border-os-pewter hover:border-os-pewter text-os-fog'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{unit.unit_name}</span>
                  <span className="text-[10px] text-os-ash">({unit.unit_type.replace('_', ' ')})</span>
                </div>
                {getStatusBadge(unit.status)}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 text-[11px] text-os-ash py-1">
                <div>
                  <span className="text-os-slate">Speed:</span>{' '}
                  <span className="text-white">{unit.speed_knots} kn</span>
                </div>
                <div>
                  <span className="text-os-slate">Heading:</span>{' '}
                  <span className="text-white">{unit.heading_deg}°</span>
                </div>
                <div>
                  <span className="text-os-slate">Range:</span>{' '}
                  <span className="text-white">{unit.max_range_nm} NM</span>
                </div>
              </div>

              {/* Battery and payload bars */}
              <div className="space-y-1.5 mt-2">
                <div>
                  <div className="flex justify-between text-[10px] text-os-ash mb-0.5">
                    <span>Battery</span>
                    <span className="font-bold text-os-clear">{Math.round(unit.battery_pct)}%</span>
                  </div>
                  <div className="w-full bg-os-raised rounded-full h-1.5 overflow-hidden">
                    <div
 className="bg-os-clear h-full rounded-full transition-all"
 style={{ width: `${unit.battery_pct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-os-ash mb-0.5">
                    <span>Payload</span>
                    <span className="font-bold text-os-signal">
                      {unit.current_load_kg} / {unit.capacity_kg} kg
                    </span>
                  </div>
                  <div className="w-full bg-os-raised rounded-full h-1.5 overflow-hidden">
                    <div
 className="bg-os-signal h-full rounded-full transition-all"
 style={{ width: `${Math.min(100, (unit.current_load_kg / unit.capacity_kg) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick control actions */}
              <div className="flex items-center space-x-1.5 mt-3 pt-2 border-t border-os-pewter">
                <button
 onClick={(e) => handleCommand(unit.id, 'hold', e)}
 className="px-2 py-1 bg-os-raised hover:bg-os-raised text-[10px] text-risk-moderate rounded border border-os-pewter transition"
 title="Hold Position"
                >
                  ⏸ Hold
                </button>
                <button
 onClick={(e) => handleCommand(unit.id, 'return_to_base', e)}
 className="px-2 py-1 bg-os-raised hover:bg-os-raised text-[10px] text-os-signal rounded border border-os-pewter transition"
 title="Return to Base"
                >
                  ↩ Return
                </button>
                <button
 onClick={(e) => handleCommand(unit.id, 'resume', e)}
 className="px-2 py-1 bg-os-raised hover:bg-os-raised text-[10px] text-os-signal rounded border border-os-signal transition flex-1 text-center font-bold"
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
