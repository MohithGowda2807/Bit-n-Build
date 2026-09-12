import React from 'react';
import { Circle, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { Storm } from '../../types';

interface StormLayerProps {
 storms: Storm[];
}

export const StormLayer: React.FC<StormLayerProps> = ({ storms }) => {
 if (!storms || storms.length === 0) return null;

 return (
    <>
      {storms.map(storm => {
 if (
 storm.center_latitude == null ||
 storm.center_longitude == null ||
 isNaN(storm.center_latitude) ||
 isNaN(storm.center_longitude)
        ) {
 return null;
        }
 const isCritical = storm.severity === 'critical';
 const isHigh = storm.severity === 'high';
 const strokeColor = isCritical ? '#f0483e' : isHigh ? '#f0873a' : '#e2a33a';
 const fillColor = isCritical ? '#f0483e' : isHigh ? '#f0873a' : '#e2a33a';

 const center: [number, number] = [storm.center_latitude, storm.center_longitude];
 const radiusMeters = (storm.radius_km || 10) * 1000;
 const coreRadiusMeters = radiusMeters * 0.4;

 return (
          <React.Fragment key={storm.id}>
            {/* Outer storm buffer radius */}
            <Circle
 center={center}
 radius={radiusMeters}
 pathOptions={{
 color: strokeColor,
 weight: 1.5,
 dashArray: '6, 6',
 fillColor: fillColor,
 fillOpacity: 0.12,
              }}
            />

            {/* Inner severe core / storm eye */}
            <Circle
 center={center}
 radius={coreRadiusMeters}
 pathOptions={{
 color: strokeColor,
 weight: 2,
 fillColor: fillColor,
 fillOpacity: 0.35,
              }}
            />

            {/* Pulsing storm eye marker */}
            <CircleMarker
 center={center}
 radius={7}
 pathOptions={{
 color: '#ffffff',
 weight: 2,
 fillColor: strokeColor,
 fillOpacity: 1,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} permanent={false}>
                <div className="text-xs font-mono font-bold">
                  🌀 {storm.name} ({storm.severity.toUpperCase()})
                </div>
              </Tooltip>
              <Popup>
                <div className="p-3 font-mono text-xs flex flex-col gap-1.5 text-white bg-os-panel border border-os-pewter rounded-row">
                  <div className="font-bold text-sm text-risk-critical flex items-center gap-1.5 border-b border-os-pewter pb-1.5">
                    <span>🌀</span> {storm.name}
                  </div>
                  <div className="mt-1 text-[11px]"><span className="text-os-ash font-semibold">Type:</span> <span className="text-white font-semibold">{storm.storm_type.toUpperCase()}</span></div>
                  <div className="text-[11px]"><span className="text-os-ash font-semibold">Severity:</span> <span className="uppercase font-bold text-risk-critical">{storm.severity}</span></div>
                  <div className="text-[11px]"><span className="text-os-ash font-semibold">Wind:</span> <span className="text-risk-moderate font-semibold">{storm.wind_speed_knots} knots</span></div>
                  <div className="text-[11px]"><span className="text-os-ash font-semibold">Radius:</span> <span className="text-white">{storm.radius_km} km (Core: {(storm.radius_km * 0.4).toFixed(0)} km)</span></div>
                  <div className="text-[11px]"><span className="text-os-ash font-semibold">Track:</span> <span className="text-os-signal">{storm.movement_direction_deg}° at {storm.movement_speed_knots} kn</span></div>
                  <div className="text-[10px] text-os-ash mt-1 pt-1 border-t border-os-pewter">Source: {storm.source}</div>
                </div>
              </Popup>
            </CircleMarker>
          </React.Fragment>
        );
      })}
    </>
  );
};
