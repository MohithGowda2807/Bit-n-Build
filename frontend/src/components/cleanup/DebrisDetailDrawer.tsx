import React, { useEffect, useState } from 'react';
import { Debris, DebrisDriftForecast } from '../../types';
import { fetchDebrisDrift } from '../../services/api';
import { useRole } from '../../services/session';
import { atLeast } from '../../design/roles';

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
  const role = useRole();
  const mayPlan = atLeast(role, 'OPERATOR');
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
 debris.severity >= 85 ? 'text-risk-critical' : debris.severity >= 70 ? 'text-risk-moderate' : 'text-risk-moderate';

 return (
    <div className="absolute right-4 top-4 bottom-4 w-96 z-[1001] bg-os-panel border border-os-pewter rounded-panel p-5 flex flex-col font-mono text-xs text-os-fog overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-os-pewter">
        <div>
          <span className="text-[10px] text-os-signal font-bold tracking-widest uppercase">
 Debris Hazard Analysis
          </span>
          <h3 className="text-base font-bold text-white capitalize">
            {debris.debris_type.replace('_', ' ')} #{debris.id}
          </h3>
        </div>
        <button
 onClick={onClose}
 className="text-os-ash hover:text-white p-1 rounded-input hover:bg-os-raised transition"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1">
        {/* Risk & Mass Badges */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-os-void border border-os-pewter rounded-row">
            <div className="text-[10px] text-os-ash uppercase">Hazard Severity</div>
            <div className={`text-xl font-bold ${severityColor}`}>
              {debris.severity}<span className="text-xs text-os-slate">/100</span>
            </div>
            <div className="text-[10px] text-os-ash uppercase mt-0.5">
 Priority: <span className="text-risk-moderate font-semibold">{debris.clean_up_priority}</span>
            </div>
          </div>
          <div className="p-3 bg-os-void border border-os-pewter rounded-row">
            <div className="text-[10px] text-os-ash uppercase">Estimated Mass</div>
            <div className="text-xl font-bold text-os-signal">
              {debris.estimated_mass_kg?.toLocaleString() || Math.round(debris.estimated_size_m2)}
              <span className="text-xs text-os-slate font-normal"> kg</span>
            </div>
            <div className="text-[10px] text-os-ash uppercase mt-0.5">
 Area: {Math.round(debris.estimated_size_m2)} m²
            </div>
          </div>
        </div>

        {/* Threatened Ecosystem / MPA Alert */}
        {debris.target_species_threatened && (
          <div className="p-3 bg-os-raised border border-risk-critical rounded-row">
            <div className="text-[10px] text-risk-critical font-bold uppercase flex items-center gap-1">
              Threatened Marine Life
            </div>
            <div className="text-risk-critical mt-1 text-[11px] font-sans leading-tight">
              {debris.target_species_threatened}
            </div>
            {debris.nearest_mpa_distance_nm && (
              <div className="text-[10px] text-risk-critical mt-2 font-mono">
 Distance to Nearest MPA: <span className="font-bold">{debris.nearest_mpa_distance_nm} NM</span>
              </div>
            )}
          </div>
        )}

        {/* Leeway Drift Physics */}
        <div className="p-3 bg-os-void border border-os-pewter rounded-row space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-os-signal font-bold uppercase">
 Leeway Drift Prediction
            </span>
            <span className="text-[10px] text-os-ash">
              {debris.drift_speed_knots || 1.6} kn @ {debris.drift_heading_deg || 84}°
            </span>
          </div>

          {loadingDrift ? (
            <div className="text-center py-4 text-os-slate animate-pulse">
 Calculating hydrodynamic leeway vector...
            </div>
          ) : driftForecast ? (
            <div className="space-y-1.5 pt-1">
              <div className="grid grid-cols-4 text-[10px] text-os-slate font-bold border-b border-os-pewter pb-1">
                <span>TIME</span>
                <span>LAT</span>
                <span>LON</span>
                <span className="text-right">UNCERTAINTY</span>
              </div>
              {driftForecast.trajectory.slice(0, 5).map((step, idx) => (
                <div key={idx} className="grid grid-cols-4 text-[10px] text-os-fog">
                  <span className="text-os-signal">+{step.hour}h</span>
                  <span>{step.latitude.toFixed(2)}°N</span>
                  <span>{step.longitude.toFixed(2)}°E</span>
                  <span className="text-right text-risk-moderate">±{step.uncertainty_radius_nm} NM</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-os-slate text-[10px]">No drift data available.</div>
          )}
        </div>

        {/* Narrative Description */}
        {debris.description && (
          <div className="p-3 bg-os-void border border-os-pewter rounded-row">
            <div className="text-[10px] text-os-ash uppercase mb-1">Intelligence Assessment</div>
            <p className="text-[11px] text-os-fog font-sans leading-relaxed">
              {debris.description}
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-os-pewter">
        <button
 onClick={() => onPlanMission(debris)}
 disabled={!mayPlan}
 title={mayPlan ? undefined : 'Requires the Operator role'}
 className="w-full bg-os-signal hover:bg-os-signal-hover disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-row text-xs tracking-wider uppercase transition flex items-center justify-center gap-2"
        >
          <span>Plan Intercept Sortie</span>
        </button>
      </div>
    </div>
  );
};
