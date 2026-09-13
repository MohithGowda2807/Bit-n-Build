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
 case 'collecting': return '#e2a33a'; // Amber
 case 'transit': return '#2fae6e'; // Emerald
 case 'returning': return '#007afc'; // Violet
 case 'maintenance': return '#f0483e'; // Red
 default: return '#007afc'; // Sky Blue
  }
};

const unitGlyph = (type: string) => {
 switch (type) {
 case 'autonomous_drone': return 'D';
 case 'robotic_interceptor': return 'I';
 case 'collection_boom': return 'B';
 default: return 'S';
  }
};

const createFleetIcon = (unit: CleanupUnit, isSelected: boolean) => {
 const color = getStatusColor(unit.status);
 const emoji = unitGlyph(unit.unit_type);
 const size = isSelected ? 38 : 30;
 const border = isSelected ? '3px solid #3d9bff' : '2px solid rgba(255,255,255,0.9)';

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
 background: #15171b;
 color: #3d9bff;
 font-family: monospace;
 font-size: 9px;
 font-weight: bold;
 padding: 1px 3px;
 border-radius: 4px;
 border: 1px solid rgba(0, 122, 252, 0.4);
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
 color: '#e2a33a',
 fillColor: '#e2a33a',
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
                  <div className="font-bold text-os-signal">{unit.unit_name}</div>
                  <div className="text-os-fog uppercase">
                    {unit.status} | {unit.speed_knots} kn | battery {Math.round(unit.battery_pct)}%
                  </div>
                </div>
              </Tooltip>
              <Popup>
                <div className="p-3 font-mono text-xs max-w-xs text-white bg-os-panel border border-os-pewter rounded-row space-y-2">
                  <div className="font-bold text-sm text-os-signal uppercase flex items-center justify-between border-b border-os-pewter pb-1.5">
                    <span>{unitGlyph(unit.unit_type)} {unit.unit_name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-os-raised text-os-signal border border-os-signal">
                      {unit.unit_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-white text-[11px]">
                    <div>
                      <span className="text-os-ash font-semibold">Status:</span>{' '}
                      <span className="uppercase font-bold" style={{ color: getStatusColor(unit.status) }}>
                        {unit.status}
                      </span>
                    </div>
                    <div><span className="text-os-ash font-semibold">Battery:</span> <span className="text-white font-bold">{Math.round(unit.battery_pct)}%</span></div>
                    <div><span className="text-os-ash font-semibold">Payload:</span> <span className="text-white font-bold">{unit.current_load_kg} / {unit.capacity_kg} kg</span></div>
                    <div><span className="text-os-ash font-semibold">Velocity:</span> <span className="text-white font-bold">{unit.speed_knots} kn @ {unit.heading_deg}°</span></div>
                    <div><span className="text-os-ash font-semibold">Coordinates:</span> <span className="text-os-fog">{unit.latitude.toFixed(3)}°N, {unit.longitude.toFixed(3)}°E</span></div>
                  </div>
                  <button
 onClick={() => onSelectUnit?.(unit)}
 className="mt-3 w-full bg-os-raised hover:bg-os-raised text-os-signal py-1.5 px-2 rounded-input text-xs font-semibold uppercase tracking-wider border border-os-pewter cursor-pointer transition"
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
