import React, { useEffect, useState } from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';
import { Basemap } from '../components/OceanMap';
import { BaseMap, BasemapToggle } from '../components/map/BaseMap';
import { Eyebrow, GhostLink, Mono, Panel, RiskBadge } from '../components/ui/primitives';
import { fetchAlerts, fetchOceanCurrents, fetchVessels, fetchWeather, fetchActiveStorms, getOperatingMode, recalculateVoyageRoute } from '../services/api';
import { acknowledgeAlert } from '../services/surveillance';
import { Alert, OceanCurrentData, Vessel, WeatherData, Storm, RecalculateRouteResponse } from '../types';
import { formatClock } from '../design/format';
import { RiskLevel } from '../design/risk';
import { StormLayer } from '../components/map/StormLayer';
import { ScenarioControlBar } from '../components/routing/ScenarioControlBar';
import { DynamicRouteDiffModal } from '../components/routing/DynamicRouteDiffModal';

const severityLevel = (s: string): RiskLevel => (s === 'critical' ? 'CRITICAL' : s === 'warning' ? 'ELEVATED' : 'MODERATE');

export const EnvironmentPage: React.FC = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currents, setCurrents] = useState<OceanCurrentData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [storms, setStorms] = useState<Storm[]>([]);
  const [mode, setMode] = useState<string>('autonomous');
  const [recalcDiff, setRecalcDiff] = useState<RecalculateRouteResponse | null>(null);
  const [isRerouting, setIsRerouting] = useState<boolean>(false);
  const [basemap, setBasemap] = useState<Basemap>('night');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    fetchVessels().then(v => { setVessels(v); if (v.length) setSelectedId(v[0].id); }).catch(() => {});
    fetchAlerts().then(setAlerts).catch(() => {});
    fetchActiveStorms().then(setStorms).catch(() => {});
    getOperatingMode().then(setMode).catch(() => {});
  }, []);

  const selected = vessels.find(v => v.id === selectedId) ?? null;
  useEffect(() => {
    if (!selected) return;
    fetchWeather(selected.latitude, selected.longitude).then(setWeather).catch(() => setWeather(null));
    fetchOceanCurrents(selected.latitude, selected.longitude).then(setCurrents).catch(() => setCurrents(null));
  }, [selected?.id, selected?.latitude, selected?.longitude]);

  const ack = async (id: number) => {
    try { await acknowledgeAlert(id); setAlerts(a => a.map(x => (x.id === id ? { ...x, acknowledged: true } : x))); } catch { /* keep the row */ }
  };

  const handleCycleExecuted = (result: any) => {
    fetchActiveStorms().then(setStorms).catch(() => {});
    fetchAlerts().then(setAlerts).catch(() => {});
    if (result?.environmental_routing?.recalculations?.length > 0) {
      const recalc = result.environmental_routing.recalculations[0];
      setRecalcDiff({
        voyage_id: recalc.voyage_id,
        previous_route_id: recalc.previous_route_id,
        new_route_id: recalc.new_route_id,
        version_number: recalc.version,
        risk_reduction_pct: recalc.risk_reduction_pct,
        fuel_change_pct: 3.2,
        eta_change_hours: 1.1,
        reasons: [
          'Severe storm system intersects shipping corridor',
          `Autonomous route recalculation deployed (v${recalc.version})`,
          'Dynamic detour maintains safe standoff distance from hazard perimeter'
        ],
        tradeoffs: {
          fuel_delta_pct: 3.2,
          eta_delta_hours: 1.1,
          risk_reduction: recalc.risk_reduction_pct
        },
        route_geojson: '',
        applied: recalc.applied,
        mode: mode
      });
    }
  };

  const handleTriggerReroute = async () => {
    try {
      setIsRerouting(true);
      const res = await recalculateVoyageRoute(1, 'HAZARD_AVOIDANCE', mode, 'safest');
      setRecalcDiff(res);
      fetchAlerts().then(setAlerts).catch(() => {});
    } catch (err: any) {
      alert(`Recalculation error: ${err.message}`);
    } finally {
      setIsRerouting(false);
    }
  };

  const reading = (label: string, value: string, hint?: string) => (
    <div key={label} className="flex flex-col gap-0.5 px-3 py-2 rounded-xl bg-os-void/80 border border-os-border">
      <Eyebrow>{label}</Eyebrow>
      <Mono className="text-sm font-bold text-white">{value}</Mono>
      {hint && <span className="text-[10px] text-os-ash font-sans">{hint}</span>}
    </div>
  );

  return (
    <div className="relative flex-1 min-h-0 flex flex-col bg-os-void overflow-hidden">
      {/* 1. Integrated Mission Control Strip */}
      <ScenarioControlBar
        activeStorms={storms}
        operatingMode={mode}
        onStormsChanged={setStorms}
        onModeChanged={setMode}
        onCycleExecuted={handleCycleExecuted}
      />

      {/* 2. Interactive Map Workspace */}
      <div className="relative flex-1 min-h-0">
        <BaseMap basemap={basemap} center={[13, 74]} zoom={5}>
          {/* Storm layer with outer bounds, core eye, and tooltips */}
          <StormLayer storms={storms} />

          {/* Vessel markers */}
          {vessels.map(v => (
            <CircleMarker key={v.id} center={[v.latitude, v.longitude]} radius={v.id === selectedId ? 6 : 4.5}
              pathOptions={{ color: '#0e1012', weight: 2, fillColor: '#a0aaba', fillOpacity: 1 }}
              eventHandlers={{ click: () => setSelectedId(v.id) }}>
              <Tooltip direction="top" offset={[0, -6]}>{v.name}</Tooltip>
            </CircleMarker>
          ))}
          {selected && <CircleMarker center={[selected.latitude, selected.longitude]} radius={12} interactive={false} pathOptions={{ color: '#007afc', weight: 1.5, fill: false }} />}
        </BaseMap>

        {/* 3. Left Collapsible Atmospheric Studio */}
        {sidebarOpen ? (
          <div className="absolute left-4 top-4 bottom-4 z-[1000] flex flex-col pointer-events-none os-reveal">
            <div className="w-[350px] h-full bg-os-card/95 backdrop-blur-xl border border-os-border rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden">
              <div className="px-5 py-3.5 border-b border-os-border flex items-center justify-between bg-os-surface/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-tight">Atmospheric Feed</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 font-semibold">
                    Live
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  title="Collapse Panel"
                  className="w-7 h-7 rounded-lg hover:bg-white/10 text-os-ash hover:text-white flex items-center justify-center transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto os-scrollbar p-5 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <Eyebrow>Selected Target</Eyebrow>
                  <select
                    value={selectedId ?? ''}
                    onChange={e => setSelectedId(Number(e.target.value))}
                    className="bg-os-void text-white text-xs font-mono border border-os-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500"
                  >
                    {vessels.map(v => <option key={v.id} value={v.id} className="bg-[#121620] text-white">{v.name}</option>)}
                  </select>
                </label>
                {selected && (
                  <div className="px-3 py-1.5 rounded-lg bg-os-void border border-os-border">
                    <Mono className="text-xs text-os-ash">{selected.latitude.toFixed(2)}°N, {selected.longitude.toFixed(2)}°E</Mono>
                  </div>
                )}

                {weather && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-os-ash">Weather Conditions</span>
                    <div className="grid grid-cols-2 gap-2">
                      {reading('Wind', `${weather.wind_speed_knots.toFixed(1)} kn`, `from ${Math.round(weather.wind_direction_deg)}°`)}
                      {reading('Waves', `${weather.wave_height_m.toFixed(1)} m`, weather.sea_state !== undefined ? `State ${weather.sea_state} · ${weather.conditions}` : weather.conditions)}
                      {reading('Visibility', `${weather.visibility_nm.toFixed(1)} nm`)}
                      {reading('Pressure', `${Math.round(weather.pressure_hpa)} hPa`)}
                    </div>
                  </div>
                )}

                {currents && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-os-ash">Ocean Current Dynamics</span>
                    <div className="grid grid-cols-2 gap-2">
                      {reading('Current', `${currents.current_speed_knots.toFixed(2)} kn`, `${Math.round(currents.current_direction_deg)}° · ${currents.tidal_state}`)}
                      {reading('Sea Surface Temp', `${currents.sea_surface_temp_c.toFixed(1)} °C`, `salinity ${currents.salinity_psu.toFixed(1)} PSU`)}
                    </div>
                  </div>
                )}

                {/* Active Storms Detail Section */}
                {storms.length > 0 && (
                  <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/80">
                    <div className="flex items-center justify-between text-xs font-mono text-rose-300 font-semibold">
                      <span>🌀 ACTIVE DISTURBANCE</span>
                      <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-rose-900 border border-rose-700 font-bold">
                        {storms[0].severity}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">{storms[0].name}</div>
                    <div className="text-xs text-os-fog font-mono flex flex-col gap-1">
                      <span>Winds: <b className="text-rose-300 font-bold">{storms[0].wind_speed_knots} knots</b></span>
                      <span>Buffer Radius: <b className="text-rose-300 font-bold">{storms[0].radius_km} km</b></span>
                      <span>Coordinates: {storms[0].center_latitude.toFixed(1)}°N, {storms[0].center_longitude.toFixed(1)}°E</span>
                    </div>
                    <button
                      onClick={handleTriggerReroute}
                      disabled={isRerouting}
                      className="mt-1 w-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono py-2 px-3 rounded-lg font-bold shadow-md shadow-rose-600/20 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <span>⚡</span>
                      <span>{isRerouting ? 'Recalculating Detour…' : 'Trigger Dynamic Reroute'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-4 top-4 z-[1000] px-4 py-2 rounded-xl bg-os-card/95 backdrop-blur-md border border-os-border text-white text-xs font-bold font-mono shadow-xl flex items-center gap-2 hover:bg-os-surface transition"
          >
            <span>🌊</span>
            <span>Atmospheric Feed</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        )}

        {/* 4. Right Panel: Advisories */}
        <div className="absolute right-4 top-4 bottom-4 z-[1000] flex flex-col pointer-events-none os-reveal">
          <div className="w-[370px] h-full bg-os-card/95 backdrop-blur-xl border border-os-border rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden">
            <div className="px-5 py-3.5 border-b border-os-border flex items-center justify-between bg-os-surface/50">
              <span className="text-sm font-bold text-white tracking-tight">Advisories & Alerts</span>
              <Mono className="text-xs text-os-slate font-semibold">{alerts.filter(a => !a.acknowledged).length} Open</Mono>
            </div>
            <div className="flex-1 overflow-y-auto os-scrollbar p-5 flex flex-col gap-3">
              {alerts.map((a, i) => (
                <div key={a.id} className="flex flex-col gap-2 p-3 rounded-xl bg-os-void/70 border border-os-border">
                  <div className="flex items-center gap-2">
                    <Mono className="text-xs text-os-slate">{formatClock(a.timestamp)}</Mono>
                    <RiskBadge level={severityLevel(a.severity)} />
                    <Mono className="text-[10px] text-os-ash truncate max-w-[120px]">{a.alert_type.replace(/_/g, ' ')}</Mono>
                    {a.acknowledged
                      ? <span className="text-[10px] font-mono text-os-slate ml-auto">ack</span>
                      : <button className="text-xs text-blue-400 hover:text-blue-300 ml-auto font-mono font-semibold" onClick={() => ack(a.id)}>Acknowledge</button>}
                  </div>
                  <span className="text-xs text-os-fog leading-relaxed break-words whitespace-normal">{a.message}</span>
                  {a.details && <span className="text-[11px] text-os-ash leading-relaxed break-words whitespace-normal">{a.details}</span>}
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="p-4 rounded-xl bg-os-void/60 border border-os-border text-center">
                  <span className="text-xs text-os-ash">No active marine advisories.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basemap Toggle */}
        <BasemapToggle basemap={basemap} onChange={setBasemap} style={{ right: 396, bottom: 16 }} />
      </div>

      {/* Route Recalculation Diff Modal */}
      {recalcDiff && (
        <DynamicRouteDiffModal
          diff={recalcDiff}
          onClose={() => setRecalcDiff(null)}
          onAccept={() => setRecalcDiff(null)}
        />
      )}
    </div>
  );
};
