import React from 'react';
import { Compass, Radio, ShieldCheck, Waves } from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface NavbarProps {
  analytics: AnalyticsSummary | null;
  systemStatus: string;
}

export const Navbar: React.FC<NavbarProps> = ({ analytics, systemStatus }) => {
  return (
    <header className="bg-[#071224]/90 backdrop-blur border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Compass className="h-6 w-6 text-white animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              OCEANSENTINEL
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-700/60 font-mono font-semibold">
              PHASE 1 MVP
            </span>
          </div>
          <p className="text-xs text-slate-400">Autonomous Maritime Logistics & Multi-Agent Intelligence</p>
        </div>
      </div>

      {/* KPI Ticker */}
      <div className="hidden lg:flex items-center space-x-6 text-xs font-mono">
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center space-x-2">
          <Waves className="h-4 w-4 text-cyan-400" />
          <span className="text-slate-400">FLEET:</span>
          <span className="text-white font-bold">{analytics?.total_vessels || 10} VESSELS</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-slate-400">OPTIMIZED:</span>
          <span className="text-emerald-400 font-bold">{analytics?.total_routes_optimized || 0} ROUTES</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center space-x-2">
          <span className="text-slate-400">FUEL SAVED:</span>
          <span className="text-cyan-300 font-bold">ACTIVE</span>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            {systemStatus === 'ok' ? 'System Online' : 'Degraded Mode'}
          </span>
        </div>
      </div>
    </header>
  );
};
