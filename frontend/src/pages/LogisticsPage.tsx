import React, { useEffect, useMemo, useRef, useState } from 'react';
import { OceanMap, Basemap } from '../components/OceanMap';
import { BasemapToggle } from '../components/map/BaseMap';
import { Eyebrow, FilterPill, GhostLink, IconFrame, Mono, OutlinePill, Panel, PrimaryPill, RiskBadge } from '../components/ui/primitives';
import { fetchAlerts, fetchPorts, fetchVessels, fetchZones, optimizeRoute, fetchActiveStorms, getOperatingMode, recalculateVoyageRoute, fetchVoyageRouteVersions } from '../services/api';
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
  const [isRerouting, setIsRerouting] = useState<boolean>(false);
  const [basemap, setBasemap] = useState<Basemap>('chart');

  const [vesselId, setVesselId] = useState<number | null>(null);
  const [origin, setOrigin] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState<Coordinate | null>(null);
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
      const mumbai = portByName(p, 'mumbai'); const singapore = portByName(p, 'singapore');
      if (mumbai && singapore) {
        setOrigin({ latitude: mumbai.latitude, longitude: mumbai.longitude });
        setDestination({ latitude: singapore.latitude, longitude: singapore.longitude });
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
    setLoading(true); setError(null); setAltIndex(null); setProgress(0); setPlaying(false);
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
      // Refresh route versions and route display
      const vers = await fetchVoyageRouteVersions(1);
      setRouteVersions(vers);
      generate();
    } catch (err: any) {
      setError(`Dynamic recalculation failed: ${err.message}`);
    } finally {
      setIsRerouting(false);
    }
  };

  const handleCycleExecuted = (cycleRes: any) => {
    fetchActiveStorms().then(setStorms).catch(() => {});
    fetchVoyageRouteVersions(1).then(setRouteVersions).catch(() => {});
    if (cycleRes?.environmental_routing?.recalculations?.length > 0) {
      generate();
    }
  };

  const onPick = (coord: Coordinate) => {
    if (pickMode === 'origin') setOrigin(coord);
    if (pickMode === 'destination') setDestination(coord);
    setPickMode(null);
  };

  const selectedVessel = vessels.find(v => v.id === vesselId) ?? null;
  const rightInset = result ? 408 : 16;

  return (
    <div className="relative flex-1 min-h-0 flex flex-col">
      {/* Simulation Scenario & Mode Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1001]">
        <ScenarioControlBar
          activeStorms={storms}
          operatingMode={operatingMode}
          onStormsChanged={setStorms}
          onModeChanged={setOperatingModeState}
          onCycleExecuted={handleCycleExecuted}
        />
      </div>

      <div className="absolute inset-0 [&>div]:!rounded-none [&>div]:!border-0 [&>div]:!shadow-none [&>div]:!min-h-0">
        <OceanMap
          vessels={vessels} ports={ports} zones={zones}
          selectedVessel={selectedVessel}
          origin={origin} destination={destination}
          activeRoute={result?.recommended_route ?? null}
          alternativeRoutes={result?.alternatives ?? []}
          selectedAlternativeIndex={altIndex}
          onSelectAlternative={setAltIndex}
          mapSelectionMode={pickMode}
          onSelectCoordinate={onPick}
          replayPosition={replayPos}
          basemap={basemap} onBasemapChange={setBasemap} showLayerBar={false}
          storms={storms}
        />
      </div>

      {pickMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] os-reveal">
          <Mono className="text-xs text-white bg-os-signal px-3 py-1.5 rounded-pill">Click the map to set the {pickMode}</Mono>
        </div>
      )}

      {/* Route planner panel */}
      <div className="absolute left-4 top-20 bottom-4 z-[1000] flex flex-col gap-4 overflow-y-auto pointer-events-none">
        <Panel className="w-[320px] p-5 flex flex-col gap-4 pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-white">Route planner</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">Phase 2 A*</span>
          </div>

          <label className="flex flex-col gap-1.5">
            <Eyebrow>Vessel</Eyebrow>
            <select
              value={vesselId ?? ''}
              onChange={e => setVesselId(Number(e.target.value))}
              className="bg-os-raised text-white text-sm border border-os-pewter rounded-input px-3 py-2 focus:outline-none focus:border-os-silver"
            >
              {vessels.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.vessel_type})</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Eyebrow>Origin</Eyebrow>
                <GhostLink className="text-[11px]" onClick={() => setPickMode('origin')}>Pick</GhostLink>
              </div>
              <div className="px-3 py-2 rounded-input bg-os-raised border border-os-pewter">
                <Mono className="text-xs text-white truncate">{origin ? `${origin.latitude.toFixed(2)}, ${origin.longitude.toFixed(2)}` : 'unset'}</Mono>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Eyebrow>Destination</Eyebrow>
                <GhostLink className="text-[11px]" onClick={() => setPickMode('destination')}>Pick</GhostLink>
              </div>
              <div className="px-3 py-2 rounded-input bg-os-raised border border-os-pewter">
                <Mono className="text-xs text-white truncate">{destination ? `${destination.latitude.toFixed(2)}, ${destination.longitude.toFixed(2)}` : 'unset'}</Mono>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Eyebrow>Optimization Goal</Eyebrow>
            <div className="grid grid-cols-2 gap-1.5">
              {MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`px-2 py-1.5 text-xs font-mono rounded border transition text-left ${
                    mode === m.id
                      ? 'bg-blue-600/30 border-blue-500 text-white font-semibold'
                      : 'bg-os-raised border-os-pewter text-os-ash hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {error && <span className="text-xs text-red-400">{error}</span>}

          <div className="flex flex-col gap-2 pt-1">
            <PrimaryPill className="w-full justify-center !py-2.5" onClick={generate} disabled={loading}>
              {loading ? 'Optimizing Corridor...' : 'Calculate Routes'}
            </PrimaryPill>

            {/* Dynamic Hazard Recalculate Button */}
            {storms.length > 0 && (
              <button
                onClick={handleDynamicReroute}
                disabled={isRerouting}
                className="w-full py-2 px-3 rounded text-xs font-mono font-semibold bg-red-700 hover:bg-red-600 text-white border border-red-500/80 shadow transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>⚡</span>
                <span>{isRerouting ? 'Rerouting...' : 'Autonomous Storm Avoidance'}</span>
              </button>
            )}
          </div>

          {/* Route Version Lineage */}
          {routeVersions.length > 0 && (
            <div className="pt-2 border-t border-os-pewter/60">
              <VoyageTimeline versions={routeVersions} />
            </div>
          )}
        </Panel>
      </div>

      {/* Inspected route details panel */}
      {result && inspected && (
        <div className="absolute right-4 top-20 bottom-4 z-[1000]">
          <Panel className="w-[376px] h-full p-6 flex flex-col gap-5 overflow-hidden">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Eyebrow>{altIndex === null ? 'Recommended' : 'Alternative'} · {inspected.optimization_mode.replace('_', ' ')}</Eyebrow>
                <button onClick={() => { setResult(null); setPlaying(false); setProgress(0); }} className="text-os-ash hover:text-white" aria-label="Close">
                  <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M5 5l10 10M15 5L5 15" /></svg>
                </button>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight leading-[1.33]">{inspected.name}</span>
              <Mono className="text-xs text-os-ash">ETA {formatClock(inspected.eta)} · risk {Math.round(inspected.risk_score)}/100 · env {Math.round(inspected.environmental_score)}/100</Mono>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                ['Distance', `${fmt(inspected.distance_km)} km`],
                ['Time', `${fmt(inspected.estimated_time_hours, 1)} h`],
                ['Fuel', `${fmt(inspected.estimated_fuel_liters)} L`],
                ['CO₂', `${fmt(inspected.estimated_co2_kg / 1000, 1)} t`],
                ['Cost', `$${fmt(inspected.estimated_cost)}`],
                ['Score', `${fmt(inspected.optimization_score, 1)}`],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <Eyebrow>{k}</Eyebrow>
                  <Mono className="text-[15px] text-white">{v}</Mono>
                </div>
              ))}
            </div>

            {altIndex === null && (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-row bg-os-raised">
                <span className="os-eyebrow px-[7px] py-1 rounded-badge text-white" style={{ background: '#2fae6e' }}>vs {result.explanation.baseline_mode.replace('_', ' ')}</span>
                <Mono className="text-xs text-os-fog">fuel <span className="text-white">−{fmt(result.explanation.savings_percentage_fuel, 1)}%</span> · CO₂ <span className="text-white">−{fmt(result.explanation.savings_percentage_co2, 1)}%</span></Mono>
              </div>
            )}

            <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-auto pr-1">
              <Eyebrow>Why this route</Eyebrow>
              <span className="text-[15px] leading-relaxed text-os-fog">{result.explanation.recommendation}</span>
              {result.explanation.reasons.map((r, i) => (
                <div key={i} className="flex gap-3"><Mono className="text-[13px] w-5 shrink-0 text-os-clear">+</Mono><span className="text-sm text-os-fog leading-relaxed">{r}</span></div>
              ))}
              {result.explanation.tradeoffs.map((r, i) => (
                <div key={i} className="flex gap-3"><Mono className="text-[13px] w-5 shrink-0 text-os-ash">−</Mono><span className="text-sm text-os-ash leading-relaxed">{r}</span></div>
              ))}

              <Eyebrow className="mt-2">Candidates</Eyebrow>
              <div className="flex flex-col">
                {result.comparison.map((c, i) => {
                  const idx = c.is_recommended ? null : result.alternatives.findIndex(a => a.name === c.name);
                  const active = (altIndex === null && c.is_recommended) || (altIndex !== null && idx === altIndex);
                  return (
                    <button key={c.name} onClick={() => setAltIndex(idx === -1 ? null : idx)}
                      className={`flex items-center gap-3 h-11 text-left ${active ? 'bg-os-raised rounded-row px-3 -mx-3 shadow-[inset_2px_0_0_#007afc]' : `${i < result.comparison.length - 1 ? 'border-b border-os-raised' : ''}`}`}>
                      <span className="text-sm font-medium text-white flex-1 truncate">{c.name}</span>
                      <Mono className="text-xs text-os-ash">{fmt(c.fuel_liters / 1000)} kL</Mono>
                      <Mono className="text-xs text-os-ash">{fmt(c.time_hours)} h</Mono>
                      <Mono className="text-xs text-white w-9 text-right">{fmt(c.optimization_score, 1)}</Mono>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IconFrame onClick={() => { if (progress >= 100) setProgress(0); setPlaying(p => !p); }} aria-label={playing ? 'Pause replay' : 'Play replay'}>
                {playing
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.5h3v9H2zM7 1.5h3v9H7z" /></svg>
                  : <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5l7 4.5-7 4.5z" /></svg>}
              </IconFrame>
              <div className="flex-1 h-0.5 bg-os-steel relative">
                <div className="absolute left-0 top-0 h-0.5 bg-white" style={{ width: `${progress}%` }} />
              </div>
              <Mono className="text-xs text-os-ash w-12 text-right">{fmt(inspected.distance_km * progress / 100)} km</Mono>
              <OutlinePill className="!py-1 !px-3 text-xs" onClick={() => setSpeed(s => (s >= 8 ? 1 : s * 2))}>{speed}×</OutlinePill>
            </div>
          </Panel>
        </div>
      )}

      <BasemapToggle basemap={basemap} onChange={setBasemap} style={{ right: rightInset, bottom: 16 }} />

      {!result && (
        <div className="absolute inset-x-0 bottom-8 z-[999] flex justify-center pointer-events-none">
          <Mono className="text-xs text-os-slate bg-os-void/70 px-3 py-1.5 rounded-input">Generate a route to compare candidates on the chart</Mono>
        </div>
      )}
      <GhostLink className="hidden" />

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
