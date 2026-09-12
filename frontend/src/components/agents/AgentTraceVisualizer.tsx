import React, { useState } from 'react';

export interface AgentTraceStep {
  step?: number;
  agent_name: string;
  action: string;
  thought?: string;
  reasoning?: string;
  observation?: string;
  duration_ms?: number;
  domain?: 'logistics' | 'surveillance' | 'preservation' | 'compliance' | 'orchestrator';
}

interface AgentTraceVisualizerProps {
  traces?: AgentTraceStep[];
  domainImpact?: {
    logistics?: { fuel_saved_liters?: number; eta_change_hours?: number; safety_score?: number };
    surveillance?: { threat_level?: string; dark_vessels_flagged?: number };
    preservation?: { debris_intercepted_kg?: number; mpa_shielded?: string };
  };
}

const getDomainBadge = (domain?: string, agentName?: string) => {
  const name = (agentName || '').toLowerCase();
  if (name.includes('cleanup') || name.includes('debris') || domain === 'preservation') {
    return { label: 'Preservation', bg: 'bg-emerald-950/60', border: 'border-emerald-500/50', text: 'text-emerald-300', icon: '🌿' };
  }
  if (name.includes('surveillance') || name.includes('vessel watch') || name.includes('anomaly') || domain === 'surveillance') {
    return { label: 'Surveillance', bg: 'bg-amber-950/60', border: 'border-amber-500/50', text: 'text-amber-300', icon: '🛰️' };
  }
  if (name.includes('compliance') || name.includes('auditor') || domain === 'compliance') {
    return { label: 'Compliance', bg: 'bg-purple-950/60', border: 'border-purple-500/50', text: 'text-purple-300', icon: '⚖️' };
  }
  if (name.includes('route') || name.includes('logistics') || domain === 'logistics') {
    return { label: 'Logistics', bg: 'bg-cyan-950/60', border: 'border-cyan-500/50', text: 'text-cyan-300', icon: '🧭' };
  }
  return { label: 'Commander', bg: 'bg-blue-950/60', border: 'border-blue-500/50', text: 'text-blue-300', icon: '👑' };
};

