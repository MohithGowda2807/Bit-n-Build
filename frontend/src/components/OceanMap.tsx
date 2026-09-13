import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import {
 MapContainer,
 TileLayer,
 Marker,
 Popup,
 Tooltip,
 Polyline,
 Polygon,
 ZoomControl,
 useMap,
 useMapEvents
} from 'react-leaflet';
import { Vessel, Port, MarineZone, RouteDetail, Coordinate, Debris, VesselTrack, Storm, CleanupUnit, DebrisCluster, Mission } from '../types';
import { StormLayer } from './map/StormLayer';
import { DebrisLayer } from './map/DebrisLayer';
import { FleetLayer } from './map/FleetLayer';
import { MissionPathLayer } from './map/MissionPathLayer';


// Custom SVG Icons for high-tech maritime visualization
const createCustomIcon = (color: string, label: string, size = 28, glowColor?: string) => {
 const glow = glowColor || color;
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
 font-size: ${size > 28 ? '13px' : '11px'};
 border: 2px solid rgba(255,255,255,0.85);
 box-shadow: 0 0 14px ${glow};
 cursor: pointer;
 ">
        ${label}
      </div>
 `,
 iconSize: [size, size],
 iconAnchor: [size / 2, size / 2]
  });
};

const vesselIcon = createCustomIcon('#3d9bff', '', 26, '#0062ca');
const underwayVesselIcon = createCustomIcon('#2fae6e', '', 28, '#2fae6e');
const selectedVesselIcon = createCustomIcon('#e2a33a', '', 32, '#e2a33a');
const portIcon = createCustomIcon('#007afc', '', 22, '#0062ca');
const originIcon = createCustomIcon('#2fae6e', 'A', 26, '#2fae6e');
const destIcon = createCustomIcon('#f0483e', 'B', 26, '#f0483e');
const replayShipIcon = createCustomIcon('#f2643e', '', 32, '#f0483e');

// Debris icons by severity
const debrisCriticalIcon = createCustomIcon('#f0483e', '', 26, '#f0483e');
const debrisHighIcon = createCustomIcon('#f0873a', '', 24, '#f0873a');
const debrisMediumIcon = createCustomIcon('#e2a33a', '', 22, '#e2a33a');

interface MapEventsHandlerProps {
 mapSelectionMode: 'origin' | 'destination' | null;
 onSelectCoordinate: (coord: Coordinate) => void;
 ports?: Port[];
 onSelectPort?: (port: Port) => void;
}

const MapEventsHandler: React.FC<MapEventsHandlerProps> = ({ mapSelectionMode, onSelectCoordinate, ports = [], onSelectPort }) => {
 useMapEvents({
 click(e) {
 if (mapSelectionMode) {
 if (ports && ports.length > 0) {
          // Snap to nearest port worldwide
 let nearest = ports[0];
 let minDist = Math.hypot(e.latlng.lat - nearest.latitude, e.latlng.lng - nearest.longitude);
 for (let i = 1; i < ports.length; i++) {
 const d = Math.hypot(e.latlng.lat - ports[i].latitude, e.latlng.lng - ports[i].longitude);
 if (d < minDist) {
 minDist = d;
 nearest = ports[i];
            }
          }
 onSelectCoordinate({
 latitude: nearest.latitude,
 longitude: nearest.longitude
          });
 if (onSelectPort) onSelectPort(nearest);
        } else {
 onSelectCoordinate({
 latitude: parseFloat(e.latlng.lat.toFixed(4)),
 longitude: parseFloat(e.latlng.lng.toFixed(4))
          });
        }
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
 const latLngs = coords.map(c => [c[1], c[0]] as [number, number]);
 const bounds = L.latLngBounds(latLngs);
 map.fitBounds(bounds, { padding: [60, 60], maxZoom: 8 });
    }
  }, [coords, map]);
 return null;
};

// Auto-pan to demo scenario location
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

interface OceanMapProps {
 vessels: Vessel[];
 ports: Port[];
 zones: MarineZone[];
 debris?: Debris[];
 fleetUnits?: CleanupUnit[];
 missions?: Mission[];
 debrisClusters?: DebrisCluster[];
 selectedVessel?: Vessel | null;
 selectedVesselTracks?: VesselTrack[];
 onSelectVessel?: (vessel: Vessel) => void;
 selectedDebris?: Debris | null;
 onSelectDebris?: (debris: Debris) => void;
 onOpenPlanner?: (debris: Debris) => void;
 selectedFleetUnit?: CleanupUnit | null;
 onSelectFleetUnit?: (unit: CleanupUnit) => void;
 selectedMission?: Mission | null;
 onSelectMission?: (mission: Mission) => void;
 origin: Coordinate | null;
 destination: Coordinate | null;
 activeRoute: RouteDetail | null;
 alternativeRoutes: RouteDetail[];
 selectedAlternativeIndex: number | null;
 onSelectAlternative: (index: number | null) => void;
 mapSelectionMode: 'origin' | 'destination' | null;
 onSelectCoordinate: (coord: Coordinate) => void;
 onSelectPort?: (port: Port) => void;
 replayPosition: [number, number] | null;
  /** Chart keeps the light OpenStreetMap look; Night is the dark basemap the surveillance view uses. */
 basemap?: Basemap;
 onBasemapChange?: (basemap: Basemap) => void;
  /** Hide the Phase 1 layer bar when a page supplies its own chips. */
 showLayerBar?: boolean;
 storms?: Storm[];
}

export type Basemap = 'chart' | 'night';

export const BASEMAPS: Record<Basemap, { url: string; attribution: string; opacity: number }> = {
 chart: {
 url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
 opacity: 0.92,
  },
 night: {
    // Esri Dark Gray Canvas: free, no key, dark land with quiet labels. Max zoom 16.
 url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
 attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
 opacity: 1,
  },
};

export const OceanMap: React.FC<OceanMapProps> = ({
 vessels,
 ports,
 zones,
 debris = [],
 fleetUnits = [],
 missions = [],
 debrisClusters = [],
 selectedVessel,
 selectedVesselTracks = [],
 onSelectVessel,
 selectedDebris,
 onSelectDebris,
 onOpenPlanner,
 selectedFleetUnit,
 onSelectFleetUnit,
 selectedMission,
 onSelectMission,
 origin,
 destination,
 activeRoute,
 alternativeRoutes,
 selectedAlternativeIndex,
 onSelectAlternative,
 mapSelectionMode,
 onSelectCoordinate,
 onSelectPort,
 replayPosition,
 basemap: basemapProp,
 onBasemapChange,
 showLayerBar = true,
 storms = []
}) => {
 const [basemapState, setBasemapState] = useState<Basemap>('chart');
 const basemap = basemapProp ?? basemapState;
 const setBasemap = (next: Basemap) => {
 setBasemapState(next);
 onBasemapChange?.(next);
  };
 const tiles = BASEMAPS[basemap];
  // Layer toggles
 const [showVessels, setShowVessels] = useState(true);
 const [showDebris, setShowDebris] = useState(true);
 const [showFleet, setShowFleet] = useState(true);
 const [showMissions, setShowMissions] = useState(true);
 const [showZones, setShowZones] = useState(true);
 const [showPorts, setShowPorts] = useState(true);
 const [showStorms, setShowStorms] = useState(true);

  // Convert GeoJSON coords [lon, lat] -> Leaflet [lat, lon]
 const recommendedPolyline = activeRoute
    ? activeRoute.geometry.coordinates.map(c => [c[1], c[0]] as [number, number])
    : null;

  // Selected vessel track polyline
 const vesselTrackPolyline = selectedVesselTracks.length > 1
    ? selectedVesselTracks.map(t => [t.latitude, t.longitude] as [number, number])
    : null;

 return (
    <div className="relative w-full h-full min-h-[520px] rounded-row overflow-hidden border border-os-pewter bg-os-void">
      {/* Map selection alert banner */}
      {mapSelectionMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-os-raised border border-os-signal px-4 py-2 rounded-input text-xs font-mono text-os-signal animate-pulse flex items-center space-x-2">
          <span>Click anywhere on the ocean map to set {mapSelectionMode.toUpperCase()}</span>
        </div>
      )}

      {/* Layer Control Bar */}
      {showLayerBar && (
      <div className="absolute top-4 right-4 z-[1000] bg-os-panel border border-os-pewter rounded-input p-2 flex items-center space-x-2 text-xs font-mono">
        <button
 onClick={() => setBasemap(basemap === 'chart' ? 'night' : 'chart')}
 className="px-2 py-1 rounded border border-os-pewter text-os-fog hover:text-white"
 title="Switch basemap"
        >
          {basemap === 'chart' ? 'Chart' : 'Night'}
        </button>
        <span className="text-os-ash font-semibold px-1">Layers:</span>
        <button
 onClick={() => setShowFleet(!showFleet)}
 className={`px-2 py-1 rounded transition-colors ${
 showFleet ? 'bg-os-signal/30 text-os-signal border border-os-signal' : 'bg-os-raised text-os-slate'
          }`}
        >
          Fleet ({fleetUnits.length})
        </button>
        <button
 onClick={() => setShowDebris(!showDebris)}
 className={`px-2 py-1 rounded transition-colors ${
 showDebris ? 'bg-risk-moderate/30 text-risk-moderate border border-risk-moderate' : 'bg-os-raised text-os-slate'
          }`}
        >
          Debris ({debris.length})
        </button>
        <button
 onClick={() => setShowMissions(!showMissions)}
 className={`px-2 py-1 rounded transition-colors ${
 showMissions ? 'bg-os-signal/30 text-os-signal border border-os-signal' : 'bg-os-raised text-os-slate'
          }`}
        >
          Missions ({missions.length})
        </button>
        <button
 onClick={() => setShowVessels(!showVessels)}
 className={`px-2 py-1 rounded transition-colors ${
 showVessels ? 'bg-os-signal/30 text-os-signal border border-os-signal' : 'bg-os-raised text-os-slate'
          }`}
        >
          Vessels ({vessels.length})
        </button>
        <button
 onClick={() => setShowZones(!showZones)}
 className={`px-2 py-1 rounded transition-colors ${
 showZones ? 'bg-os-clear/30 text-os-clear border border-os-clear' : 'bg-os-raised text-os-slate'
          }`}
        >
          MPAs ({zones.length})
        </button>
        <button
 onClick={() => setShowStorms(!showStorms)}
 className={`px-2 py-1 rounded transition-colors ${
 showStorms ? 'bg-risk-critical/30 text-risk-critical border border-risk-critical' : 'bg-os-raised text-os-slate'
          }`}
        >
          Storms ({storms.length})
        </button>
      </div>
      )}

      <MapContainer
 center={[15.0, 75.0]}
 zoom={4}
 scrollWheelZoom={true}
 zoomControl={false}
 className="w-full h-full"
 style={{ background: '#0e1012' }}
      >
        <ZoomControl position="bottomright" />
        <MapEventsHandler
 mapSelectionMode={mapSelectionMode}
 onSelectCoordinate={onSelectCoordinate}
 ports={ports}
 onSelectPort={onSelectPort}
        />
        <RouteBoundsController coords={activeRoute ? activeRoute.geometry.coordinates : null} />
        <ScenarioFocusController />

        {/* Basemap: Chart (OpenStreetMap) or Night (CARTO dark) */}
        <TileLayer
 key={basemap}
 attribution={tiles.attribution}
 url={tiles.url}
 opacity={tiles.opacity}
        />

        {/* Active Storm Systems (Phase 2) */}
        {showStorms && <StormLayer storms={storms} />}

        {/* Marine Protected Areas & Restricted Zones Polygons */}
        {showZones && zones.map(zone => {
 try {
 const geo = JSON.parse(zone.geometry_geojson);
 const rawCoords = geo.coordinates?.[0] || [];
 const latLngs = rawCoords.map((c: any) => [c[1], c[0]] as [number, number]);

 const isRestricted = zone.restricted || zone.risk_level > 50;
 const color = isRestricted ? '#f2643e' : zone.zone_type === 'protected_area' ? '#2fae6e' : '#007afc';

 return (
              <Polygon
 key={`zone-${zone.id}`}
 positions={latLngs}
 pathOptions={{
 color,
 weight: isRestricted ? 2 : 1,
 dashArray: zone.zone_type === 'shipping_lane' ? '6, 6' : undefined,
 fillOpacity: isRestricted ? 0.22 : 0.12
                }}
              >
                <Tooltip sticky className="font-mono text-xs">
                  <div>
                    <div className="font-bold flex items-center space-x-1">
                      <span>{zone.name}</span>
                    </div>
                    <div>Type: {zone.zone_type} | Risk Level: {zone.risk_level}%</div>
                    <div className="text-os-clear font-semibold">{zone.restricted ? 'Strict Restriction / Sanctuary' : 'Permitted Corridor'}</div>
                    {zone.description && <div className="text-os-ash mt-1">{zone.description}</div>}
                  </div>
                </Tooltip>
              </Polygon>
            );
          } catch {
 return null;
          }
        })}

        {/* Ports Markers */}
        {showPorts && ports.map(port => (
          <Marker
 key={`port-${port.id}`}
 position={[port.latitude, port.longitude]}
 icon={portIcon}
 eventHandlers={{
 click: () => {
 if (mapSelectionMode) {
 onSelectCoordinate({
 latitude: port.latitude,
 longitude: port.longitude
                  });
 if (onSelectPort) onSelectPort(port);
                }
              }
            }}
          >
            <Popup className="font-mono text-xs">
              <div className="p-3 text-white bg-os-panel border border-os-pewter rounded-row space-y-1">
                <div className="font-bold text-white text-sm">{port.name}</div>
                <div className="text-os-fog text-xs">{port.country}</div>
                <div className="text-risk-moderate mt-1 font-semibold text-xs">Congestion: {port.congestion_level}%</div>
                <div className="text-os-ash text-xs">Capacity: {port.capacity.toLocaleString()} berths</div>
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -10]}>{port.name}</Tooltip>
          </Marker>
        ))}

        {/* Autonomous Cleanup Fleet Layer */}
        {showFleet && (
          <FleetLayer
 units={fleetUnits}
 selectedUnitId={selectedFleetUnit?.id}
 onSelectUnit={onSelectFleetUnit}
          />
        )}

        {/* Debris Sentinel Clusters & Drift Vectors Layer */}
        {showDebris && (
          <DebrisLayer
 debrisList={debris}
 clusters={debrisClusters}
 selectedDebrisId={selectedDebris?.id}
 onSelectDebris={onSelectDebris}
 onOpenPlanner={onOpenPlanner}
 showDriftVectors={true}
          />
        )}

        {/* Autonomous Mission Trajectories Layer */}
        {showMissions && (
          <MissionPathLayer
 missions={missions}
 selectedMissionId={selectedMission?.id}
 onSelectMission={onSelectMission}
          />
        )}


        {/* Selected Vessel Historical Track Trail */}
        {vesselTrackPolyline && (
          <Polyline
 positions={vesselTrackPolyline}
 pathOptions={{
 color: '#e2a33a',
 weight: 3,
 dashArray: '4, 4',
 opacity: 0.85
            }}
          >
            <Tooltip sticky>
              <div className="font-mono text-xs">
 Historical Track: {selectedVessel?.name} ({selectedVesselTracks.length} breadcrumbs)
              </div>
            </Tooltip>
          </Polyline>
        )}

        {/* Vessels Markers */}
        {showVessels && vessels.map(vessel => {
 const isSelected = selectedVessel?.id === vessel.id;
 const icon = isSelected
            ? selectedVesselIcon
            : vessel.status === 'underway'
            ? underwayVesselIcon
            : vesselIcon;

 return (
            <Marker
 key={`vessel-${vessel.id}`}
 position={[vessel.latitude, vessel.longitude]}
 icon={icon}
 eventHandlers={{
 click: () => onSelectVessel && onSelectVessel(vessel)
              }}
            >
              <Popup className="font-mono text-xs">
                <div className="p-3 space-y-2 text-white bg-os-panel border border-os-pewter rounded-row">
                  <div className="font-bold text-white text-sm flex items-center justify-between border-b border-os-pewter pb-1.5">
                    <span>{vessel.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-os-raised text-os-signal border border-os-pewter font-normal">{vessel.vessel_type}</span>
                  </div>
                  <div className="text-os-ash text-[11px]">ID: <span className="text-white font-semibold">{vessel.vessel_identifier}</span> | MMSI: <span className="text-white">{vessel.mmsi || 'N/A'}</span></div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-os-pewter text-os-fog">
                    <div>Speed: <span className="font-semibold text-os-clear">{vessel.speed_knots || vessel.cruise_speed_knots} kts</span></div>
                    <div>Heading: <span className="font-semibold text-white">{vessel.heading}°</span></div>
                    <div>Draft: <span className="font-semibold text-white">{vessel.draft_m}m</span></div>
                    <div>Status: <span className="font-semibold uppercase text-os-signal">{vessel.status}</span></div>
                  </div>
                  {vessel.destination && (
                    <div className="text-[10px] text-os-ash pt-1 border-t border-os-pewter">
 Destination: <span className="font-semibold text-white">{vessel.destination}</span>
                    </div>
                  )}
                  <div className="pt-1">
                    <button
 onClick={() => onSelectVessel && onSelectVessel(vessel)}
 className="w-full text-center py-1.5 bg-os-signal hover:bg-os-signal-hover text-white rounded-input text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                    >
                      {isSelected ? 'Viewing Track History' : 'Select & View Track'}
                    </button>
                  </div>
                </div>
              </Popup>
              <Tooltip direction="bottom" offset={[0, 10]}>
                <span>{vessel.name} ({vessel.speed_knots || 0} kts)</span>
              </Tooltip>
            </Marker>
          );
        })}

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
 color: isSelected ? '#3d9bff' : '#566171',
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
 color: '#007afc',
 weight: 5,
 opacity: 0.95,
 lineCap: 'round',
 lineJoin: 'round'
            }}
          >
            <Tooltip sticky>
              <div className="font-bold text-os-signal-deep">
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
