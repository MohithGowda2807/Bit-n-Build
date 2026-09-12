import React, { useEffect, useMemo, useState } from 'react';
import { CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { Basemap } from '../components/OceanMap';
import { BaseMap, BasemapToggle } from '../components/map/BaseMap';
import { Eyebrow, InfoBadge, Mono, Panel, RiskBadge, RiskNumber } from '../components/ui/primitives';
import { fetchDebris, fetchIncidents, fetchMissions } from '../services/api';
import { Debris, Incident, Mission } from '../types';
import { riskColor } from '../design/risk';
import { formatClock } from '../design/format';

const FlyTo: React.FC<{ target: [number, number] | null }> = ({ target }) => {
  const map = useMap();
  useEffect(() => { if (target) map.flyTo(target, Math.max(map.getZoom(), 6), { duration: 0.6 }); }, [target, map]);
  return null;
};

export const CleanupPage: React.FC = () => {
  const [debris, setDebris] = useState<Debris[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [basemap, setBasemap] = useState<Basemap>('night');

  useEffect(() => {
    fetchDebris().then(d => setDebris([...d].sort((a, b) => b.severity - a.severity))).catch(() => {});
    fetchMissions().then(setMissions).catch(() => {});
    fetchIncidents().then(setIncidents).catch(() => {});
  }, []);

  const selected = useMemo(() => debris.find(d => d.id === selectedId) ?? null, [debris, selectedId]);

  return (
    <div className="relative flex-1 min-h-0">
      <BaseMap basemap={basemap} center={[10, 78]} zoom={5}>
        <FlyTo target={selected ? [selected.latitude, selected.longitude] : null} />
        {debris.map(d => (
          <CircleMarker key={d.id} center={[d.latitude, d.longitude]} radius={Math.max(5, Math.min(14, Math.sqrt(d.estimated_size_m2) / 2))}
            pathOptions={{ color: '#0e1012', weight: 2, fillColor: riskColor(d.severity), fillOpacity: 0.9 }}
            eventHandlers={{ click: () => setSelectedId(d.id) }}>
            <Tooltip direction="top" offset={[0, -6]}>{d.debris_type.replace(/_/g, ' ')} · severity {Math.round(d.severity)}</Tooltip>
          </CircleMarker>
        ))}
        {selected && <CircleMarker center={[selected.latitude, selected.longitude]} radius={18} interactive={false} pathOptions={{ color: '#007afc', weight: 1.5, fill: false }} />}
        {missions.filter(m => m.target_lat && m.target_lon).map(m => (
          <CircleMarker key={`m-${m.id}`} center={[m.target_lat!, m.target_lon!]} radius={4} pathOptions={{ color: '#2fae6e', weight: 1.5, fill: false }}>
            <Tooltip>{m.mission_name}</Tooltip>
          </CircleMarker>
        ))}
      </BaseMap>

      {/* Left panel collapse toggle */}
      <div className="absolute left-4 top-4 z-[1001]">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-os-card/90 backdrop-blur-md border border-os-border/90 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-200 hover:text-white hover:border-blue-500 transition shadow-lg flex items-center gap-1.5 cursor-pointer"
        >
          <span>{sidebarOpen ? '◀' : '▶'}</span>
          <span className="font-semibold">{sidebarOpen ? 'Hide Debris List' : 'Show Debris List'}</span>
        </button>
      </div>

      {sidebarOpen && (
        <div className="absolute left-4 top-14 bottom-4 z-[1000]">
          <Panel className="w-[340px] h-full p-5 flex flex-col gap-3.5 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-white">Debris</span>
              <Mono className="text-xs text-os-slate">sorted by severity</Mono>
            </div>
            <div className="flex flex-col overflow-auto pr-1">
              {debris.map((d, i) => {
                const active = d.id === selectedId;
                return (
                  <button key={d.id} onClick={() => setSelectedId(d.id)}
                    className={`flex items-center gap-3 h-14 text-left ${active ? 'bg-os-raised rounded-row px-3 -mx-3 shadow-[inset_2px_0_0_#007afc]' : `${i < debris.length - 1 ? 'border-b border-os-raised' : ''} hover:bg-os-raised/50`}`}>
                    <RiskNumber score={d.severity} className="w-11 shrink-0" />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="text-sm font-medium text-white truncate">{d.debris_type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}</span>
                      <span className="text-xs text-os-ash truncate">{Math.round(d.estimated_size_m2)} m² · {d.density_category} · {d.status.replace(/_/g, ' ')}</span>
                    </div>
                    <RiskBadge level={d.clean_up_priority === 'urgent' ? 'CRITICAL' : d.clean_up_priority === 'high' ? 'HIGH' : 'MODERATE'} />
                  </button>
                );
              })}
              {debris.length === 0 && <span className="text-sm text-os-fog py-2">No debris reports.</span>}
            </div>
            <span className="text-xs text-os-ash leading-relaxed">Autonomous cleanup allocation and drift prediction arrive with Phase 4. Reports here come from the Phase 1 debris service.</span>
          </Panel>
        </div>
      )}

      <div className="absolute right-4 top-4 bottom-4 z-[1000]">
        <Panel className="w-[376px] h-full p-6 flex flex-col gap-4 overflow-hidden">
          {selected && (
            <div className="flex flex-col gap-2 pb-4 border-b border-os-raised">
              <Eyebrow>Report {selected.id} · {selected.source.replace(/_/g, ' ')} · {formatClock(selected.detected_at)}</Eyebrow>
              <span className="text-xl font-bold text-white tracking-tight">{selected.debris_type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}</span>
              {selected.description && <span className="text-sm text-os-fog leading-relaxed">{selected.description}</span>}
              <Mono className="text-xs text-os-ash">{selected.latitude.toFixed(3)}, {selected.longitude.toFixed(3)} · {Math.round(selected.estimated_size_m2)} m²</Mono>
            </div>
          )}
          <span className="text-lg font-medium text-white">Missions</span>
          <div className="flex flex-col overflow-auto pr-1">
            {missions.map((m, i) => (
              <div key={m.id} className={`flex flex-col gap-1 py-3 ${i < missions.length - 1 ? 'border-b border-os-raised' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white flex-1 truncate">{m.mission_name}</span>
                  <InfoBadge tone={m.status === 'active' ? 'clear' : 'muted'}>{m.status}</InfoBadge>
                </div>
                <Mono className="text-[11px] text-os-ash">{m.mission_type.replace(/_/g, ' ')} · priority {m.priority}{m.assigned_vessel_id ? ` · vessel ${m.assigned_vessel_id}` : ' · unassigned'}</Mono>
              </div>
            ))}
          </div>
          {incidents.length > 0 && (
            <>
              <Eyebrow>Incidents</Eyebrow>
              <div className="flex flex-col gap-2">
                {incidents.slice(0, 3).map(inc => (
                  <div key={inc.id} className="flex items-center gap-2.5">
                    <RiskBadge level={inc.severity === 'critical' ? 'CRITICAL' : inc.severity === 'high' ? 'HIGH' : 'MODERATE'} />
                    <span className="text-[13px] text-os-fog truncate">{inc.title}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>
      </div>

      <BasemapToggle basemap={basemap} onChange={setBasemap} style={{ right: 408, bottom: 16 }} />
    </div>
  );
};
