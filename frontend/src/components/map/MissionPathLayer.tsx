import React from 'react';
import { Polyline, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import { Mission } from '../../types';

interface MissionPathLayerProps {
  missions: Mission[];
  selectedMissionId?: number | null;
  onSelectMission?: (mission: Mission) => void;
}

interface Waypoint {
  waypoint_index?: number;
  latitude: number;
  longitude: number;
  label?: string;
  action?: string;
}

export const MissionPathLayer: React.FC<MissionPathLayerProps> = ({
  missions,
  selectedMissionId,
  onSelectMission
}) => {
  if (!missions || missions.length === 0) return null;

  return (
    <>
      {missions.map((mission) => {
        let waypoints: Waypoint[] = [];
        const isSelected = mission.id === selectedMissionId;
        const color = isSelected ? '#38bdf8' : '#10b981';

        if ((mission as any).waypoints_json) {
          try {
            waypoints = typeof (mission as any).waypoints_json === 'string'
              ? JSON.parse((mission as any).waypoints_json)
              : (mission as any).waypoints_json;
          } catch {
            waypoints = [];
          }
        }

        // Fallback to origin/target if waypoints JSON not present
        if (waypoints.length === 0 && (mission as any).origin_lat && mission.target_lat) {
          waypoints = [
            { latitude: (mission as any).origin_lat, longitude: (mission as any).origin_lon, label: 'Origin' },
            { latitude: mission.target_lat, longitude: mission.target_lon || 0, label: 'Target Debris' }
          ];
        }

        waypoints = waypoints.filter(
          w => w && w.latitude != null && w.longitude != null && !isNaN(w.latitude) && !isNaN(w.longitude)
        );

        if (waypoints.length < 2) return null;

        const positions = waypoints.map(w => [w.latitude, w.longitude] as [number, number]);

        return (
          <React.Fragment key={mission.id}>
            {/* Animated dashed corridor line */}
            <Polyline
              positions={positions}
              pathOptions={{
                color: color,
                weight: isSelected ? 4 : 2.5,
                dashArray: '8, 8',
                opacity: 0.85
              }}
            >
              <Tooltip sticky>
                <div className="font-mono text-xs text-cyan-300">
                  Mission: {mission.mission_name} ({mission.status.toUpperCase()})
                </div>
              </Tooltip>
            </Polyline>

            {/* Waypoint milestone markers */}
            {waypoints.map((wp, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === waypoints.length - 1;
              const markerColor = isFirst ? '#0284c7' : isLast ? '#8b5cf6' : '#f59e0b';

              return (
                <CircleMarker
                  key={idx}
                  center={[wp.latitude, wp.longitude]}
                  radius={isFirst || isLast ? 6 : 4}
                  pathOptions={{
                    color: '#ffffff',
                    fillColor: markerColor,
                    fillOpacity: 1,
                    weight: 2
                  }}
                  eventHandlers={{
                    click: () => onSelectMission?.(mission)
                  }}
                >
                  <Tooltip direction="top" offset={[0, -8]}>
                    <div className="font-mono text-[11px]">
                      <span className="font-bold text-amber-300">WP #{idx}: </span>
                      {wp.label || `Point ${idx + 1}`} ({wp.action || 'waypoint'})
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};
