import React from 'react';
import { Circle, CircleMarker, Marker, Popup, Tooltip, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Debris, DebrisCluster } from '../../types';

interface DebrisLayerProps {
 debrisList: Debris[];
 clusters?: DebrisCluster[];
 selectedDebrisId?: number | null;
 onSelectDebris?: (debris: Debris) => void;
 onOpenPlanner?: (debris: Debris) => void;
 showDriftVectors?: boolean;
}

// Compute future point given lat, lon, heading (deg), speed (knots), and hours
function computeDriftPoint(lat: number, lon: number, headingDeg: number, speedKnots: number, hours: number): [number, number] {
 const distNm = speedKnots * hours;
 const distKm = distNm * 1.852;
 const dByR = distKm / 6371.0;
 const radH = (headingDeg * Math.PI) / 180.0;
 const radLat = (lat * Math.PI) / 180.0;
 const radLon = (lon * Math.PI) / 180.0;

 const newLat = Math.asin(
 Math.sin(radLat) * Math.cos(dByR) +
 Math.cos(radLat) * Math.sin(dByR) * Math.cos(radH)
  );
 const newLon = radLon + Math.atan2(
 Math.sin(radH) * Math.sin(dByR) * Math.cos(radLat),
 Math.cos(dByR) - Math.sin(radLat) * Math.sin(newLat)
  );

 return [(newLat * 180.0) / Math.PI, (newLon * 180.0) / Math.PI];
}

const createDebrisIcon = (type: string, severity: number, isSelected: boolean) => {
 const isCritical = severity >= 85;
 const isHigh = severity >= 70;
 const bg = isCritical ? '#f0483e' : isHigh ? '#f0873a' : '#e2a33a';
 const glow = isCritical ? 'rgba(240, 72, 62, 0.7)' : 'rgba(249, 115, 22, 0.5)';
 const border = isSelected ? '3px solid #3d9bff' : '2px solid rgba(255,255,255,0.9)';
 const size = isSelected ? 34 : 26;

 return L.divIcon({
 className: 'custom-debris-icon',
 html: `
      <div style="
 background: ${bg};
 width: ${size}px;
 height: ${size}px;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: ${size > 28 ? '16px' : '13px'};
 border: ${border};
 box-shadow: 0 0 16px ${glow};
 cursor: pointer;
 transition: transform 0.2s ease;
 ">
      </div>
 `,
 iconSize: [size, size],
 iconAnchor: [size / 2, size / 2]
  });
};

