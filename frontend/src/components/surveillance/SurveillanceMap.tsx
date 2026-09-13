import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Polygon, Rectangle, Tooltip, useMap } from 'react-leaflet';
import { Basemap, BASEMAPS } from '../OceanMap';
import { Vessel } from '../../types';
import { DarkPeriod, FishingZone, Heatmap, ProtectedArea, VesselRiskSummary } from '../../types/surveillance';
import { cellBounds, heatStyle } from '../../design/heatmap';
import { TrackSegment } from '../../design/track';
import { riskColor, CLEAR_GREEN } from '../../design/risk';

export interface LayerState {
  vessels: boolean;
  trails: boolean;
  zones: boolean;
  gaps: boolean;
  heat: boolean;
}

interface Props {
  basemap: Basemap;
  vessels: Vessel[];
  riskByVessel: Map<number, VesselRiskSummary>;
  fishingZones: FishingZone[];
  protectedAreas: ProtectedArea[];
  selectedId: number | null;
  onSelect: (vessel: Vessel) => void;
  segments: TrackSegment[];
  gaps: DarkPeriod[];
  layers: LayerState;
  /** Positions pushed by replay, keyed by vessel id; override live markers while set. */
  replayPositions?: Map<number, [number, number]>;
  heatmap?: Heatmap | null;
}

const ZONE_STYLE: Record<string, string> = {
  NO_FISHING: '#f0483e',
  RESTRICTED_FISHING: '#e2a33a',
  SEASONAL_FISHING: '#e2a33a',
  AUTHORIZED_FISHING: CLEAR_GREEN,
};

function ring(geometry: { coordinates: number[][][] }): [number, number][] {
  return (geometry.coordinates[0] || []).map(c => [c[1], c[0]] as [number, number]);
}

const FitToSegments: React.FC<{ segments: TrackSegment[] }> = ({ segments }) => {
  const map = useMap();
  useEffect(() => {
    const pts = segments.flatMap(s => s.points);
    if (pts.length > 1) map.fitBounds(pts as any, { padding: [80, 80], maxZoom: 9 });
  }, [segments, map]);
  return null;
};

const ScenarioFocusController: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const handleScenario = (e: Event) => {
      const custom = e as CustomEvent;
      const focus = custom.detail?.scenario?.focus;
      if (focus && typeof focus.latitude === 'number' && typeof focus.longitude === 'number') {
        map.flyTo([focus.latitude, focus.longitude], focus.zoom || 8, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    };
    window.addEventListener('triton:scenario-activated', handleScenario);
    return () => window.removeEventListener('triton:scenario-activated', handleScenario);
  }, [map]);
  return null;
};

