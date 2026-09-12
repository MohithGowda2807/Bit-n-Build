import React, { useState } from 'react';
import { ImpactMetricsBar } from './ImpactMetricsBar';
import { DemoScenarioSwitcher } from './DemoScenarioSwitcher';
import { ReportExportModal } from '../reports/ReportExportModal';

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
}

export const TopBar: React.FC<TopBarProps> = ({ domain, onDomainChange, subtitle, live, counters = [], action }) => {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <>
      <header className="h-14 flex items-center justify-between px-6 bg-os-deep/95 backdrop-blur-md border-b border-os-border/80 shrink-0 z-50">
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v18M3 12h18" />
              <circle cx="12" cy="12" r="3" fill="#ffffff" stroke="none" />
            </svg>
          </div>
          <div className="flex flex-col leading-none gap-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">TRITON / OceanSentinel</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold uppercase">Command Center</span>
            </div>
            <span className="os-eyebrow text-os-slate text-[10px]">{subtitle}</span>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-os-void/70 p-1 rounded-full border border-os-border/70" aria-label="Domains">
          {DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => onDomainChange(d.id)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-150 ${
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

        <div className="flex items-center gap-3">
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

          <span
            className={`os-eyebrow flex items-center gap-1.5 px-[7px] py-1 rounded-badge text-white ${
              live ? 'bg-os-clear' : 'bg-os-steel'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-white ${live ? 'os-live-dot' : ''}`} />
            {live ? 'Live' : 'Offline'}
          </span>
          {action}
        </div>
      </header>

      {/* Modal Report */}
      <ReportExportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </>
  );
};