export const DebrisLayer: React.FC<DebrisLayerProps> = ({
 debrisList,
 clusters = [],
 selectedDebrisId,
 onSelectDebris,
 onOpenPlanner,
 showDriftVectors = true
}) => {
 return (
    <>
      {/* Clusters halos */}
      {clusters.map((cluster) => {
 const lat = cluster.center_lat ?? (cluster as any).centroid_lat;
 const lon = cluster.center_lon ?? (cluster as any).centroid_lon;
 if (lat == null || lon == null || isNaN(lat) || isNaN(lon)) return null;
 const isCrit = cluster.risk_level === 'critical' || (cluster as any).max_severity > 80;
 const color = isCrit ? '#f0483e' : '#f0873a';
 return (
          <Circle
 key={cluster.cluster_id}
 center={[lat, lon]}
 radius={25000} // 25 km halo
 pathOptions={{
 color: color,
 weight: 1.5,
 dashArray: '5, 8',
 fillColor: color,
 fillOpacity: 0.08
            }}
          >
            <Tooltip direction="top" offset={[0, -10]}>
              <div className="font-mono text-xs font-bold text-risk-moderate">
                {cluster.cluster_id} ({(cluster.total_mass_kg || 0).toLocaleString()} kg, {cluster.member_count} patches)
              </div>
            </Tooltip>
          </Circle>
        );
      })}

      {/* Individual debris items and drift projections */}
      {debrisList.map((debris) => {
 if (debris.latitude == null || debris.longitude == null || isNaN(debris.latitude) || isNaN(debris.longitude)) {
 return null;
        }
 const isSelected = debris.id === selectedDebrisId;
 const icon = createDebrisIcon(debris.debris_type, debris.severity, isSelected);
 const heading = debris.drift_heading_deg ?? 80;
 const speed = debris.drift_speed_knots ?? 1.4;

        // 6-hr and 12-hr drift vectors
 const p6 = computeDriftPoint(debris.latitude, debris.longitude, heading, speed, 6);
 const p12 = computeDriftPoint(debris.latitude, debris.longitude, heading, speed, 12);

 return (
          <React.Fragment key={debris.id}>
            {/* Drift Forecast Vector Line */}
            {showDriftVectors && (
              <>
                <Polyline
 positions={[
                    [debris.latitude, debris.longitude],
 p6,
 p12
                  ]}
 pathOptions={{
 color: '#e2a33a',
 weight: 2,
 dashArray: '4, 6',
 opacity: 0.75
                  }}
                >
                  <Tooltip direction="right" sticky>
                    <div className="font-mono text-[11px] text-risk-moderate">
 Drift Forecast: {speed} kn @ {heading}° (12h Projection)
                    </div>
                  </Tooltip>
                </Polyline>

                {/* 12-hr Endpoint Cone */}
                <CircleMarker
 center={p12}
 radius={5}
 pathOptions={{
 color: '#e2a33a',
 fillColor: '#e2a33a',
 fillOpacity: 0.9,
 weight: 1
                  }}
                />
              </>
            )}

            {/* Main Debris Marker */}
            <Marker
 position={[debris.latitude, debris.longitude]}
 icon={icon}
 eventHandlers={{
 click: () => onSelectDebris?.(debris)
              }}
            >
              <Tooltip direction="top" offset={[0, -14]}>
                <div className="font-mono text-xs">
                  <div className="font-bold text-risk-moderate capitalize">{debris.debris_type.replace('_', ' ')}</div>
                  <div className="text-os-fog">
 Severity: {debris.severity}/100 | Mass: {debris.estimated_mass_kg?.toLocaleString() || debris.estimated_size_m2} kg
                  </div>
                </div>
              </Tooltip>
              <Popup>
                <div className="p-3.5 font-mono text-xs max-w-[280px] text-white bg-os-panel border border-os-signal rounded-row space-y-2">
                  <div className="font-bold text-sm text-risk-moderate uppercase flex items-center justify-between border-b border-os-pewter pb-2">
                    <span className="flex items-center gap-1.5">
                      {debris.debris_type.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
 debris.clean_up_priority === 'urgent'
                        ? 'bg-risk-critical/20 text-risk-critical border-risk-critical'
                        : debris.clean_up_priority === 'high'
                        ? 'bg-risk-moderate/20 text-risk-moderate border-risk-moderate'
                        : 'bg-os-clear/20 text-os-clear border-os-clear'
                    }`}>
                      {debris.clean_up_priority}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] pt-1">
                    <div>
                      <span className="text-os-ash">ID:</span>{' '}
                      <span className="font-bold text-white">#{debris.id}</span>
                    </div>
                    <div>
                      <span className="text-os-ash">Severity:</span>{' '}
                      <span className={`font-bold ${debris.severity >= 80 ? 'text-risk-critical' : 'text-risk-moderate'}`}>
                        {debris.severity}/100
                      </span>
                    </div>
                    <div>
                      <span className="text-os-ash">Mass:</span>{' '}
                      <span className="font-bold text-os-signal">
                        {debris.estimated_mass_kg?.toLocaleString() ?? Math.round(debris.estimated_size_m2)} kg
                      </span>
                    </div>
                    <div>
                      <span className="text-os-ash">Drift:</span>{' '}
                      <span className="font-bold text-white">
                        {debris.drift_speed_knots ?? 1.4} kn
                      </span>
                    </div>
                  </div>

                  {debris.target_species_threatened && (
                    <div className="text-risk-critical text-[11px] font-medium bg-os-raised p-2 rounded-input border border-risk-critical flex items-start gap-1.5">
                      <div>
                        <span className="font-bold text-risk-critical">Threat:</span> {debris.target_species_threatened}
                      </div>
                    </div>
                  )}

                  {debris.nearest_mpa_distance_nm && (
                    <div className="text-os-clear text-[11px] bg-os-raised p-1.5 rounded-input border border-os-clear flex items-center gap-1.5">
                      <div>
                        <span className="font-semibold text-os-clear">Nearest MPA:</span> {debris.nearest_mpa_distance_nm} NM
                      </div>
                    </div>
                  )}

                  {debris.description && (
                    <div className="text-[11px] text-os-fog italic bg-os-void p-2 rounded-input border border-os-pewter">
 "{debris.description}"
                    </div>
                  )}

                  <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 e.preventDefault();
 onSelectDebris?.(debris);
 if (onOpenPlanner) {
 onOpenPlanner(debris);
                      } else {
 window.dispatchEvent(new CustomEvent('triton:open-mission-planner', { detail: debris }));
                      }
                    }}
 className="mt-3 w-full bg-os-signal hover:bg-os-signal-hover text-white py-2 px-3 rounded-input text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Open Mission Studio</span>
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