export const SurveillanceMap: React.FC<Props> = ({
  basemap, vessels, riskByVessel, fishingZones, protectedAreas, selectedId, onSelect, segments, gaps, layers, replayPositions, heatmap,
}) => {
  const tiles = BASEMAPS[basemap];
  const selected = useMemo(() => vessels.find(v => v.id === selectedId) ?? null, [vessels, selectedId]);

  const positionOf = (v: Vessel): [number, number] =>
    replayPositions?.get(v.id) ?? [v.latitude, v.longitude];

  return (
    <MapContainer center={[13.0, 72.0]} zoom={6} scrollWheelZoom className="w-full h-full" zoomControl={false} style={{ background: '#10141a' }}>
      <TileLayer key={basemap} attribution={tiles.attribution} url={tiles.url} opacity={tiles.opacity} />
      <FitToSegments segments={segments} />
      <ScenarioFocusController />

      {layers.heat && heatmap?.cells.map(c => (
        <Rectangle key={`heat-${c.lat}-${c.lon}`} bounds={cellBounds(c, heatmap.cell_degrees)} pathOptions={heatStyle(c)} interactive={false} />
      ))}

      {layers.zones && protectedAreas.map(a => (
        <Polygon key={`mpa-${a.id}`} positions={ring(a.geometry)}
          pathOptions={{ color: '#f0483e', weight: 1, fillColor: '#f0483e', fillOpacity: 0.08 }}>
          <Tooltip sticky>{a.name} · protected · {a.protection_level}</Tooltip>
        </Polygon>
      ))}
      {layers.zones && fishingZones.map(z => (
        <Polygon key={`fz-${z.id}`} positions={ring(z.geometry)}
          pathOptions={{ color: ZONE_STYLE[z.zone_type] ?? '#a0aaba', weight: 1, fillColor: ZONE_STYLE[z.zone_type] ?? '#a0aaba', fillOpacity: 0.06 }}>
          <Tooltip sticky>{z.name} · {z.zone_type.replace('_', ' ').toLowerCase()}</Tooltip>
        </Polygon>
      ))}

      {layers.trails && segments.map((s, i) => (
        s.points.length > 1 ? (
          <Polyline key={`seg-${i}`} positions={s.points}
            pathOptions={s.kind === 'observed'
              ? { color: '#ffffff', weight: 1.5, opacity: 0.95 }
              : { color: '#e2a33a', weight: 1.5, dashArray: '4 6', opacity: 0.95 }} />
        ) : null
      ))}

      {layers.gaps && gaps.map(g => {
        if (g.last_latitude == null || g.last_longitude == null || isNaN(g.last_latitude) || isNaN(g.last_longitude)) {
          return null;
        }
        return (
          <React.Fragment key={`gap-${g.id}`}>
            <CircleMarker center={[g.last_latitude, g.last_longitude]} radius={3} pathOptions={{ color: '#e2a33a', fillColor: '#e2a33a', fillOpacity: 1, weight: 0 }}>
              <Tooltip>AIS lost · {Math.round(g.duration_seconds / 60)} min dark</Tooltip>
            </CircleMarker>
            {g.reappearance_latitude !== null && g.reappearance_longitude !== null && !isNaN(g.reappearance_latitude) && !isNaN(g.reappearance_longitude) ? (
              <CircleMarker center={[g.reappearance_latitude, g.reappearance_longitude]} radius={3} pathOptions={{ color: '#e2a33a', fillColor: '#e2a33a', fillOpacity: 1, weight: 0 }}>
                <Tooltip>Reappeared{g.estimated_distance_km ? ` · ${g.estimated_distance_km.toFixed(1)} km away` : ''}</Tooltip>
              </CircleMarker>
            ) : (
              <CircleMarker center={[g.last_latitude, g.last_longitude]} radius={22} pathOptions={{ color: '#e2a33a', weight: 1, dashArray: '3 5', fillColor: '#e2a33a', fillOpacity: 0.06 }} />
            )}
          </React.Fragment>
        );
      })}

      {layers.vessels && vessels.map(v => {
        const pos = positionOf(v);
        if (!pos || pos[0] == null || pos[1] == null || isNaN(pos[0]) || isNaN(pos[1])) return null;
        const risk = riskByVessel.get(v.id);
        const fill = risk ? riskColor(risk.score) : '#a0aaba';
        const isSelected = v.id === selectedId;
        return (
          <CircleMarker key={v.id} center={pos} radius={isSelected ? 6 : 4.5}
            pathOptions={{ color: '#0e1012', weight: 2, fillColor: fill, fillOpacity: 1 }}
            eventHandlers={{ click: () => onSelect(v) }}>
            <Tooltip direction="top" offset={[0, -6]}>{v.name}{risk ? ` · ${Math.round(risk.score)}` : ''}</Tooltip>
          </CircleMarker>
        );
      })}
      {layers.vessels && selected && (() => {
        const pos = positionOf(selected);
        if (!pos || pos[0] == null || pos[1] == null || isNaN(pos[0]) || isNaN(pos[1])) return null;
        return (
          <CircleMarker center={pos} radius={12} interactive={false}
            pathOptions={{ color: '#007afc', weight: 1.5, fill: false }} />
        );
      })()}
    </MapContainer>
  );
};
