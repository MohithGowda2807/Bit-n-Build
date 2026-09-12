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
    <>
      {/* Full Ticker on Ultra-Wide screens (2xl: 1536px+) */}
      <div className="hidden 2xl:flex items-center space-x-3 px-3 py-1 rounded-full bg-os-void border border-os-pewter text-[11px] font-mono shrink-0">
        <div className="flex items-center space-x-1.5" title="Total CO2 emissions eliminated through eco-routing">
          <span className="text-os-clear">🌿</span>
          <span className="font-bold text-white">{metrics.co2_avoided_tonnes}t</span>
          <span className="text-os-slate text-[10px]">CO₂</span>
        </div>

        <span className="text-os-void">|</span>

        <div className="flex items-center space-x-1.5" title="Heavy bunker fuel saved by dynamic optimization">
          <span className="text-os-signal">⛽</span>
          <span className="font-bold text-white">{(metrics.fuel_saved_liters / 1000).toFixed(1)}k</span>
          <span className="text-os-slate text-[10px]">Liters</span>
        </div>

        <span className="text-os-void">|</span>

        <div className="flex items-center space-x-1.5" title="Marine debris and ghost nets intercepted by autonomous fleet">
          <span className="text-risk-moderate">♻️</span>
          <span className="font-bold text-white">{(metrics.debris_cleared_kg / 1000).toFixed(1)}t</span>
          <span className="text-os-slate text-[10px]">Cleared</span>
        </div>

        <span className="text-os-void">|</span>

        <div className="flex items-center space-x-1.5" title="Marine Protected Areas shielded from collision or encroachment">
          <span className="text-os-signal">🛡️</span>
          <span className="font-bold text-white">{metrics.protected_areas_shielded}</span>
          <span className="text-os-slate text-[10px]">MPAs</span>
        </div>
      </div>

      {/* Compact Smart Pill on Laptop & Standard Desktop screens (<1536px) */}
      <div
 className="hidden lg:flex 2xl:hidden items-center space-x-1.5 px-2.5 py-1 rounded-full bg-os-void border border-os-pewter text-[10px] font-mono shrink-0 cursor-pointer hover:border-os-clear transition"
 title={`Total Decarbonization Impact:\n• CO2 Avoided: ${metrics.co2_avoided_tonnes}t\n• Fuel Saved: ${(metrics.fuel_saved_liters / 1000).toFixed(1)}k L\n• Debris Cleared: ${(metrics.debris_cleared_kg / 1000).toFixed(1)}t\n• Protected MPAs: ${metrics.protected_areas_shielded}`}
      >
        <span className="text-os-clear">🌿</span>
        <span className="font-bold text-white">{metrics.co2_avoided_tonnes}t</span>
        <span className="text-os-slate text-[9px]">CO₂</span>
        <span className="text-os-void">|</span>
        <span className="text-os-signal">⛽</span>
        <span className="font-bold text-white">{(metrics.fuel_saved_liters / 1000).toFixed(1)}k</span>
      </div>
    </>
  );
};
