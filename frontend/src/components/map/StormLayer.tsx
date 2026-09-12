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
 const isCritical = storm.severity === 'critical';
 const isHigh = storm.severity === 'high';
 const strokeColor = isCritical ? '#f0483e' : isHigh ? '#f0873a' : '#e2a33a';
 const fillColor = isCritical ? '#f0483e' : isHigh ? '#f0873a' : '#e2a33a';

 const center: [number, number] = [storm.center_latitude, storm.center_longitude];
 const radiusMeters = storm.radius_km * 1000;
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
                <div className="p-2 font-mono text-xs flex flex-col gap-1 text-os-void">
                  <div className="font-bold text-sm text-risk-critical flex items-center gap-1">
                    <span>🌀</span> {storm.name}
                  </div>
                  <div><span className="font-semibold">Type:</span> {storm.storm_type.toUpperCase()}</div>
                  <div><span className="font-semibold">Severity:</span> <span className="uppercase font-bold text-risk-critical">{storm.severity}</span></div>
                  <div><span className="font-semibold">Wind:</span> {storm.wind_speed_knots} knots</div>
                  <div><span className="font-semibold">Radius:</span> {storm.radius_km} km (Core: {(storm.radius_km * 0.4).toFixed(0)} km)</div>
                  <div><span className="font-semibold">Track:</span> {storm.movement_direction_deg}° at {storm.movement_speed_knots} kn</div>
                  <div className="text-[10px] text-os-slate mt-1">Source: {storm.source}</div>
                </div>
              </Popup>
            </CircleMarker>
          </React.Fragment>
        );
      })}
    </>
  );
};
