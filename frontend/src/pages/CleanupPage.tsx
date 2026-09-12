import React, { useEffect, useState } from 'react';
import { OceanMap, Basemap } from '../components/OceanMap';
import { Debris, CleanupUnit, Mission, MarineZone, DebrisCluster, Vessel, Port, Storm } from '../types';
import {
  fetchDebris,
  fetchFleetUnits,
  fetchMissions,
  fetchZones,
  fetchDebrisClusters,
  fetchVessels,
  fetchPorts,
  fetchActiveStorms
} from '../services/api';
import { DebrisDetailDrawer } from '../components/cleanup/DebrisDetailDrawer';
import { FleetControlDrawer } from '../components/cleanup/FleetControlDrawer';
import { MissionPlannerModal } from '../components/cleanup/MissionPlannerModal';

export const CleanupPage: React.FC = () => {
  const [debris, setDebris] = useState<Debris[]>([]);
  const [fleetUnits, setFleetUnits] = useState<CleanupUnit[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [zones, setZones] = useState<MarineZone[]>([]);
  const [clusters, setClusters] = useState<DebrisCluster[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [storms, setStorms] = useState<Storm[]>([]);
  const [selectedDebris, setSelectedDebris] = useState<Debris | null>(null);
  const [selectedFleetUnit, setSelectedFleetUnit] = useState<CleanupUnit | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'debris' | 'fleet'>('debris');
  const [basemap, setBasemap] = useState<Basemap>('night');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadData = () => {
    fetchDebris()
      .then(d => {
        const sorted = [...d].sort((a, b) => (b.severity || 0) - (a.severity || 0));
        setDebris(sorted);
        if (!selectedDebris && sorted.length > 0) {
          setSelectedDebris(sorted[0]);
        }
      })
      .catch(() => {});

    fetchFleetUnits().then(setFleetUnits).catch(() => {});
    fetchMissions().then(setMissions).catch(() => {});
    fetchZones().then(setZones).catch(() => {});
    fetchDebrisClusters().then(setClusters).catch(() => {});
    fetchVessels().then(setVessels).catch(() => {});
    fetchPorts().then(setPorts).catch(() => {});
    fetchActiveStorms().then(setStorms).catch(() => {});
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Poll live fleet telemetry every 10s
    return () => clearInterval(interval);
  }, []);

  const handleMissionCreated = (newMission: any) => {
    setMissions(prev => [newMission, ...prev]);
    loadData();
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex overflow-hidden bg-slate-950 font-sans">
      {/* Main Unified Ocean Map */}
      <div className="flex-1 h-full relative">
        <OceanMap
          vessels={vessels}
          ports={ports}
          zones={zones}
          debris={debris}
          fleetUnits={fleetUnits}
          missions={missions}
          storms={storms}
          debrisClusters={clusters}
          selectedDebris={selectedDebris}
          onSelectDebris={setSelectedDebris}
          selectedFleetUnit={selectedFleetUnit}
          onSelectFleetUnit={setSelectedFleetUnit}
          selectedMission={selectedMission}
          onSelectMission={setSelectedMission}
          origin={null}
          destination={null}
          activeRoute={null}
          alternativeRoutes={[]}
          selectedAlternativeIndex={null}
          onSelectAlternative={() => {}}
          mapSelectionMode={null}
          onSelectCoordinate={() => {}}
          replayPosition={null}
          basemap={basemap}
          onBasemapChange={setBasemap}
          showLayerBar={true}
        />

        {/* Floating Mission Studio Header HUD */}
        <div className="absolute top-4 left-4 z-[1000] flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 hover:text-white hover:border-cyan-500 transition shadow-xl flex items-center gap-2 cursor-pointer"
          >
            <span>{sidebarOpen ? '◀' : '▶'}</span>
            <span className="font-bold">{sidebarOpen ? 'Collapse Studio' : 'Open Studio'}</span>
          </button>

          <button
            onClick={() => setIsPlannerOpen(true)}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-950/60 border border-cyan-400/40 flex items-center gap-2 transition cursor-pointer"
          >
            <span>⚡</span>
            <span>Plan Autonomous Sortie</span>
          </button>
        </div>

        {/* Collapsible Left Panel: Debris & Fleet Tabs */}
        {sidebarOpen && (
          <div className="absolute left-4 top-16 bottom-4 w-84 z-[1000] flex flex-col space-y-3 pointer-events-none">
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col max-h-full overflow-hidden pointer-events-auto">
              {/* Studio Tabs */}
              <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-3 font-mono text-xs">
                <button
                  onClick={() => setSidebarTab('debris')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                    sidebarTab === 'debris'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚠️ Debris ({debris.length})
                </button>
                <button
                  onClick={() => setSidebarTab('fleet')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                    sidebarTab === 'fleet'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🚤 Fleet ({fleetUnits.length})
                </button>
              </div>

              {/* Tab 1: Debris List */}
              {sidebarTab === 'debris' && (
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                  {debris.map(d => {
                    const isSelected = d.id === selectedDebris?.id;
                    return (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDebris(d)}
                        className={`p-3 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg'
                            : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold capitalize">{d.debris_type.replace('_', ' ')}</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              d.severity >= 85
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {d.clean_up_priority}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                          <span>Severity: {d.severity}/100</span>
                          <span className="text-cyan-300 font-semibold">
                            {d.estimated_mass_kg?.toLocaleString() || Math.round(d.estimated_size_m2)} kg
                          </span>
                        </div>
                        {d.nearest_mpa_distance_nm && (
                          <div className="text-[10px] text-emerald-400 mt-1">
                            🛡️ {d.nearest_mpa_distance_nm} NM from MPA
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Fleet Status */}
              {sidebarTab === 'fleet' && (
                <FleetControlDrawer
                  units={fleetUnits}
                  selectedUnitId={selectedFleetUnit?.id}
                  onSelectUnit={setSelectedFleetUnit}
                  onRefreshFleet={loadData}
                />
              )}
            </div>
          </div>
        )}

        {/* Right Drawer: Selected Debris Intelligence & Drift Projection */}
        {selectedDebris && (
          <DebrisDetailDrawer
            debris={selectedDebris}
            onClose={() => setSelectedDebris(null)}
            onPlanMission={(d) => {
              setSelectedDebris(d);
              setIsPlannerOpen(true);
            }}
          />
        )}
      </div>

      {/* Mission Planner & Autonomous Dispatch Modal */}
      <MissionPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        debrisList={debris}
        fleetUnits={fleetUnits}
        initialDebrisId={selectedDebris?.id}
        onMissionCreated={handleMissionCreated}
      />
    </div>
  );
};
