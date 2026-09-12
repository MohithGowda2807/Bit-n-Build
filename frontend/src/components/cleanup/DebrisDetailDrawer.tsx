import React, { useEffect, useState } from 'react';
import { Debris, DebrisDriftForecast } from '../../types';
import { fetchDebrisDrift } from '../../services/api';

interface DebrisDetailDrawerProps {
  debris: Debris | null;
  onClose: () => void;
  onPlanMission: (debris: Debris) => void;
}

export const DebrisDetailDrawer: React.FC<DebrisDetailDrawerProps> = ({
  debris,
  onClose,
  onPlanMission
}) => {
  const [driftForecast, setDriftForecast] = useState<DebrisDriftForecast | null>(null);
  const [loadingDrift, setLoadingDrift] = useState(false);

  useEffect(() => {
    if (debris) {
      setLoadingDrift(true);
      fetchDebrisDrift(debris.id, 12)
        .then(setDriftForecast)
        .catch(() => {})
        .finally(() => setLoadingDrift(false));
    } else {
      setDriftForecast(null);
    }
  }, [debris]);

  if (!debris) return null;

  const severityColor =
    debris.severity >= 85 ? 'text-red-400' : debris.severity >= 70 ? 'text-orange-400' : 'text-amber-400';

  return (
    <div className="absolute right-4 top-4 bottom-4 w-96 z-[1001] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-5 flex flex-col font-mono text-xs text-slate-300 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">
            Debris Hazard Analysis
          </span>
          <h3 className="text-base font-bold text-white capitalize">
            {debris.debris_type.replace('_', ' ')} #{debris.id}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1">
        {/* Risk & Mass Badges */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase">Hazard Severity</div>
            <div className={`text-xl font-bold ${severityColor}`}>
              {debris.severity}<span className="text-xs text-slate-500">/100</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase mt-0.5">
              Priority: <span className="text-amber-400 font-semibold">{debris.clean_up_priority}</span>
            </div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase">Estimated Mass</div>
            <div className="text-xl font-bold text-cyan-300">
              {debris.estimated_mass_kg?.toLocaleString() || Math.round(debris.estimated_size_m2)}
              <span className="text-xs text-slate-500 font-normal"> kg</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase mt-0.5">
              Area: {Math.round(debris.estimated_size_m2)} m²
            </div>
          </div>
        </div>

        {/* Threatened Ecosystem / MPA Alert */}
        {debris.target_species_threatened && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl">
            <div className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1">
              <span>⚠️</span> Threatened Marine Life
            </div>
            <div className="text-rose-200 mt-1 text-[11px] font-sans leading-tight">
              {debris.target_species_threatened}
            </div>
            {debris.nearest_mpa_distance_nm && (
              <div className="text-[10px] text-rose-300 mt-2 font-mono">
                Distance to Nearest MPA: <span className="font-bold">{debris.nearest_mpa_distance_nm} NM</span>
              </div>
            )}
          </div>
        )}

        {/* Leeway Drift Physics */}
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-cyan-400 font-bold uppercase">
              Leeway Drift Prediction
            </span>
            <span className="text-[10px] text-slate-400">
              {debris.drift_speed_knots || 1.6} kn @ {debris.drift_heading_deg || 84}°
            </span>
          </div>

          {loadingDrift ? (
            <div className="text-center py-4 text-slate-500 animate-pulse">
              Calculating hydrodynamic leeway vector...
            </div>
          ) : driftForecast ? (
            <div className="space-y-1.5 pt-1">
              <div className="grid grid-cols-4 text-[10px] text-slate-500 font-bold border-b border-slate-800 pb-1">
                <span>TIME</span>
                <span>LAT</span>
                <span>LON</span>
                <span className="text-right">UNCERTAINTY</span>
              </div>
              {driftForecast.trajectory.slice(0, 5).map((step, idx) => (
                <div key={idx} className="grid grid-cols-4 text-[10px] text-slate-300">
                  <span className="text-cyan-400">+{step.hour}h</span>
                  <span>{step.latitude.toFixed(2)}°N</span>
                  <span>{step.longitude.toFixed(2)}°E</span>
                  <span className="text-right text-amber-400">±{step.uncertainty_radius_nm} NM</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-[10px]">No drift data available.</div>
          )}
        </div>

        {/* Narrative Description */}
        {debris.description && (
          <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
            <div className="text-[10px] text-slate-400 uppercase mb-1">Intelligence Assessment</div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {debris.description}
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800">
        <button
          onClick={() => onPlanMission(debris)}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs tracking-wider uppercase shadow-lg shadow-cyan-950 transition flex items-center justify-center gap-2"
        >
          <span>🎯</span>
          <span>Plan Intercept Sortie</span>
        </button>
      </div>
    </div>
  );
};
