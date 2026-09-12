import React from 'react';
import { Marker, Popup, Tooltip, Circle } from 'react-leaflet';
import L from 'leaflet';
import { CleanupUnit } from '../../types';

interface FleetLayerProps {
  units: CleanupUnit[];
  selectedUnitId?: number | null;
  onSelectUnit?: (unit: CleanupUnit) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'collecting': return '#f59e0b'; // Amber
    case 'transit': return '#10b981'; // Emerald
    case 'returning': return '#8b5cf6'; // Violet
    case 'maintenance': return '#ef4444'; // Red
    default: return '#0ea5e9'; // Sky Blue
  }
};

const getUnitEmoji = (type: string) => {
  switch (type) {
    case 'autonomous_drone': return '🛸';
    case 'robotic_interceptor': return '⚡';
    case 'collection_boom': return '⚓';
    default: return '🚤';
  }
};

const createFleetIcon = (unit: CleanupUnit, isSelected: boolean) => {
  const color = getStatusColor(unit.status);
  const emoji = getUnitEmoji(unit.unit_type);
  const size = isSelected ? 38 : 30;
  const border = isSelected ? '3px solid #38bdf8' : '2px solid rgba(255,255,255,0.9)';

  return L.divIcon({
    className: 'custom-fleet-icon',
    html: `
      <div style="
        position: relative;
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size > 32 ? '17px' : '13px'};
        border: ${border};
        box-shadow: 0 0 16px ${color};
        cursor: pointer;
        transform: rotate(${unit.heading_deg || 0}deg);
        transition: all 0.3s ease;
      ">
        <span style="transform: rotate(-${unit.heading_deg || 0}deg);">${emoji}</span>
        <div style="
          position: absolute;
          bottom: -7px;
          right: -7px;
          background: #0f172a;
          color: #38bdf8;
          font-family: monospace;
          font-size: 9px;
          font-weight: bold;
          padding: 1px 3px;
          border-radius: 4px;
          border: 1px solid rgba(56, 189, 248, 0.4);
          transform: rotate(-${unit.heading_deg || 0}deg);
        ">
          ${Math.round(unit.battery_pct)}%
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

export const FleetLayer: React.FC<FleetLayerProps> = ({
  units,
  selectedUnitId,
  onSelectUnit
}) => {
  if (!units || units.length === 0) return null;

  return (
    <>
      {units.map((unit) => {
        if (unit.latitude == null || unit.longitude == null || isNaN(unit.latitude) || isNaN(unit.longitude)) {
          return null;
        }
        const isSelected = unit.id === selectedUnitId;
        const icon = createFleetIcon(unit, isSelected);

        return (
          <React.Fragment key={unit.id}>
            {/* Active sweep radius if collecting */}
            {unit.status === 'collecting' && (
              <Circle
                center={[unit.latitude, unit.longitude]}
                radius={1500}
                pathOptions={{
                  color: '#f59e0b',
                  fillColor: '#f59e0b',
                  fillOpacity: 0.2,
                  weight: 2,
                  dashArray: '4, 4'
                }}
              />
            )}

            <Marker
              position={[unit.latitude, unit.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectUnit?.(unit)
              }}
            >
              <Tooltip direction="top" offset={[0, -16]}>
                <div className="font-mono text-xs">
                  <div className="font-bold text-cyan-300">{unit.unit_name}</div>
                  <div className="text-slate-300 uppercase">
                    {unit.status} | {unit.speed_knots} kn | 🔋 {Math.round(unit.battery_pct)}%
                  </div>
                </div>
              </Tooltip>

              <Popup>
                <div className="p-3 font-mono text-xs max-w-xs text-slate-100 bg-slate-900 border border-slate-700/80 rounded-xl space-y-2">
                  <div className="font-bold text-sm text-cyan-400 uppercase flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span>{getUnitEmoji(unit.unit_type)} {unit.unit_name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                      {unit.unit_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-semibold">Status:</span>{' '}
                      <span className="uppercase font-bold" style={{ color: getStatusColor(unit.status) }}>
                        {unit.status}
                      </span>
                    </div>
                    <div><span className="text-slate-400 font-semibold">Battery:</span> <span className="text-white font-bold">{Math.round(unit.battery_pct)}%</span></div>
                    <div><span className="text-slate-400 font-semibold">Payload:</span> <span className="text-white font-bold">{unit.current_load_kg} / {unit.capacity_kg} kg</span></div>
                    <div><span className="text-slate-400 font-semibold">Velocity:</span> <span className="text-white font-bold">{unit.speed_knots} kn @ {unit.heading_deg}°</span></div>
                    <div><span className="text-slate-400 font-semibold">Coordinates:</span> <span className="text-slate-300">{unit.latitude.toFixed(3)}°N, {unit.longitude.toFixed(3)}°E</span></div>
                  </div>

                  <button
                    onClick={() => onSelectUnit?.(unit)}
                    className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 py-1.5 px-2 rounded-lg text-xs font-semibold uppercase tracking-wider border border-slate-700 cursor-pointer transition"
                  >
                    Select Unit
                  </button>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </>
  );
};