export const AgentTraceVisualizer: React.FC<AgentTraceVisualizerProps> = ({
  traces = [],
  domainImpact
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Fallback default 5-step trace if traces array empty
  const activeTraces: AgentTraceStep[] = traces.length > 0 ? traces : [
    {
      step: 1,
      agent_name: 'Maritime Orchestrator Agent',
      action: 'QUERY_DECOMPOSITION',
      thought: 'Parsing mission query against Arabian Sea maritime graph and active environmental layers.',
      observation: 'Identified Lakshadweep MPA proximity alert and monofilament ghost net cluster #1.',
      duration_ms: 120,
      domain: 'orchestrator'
    },
    {
      step: 2,
      agent_name: 'Debris Sentinel Agent',
      action: 'LEIWAY_DRIFT_COMPUTATION',
      thought: 'Applying hydrodynamic leeway physics: v_drift = 0.03 * v_wind + 1.1 * v_current.',
      observation: '1,450 kg net drifting at 1.6kt heading 84°. Intersects coral reserve boundary in 7.2h.',
      duration_ms: 240,
      domain: 'preservation'
    },
    {
      step: 3,
      agent_name: 'Autonomous Cleanup Specialist',
      action: 'VRP_FLEET_ALLOCATION',
      thought: 'Running 2-Opt Vehicle Routing heuristic across available autonomous surface vessels.',
      observation: 'Assigned SeaSweeper-Alpha (96% battery, 2,000kg capacity) with specialized acoustic net cutters.',
      duration_ms: 310,
      domain: 'preservation'
    },
    {
      step: 4,
      agent_name: 'Route Planner Specialist',
      action: 'WAYPOINT_SAFETY_VALIDATION',
      thought: 'Checking departure corridor against bathymetry, active squalls, and commercial shipping fairways.',
      observation: 'Cleared 3-waypoint corridor. Minimum clearance of 4.2 NM maintained from commercial traffic.',
      duration_ms: 180,
      domain: 'logistics'
    },
    {
      step: 5,
      agent_name: 'Maritime Compliance Agent',
      action: 'REGULATORY_AUDIT',
      thought: 'Cross-referencing UNCLOS Article 194 and Indian Wildlife Protection Act (Schedule I corals).',
      observation: 'Compliant with urgent ecological salvage protocols. Mission flagged for Operator Authorize.',
      duration_ms: 95,
      domain: 'compliance'
    }
  ];

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Domain Impact Ribbon */}
      {domainImpact && (
        <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl">
          <div className="p-2 bg-slate-900/60 rounded-lg">
            <div className="text-[10px] text-cyan-400 font-semibold uppercase flex items-center gap-1">
              <span>🧭</span> Logistics
            </div>
            <div className="text-white font-bold mt-0.5">
              {domainImpact.logistics?.fuel_saved_liters || 840} L saved
            </div>
            <div className="text-[10px] text-slate-400">
              Safety Score: {domainImpact.logistics?.safety_score || 94}/100
            </div>
          </div>

          <div className="p-2 bg-slate-900/60 rounded-lg">
            <div className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
              <span>🌿</span> Preservation
            </div>
            <div className="text-white font-bold mt-0.5">
              {domainImpact.preservation?.debris_intercepted_kg || 1450} kg target
            </div>
            <div className="text-[10px] text-slate-400">
              MPA: {domainImpact.preservation?.mpa_shielded || 'Lakshadweep Reserve'}
            </div>
          </div>

          <div className="p-2 bg-slate-900/60 rounded-lg">
            <div className="text-[10px] text-amber-400 font-semibold uppercase flex items-center gap-1">
              <span>🛰️</span> Surveillance
            </div>
            <div className="text-white font-bold mt-0.5">
              Level: {domainImpact.surveillance?.threat_level || 'ELEVATED'}
            </div>
            <div className="text-[10px] text-slate-400">
              Correlated Anomaly Verified
            </div>
          </div>
        </div>
      )}

      {/* Thought Tree Timeline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase pb-1 border-b border-slate-800">
          <span>Multi-Agent Thought & Execution Tree</span>
          <span className="text-cyan-400">{activeTraces.length} Agent Steps</span>
        </div>

        <div className="space-y-2 pt-1">
          {activeTraces.map((trace, idx) => {
            const isExpanded = expandedIndex === idx;
            const badge = getDomainBadge(trace.domain, trace.agent_name);

            return (
              <div
                key={idx}
                className="border border-slate-800 hover:border-slate-700 bg-slate-950/60 rounded-xl overflow-hidden transition"
              >
                {/* Step Header */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="p-3 cursor-pointer flex items-center justify-between hover:bg-slate-900/40"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] flex items-center justify-center font-bold text-slate-300 shrink-0">
                      {trace.step || idx + 1}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.bg} ${badge.border} ${badge.text} font-bold shrink-0 flex items-center gap-1`}>
                      <span>{badge.icon}</span>
                      <span>{badge.label}</span>
                    </span>
                    <span className="font-bold text-slate-200 truncate">{trace.agent_name}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 text-[10px] text-slate-400">
                    <span className="font-mono text-cyan-400 font-semibold">{trace.action}</span>
                    {trace.duration_ms && <span>{trace.duration_ms}ms</span>}
                    <span className="text-slate-500">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-3 pt-0 border-t border-slate-900 bg-slate-900/30 space-y-2 text-[11px]">
                    {trace.thought && (
                      <div>
                        <span className="text-slate-400 font-semibold uppercase text-[10px]">Thinking:</span>
                        <p className="text-slate-300 font-sans mt-0.5 leading-relaxed bg-slate-950/50 p-2 rounded-lg border border-slate-900">
                          {trace.thought}
                        </p>
                      </div>
                    )}
                    {trace.observation && (
                      <div>
                        <span className="text-emerald-400 font-semibold uppercase text-[10px]">Observation & Finding:</span>
                        <p className="text-emerald-200 font-sans mt-0.5 leading-relaxed bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/40">
                          {trace.observation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
