import React, { useState } from 'react';
import { ImpactMetricsBar } from './ImpactMetricsBar';
import { DemoScenarioSwitcher } from './DemoScenarioSwitcher';
import { ReportExportModal } from '../reports/ReportExportModal';

import { API_BASE } from '../../services/api';

export type Domain = 'logistics' | 'environment' | 'surveillance' | 'cleanup' | 'agents';

const DOMAINS: { id: Domain; label: string }[] = [
  { id: 'logistics', label: 'Logistics' },
  { id: 'environment', label: 'Environment' },
  { id: 'surveillance', label: 'Surveillance' },
  { id: 'cleanup', label: 'Autonomous Fleet' },
  { id: 'agents', label: 'Ask TRITON' },
];

interface TopBarProps {
  domain: Domain;
  onDomainChange: (domain: Domain) => void;
  subtitle: string;
  live: boolean;
  counters?: { label: string; value: number | string; tone?: 'critical' }[];
  action?: React.ReactNode;
  onGoToLanding?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ domain, onDomainChange, subtitle, live, counters = [], action, onGoToLanding }) => {
  const [reportOpen, setReportOpen] = useState(false);
  const [connModalOpen, setConnModalOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState(API_BASE);

  const handleSaveApiUrl = () => {
    if (customUrl.trim()) {
      localStorage.setItem('triton_api_url', customUrl.trim());
    } else {
      localStorage.removeItem('triton_api_url');
    }
    window.location.reload();
  };

  return (
    <>
      <header className="h-14 flex items-center justify-between px-3 sm:px-4 bg-os-deep/95 backdrop-blur-md border-b border-os-border/80 shrink-0 z-50">
        <div
          onClick={onGoToLanding}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer group select-none"
          title="Return to TRITON Main Landing Portal"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 group-hover:scale-105 transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v18M3 12h18" />
              <circle cx="12" cy="12" r="3" fill="#ffffff" stroke="none" />
            </svg>
          </div>
          <div className="flex flex-col leading-none gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-cyan-400 transition">TRITON</span>
              <span className="hidden md:inline text-xs font-medium text-slate-400">/ OceanSentinel</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold uppercase">Command Center</span>
            </div>
            <span className="os-eyebrow text-os-slate text-[10px] truncate max-w-[180px] sm:max-w-none">{subtitle}</span>
          </div>
        </div>

        <nav className="flex items-center gap-0.5 bg-os-void/70 p-0.5 rounded-full border border-os-border/70 shrink-0" aria-label="Domains">
          {DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => onDomainChange(d.id)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-150 whitespace-nowrap ${
                domain === d.id
                  ? 'bg-os-signal text-white shadow-md shadow-blue-600/30'
                  : 'text-os-fog hover:text-white hover:bg-white/5'
              }`}
            >
              {d.label}
            </button>
          ))}
        </nav>

        {/* Live Sustainability Impact Metrics Ticker */}
        <ImpactMetricsBar />

        <div className="flex items-center gap-2.5 shrink-0">
          {/* 1-Click Demo Scenario Switcher */}
          <DemoScenarioSwitcher
            onNavigateDomain={(dom) => onDomainChange(dom as Domain)}
          />

          {/* Printable Executive Briefing Trigger */}
          <button
            onClick={() => setReportOpen(true)}
            className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-[11px] font-mono transition flex items-center gap-1 cursor-pointer"
            title="Generate Executive Tactical Intelligence Briefing"
          >
            <span>📑</span>
            <span className="hidden sm:inline">Briefing</span>
          </button>

          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className="px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-[11px] font-mono transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Return to TRITON Public Landing Page & Simulator"
            >
              <span>🌐</span>
              <span className="hidden xl:inline font-bold">Portal</span>
            </button>
          )}

          <button
            onClick={() => setConnModalOpen(true)}
            className={`os-eyebrow flex items-center gap-1.5 px-[8px] py-1 rounded-full text-white cursor-pointer transition hover:opacity-90 ${
              live ? 'bg-emerald-600/80 hover:bg-emerald-500' : 'bg-amber-600/80 hover:bg-amber-500'
            }`}
            title="Click to view or configure Backend API Connection"
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-white ${live ? 'os-live-dot' : 'animate-ping'}`} />
            <span>{live ? 'Live' : 'Offline / Seed'}</span>
          </button>
          {action}
        </div>
      </header>

      {/* Backend Connection Modal */}
      {connModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📡</span>
                <h3 className="font-bold text-white text-sm">TRITON Cloud Backend Link</h3>
              </div>
              <button
                onClick={() => setConnModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-slate-400 block mb-1">Current Backend API Endpoint:</span>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-cyan-400 break-all select-all font-semibold">
                  {API_BASE || '(Relative root / Self-hosted)'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Connection State:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${live ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                  {live ? '● Connected (Live Uvicorn API)' : '⚠️ Booting / Standby (Seed Data Active)'}
                </span>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Custom Backend URL (Render or Local):
                </label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://your-backend.onrender.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Paste your active Render web service URL or keep blank for auto-discovery.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    localStorage.removeItem('triton_api_url');
                    window.location.reload();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                >
                  Reset Default
                </button>
                <button
                  onClick={handleSaveApiUrl}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition cursor-pointer"
                >
                  Save & Reconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Report */}
      <ReportExportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </>
  );
};

