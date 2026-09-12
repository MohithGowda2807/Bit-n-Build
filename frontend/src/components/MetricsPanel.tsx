import React from 'react';
import { Fuel, Clock, Gauge, DollarSign, Leaf, AlertTriangle, TrendingDown } from 'lucide-react';
import { RouteDetail } from '../types';

interface MetricsPanelProps {
  route: RouteDetail | null;
  isAlternative?: boolean;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ route, isAlternative = false }) => {
  if (!route) {
    return (
      <div className="bg-[#09152b] border border-slate-800 rounded-xl p-5 shadow-xl flex items-center justify-center min-h-[220px]">
        <div className="text-center text-slate-500 font-mono text-xs">
          Select origin, destination and optimize to inspect maritime telemetry.
        </div>
      </div>
    );
  }

  const formatHours = (hrs: number) => {
    const wholeHours = Math.floor(hrs);
    const minutes = Math.round((hrs - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const riskLabel = route.risk_score < 20 ? 'Low' : route.risk_score < 40 ? 'Moderate' : 'Elevated';
  const riskColor = route.risk_score < 20 ? 'text-emerald-400' : route.risk_score < 40 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="bg-[#09152b] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <Gauge className="h-5 w-5 text-cyan-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
            {isAlternative ? 'Alternative Route Telemetry' : 'Recommended Route Metrics'}
          </h2>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase">
          {route.optimization_mode}
        </span>
      </div>

      {/* Grid of Key Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Distance */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
            <Gauge className="h-3 w-3 text-cyan-400" />
            <span>DISTANCE</span>
          </div>
          <div className="text-lg font-bold font-mono text-white mt-1">
            {route.distance_km.toLocaleString()} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            {(route.distance_km / 1.852).toFixed(0)} NM
          </div>
        </div>

        {/* Travel Time & ETA */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
            <Clock className="h-3 w-3 text-blue-400" />
            <span>DURATION / ETA</span>
          </div>
          <div className="text-lg font-bold font-mono text-white mt-1">
            {formatHours(route.estimated_time_hours)}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            {new Date(route.eta).toLocaleDateString()} {new Date(route.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Fuel */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
            <Fuel className="h-3 w-3 text-amber-400" />
            <span>EST. FUEL</span>
          </div>
          <div className="text-lg font-bold font-mono text-amber-300 mt-1">
            {Math.round(route.estimated_fuel_liters).toLocaleString()} <span className="text-xs font-normal text-slate-400">L</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            ~{(route.estimated_fuel_liters / 1000).toFixed(1)} MT
          </div>
        </div>

        {/* Cost */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
            <DollarSign className="h-3 w-3 text-emerald-400" />
            <span>EST. FUEL COST</span>
          </div>
          <div className="text-lg font-bold font-mono text-emerald-300 mt-1">
            ${Math.round(route.estimated_cost).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            @ $0.85/L bunker
          </div>
        </div>

        {/* CO2 Emissions */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
            <Leaf className="h-3 w-3 text-teal-400" />
            <span>CO₂ EMISSIONS</span>
          </div>
          <div className="text-lg font-bold font-mono text-teal-300 mt-1">
            {(route.estimated_co2_kg / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">t</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            {Math.round(route.estimated_co2_kg).toLocaleString()} kg
          </div>
        </div>

        {/* Navigational Risk */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3 text-rose-400" />
            <span>ZONE RISK</span>
          </div>
          <div className={`text-lg font-bold font-mono mt-1 ${riskColor}`}>
            {riskLabel}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            Score: {route.risk_score.toFixed(0)}/100
          </div>
        </div>
      </div>

      {/* Fuel Saved & Sustainability Banner */}
      {(route.fuel_saved_liters > 0 || route.co2_avoided_kg > 0) && (
        <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <TrendingDown className="h-5 w-5 text-emerald-400" />
            <div>
              <div className="text-xs font-bold font-mono text-emerald-300">
                SUSTAINABILITY SAVINGS (VS FASTEST BASELINE)
              </div>
              <div className="text-[11px] font-mono text-slate-300">
                Reduced consumption via hydrodynamic eco-steaming & corridor routing
              </div>
            </div>
          </div>
          <div className="text-right font-mono">
            <div className="text-sm font-bold text-emerald-400">
              +{Math.round(route.fuel_saved_liters).toLocaleString()} L
            </div>
            <div className="text-[10px] text-teal-300">
              {Math.round(route.co2_avoided_kg).toLocaleString()} kg CO₂ avoided
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
