import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { OceanMap } from '../components/OceanMap';
import { RoutePlanner } from '../components/RoutePlanner';
import { MetricsPanel } from '../components/MetricsPanel';
import { RouteComparison } from '../components/RouteComparison';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { RouteReplay } from '../components/RouteReplay';
import {
  fetchVessels,
  fetchPorts,
  fetchZones,
  fetchAnalytics,
  fetchHealth,
  optimizeRoute
} from '../services/api';
import {
  Vessel,
  Port,
  MarineZone,
  AnalyticsSummary,
  Coordinate,
  OptimizationWeights,
  RouteOptimizeResponse
} from '../types';
import { AlertCircle } from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [zones, setZones] = useState<MarineZone[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [systemStatus, setSystemStatus] = useState<string>('ok');

  const [selectedVesselId, setSelectedVesselId] = useState<number | null>(null);
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

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [vList, pList, zList, aSummary, hStatus] = await Promise.all([
          fetchVessels(),
          fetchPorts(),
          fetchZones(),
          fetchAnalytics().catch(() => null),
          fetchHealth().catch(() => ({ status: 'degraded' }))
        ]);

        setVessels(vList);
        setPorts(pList);
        setZones(zList);
        setAnalytics(aSummary);
        setSystemStatus(hStatus.status || 'ok');

        if (vList.length > 0) setSelectedVesselId(vList[0].id);

        // Pre-fill Flagship Demo Scenario: Mumbai -> Singapore
        const mumbai = pList.find(p => p.name.includes("Mumbai"));
        const singapore = pList.find(p => p.name.includes("Singapore"));
        if (mumbai && singapore) {
          setOrigin({ latitude: mumbai.latitude, longitude: mumbai.longitude });
          setDestination({ latitude: singapore.latitude, longitude: singapore.longitude });
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error connecting to backend services.');
      }
    };

    loadInitialData();
  }, []);

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
      // Refresh analytics
      fetchAnalytics().then(setAnalytics).catch(() => {});
    } catch (err: any) {
      setErrorMessage(err.message || 'Route optimization failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Currently inspected route (either recommended or selected alternative)
  const inspectedRoute = selectedAlternativeIndex !== null && routeResponse?.alternatives[selectedAlternativeIndex]
    ? routeResponse.alternatives[selectedAlternativeIndex]
    : routeResponse?.recommended_route || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14] text-slate-100 font-sans">
      <Navbar analytics={analytics} systemStatus={systemStatus} />

      <main className="flex-1 p-4 md:p-6 space-y-5 max-w-[1700px] w-full mx-auto">
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

        {/* Primary Command Center Grid: Controls on left, Map & HUD on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Route Planner & Route Replay Controls */}
          <div className="lg:col-span-4 space-y-5">
            <RoutePlanner
              vessels={vessels}
              ports={ports}
              selectedVesselId={selectedVesselId}
              onSelectVessel={setSelectedVesselId}
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

            {routeResponse && (
              <RouteReplay
                route={inspectedRoute}
                onUpdateReplayPosition={setReplayPosition}
              />
            )}
          </div>

          {/* Right Column: Ocean Map & Metrics HUD */}
          <div className="lg:col-span-8 space-y-5 flex flex-col">
            <div className="h-[460px] md:h-[540px] w-full">
              <OceanMap
                vessels={vessels}
                ports={ports}
                zones={zones}
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
        OceanSentinel Multi-Agent Platform &bull; Phase 1 Maritime Logistics Intelligence &bull; Deterministic Engine
      </footer>
    </div>
  );
};
