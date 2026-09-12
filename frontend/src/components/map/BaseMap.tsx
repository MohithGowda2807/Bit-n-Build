import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Basemap, BASEMAPS } from '../OceanMap';
import { FilterPill } from '../ui/primitives';

interface Props {
  basemap: Basemap;
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
}

/** Full-bleed Leaflet map in the system: no zoom chrome, dark ground, basemap by prop. */
export const BaseMap: React.FC<Props> = ({ basemap, center = [13.0, 74.0], zoom = 5, children }) => {
  const tiles = BASEMAPS[basemap];
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="w-full h-full" zoomControl={false} style={{ background: '#10141a' }}>
      <TileLayer key={basemap} attribution={tiles.attribution} url={tiles.url} opacity={tiles.opacity} />
      {children}
    </MapContainer>
  );
};

export const BasemapToggle: React.FC<{ basemap: Basemap; onChange: (b: Basemap) => void; style?: React.CSSProperties }> = ({ basemap, onChange, style }) => (
  <div className="absolute z-[1000] flex gap-2" style={style}>
    {(['night', 'chart'] as Basemap[]).map(b => (
      <FilterPill key={b} active={basemap === b} onClick={() => onChange(b)}>{b === 'night' ? 'Night' : 'Chart'}</FilterPill>
    ))}
  </div>
);
