import React from 'react';
import { Circle, CircleMarker, Marker, Popup, Tooltip, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Debris, DebrisCluster } from '../../types';

interface DebrisLayerProps {
  debrisList: Debris[];
  clusters?: DebrisCluster[];
  selectedDebrisId?: number | null;
  onSelectDebris?: (debris: Debris) => void;
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
  const bg = isCritical ? '#ef4444' : isHigh ? '#f97316' : '#eab308';
  const glow = isCritical ? 'rgba(239, 68, 68, 0.7)' : 'rgba(249, 115, 22, 0.5)';
  const border = isSelected ? '3px solid #38bdf8' : '2px solid rgba(255,255,255,0.9)';
  const size = isSelected ? 34 : 26;

  let emoji = '♻️';
  if (type === 'ghost_net') emoji = '🕸️';
  else if (type === 'chemical_slick') emoji = '🛢️';
  else if (type === 'container_hazard') emoji = '📦';

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
        ${emoji}
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
  showDriftVectors = true
}) => {
  return (
    <>
      {/* Clusters halos */}
      {clusters.map((cluster) => {
        const isCrit = cluster.risk_level === 'critical';
        const color = isCrit ? '#ef4444' : '#f97316';
        return (
          <Circle
            key={cluster.cluster_id}
            center={[cluster.center_lat, cluster.center_lon]}
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
              <div className="font-mono text-xs font-bold text-amber-300">
                ⚠️ {cluster.cluster_id} ({cluster.total_mass_kg.toLocaleString()} kg, {cluster.member_count} patches)
              </div>
            </Tooltip>
          </Circle>
        );
      })}

      {/* Individual debris items and drift projections */}
      {debrisList.map((debris) => {
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
                    color: '#f59e0b',
                    weight: 2,
                    dashArray: '4, 6',
                    opacity: 0.75
                  }}
                >
                  <Tooltip direction="right" sticky>
                    <div className="font-mono text-[11px] text-amber-300">
                      Drift Forecast: {speed} kn @ {heading}° (12h Projection)
                    </div>
                  </Tooltip>
                </Polyline>

                {/* 12-hr Endpoint Cone */}
                <CircleMarker
                  center={p12}
                  radius={5}
                  pathOptions={{
                    color: '#f59e0b',
                    fillColor: '#fbbf24',
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
                  <div className="font-bold text-amber-400 capitalize">{debris.debris_type.replace('_', ' ')}</div>
                  <div className="text-slate-300">
                    Severity: {debris.severity}/100 | Mass: {debris.estimated_mass_kg?.toLocaleString() || debris.estimated_size_m2} kg
                  </div>
                </div>
              </Tooltip>
              <Popup>
                <div className="p-2 font-mono text-xs max-w-xs text-slate-800">
                  <div className="font-bold text-sm text-red-600 uppercase flex items-center gap-1">
                    <span>⚠️</span> {debris.debris_type.replace('_', ' ')}
                  </div>
                  <div className="mt-1"><span className="font-semibold">ID:</span> #{debris.id}</div>
                  <div><span className="font-semibold">Priority:</span> <span className="uppercase font-bold text-red-600">{debris.clean_up_priority}</span></div>
                  <div><span className="font-semibold">Severity:</span> {debris.severity}/100</div>
                  <div><span className="font-semibold">Mass:</span> {debris.estimated_mass_kg?.toLocaleString() ?? '1,200'} kg</div>
                  {debris.target_species_threatened && (
                    <div className="text-red-700 font-semibold mt-1">
                      Threat: {debris.target_species_threatened}
                    </div>
                  )}
                  {debris.nearest_mpa_distance_nm && (
                    <div className="text-emerald-700">
                      Nearest MPA: {debris.nearest_mpa_distance_nm} NM
                    </div>
                  )}
                  <div className="text-[11px] text-slate-600 mt-1 italic">{debris.description}</div>
                  <button
                    onClick={() => onSelectDebris?.(debris)}
                    className="mt-2 w-full bg-cyan-700 hover:bg-cyan-600 text-white py-1 px-2 rounded text-xs font-semibold uppercase tracking-wider"
                  >
                    Open Mission Studio
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
