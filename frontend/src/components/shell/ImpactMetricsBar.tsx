import React, { useEffect, useState } from 'react';
import { ImpactMetrics } from '../../types';
import { fetchImpactMetrics } from '../../services/api';

export const ImpactMetricsBar: React.FC = () => {
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);

  useEffect(() => {
    fetchImpactMetrics().then(setMetrics).catch(() => {});
    const interval = setInterval(() => {
      fetchImpactMetrics().then(setMetrics).catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) return null;

  return (
    <div className="hidden lg:flex items-center space-x-3 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono shadow-inner">
      <div className="flex items-center space-x-1.5" title="Total CO2 emissions eliminated through eco-routing">
        <span className="text-emerald-400">🌿</span>
        <span className="font-bold text-white">{metrics.co2_avoided_tonnes}t</span>
        <span className="text-slate-500 text-[10px]">CO₂</span>
      </div>

      <span className="text-slate-700">|</span>

      <div className="flex items-center space-x-1.5" title="Heavy bunker fuel saved by dynamic optimization">
        <span className="text-cyan-400">⛽</span>
        <span className="font-bold text-white">{(metrics.fuel_saved_liters / 1000).toFixed(1)}k</span>
        <span className="text-slate-500 text-[10px]">Liters</span>
      </div>

      <span className="text-slate-700">|</span>

      <div className="flex items-center space-x-1.5" title="Marine debris and ghost nets intercepted by autonomous fleet">
        <span className="text-amber-400">♻️</span>
        <span className="font-bold text-white">{(metrics.debris_cleared_kg / 1000).toFixed(1)}t</span>
        <span className="text-slate-500 text-[10px]">Cleared</span>
      </div>

      <span className="text-slate-700">|</span>

      <div className="flex items-center space-x-1.5" title="Marine Protected Areas shielded from collision or encroachment">
        <span className="text-purple-400">🛡️</span>
        <span className="font-bold text-white">{metrics.protected_areas_shielded}</span>
        <span className="text-slate-500 text-[10px]">MPAs</span>
      </div>
    </div>
  );
};
