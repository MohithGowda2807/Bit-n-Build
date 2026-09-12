import React from 'react';

interface ReportData {
  reportId: string;
  title: string;
  category: string;
  classification: string;
  generatedAt: string;
  incidentLocation?: string;
  primaryEntity?: string;
  executiveSummary: string;
  agentFindings: Array<{
    agent: string;
    domain: string;
    summary: string;
    confidence: number;
  }>;
  environmentalImpact: {
    co2SavedTonnes?: number;
    debrisClearedKg?: number;
    mpaProtected?: string;
    complianceStatus?: string;
  };
  signOff: {
    authorizingOfficer: string;
    clearanceLevel: string;
    timestamp: string;
    status: 'AUTHORIZED' | 'PENDING' | 'OVERRIDDEN';
  };
}

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Partial<ReportData>;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen) return null;

  const defaultData: ReportData = {
    reportId: data?.reportId || `TRITON-EXEC-REP-${Date.now().toString().slice(-6)}`,
    title: data?.title || 'Maritime Multi-Agent Tactical Assessment & Mission Authorization',
    category: data?.category || 'Autonomous Environmental Preservation & Law Enforcement',
    classification: data?.classification || 'CONFIDENTIAL // MARITIME WATCH',
    generatedAt: data?.generatedAt || new Date().toUTCString(),
    incidentLocation: data?.incidentLocation || 'Arabian Sea / Lakshadweep Coral Reserve (10.42°N, 72.15°E)',
    primaryEntity: data?.primaryEntity || 'Cluster DEB-LAK-001 (1,450 kg Ghost Net) & ASV SeaSweeper-Alpha',
    executiveSummary: data?.executiveSummary ||
      'Multi-agent sensor fusion corroborated severe ecological threat from an abandoned monofilament ghost net drifting at 1.6kt toward the Lakshadweep Coral Sanctuary. Autonomous 2-Opt Vehicle Routing heuristics scheduled intercept sortie with zero human life exposure and 100% UNCLOS compliance.',
    agentFindings: data?.agentFindings || [
      {
        agent: 'Debris Sentinel Agent',
        domain: 'Preservation',
        summary: 'Hydrodynamic leeway modeling predicts coral reef collision in 7.2 hours. Target mass: 1,450 kg.',
        confidence: 0.96
      },
      {
        agent: 'Autonomous Cleanup Agent',
        domain: 'Logistics / Fleet',
        summary: 'Allocated SeaSweeper-Alpha with acoustic cutters. Sortie energy demand: 38.5 kWh.',
        confidence: 0.94
      },
      {
        agent: 'Compliance Agent',
        domain: 'Regulatory',
        summary: 'Fully compliant with IMO MARPOL Annex V and Indian Wildlife Protection Act.',
        confidence: 0.98
      }
    ],
    environmentalImpact: {
      co2SavedTonnes: data?.environmentalImpact?.co2SavedTonnes || 8.4,
      debrisClearedKg: data?.environmentalImpact?.debrisClearedKg || 1450,
      mpaProtected: data?.environmentalImpact?.mpaProtected || 'Lakshadweep Coral Reserve',
      complianceStatus: data?.environmentalImpact?.complianceStatus || 'FULL MARITIME COMPLIANCE'
    },
    signOff: {
      authorizingOfficer: data?.signOff?.authorizingOfficer || 'Command Officer (Human-in-the-Loop)',
      clearanceLevel: data?.signOff?.clearanceLevel || 'Level 4 Tactical Commander',
      timestamp: data?.signOff?.timestamp || new Date().toISOString(),
      status: data?.signOff?.status || 'AUTHORIZED'
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col font-mono text-slate-200">
        {/* Header Toolbar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 font-bold text-sm">TRITON COMMAND SYSTEM</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-400">Executive Intelligence Briefing</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>🖨️</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 bg-slate-950 text-slate-300">
          {/* Document Header Banner */}
          <div className="border-b-2 border-cyan-500 pb-4 flex items-start justify-between">
            <div>
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                {defaultData.classification}
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight mt-1 font-sans">
                {defaultData.title}
              </h1>
              <div className="text-xs text-slate-400 mt-1">
                Category: {defaultData.category}
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div>REPORT: <span className="text-white font-bold">{defaultData.reportId}</span></div>
              <div className="text-[11px] text-slate-500 mt-0.5">{defaultData.generatedAt}</div>
            </div>
          </div>

          {/* Operational Context Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Location / Sector</span>
              <span className="text-slate-200 font-bold">{defaultData.incidentLocation}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Target Entity & Assets</span>
              <span className="text-cyan-300 font-bold">{defaultData.primaryEntity}</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
              1. Executive Overview & Mission Mandate
            </h2>
            <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
              {defaultData.executiveSummary}
            </p>
          </div>

          {/* Multi-Agent Corroborated Findings */}
          <div>
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              2. Autonomous Multi-Agent Corroborated Findings
            </h2>
            <div className="space-y-2">
              {defaultData.agentFindings.map((f, i) => (
                <div key={i} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl text-xs flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{f.agent}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {f.domain}
                      </span>
                    </div>
                    <div className="text-slate-400 font-sans text-xs pt-1">{f.summary}</div>
                  </div>
                  <div className="text-right text-[11px] text-emerald-400 font-bold shrink-0 ml-4">
                    {Math.round(f.confidence * 100)}% Conf.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental & Decarbonization Impact */}
          <div>
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              3. Environmental Shield & Decarbonization Metrics
            </h2>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase">CO2 AVOIDED</div>
                <div className="text-base font-bold text-emerald-400">{defaultData.environmentalImpact.co2SavedTonnes}t</div>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase">DEBRIS TARGET</div>
                <div className="text-base font-bold text-amber-400">{defaultData.environmentalImpact.debrisClearedKg?.toLocaleString()} kg</div>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase">MPA SHIELD</div>
                <div className="text-xs font-bold text-cyan-300 truncate">{defaultData.environmentalImpact.mpaProtected}</div>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase">COMPLIANCE</div>
                <div className="text-[11px] font-bold text-emerald-400">100% MARPOL</div>
              </div>
            </div>
          </div>

          {/* Authorization & Sign-off Stamp */}
          <div className="p-4 border border-cyan-500/40 bg-cyan-950/20 rounded-xl flex items-center justify-between">
            <div className="space-y-1 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <span>🛡️</span>
                <span>Human-in-the-Loop Sign-Off Stamp</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Authorized By: <span className="text-slate-200 font-semibold">{defaultData.signOff.authorizingOfficer}</span> ({defaultData.signOff.clearanceLevel})
              </div>
              <div className="text-slate-500 text-[10px]">
                Timestamp: {defaultData.signOff.timestamp}
              </div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold text-xs uppercase tracking-widest">
              ✓ {defaultData.signOff.status}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-xs text-slate-500">
          <span>TRITON / OceanSentinel Autonomous Marine Intelligence Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
