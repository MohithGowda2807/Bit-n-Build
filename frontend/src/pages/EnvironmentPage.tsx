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
  const [basemap, setBasemap] = useState<Basemap>('chart');

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
    <div key={label} className="flex flex-col gap-0.5 px-3 py-2.5 rounded-row bg-os-raised">
      <Eyebrow>{label}</Eyebrow>
      <Mono className="text-[15px] text-white">{value}</Mono>
      {hint && <span className="text-[11px] text-os-ash">{hint}</span>}
    </div>
  );

  return (
    <div className="relative flex-1 min-h-0 flex flex-col">
      {/* Top Scenario & Mode Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1001]">
        <ScenarioControlBar
          activeStorms={storms}
          operatingMode={mode}
          onStormsChanged={setStorms}
          onModeChanged={setMode}
          onCycleExecuted={handleCycleExecuted}
        />
      </div>

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

      {/* Left Panel: Telemetry & Conditions */}
      <div className="absolute left-4 top-20 z-[1000] bottom-4 flex flex-col pointer-events-none">
        <Panel className="w-[340px] p-5 flex flex-col gap-4 pointer-events-auto overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-white">Atmospheric Feed</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">Phase 2 Dynamic</span>
          </div>

          <select value={selectedId ?? ''} onChange={e => setSelectedId(Number(e.target.value))}
            className="bg-os-raised text-white text-sm border border-os-pewter rounded-input px-3 py-2 focus:outline-none focus:border-os-silver">
            {vessels.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          {selected && <Mono className="text-[11px] text-os-ash">{selected.latitude.toFixed(2)}°N, {selected.longitude.toFixed(2)}°E</Mono>}

          {weather && (
            <div className="grid grid-cols-2 gap-2">
              {reading('Wind', `${weather.wind_speed_knots.toFixed(1)} kn`, `from ${Math.round(weather.wind_direction_deg)}°`)}
              {reading('Waves', `${weather.wave_height_m.toFixed(1)} m`, weather.sea_state !== undefined ? `State ${weather.sea_state} · ${weather.conditions}` : weather.conditions)}
              {reading('Visibility', `${weather.visibility_nm.toFixed(1)} nm`)}
              {reading('Pressure', `${Math.round(weather.pressure_hpa)} hPa`)}
            </div>
          )}
          {currents && (
            <div className="grid grid-cols-2 gap-2">
              {reading('Current', `${currents.current_speed_knots.toFixed(2)} kn`, `${Math.round(currents.current_direction_deg)}° · ${currents.tidal_state}`)}
              {reading('Sea temp', `${currents.sea_surface_temp_c.toFixed(1)} °C`, `salinity ${currents.salinity_psu.toFixed(1)} PSU`)}
            </div>
          )}

          {/* Active Storms Detail Section */}
          {storms.length > 0 && (
            <div className="flex flex-col gap-2 p-3 rounded-input bg-red-950/40 border border-red-800/80">
              <div className="flex items-center justify-between text-xs font-mono text-red-300 font-semibold">
                <span>🌀 ACTIVE DISTURBANCE</span>
                <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-red-900 border border-red-700">
                  {storms[0].severity}
                </span>
              </div>
              <div className="text-sm font-semibold text-white">{storms[0].name}</div>
              <div className="text-xs text-os-ash font-mono flex flex-col gap-0.5">
                <span>Winds: <b className="text-red-300">{storms[0].wind_speed_knots} knots</b></span>
                <span>Radius: <b className="text-red-300">{storms[0].radius_km} km</b></span>
                <span>Center: {storms[0].center_latitude.toFixed(1)}°N, {storms[0].center_longitude.toFixed(1)}°E</span>
              </div>
              <button
                onClick={handleTriggerReroute}
                disabled={isRerouting}
                className="mt-2 bg-red-600 hover:bg-red-500 text-white text-xs font-mono py-1.5 px-3 rounded font-semibold transition disabled:opacity-50"
              >
                {isRerouting ? 'Recalculating...' : '⚡ Trigger Autonomous Reroute'}
              </button>
            </div>
          )}
        </Panel>
      </div>

      {/* Right Panel: Advisories */}
      <div className="absolute right-4 top-20 bottom-4 z-[1000] flex flex-col pointer-events-none">
        <Panel className="w-[376px] h-full p-6 flex flex-col gap-4 overflow-hidden pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-white">Advisories & Alerts</span>
            <Mono className="text-xs text-os-slate">{alerts.filter(a => !a.acknowledged).length} open</Mono>
          </div>
          <div className="flex flex-col overflow-auto pr-1">
            {alerts.map((a, i) => (
              <div key={a.id} className={`flex flex-col gap-2 py-3 ${i < alerts.length - 1 ? 'border-b border-os-raised' : ''}`}>
                <div className="flex items-center gap-2.5">
                  <Mono className="text-xs text-os-slate">{formatClock(a.timestamp)}</Mono>
                  <RiskBadge level={severityLevel(a.severity)} />
                  <Mono className="text-[11px] text-os-ash">{a.alert_type.replace(/_/g, ' ')}</Mono>
                  {a.acknowledged
                    ? <Mono className="text-[11px] text-os-slate ml-auto">acknowledged</Mono>
                    : <GhostLink className="text-xs ml-auto" onClick={() => ack(a.id)}>Acknowledge</GhostLink>}
                </div>
                <span className="text-sm text-os-fog leading-relaxed">{a.message}</span>
                {a.details && <span className="text-xs text-os-ash leading-relaxed">{a.details}</span>}
              </div>
            ))}
            {alerts.length === 0 && <span className="text-sm text-os-fog py-2">No active marine advisories.</span>}
          </div>
        </Panel>
      </div>

      <BasemapToggle basemap={basemap} onChange={setBasemap} style={{ right: 408, bottom: 16 }} />

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
