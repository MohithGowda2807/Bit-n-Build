import React, { useEffect, useState } from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';
import { Basemap } from '../components/OceanMap';
import { BaseMap, BasemapToggle } from '../components/map/BaseMap';
import { Eyebrow, GhostLink, Mono, Panel, RiskBadge } from '../components/ui/primitives';
import { fetchAlerts, fetchOceanCurrents, fetchVessels, fetchWeather } from '../services/api';
import { acknowledgeAlert } from '../services/surveillance';
import { Alert, OceanCurrentData, Vessel, WeatherData } from '../types';
import { formatClock } from '../design/format';
import { RiskLevel } from '../design/risk';

const severityLevel = (s: string): RiskLevel => (s === 'critical' ? 'CRITICAL' : s === 'warning' ? 'ELEVATED' : 'MODERATE');

export const EnvironmentPage: React.FC = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currents, setCurrents] = useState<OceanCurrentData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [basemap, setBasemap] = useState<Basemap>('chart');

  useEffect(() => {
    fetchVessels().then(v => { setVessels(v); if (v.length) setSelectedId(v[0].id); }).catch(() => {});
    fetchAlerts().then(setAlerts).catch(() => {});
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

  const reading = (label: string, value: string, hint?: string) => (
    <div key={label} className="flex flex-col gap-0.5 px-3 py-2.5 rounded-row bg-os-raised">
      <Eyebrow>{label}</Eyebrow>
      <Mono className="text-[15px] text-white">{value}</Mono>
      {hint && <span className="text-[11px] text-os-ash">{hint}</span>}
    </div>
  );

  return (
    <div className="relative flex-1 min-h-0">
      <BaseMap basemap={basemap} center={[13, 74]} zoom={5}>
        {vessels.map(v => (
          <CircleMarker key={v.id} center={[v.latitude, v.longitude]} radius={v.id === selectedId ? 6 : 4.5}
            pathOptions={{ color: '#0e1012', weight: 2, fillColor: '#a0aaba', fillOpacity: 1 }}
            eventHandlers={{ click: () => setSelectedId(v.id) }}>
            <Tooltip direction="top" offset={[0, -6]}>{v.name}</Tooltip>
          </CircleMarker>
        ))}
        {selected && <CircleMarker center={[selected.latitude, selected.longitude]} radius={12} interactive={false} pathOptions={{ color: '#007afc', weight: 1.5, fill: false }} />}
      </BaseMap>

      <div className="absolute left-4 top-4 z-[1000]">
        <Panel className="w-[340px] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-white">Conditions</span>
            <Mono className="text-xs text-os-slate">synthetic feed</Mono>
          </div>
          <select value={selectedId ?? ''} onChange={e => setSelectedId(Number(e.target.value))}
            className="bg-os-raised text-white text-sm border border-os-pewter rounded-input px-3 py-2 focus:outline-none focus:border-os-silver">
            {vessels.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          {selected && <Mono className="text-[11px] text-os-ash">{selected.latitude.toFixed(2)}, {selected.longitude.toFixed(2)}</Mono>}

          {weather && (
            <div className="grid grid-cols-2 gap-2">
              {reading('Wind', `${weather.wind_speed_knots.toFixed(1)} kn`, `from ${Math.round(weather.wind_direction_deg)}°`)}
              {reading('Waves', `${weather.wave_height_m.toFixed(1)} m`, weather.conditions)}
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
          <span className="text-xs text-os-ash leading-relaxed">Dynamic rerouting on live weather arrives with Phase 2. The readings here come from the Phase 1 environmental services.</span>
        </Panel>
      </div>

      <div className="absolute right-4 top-4 bottom-4 z-[1000]">
        <Panel className="w-[376px] h-full p-6 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-white">Advisories</span>
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
            {alerts.length === 0 && <span className="text-sm text-os-fog py-2">No advisories.</span>}
          </div>
        </Panel>
      </div>

      <BasemapToggle basemap={basemap} onChange={setBasemap} style={{ right: 408, bottom: 16 }} />
    </div>
  );
};
