import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { OceanMap } from '../components/OceanMap';
import { RoutePlanner } from '../components/RoutePlanner';
import { MetricsPanel } from '../components/MetricsPanel';
import { RouteComparison } from '../components/RouteComparison';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { RouteReplay } from '../components/RouteReplay';
import { AgentOrchestratorConsole } from '../components/AgentOrchestratorConsole';
import { EnvironmentalPanel } from '../components/EnvironmentalPanel';
import {
  fetchVessels,
  fetchPorts,
  fetchZones,
  fetchDebris,
  fetchAlerts,
  fetchVesselTracks,
  fetchAnalytics,
  fetchHealth,
  optimizeRoute
} from '../services/api';
import {
  Vessel,
  VesselTrack,
  Port,
  MarineZone,
  Debris,
  Alert,
  AnalyticsSummary,
  Coordinate,
  OptimizationWeights,
  RouteOptimizeResponse
} from '../types';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [zones, setZones] = useState<MarineZone[]>([]);
  const [debris, setDebris] = useState<Debris[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [systemStatus, setSystemStatus] = useState<string>('ok');
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  const [selectedVesselId, setSelectedVesselId] = useState<number | null>(null);
  const [selectedVesselTracks, setSelectedVesselTracks] = useState<VesselTrack[]>([]);

  const [origin, setOrigin] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [mapSelectionMode, setMapSelectionMode] = useState<'origin' | 'destination' | null>(null);

  const [optimizationMode, setOptimizationMode] = useState<string>('fuel_efficient');
  const [customWeights, setCustomWeights] = useState<OptimizationWeights>({
    fuel: 0.55,
    time: 0.15,
    safety: 0.15,
    environment: 0.15
  });

  const [routeResponse, setRouteResponse] = useState<RouteOptimizeResponse | null>(null);
  const [selectedAlternativeIndex, setSelectedAlternativeIndex] = useState<number | null>(null);
  const [replayPosition, setReplayPosition] = useState<[number, number] | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  // Load initial backend collections
  const loadInitialData = async () => {
    try {
      const [vList, pList, zList, dList, aList, aSummary, hStatus] = await Promise.all([
        fetchVessels(),
        fetchPorts(),
        fetchZones(),
        fetchDebris().catch(() => []),
        fetchAlerts().catch(() => []),
        fetchAnalytics().catch(() => null),
        fetchHealth().catch(() => ({ status: 'degraded' }))
      ]);

      setVessels(vList);
      setPorts(pList);
      setZones(zList);
      setDebris(dList);
      setAlerts(aList);
      setAnalytics(aSummary);
      setSystemStatus(hStatus.status || 'ok');

      if (vList.length > 0 && !selectedVesselId) {
        setSelectedVesselId(vList[0].id);
        fetchVesselTracks(vList[0].id).then(setSelectedVesselTracks).catch(() => {});
      }

      // Pre-fill Flagship Demo Scenario: Mumbai -> Singapore
      const mumbai = pList.find(p => p.name.includes("Mumbai"));
      const singapore = pList.find(p => p.name.includes("Singapore"));
      if (mumbai && singapore && !origin && !destination) {
        setOrigin({ latitude: mumbai.latitude, longitude: mumbai.longitude });
        setDestination({ latitude: singapore.latitude, longitude: singapore.longitude });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to backend services.');
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Connect WebSocket for real-time telemetry stream
  useEffect(() => {
    const wsUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000')
      .replace(/^http/, 'ws') + '/ws/telemetry';

    let socket: WebSocket;
    const connectWs = () => {
      try {
        socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          setWsConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'vessel_telemetry' && msg.data?.vessels) {
              const updatedVessels: Vessel[] = msg.data.vessels;
              setVessels(prev => {
                const map = new Map(prev.map(v => [v.id, v]));
                for (const u of updatedVessels) {
                  const existing = map.get(u.id);
                  if (existing) {
                    map.set(u.id, { ...existing, ...u });
                  }
                }
                return Array.from(map.values());
              });
            }
          } catch {
            // Ignore plain string pongs
          }
        };

        socket.onclose = () => {
          setWsConnected(false);
          // Retry connection after 5 seconds
          setTimeout(connectWs, 5000);
        };

        socket.onerror = () => {
          socket.close();
        };
      } catch {
        setWsConnected(false);
      }
    };

    connectWs();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Fetch track history when selected vessel changes
  useEffect(() => {
    if (selectedVesselId) {
      fetchVesselTracks(selectedVesselId)
        .then(setSelectedVesselTracks)
        .catch(() => setSelectedVesselTracks([]));
    }
  }, [selectedVesselId]);

  const handleSelectCoordinate = (coord: Coordinate) => {
    if (mapSelectionMode === 'origin') {
      setOrigin(coord);
    } else if (mapSelectionMode === 'destination') {
      setDestination(coord);
    }
    setMapSelectionMode(null);
  };

  const handleOptimize = async () => {
    if (!origin || !destination) {
      setErrorMessage('Please select both Origin and Destination coordinates.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSelectedAlternativeIndex(null);
    setReplayPosition(null);

    try {
      const response = await optimizeRoute({
        vessel_id: selectedVesselId || 1,
        origin,
        destination,
        mode: optimizationMode,
        optimization: customWeights
      });

      setRouteResponse(response);
      fetchAnalytics().then(setAnalytics).catch(() => {});
    } catch (err: any) {
      setErrorMessage(err.message || 'Route optimization failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVessel = vessels.find(v => v.id === selectedVesselId) || null;

  // Currently inspected route
  const inspectedRoute = selectedAlternativeIndex !== null && routeResponse?.alternatives[selectedAlternativeIndex]
    ? routeResponse.alternatives[selectedAlternativeIndex]
    : routeResponse?.recommended_route || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14] text-slate-100 font-sans">
      <Navbar analytics={analytics} systemStatus={systemStatus} wsConnected={wsConnected} />

      <main className="flex-1 p-4 md:p-6 space-y-5 max-w-[1750px] w-full mx-auto">
        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-500/80 rounded-xl p-4 flex items-center justify-between text-rose-200 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="px-2 py-0.5 rounded bg-rose-900 hover:bg-rose-800 text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Operational Alerts Bar (if active alerts exist) */}
        {alerts.length > 0 && (
          <div className="flex items-center space-x-3 bg-amber-950/40 border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-mono text-amber-200 overflow-x-auto">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold uppercase tracking-wide text-amber-300">Active Advisories ({alerts.length}):</span>
            <div className="flex items-center space-x-3 overflow-x-auto">
              {alerts.slice(0, 3).map((a) => (
                <span key={a.id} className="bg-slate-900/90 px-2 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
                  [{a.severity.toUpperCase()}] {a.message}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Multi-Agent Orchestrator Interactive Console */}
        <AgentOrchestratorConsole
          vessels={vessels}
          selectedVessel={selectedVessel}
          onRefreshTelemetry={loadInitialData}
        />

        {/* Primary Command Center Grid: Controls on left, Map & HUD on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Route Planner & Environmental Telemetry */}
          <div className="lg:col-span-4 space-y-5">
            <RoutePlanner
              vessels={vessels}
              ports={ports}
              selectedVesselId={selectedVesselId}
              onSelectVessel={(id) => setSelectedVesselId(id)}
              origin={origin}
              destination={destination}
              onSetOrigin={setOrigin}
              onSetDestination={setDestination}
              mapSelectionMode={mapSelectionMode}
              onToggleMapSelection={setMapSelectionMode}
              optimizationMode={optimizationMode}
              onChangeMode={setOptimizationMode}
              customWeights={customWeights}
              onChangeWeights={setCustomWeights}
              onOptimize={handleOptimize}
              isLoading={isLoading}
            />

            {/* Live Marine Weather & Currents HUD */}
            <EnvironmentalPanel
              centerCoordinate={selectedVessel ? { latitude: selectedVessel.latitude, longitude: selectedVessel.longitude } : origin}
            />

            {routeResponse && (
              <RouteReplay
                route={inspectedRoute}
                onUpdateReplayPosition={setReplayPosition}
              />
            )}
          </div>

          {/* Right Column: Ocean Map & Metrics HUD */}
          <div className="lg:col-span-8 space-y-5 flex flex-col">
            <div className="h-[480px] md:h-[580px] w-full">
              <OceanMap
                vessels={vessels}
                ports={ports}
                zones={zones}
                debris={debris}
                selectedVessel={selectedVessel}
                selectedVesselTracks={selectedVesselTracks}
                onSelectVessel={(v) => setSelectedVesselId(v.id)}
                origin={origin}
                destination={destination}
                activeRoute={routeResponse ? routeResponse.recommended_route : null}
                alternativeRoutes={routeResponse ? routeResponse.alternatives : []}
                selectedAlternativeIndex={selectedAlternativeIndex}
                onSelectAlternative={setSelectedAlternativeIndex}
                mapSelectionMode={mapSelectionMode}
                onSelectCoordinate={handleSelectCoordinate}
                replayPosition={replayPosition}
              />
            </div>

            <MetricsPanel
              route={inspectedRoute}
              isAlternative={selectedAlternativeIndex !== null}
            />
          </div>
        </div>

        {/* Lower Row: Route Comparison Matrix & Explainable AI */}
        {routeResponse && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7">
              <RouteComparison
                comparison={routeResponse.comparison}
                selectedAlternativeIndex={selectedAlternativeIndex}
                onSelectAlternative={setSelectedAlternativeIndex}
              />
            </div>
            <div className="lg:col-span-5">
              <ExplanationPanel explanation={routeResponse.explanation} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 py-3 px-6 text-center text-xs font-mono text-slate-500">
        TRITON / OceanSentinel Multi-Agent Platform &bull; Phase 1 Foundation &bull; Fully Connected Live Architecture
      </footer>
    </div>
  );
};
