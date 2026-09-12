import React, { useEffect, useMemo, useRef, useState } from 'react';
import { OceanMap, Basemap } from '../components/OceanMap';
import { BasemapToggle } from '../components/map/BaseMap';
import { Eyebrow, FilterPill, GhostLink, IconFrame, Mono, OutlinePill, Panel, PrimaryPill, RiskBadge } from '../components/ui/primitives';
import { fetchAlerts, fetchPorts, fetchRoute, fetchVessels, fetchZones, optimizeRoute, fetchActiveStorms, getOperatingMode, recalculateVoyageRoute, fetchVoyageRouteVersions } from '../services/api';
import { Alert, Coordinate, MarineZone, OptimizationWeights, Port, RouteDetail, RouteOptimizeResponse, Vessel, Storm, RouteVersion, RecalculateRouteResponse } from '../types';
import { formatClock } from '../design/format';
import { ScenarioControlBar } from '../components/routing/ScenarioControlBar';
import { DynamicRouteDiffModal } from '../components/routing/DynamicRouteDiffModal';
import { VoyageTimeline } from '../components/routing/VoyageTimeline';

const MODES: { id: string; label: string; hint: string; weights: OptimizationWeights }[] = [
  { id: 'fuel_efficient', label: 'Fuel efficient', hint: 'Least consumption', weights: { fuel: 0.55, time: 0.15, safety: 0.15, environment: 0.15 } },
  { id: 'fastest', label: 'Fastest', hint: 'Least time', weights: { fuel: 0.15, time: 0.55, safety: 0.15, environment: 0.15 } },
  { id: 'green', label: 'Green', hint: 'Least CO₂, avoids zones', weights: { fuel: 0.25, time: 0.1, safety: 0.15, environment: 0.5 } },
  { id: 'balanced', label: 'Balanced', hint: 'Even weights', weights: { fuel: 0.25, time: 0.25, safety: 0.25, environment: 0.25 } },
];

const fmt = (n: number, digits = 0) => n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });

function portByName(ports: Port[], fragment: string): Port | undefined {
 return ports.find(p => p.name.toLowerCase().includes(fragment));
}

