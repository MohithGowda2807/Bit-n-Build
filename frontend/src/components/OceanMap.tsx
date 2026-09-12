import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polyline,
  Polygon,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import { Vessel, Port, MarineZone, RouteDetail, Coordinate } from '../types';

// Custom SVG Icons for high-tech maritime visualization
const createCustomIcon = (color: string, label: string, size = 28) => {
  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div style="
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 11px;
        border: 2px solid rgba(255,255,255,0.8);
        box-shadow: 0 0 14px ${color};
      ">
        ${label}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

const vesselIcon = createCustomIcon('#38bdf8', '🚢', 26);
const activeVesselIcon = createCustomIcon('#f59e0b', '🧭', 32);
const portIcon = createCustomIcon('#0ea5e9', '⚓', 22);
const originIcon = createCustomIcon('#10b981', 'A', 26);
const destIcon = createCustomIcon('#ef4444', 'B', 26);
const replayShipIcon = createCustomIcon('#ec4899', '🚢', 32);

interface MapEventsHandlerProps {
  mapSelectionMode: 'origin' | 'destination' | null;
  onSelectCoordinate: (coord: Coordinate) => void;
}

const MapEventsHandler: React.FC<MapEventsHandlerProps> = ({ mapSelectionMode, onSelectCoordinate }) => {
  useMapEvents({
    click(e) {
      if (mapSelectionMode) {
        onSelectCoordinate({
          latitude: parseFloat(e.latlng.lat.toFixed(4)),
          longitude: parseFloat(e.latlng.lng.toFixed(4))
        });
      }
    }
  });
  return null;
};

// Auto-fit bounds when route changes
const RouteBoundsController: React.FC<{ coords: [number, number][] | null }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      // coords are [lon, lat], leaflet needs [lat, lon]
      const latLngs = coords.map(c => [c[1], c[0]] as [number, number]);
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 8 });
    }
  }, [coords, map]);
  return null;
};

interface OceanMapProps {
  vessels: Vessel[];
  ports: Port[];
  zones: MarineZone[];
  origin: Coordinate | null;
  destination: Coordinate | null;
  activeRoute: RouteDetail | null;
  alternativeRoutes: RouteDetail[];
  selectedAlternativeIndex: number | null;
  onSelectAlternative: (index: number | null) => void;
  mapSelectionMode: 'origin' | 'destination' | null;
  onSelectCoordinate: (coord: Coordinate) => void;
  replayPosition: [number, number] | null;
}