export const LogisticsPage: React.FC = () => {
 const [vessels, setVessels] = useState<Vessel[]>([]);
 const [ports, setPorts] = useState<Port[]>([]);
 const [zones, setZones] = useState<MarineZone[]>([]);
 const [alerts, setAlerts] = useState<Alert[]>([]);
 const [storms, setStorms] = useState<Storm[]>([]);
 const [operatingMode, setOperatingModeState] = useState<string>('autonomous');
 const [routeVersions, setRouteVersions] = useState<RouteVersion[]>([]);
 const [diffModal, setDiffModal] = useState<RecalculateRouteResponse | null>(null);
 // The route the commander switched the live voyage to; shown on the map until the operator plans afresh.
 const [hazardRoute, setHazardRoute] = useState<RouteDetail | null>(null);
 const [isRerouting, setIsRerouting] = useState<boolean>(false);
 const [basemap, setBasemap] = useState<Basemap>('night');
 const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
 const [activeTab, setActiveTab] = useState<'planner' | 'lineage'>('planner');

 const [vesselId, setVesselId] = useState<number | null>(null);
 const [origin, setOrigin] = useState<Coordinate | null>(null);
 const [destination, setDestination] = useState<Coordinate | null>(null);
 const [originPortId, setOriginPortId] = useState<number | null>(null);
 const [destPortId, setDestPortId] = useState<number | null>(null);
 const [snapNotification, setSnapNotification] = useState<string | null>(null);
 const [pickMode, setPickMode] = useState<'origin' | 'destination' | null>(null);
 const [mode, setMode] = useState('fuel_efficient');

 const [result, setResult] = useState<RouteOptimizeResponse | null>(null);
 const [altIndex, setAltIndex] = useState<number | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const [replayPos, setReplayPos] = useState<[number, number] | null>(null);
 const [playing, setPlaying] = useState(false);
 const [progress, setProgress] = useState(0);
 const [speed, setSpeed] = useState(1);
 const timer = useRef<number | null>(null);

 useEffect(() => {
 Promise.all([
 fetchVessels(),
 fetchPorts(),
 fetchZones(),
 fetchAlerts().catch(() => []),
 fetchActiveStorms().catch(() => []),
 getOperatingMode().catch(() => 'autonomous'),
 fetchVoyageRouteVersions(1).catch(() => [])
    ]).then(([v, p, z, a, st, opMode, vers]) => {
 setVessels(v); setPorts(p); setZones(z); setAlerts(a);
 setStorms(st); setOperatingModeState(opMode); setRouteVersions(vers);
 if (v.length && vesselId === null) setVesselId(v[0].id);
 const mumbai = portByName(p, 'mumbai') || p[0];
 const singapore = portByName(p, 'singapore') || p[1];
 if (mumbai && singapore) {
 const orig = { latitude: mumbai.latitude, longitude: mumbai.longitude };
 const dest = { latitude: singapore.latitude, longitude: singapore.longitude };
 setOrigin(orig);
 setDestination(dest);
 setOriginPortId(mumbai.id);
 setDestPortId(singapore.id);
 setLoading(true);
        // Opening the tab previews the default corridor; only an explicit plan or the commander changes the live voyage.
 optimizeRoute({ vessel_id: v[0]?.id ?? 1, origin: orig, destination: dest, mode: 'fuel_efficient', optimization: MODES[0].weights, record_version: false })
          .then(res => setResult(res))
          .catch(() => {})
          .finally(() => setLoading(false));
      }
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 const inspected: RouteDetail | null = useMemo(() => {
 if (!result) return null;
 return altIndex !== null && result.alternatives[altIndex] ? result.alternatives[altIndex] : result.recommended_route;
  }, [result, altIndex]);

 const coords = inspected?.geometry?.coordinates ?? [];
 useEffect(() => {
 if (!playing || coords.length < 2) { if (timer.current) window.clearInterval(timer.current); return; }
 timer.current = window.setInterval(() => setProgress(p => (p >= 100 ? (setPlaying(false), 100) : p + 0.4 * speed)), 100);
 return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [playing, speed, coords.length]);
 useEffect(() => {
 if (!coords.length) { setReplayPos(null); return; }
 const c = coords[Math.min(coords.length - 1, Math.floor((progress / 100) * (coords.length - 1)))];
 setReplayPos([c[1], c[0]]);
  }, [progress, coords]);

 const generate = async () => {
 if (!origin || !destination) { setError('Choose an origin and a destination first.'); return; }
 setLoading(true); setError(null); setAltIndex(null); setProgress(0); setPlaying(false); setHazardRoute(null);
 try {
 const chosen = MODES.find(m => m.id === mode)!;
 setResult(await optimizeRoute({ vessel_id: vesselId ?? 1, origin, destination, mode, optimization: chosen.weights }));
    } catch (e: any) {
 setError(e.message || 'Route optimization failed.');
    } finally {
 setLoading(false);
    }
  };

 const handleDynamicReroute = async () => {
 try {
 setIsRerouting(true);
 const res = await recalculateVoyageRoute(1, 'DYNAMIC_STORM_AVOIDANCE', operatingMode, 'safest');
 setDiffModal(res);
 setRouteVersions(await fetchVoyageRouteVersions(1));
 if (res.applied) setHazardRoute(await fetchRoute(res.new_route_id));
    } catch (err: any) {
 setError(`Dynamic recalculation failed: ${err.message}`);
    } finally {
 setIsRerouting(false);
    }
  };

 const handleCycleExecuted = (cycleRes: any) => {
 fetchActiveStorms().then(setStorms).catch(() => {});
 fetchVoyageRouteVersions(1).then(setRouteVersions).catch(() => {});
    // Show the route the commander applied. Re-planning here would supersede it with a storm-blind corridor.
 const applied = (cycleRes?.environmental_routing?.recalculations ?? []).find((r: any) => r.applied);
 if (applied) {
 fetchRoute(applied.new_route_id).then(r => { setHazardRoute(r); setActiveTab('lineage'); }).catch(() => {});
    }
  };

 const sortedPorts = useMemo(() => {
 return [...ports].sort((a, b) => {
 if (a.country !== b.country) return a.country.localeCompare(b.country);
 return a.name.localeCompare(b.name);
    });
  }, [ports]);

 const handleOriginPortChange = (pId: number) => {
 const p = ports.find(pt => pt.id === pId);
 if (p) {
 setOriginPortId(p.id);
 setOrigin({ latitude: p.latitude, longitude: p.longitude });
    }
  };

 const handleDestPortChange = (pId: number) => {
 const p = ports.find(pt => pt.id === pId);
 if (p) {
 setDestPortId(p.id);
 setDestination({ latitude: p.latitude, longitude: p.longitude });
    }
  };

 const handlePortSelectedFromMap = (port: Port) => {
 if (pickMode === 'origin') {
 setOrigin({ latitude: port.latitude, longitude: port.longitude });
 setOriginPortId(port.id);
 setSnapNotification(`🎯 Snapped Origin: ${port.name} (${port.country})`);
    } else if (pickMode === 'destination') {
 setDestination({ latitude: port.latitude, longitude: port.longitude });
 setDestPortId(port.id);
 setSnapNotification(`🎯 Snapped Destination: ${port.name} (${port.country})`);
    }
 setPickMode(null);
 setTimeout(() => setSnapNotification(null), 4500);
  };

 const onPick = (coord: Coordinate) => {
    // If coordinate didn't snap via onSelectPort, snap to nearest port
 if (ports.length > 0) {
 let nearest = ports[0];
 let minDist = Math.hypot(coord.latitude - nearest.latitude, coord.longitude - nearest.longitude);
 for (let i = 1; i < ports.length; i++) {
 const d = Math.hypot(coord.latitude - ports[i].latitude, coord.longitude - ports[i].longitude);
 if (d < minDist) {
 minDist = d;
 nearest = ports[i];
        }
      }
 handlePortSelectedFromMap(nearest);
    } else {
 if (pickMode === 'origin') setOrigin(coord);
 if (pickMode === 'destination') setDestination(coord);
 setPickMode(null);
    }
  };

 const selectedVessel = vessels.find(v => v.id === vesselId) ?? null;
 const rightInset = result ? 416 : 16;

 return (
    <div className="relative flex-1 min-h-0 flex flex-col bg-os-void overflow-hidden">
      {/* 1. Integrated Mission Control Strip */}
      <ScenarioControlBar
 activeStorms={storms}
 operatingMode={operatingMode}
 onStormsChanged={setStorms}
 onModeChanged={setOperatingModeState}
 onCycleExecuted={handleCycleExecuted}
      />

      {/* 2. Interactive Map Canvas Workspace */}
      <div className="relative flex-1 min-h-0">
        <OceanMap
 vessels={vessels}
 ports={ports}
 zones={zones}
 selectedVessel={selectedVessel}
 origin={origin}
 destination={destination}
 activeRoute={hazardRoute ?? result?.recommended_route ?? null}
 alternativeRoutes={result?.alternatives ?? []}
 selectedAlternativeIndex={altIndex}
 onSelectAlternative={setAltIndex}
 mapSelectionMode={pickMode}
 onSelectCoordinate={onPick}
 onSelectPort={handlePortSelectedFromMap}
 replayPosition={replayPos}
 basemap={basemap}
 onBasemapChange={setBasemap}
 showLayerBar={false}
 storms={storms}
        />

        {/* Floating Pick Mode Hint */}
        {pickMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] os-reveal">
            <div className="text-xs font-mono font-bold text-white bg-os-signal px-5 py-2 rounded-full border border-os-signal flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span>Click any port or ocean area to snap {pickMode.toUpperCase()}</span>
              <button
 onClick={() => setPickMode(null)}
 className="ml-2 px-2 py-0.5 rounded bg-os-signal hover:bg-os-signal-hover text-os-signal text-[10px] uppercase font-semibold"
              >
 Cancel
              </button>
            </div>
          </div>
        )}

        {/* Floating Snap Notification Toast */}
        {snapNotification && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1001] os-reveal">
            <div className="bg-os-clear text-white text-xs font-mono font-bold px-5 py-2.5 rounded-full border border-os-clear flex items-center gap-2 animate-bounce">
              <span>⚓</span>
              <span>{snapNotification}</span>
            </div>
          </div>
        )}

        {/* 3. Left Operations Studio (Collapsible Dock) */}
        {sidebarOpen ? (
          <div className="absolute left-4 top-4 bottom-4 z-[1000] flex flex-col pointer-events-none os-reveal">
            <div className="w-[360px] h-full bg-os-panel border border-os-steel rounded-panel flex flex-col pointer-events-auto overflow-hidden">
              {/* Studio Header */}
              <div className="px-5 py-3.5 border-b border-os-steel flex items-center justify-between bg-os-raised">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-tight">Route Operations</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-os-signal/20 border border-os-signal text-os-signal font-semibold">
 A* Global
                  </span>
                </div>
                <button
 onClick={() => setSidebarOpen(false)}
 title="Collapse Panel"
 className="w-7 h-7 rounded-input hover:bg-white/10 text-os-ash hover:text-white flex items-center justify-center transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
              </div>

              {/* Sub-tabs: Planner vs Lineage */}
              <div className="px-5 pt-3 pb-1 flex border-b border-os-steel gap-3">
                <button
 onClick={() => setActiveTab('planner')}
 className={`text-xs font-semibold pb-2 border-b-2 transition ${
 activeTab === 'planner'
                      ? 'border-os-signal text-white'
                      : 'border-transparent text-os-ash hover:text-white'
                  }`}
                >
 Route Planner
                </button>
                <button
 onClick={() => setActiveTab('lineage')}
 className={`text-xs font-semibold pb-2 border-b-2 transition flex items-center gap-1.5 ${
 activeTab === 'lineage'
                      ? 'border-os-signal text-white'
                      : 'border-transparent text-os-ash hover:text-white'
                  }`}
                >
 Lineage History
                  {routeVersions.length > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-os-signal/20 text-os-signal font-bold">
                      {routeVersions.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto os-scrollbar p-5 flex flex-col gap-4">
                {activeTab === 'planner' ? (
                  <>
                    <label className="flex flex-col gap-1.5">
                      <Eyebrow>Vessel in Command</Eyebrow>
                      <select
 value={vesselId ?? ''}
 onChange={e => setVesselId(Number(e.target.value))}
 className="bg-os-void text-white text-xs font-mono border border-os-steel rounded-input px-3 py-2.5 focus:outline-none focus:border-os-silver"
                      >
                        {vessels.map(v => (
                          <option key={v.id} value={v.id} className="bg-[#15171b] text-white">
                            {v.name} ({v.vessel_type})
                          </option>
                        ))}
                      </select>
                    </label>

                    {/* Global Origin Port Selector */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <Eyebrow>Origin Port</Eyebrow>
                        <button
 onClick={() => setPickMode(pickMode === 'origin' ? null : 'origin')}
 className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded transition flex items-center gap-1 ${
 pickMode === 'origin'
                              ? 'bg-os-signal text-white'
                              : 'text-os-signal hover:text-os-signal hover:bg-os-signal-hover/10'
                          }`}
                        >
                          <span>📍</span>
                          <span>{pickMode === 'origin' ? 'Click to Snap' : 'Map Snap'}</span>
                        </button>
                      </div>
                      <select
 value={originPortId ?? ''}
 onChange={e => handleOriginPortChange(Number(e.target.value))}
 className="bg-os-void text-white text-xs font-mono border border-os-steel rounded-input px-3 py-2 focus:outline-none focus:border-os-silver truncate"
                      >
                        <option value="" disabled>-- Select World Origin Port --</option>
                        {sortedPorts.map(p => (
                          <option key={`orig-${p.id}`} value={p.id} className="bg-[#15171b] text-white">
                            {p.country} · {p.name}
                          </option>
                        ))}
                      </select>
                      {origin && (
                        <div className="text-[10px] font-mono text-os-ash px-1 flex items-center justify-between">
                          <span>Fairway Coords:</span>
                          <span className="text-os-fog font-semibold">{origin.latitude.toFixed(2)}°, {origin.longitude.toFixed(2)}°</span>
                        </div>
                      )}
                    </div>

                    {/* Global Destination Port Selector */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <Eyebrow>Destination Port</Eyebrow>
                        <button
 onClick={() => setPickMode(pickMode === 'destination' ? null : 'destination')}
 className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded transition flex items-center gap-1 ${
 pickMode === 'destination'
                              ? 'bg-os-signal text-white'
                              : 'text-os-signal hover:text-os-signal hover:bg-os-signal-hover/10'
                          }`}
                        >
                          <span>📍</span>
                          <span>{pickMode === 'destination' ? 'Click to Snap' : 'Map Snap'}</span>
                        </button>
                      </div>
                      <select
 value={destPortId ?? ''}
 onChange={e => handleDestPortChange(Number(e.target.value))}
 className="bg-os-void text-white text-xs font-mono border border-os-steel rounded-input px-3 py-2 focus:outline-none focus:border-os-silver truncate"
                      >
                        <option value="" disabled>-- Select World Destination Port --</option>
                        {sortedPorts.map(p => (
                          <option key={`dest-${p.id}`} value={p.id} className="bg-[#15171b] text-white">
                            {p.country} · {p.name}
                          </option>
                        ))}
                      </select>
                      {destination && (
                        <div className="text-[10px] font-mono text-os-ash px-1 flex items-center justify-between">
                          <span>Fairway Coords:</span>
                          <span className="text-os-fog font-semibold">{destination.latitude.toFixed(2)}°, {destination.longitude.toFixed(2)}°</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Eyebrow>Optimization Objective</Eyebrow>
                      <div className="grid grid-cols-2 gap-1.5">
                        {MODES.map(m => (
                          <button
 key={m.id}
 onClick={() => setMode(m.id)}
 className={`px-3 py-2 text-xs font-mono rounded-input border transition text-left flex flex-col gap-0.5 ${
 mode === m.id
                                ? 'bg-os-signal/20 border-os-signal text-white font-bold'
                                : 'bg-os-void/70 border-os-steel text-os-ash hover:text-white hover:border-os-silver/40'
                            }`}
                          >
                            <span>{m.label}</span>
                            <span className="text-[10px] text-os-slate font-sans truncate">{m.hint}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <div className="p-2.5 rounded-input bg-os-raised border border-risk-critical text-risk-critical text-xs font-mono">
                        {error}
                      </div>
                    )}

                    <div className="flex flex-col gap-2 pt-2">
                      <button
 onClick={generate}
 disabled={loading}
 className="w-full py-2.5 px-4 rounded-input bg-os-signal hover:bg-os-signal-hover text-white text-xs font-bold font-mono tracking-wide transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? 'Optimizing Corridor…' : 'Calculate Routes'}
                      </button>

                      {storms.length > 0 && (
                        <button
 onClick={handleDynamicReroute}
 disabled={isRerouting}
 className="w-full py-2.5 px-4 rounded-input bg-risk-critical hover:bg-risk-high text-white text-xs font-bold font-mono tracking-wide border border-risk-critical transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <span>⚡</span>
                          <span>{isRerouting ? 'Computing Safe Detour…' : 'Autonomous Storm Avoidance'}</span>
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <VoyageTimeline versions={routeVersions} />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Collapsed Floating Toggle Button */
          <button
 onClick={() => setSidebarOpen(true)}
 className="absolute left-4 top-4 z-[1000] px-4 py-2 rounded-row bg-os-panel border border-os-steel text-white text-xs font-bold font-mono flex items-center gap-2 hover:bg-os-raised transition"
          >
            <span>🧭</span>
            <span>Route Studio</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        )}

        {/* 4. Right Route Details Drawer (When Calculated) */}
        {result && inspected && (
          <div className="absolute right-4 top-4 bottom-4 z-[1000] flex flex-col pointer-events-none os-reveal">
            <div className="w-[390px] h-full bg-os-panel border border-os-steel rounded-panel flex flex-col pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-os-steel flex items-center justify-between bg-os-raised">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-os-clear">
                    {altIndex === null ? '★ Recommended Route' : 'Alternative Path'} · {inspected.optimization_mode.replace('_', ' ')}
                  </span>
                  <span className="text-base font-bold text-white tracking-tight truncate max-w-[280px]">
                    {inspected.name}
                  </span>
                </div>
                <button
 onClick={() => { setResult(null); setPlaying(false); setProgress(0); }}
 className="w-7 h-7 rounded-input hover:bg-white/10 text-os-ash hover:text-white flex items-center justify-center transition"
 aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto os-scrollbar p-5 flex flex-col gap-4">
                {/* 2x3 Metric Cards Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    ['Distance', `${fmt(inspected.distance_km)} km`],
                    ['Time', `${fmt(inspected.estimated_time_hours, 1)} h`],
                    ['Fuel Burn', `${fmt(inspected.estimated_fuel_liters)} L`],
                    ['CO₂ Footprint', `${fmt(inspected.estimated_co2_kg / 1000, 1)} t`],
                    ['Bunker Cost', `$${fmt(inspected.estimated_cost)}`],
                    ['Route Score', `${fmt(inspected.optimization_score, 1)} pts`],
                  ].map(([k, v]) => (
                    <div key={k} className="p-2.5 rounded-row bg-os-void/80 border border-os-steel flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono uppercase font-semibold text-os-ash">{k}</span>
                      <span className="text-sm font-bold text-white font-mono">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Savings vs Baseline Badge */}
                {altIndex === null && (
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-row bg-os-raised border border-os-clear">
                    <span className="text-xs font-mono font-bold text-os-clear">
 vs {result.explanation.baseline_mode.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-white font-semibold">
 Fuel −{fmt(result.explanation.savings_percentage_fuel, 1)}% · CO₂ −{fmt(result.explanation.savings_percentage_co2, 1)}%
                    </span>
                  </div>
                )}

                {/* Why This Route (No Dual Scrollbars!) */}
                <div className="flex flex-col gap-2 p-3.5 rounded-row bg-os-void/70 border border-os-steel">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-os-ash">Commander Rationale</span>
                  <p className="text-xs text-os-fog leading-relaxed break-words whitespace-normal">
                    {result.explanation.recommendation}
                  </p>
                  {result.explanation.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-os-clear leading-relaxed">
                      <span className="font-bold shrink-0">+</span>
                      <span className="break-words whitespace-normal">{r}</span>
                    </div>
                  ))}
                  {result.explanation.tradeoffs.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-risk-moderate leading-relaxed">
                      <span className="font-bold shrink-0">−</span>
                      <span className="break-words whitespace-normal">{r}</span>
                    </div>
                  ))}
                </div>

                {/* Candidate Selection List */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-os-ash">Candidate Paths</span>
                  <div className="flex flex-col gap-1.5">
                    {result.comparison.map((c, i) => {
 const idx = c.is_recommended ? null : result.alternatives.findIndex(a => a.name === c.name);
 const active = (altIndex === null && c.is_recommended) || (altIndex !== null && idx === altIndex);
 return (
                        <button
 key={c.name}
 onClick={() => setAltIndex(idx === -1 ? null : idx)}
 className={`flex items-center justify-between p-2.5 rounded-input border text-left transition ${
 active
                              ? 'bg-os-signal/20 border-os-signal'
                              : 'bg-os-void/60 border-os-steel hover:border-os-silver/40'
                          }`}
                        >
                          <span className="text-xs font-semibold text-white truncate flex-1">{c.name}</span>
                          <span className="text-xs font-mono text-os-ash mr-3">{fmt(c.fuel_liters / 1000, 1)}k L</span>
                          <span className="text-xs font-mono font-bold text-os-signal">{fmt(c.optimization_score, 1)} pts</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Simulation Player */}
              <div className="px-5 py-3 border-t border-os-steel bg-os-raised flex items-center gap-3">
                <button
 onClick={() => { if (progress >= 100) setProgress(0); setPlaying(p => !p); }}
 className="w-8 h-8 rounded-input bg-os-void border border-os-steel flex items-center justify-center text-white hover:bg-white/10 transition"
 aria-label={playing ? 'Pause replay' : 'Play replay'}
                >
                  {playing ? '⏸' : '▶'}
                </button>
                <div className="flex-1 h-1.5 bg-os-void rounded-full overflow-hidden relative">
                  <div className="h-full bg-os-signal rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <Mono className="text-xs text-os-ash font-medium">{fmt(inspected.distance_km * progress / 100)} km</Mono>
                <button
 onClick={() => setSpeed(s => (s >= 8 ? 1 : s * 2))}
 className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-os-void border border-os-steel text-os-fog hover:text-white"
                >
                  {speed}×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Basemap Toggle (Bottom-Right) */}
        <BasemapToggle basemap={basemap} onChange={setBasemap} style={{ right: rightInset, bottom: 16 }} />

        {!result && (
          <div className="absolute inset-x-0 bottom-6 z-[999] flex justify-center pointer-events-none">
            <Mono className="text-xs text-os-fog bg-os-panel border border-os-steel px-4 py-2 rounded-full">
 Select origin and destination, then click Calculate Routes to optimize navigation corridor
            </Mono>
          </div>
        )}
      </div>

      {/* Dynamic Recalculation Diff Modal */}
      {diffModal && (
        <DynamicRouteDiffModal
 diff={diffModal}
 onClose={() => setDiffModal(null)}
 onAccept={() => setDiffModal(null)}
        />
      )}
    </div>
  );
};