export const OceanMap: React.FC<OceanMapProps> = ({
  vessels,
  ports,
  zones,
  origin,
  destination,
  activeRoute,
  alternativeRoutes,
  selectedAlternativeIndex,
  onSelectAlternative,
  mapSelectionMode,
  onSelectCoordinate,
  replayPosition
}) => {
  // Convert GeoJSON coords [lon, lat] -> Leaflet [lat, lon]
  const recommendedPolyline = activeRoute
    ? activeRoute.geometry.coordinates.map(c => [c[1], c[0]] as [number, number])
    : null;

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {mapSelectionMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-cyan-950/95 border border-cyan-500/80 px-4 py-2 rounded-lg text-xs font-mono text-cyan-200 shadow-lg animate-pulse flex items-center space-x-2">
          <span>Click anywhere on the ocean map to set {mapSelectionMode.toUpperCase()}</span>
        </div>
      )}

      <MapContainer
        center={[15.0, 75.0]}
        zoom={4}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ background: '#070f1e' }}
      >
        <MapEventsHandler
          mapSelectionMode={mapSelectionMode}
          onSelectCoordinate={onSelectCoordinate}
        />
        <RouteBoundsController coords={activeRoute ? activeRoute.geometry.coordinates : null} />

        {/* High contrast Dark Ocean Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          opacity={0.88}
        />

        {/* Marine Zones Polygons */}
        {zones.map(zone => {
          try {
            const geo = JSON.parse(zone.geometry_geojson);
            const rawCoords = geo.coordinates?.[0] || [];
            const latLngs = rawCoords.map((c: any) => [c[1], c[0]] as [number, number]);

            const isRestricted = zone.restricted || zone.risk_level > 50;
            const color = isRestricted ? '#f43f5e' : zone.zone_type === 'protected_area' ? '#10b981' : '#3b82f6';

            return (
              <Polygon
                key={`zone-${zone.id}`}
                positions={latLngs}
                pathOptions={{
                  color,
                  weight: isRestricted ? 2 : 1,
                  dashArray: zone.zone_type === 'shipping_lane' ? '6, 6' : undefined,
                  fillOpacity: 0.15
                }}
              >
                <Tooltip sticky className="font-mono text-xs">
                  <div>
                    <div className="font-bold">{zone.name}</div>
                    <div>Type: {zone.zone_type} | Risk: {zone.risk_level}%</div>
                    {zone.description && <div className="text-slate-400 mt-1">{zone.description}</div>}
                  </div>
                </Tooltip>
              </Polygon>
            );
          } catch {
            return null;
          }
        })}

        {/* Ports Markers */}
        {ports.map(port => (
          <Marker
            key={`port-${port.id}`}
            position={[port.latitude, port.longitude]}
            icon={portIcon}
          >
            <Popup className="font-mono text-xs">
              <div className="p-1">
                <div className="font-bold text-slate-900">{port.name}</div>
                <div className="text-slate-600">{port.country}</div>
                <div className="text-cyan-700 mt-1 font-semibold">Congestion: {port.congestion_level}%</div>
                <div className="text-slate-500">Capacity: {port.capacity.toLocaleString()} berths</div>
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -10]}>{port.name}</Tooltip>
          </Marker>
        ))}

        {/* Vessels Markers */}
        {vessels.map(vessel => (
          <Marker
            key={`vessel-${vessel.id}`}
            position={[vessel.latitude, vessel.longitude]}
            icon={vesselIcon}
          >
            <Popup className="font-mono text-xs">
              <div className="p-1 space-y-1">
                <div className="font-bold text-slate-900">{vessel.name}</div>
                <div className="text-slate-600">{vessel.vessel_identifier} | {vessel.vessel_type}</div>
                <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                  <div>Cruise: <span className="font-semibold">{vessel.cruise_speed_knots} kts</span></div>
                  <div>Max: <span className="font-semibold">{vessel.max_speed_knots} kts</span></div>
                  <div>Fuel: <span className="font-semibold">{vessel.current_fuel_liters.toLocaleString()} L</span></div>
                  <div>Status: <span className="font-semibold uppercase text-emerald-600">{vessel.status}</span></div>
                </div>
              </div>
            </Popup>
            <Tooltip direction="bottom" offset={[0, 10]}>{vessel.name}</Tooltip>
          </Marker>
        ))}

        {/* Selected Origin & Destination */}
        {origin && (
          <Marker position={[origin.latitude, origin.longitude]} icon={originIcon}>
            <Tooltip permanent direction="top">Origin</Tooltip>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.latitude, destination.longitude]} icon={destIcon}>
            <Tooltip permanent direction="top">Destination</Tooltip>
          </Marker>
        )}

        {/* Alternative Routes */}
        {alternativeRoutes.map((alt, idx) => {
          const isSelected = selectedAlternativeIndex === idx;
          const altLatLngs = alt.geometry.coordinates.map(c => [c[1], c[0]] as [number, number]);
          return (
            <Polyline
              key={`alt-route-${idx}`}
              positions={altLatLngs}
              eventHandlers={{
                click: () => onSelectAlternative(isSelected ? null : idx)
              }}
              pathOptions={{
                color: isSelected ? '#a855f7' : '#64748b',
                weight: isSelected ? 5 : 3,
                dashArray: '8, 8',
                opacity: isSelected ? 0.95 : 0.6
              }}
            >
              <Tooltip sticky>
                <div>{alt.name} ({alt.distance_km} km, {alt.estimated_fuel_liters.toLocaleString()} L)</div>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* Recommended Active Route */}
        {recommendedPolyline && (
          <Polyline
            positions={recommendedPolyline}
            pathOptions={{
              color: '#06b6d4',
              weight: 5,
              opacity: 0.95,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          >
            <Tooltip sticky>
              <div className="font-bold text-cyan-900">
                {activeRoute?.name} — Recommended Route
              </div>
            </Tooltip>
          </Polyline>
        )}

        {/* Replay Simulated Moving Vessel */}
        {replayPosition && (
          <Marker position={replayPosition} icon={replayShipIcon}>
            <Tooltip permanent direction="top">Simulated Position</Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
