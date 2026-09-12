import React, { useState } from 'react';
import { Vessel, OrchestratorResponse, AgentFinding, HumanApprovalResponse } from '../types';
import { dispatchOrchestrator, triggerAisSimulation, submitHumanDecision } from '../services/api';
import {
  Bot,
  Send,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Waves,
  Compass,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AgentTraceVisualizer } from './agents/AgentTraceVisualizer';


interface AgentOrchestratorConsoleProps {
  vessels: Vessel[];
  selectedVessel: Vessel | null;
  onRefreshTelemetry?: () => void;
}

const PRESET_QUERIES = [
  "Assess navigation safety & MPA compliance for active vessel",
  "Scan fleet for speed violations, drift, and dark vessel anomalies",
  "Evaluate marine debris collision hazards along current corridor",
  "Inspect hydrodynamic efficiency and weather routing constraints"
];

export const AgentOrchestratorConsole: React.FC<AgentOrchestratorConsoleProps> = ({
  vessels,
  selectedVessel,
  onRefreshTelemetry
}) => {
  const [query, setQuery] = useState(PRESET_QUERIES[0]);
  const [targetVesselId, setTargetVesselId] = useState<number | undefined>(selectedVessel?.id);
  const [loading, setLoading] = useState(false);
  const [simulatingAis, setSimulatingAis] = useState(false);
  const [result, setResult] = useState<OrchestratorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Human approval state
  const [approvalSubmitting, setApprovalSubmitting] = useState(false);
  const [approvalReceipt, setApprovalReceipt] = useState<HumanApprovalResponse | null>(null);

  // Sync selected vessel if changed externally
  React.useEffect(() => {
    if (selectedVessel) {
      setTargetVesselId(selectedVessel.id);
    }
  }, [selectedVessel]);

  const handleDispatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setApprovalReceipt(null);
    try {
      const response = await dispatchOrchestrator({
        query: query.trim(),
        vessel_id: targetVesselId,
        context: {
          timestamp: new Date().toISOString(),
          operator: "TRITON-Command-Station-01"
        }
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch mission to Orchestrator');
    } finally {
      setLoading(false);
    }
  };

  const handleHumanDecision = async (decision: 'approve' | 'replan' | 'reject') => {
    if (!result) return;
    setApprovalSubmitting(true);
    try {
      const receipt = await submitHumanDecision({
        mission_id: result.mission_id,
        decision,
        action_notes: `Operator decision executed from TRITON Command Console`
      });
      setApprovalReceipt(receipt);
      setResult(prev => prev ? {
        ...prev,
        approval_status: receipt.approval_status
      } : null);
      if (onRefreshTelemetry) onRefreshTelemetry();
    } catch (err: any) {
      setError(err.message || `Failed to submit human approval decision: ${decision}`);
    } finally {
      setApprovalSubmitting(false);
    }
  };

  const handleSimulateAisTick = async () => {
    setSimulatingAis(true);
    try {
      await triggerAisSimulation();
      if (onRefreshTelemetry) onRefreshTelemetry();
    } catch (err: any) {
      setError(err.message || 'AIS tick simulation failed');
    } finally {
      setSimulatingAis(false);
    }
  };

  const getAgentIcon = (name: string) => {
    if (name.includes("Vessel Watch")) return <Compass className="w-4 h-4 text-cyan-400" />;
    if (name.includes("Route Planner")) return <Waves className="w-4 h-4 text-indigo-400" />;
    if (name.includes("Debris Sentinel")) return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    if (name.includes("Compliance")) return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    return <Bot className="w-4 h-4 text-cyan-400" />;
  };

  const getRiskBadge = (level: string) => {
    const l = level.toLowerCase();
    if (l === 'high' || l === 'critical') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">RISK: {level.toUpperCase()}</span>;
    }
    if (l === 'medium') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">MODERATE</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">NOMINAL</span>;
  };

  // Group findings into Specialist Agents and Compliance Report Agent
  const specialistFindings = result?.agent_findings.filter(f => !f.agent_name.includes("Compliance")) || [];
  const complianceFinding = result?.agent_findings.find(f => f.agent_name.includes("Compliance"));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl text-slate-100 flex flex-col space-y-4">
      {/* Header & Flowchart */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-cyan-600/30 to-blue-600/30 text-cyan-400 rounded-lg border border-cyan-500/40 shadow-lg shadow-cyan-950">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-cyan-100 tracking-wide uppercase">ASK TRITON</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Natural Language Maritime AI
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous Orchestrator &bull; 4 Specialist Agents &bull; Human Approval Gate</p>
          </div>
        </div>

        {/* Live Architecture Flowchart Pipeline Pills */}
        <div className="hidden xl:flex items-center space-x-1.5 text-[10px] font-mono bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
          <span className="text-cyan-300 font-semibold">ASK TRITON</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-300">ORCHESTRATOR</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-indigo-300">3 AGENTS</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-emerald-300">COMPLIANCE REPORT</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-amber-300">HUMAN APPROVAL</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-purple-300">ACTION / REPLAN</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSimulateAisTick}
            disabled={simulatingAis}
            title="Advance vessels by 1 kinematic step and push over WebSocket"
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-mono border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${simulatingAis ? 'animate-spin' : ''}`} />
            <span>Simulate AIS Tick</span>
          </button>
        </div>
      </div>

      {/* Interactive Query Input */}
      <form onSubmit={handleDispatch} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="md:col-span-3 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask TRITON: Enter natural language directive (e.g., 'Evaluate collision hazards and sanctuary compliance for MV Ocean Star')..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-inner"
            />
            <Sparkles className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
          <div>
            <select
              value={targetVesselId || ''}
              onChange={(e) => setTargetVesselId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="">Target: Fleet Wide</option>
              {vessels.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.vessel_type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preset Prompt Pills */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] text-slate-500 font-mono">Quick Missions:</span>
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setQuery(preset)}
              className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
            >
              {preset.slice(0, 38)}...
            </button>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="ml-auto px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-900/40 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Orchestrating...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Ask TRITON</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-700/60 rounded-lg text-xs text-rose-300 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Orchestrator & Multi-Agent Execution Results */}
      {result && (
        <div className="space-y-3 pt-2 border-t border-slate-800 animate-fadeIn">
          {/* Master Directive Card */}
          <div className="p-3 bg-slate-950/80 border border-cyan-500/40 rounded-lg">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-cyan-400 font-bold">MISSION ID: {result.mission_id}</span>
                <span className="px-1.5 py-0.2 bg-cyan-900/60 text-cyan-200 text-[10px] rounded font-mono">STATUS: {result.status.toUpperCase()}</span>
                {result.requires_human_approval && (
                  <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] rounded font-mono font-bold animate-pulse">
                    APPROVAL REQUIRED
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1 text-slate-400 text-[11px] font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{result.execution_time_ms} ms</span>
              </div>
            </div>

            <div className="mt-2">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Orchestrator Synthesis:</div>
              <p className="text-sm font-mono text-cyan-100 mt-1 font-medium bg-slate-900/60 p-2 rounded border border-slate-800">
                {result.orchestrator_decision}
              </p>
            </div>

            {result.recommendations.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Directives & Recommendations:</div>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs font-mono text-slate-300 flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 3 Parallel Specialist Agents */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Parallel Specialist Agent Telemetry (3 Active):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {specialistFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-lg space-y-1.5 transition flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        {getAgentIcon(finding.agent_name)}
                        <span className="font-bold text-xs text-slate-200">{finding.agent_name}</span>
                      </div>
                      {getRiskBadge(finding.risk_level)}
                    </div>
                    <div className="text-[11px] text-slate-400 italic">{finding.role}</div>
                    <p className="text-xs font-mono text-slate-300 bg-slate-900/40 p-1.5 rounded border border-slate-800/60">
                      {finding.summary}
                    </p>
                  </div>
                  {finding.details && Object.keys(finding.details).length > 0 && (
                    <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                      {Object.entries(finding.details).slice(0, 3).map(([k, v]) => (
                        <span key={k} className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
                          {k.replace(/_/g, ' ')}: <strong className="text-cyan-300">{String(v)}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Report Agent (Synthesis Gate) */}
          {complianceFinding && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/40 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-xs text-emerald-200 uppercase tracking-wide">
                    {complianceFinding.agent_name} (Multi-Agent Regulatory Synthesis)
                  </span>
                </div>
                {getRiskBadge(complianceFinding.risk_level)}
              </div>
              <p className="text-xs font-mono text-emerald-100/90 bg-slate-900/60 p-2 rounded border border-emerald-500/20">
                {complianceFinding.summary}
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-emerald-300/80">
                <span>MPAs Monitored: <strong>{complianceFinding.details?.monitored_restricted_zones || 5}</strong></span>
                <span>&bull;</span>
                <span>Environmental Compliance: <strong>{complianceFinding.details?.environmental_compliance || '100%'}</strong></span>
                <span>&bull;</span>
                <span>IMO Tier: <strong>{complianceFinding.details?.imo_emission_tier || 'Tier III Compliant'}</strong></span>
              </div>
            </div>
          )}

          {/* Autonomous Multi-Agent Execution Tree & Domain Impact */}
          <AgentTraceVisualizer
            traces={(result as any).agent_traces}
            domainImpact={(result as any).domain_impact}
          />

          {/* HUMAN APPROVAL & ACTION / REPLAN SECTION */}
          <div className="p-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 rounded-lg shadow-lg space-y-2.5">

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs text-amber-200 uppercase tracking-wider">
                  Human Approval & Mission Dispatch Gate
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                result.approval_status === 'action_executed'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : result.approval_status === 'replan_requested'
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  : result.requires_human_approval
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                STATUS: {result.approval_status?.replace(/_/g, ' ') || 'AUTO CLEARED'}
              </span>
            </div>

            {/* Proposed Action description */}
            <div className="text-xs font-mono text-slate-300 bg-slate-950/70 p-2.5 rounded border border-slate-800 flex items-start space-x-2">
              <span className="text-amber-400 font-bold shrink-0">PROPOSED ACTION:</span>
              <span className="text-slate-200 font-medium">
                {result.proposed_action || "Continue nominal voyage plan under active telemetry monitoring."}
              </span>
            </div>

            {/* Interactive Approval Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="text-[11px] font-mono text-slate-400">
                {approvalReceipt ? (
                  <span className="text-emerald-300 flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{approvalReceipt.action_result}</span>
                  </span>
                ) : result.requires_human_approval ? (
                  <span className="text-amber-300">Operator sign-off requested before dispatching fleet directives.</span>
                ) : (
                  <span className="text-emerald-300">All checks nominal. Autonomous execution cleared.</span>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-auto">
                <button
                  type="button"
                  disabled={approvalSubmitting || result.approval_status === 'action_executed'}
                  onClick={() => handleHumanDecision('replan')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono rounded-lg border border-amber-500/30 transition flex items-center space-x-1.5 disabled:opacity-40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Replan</span>
                </button>

                <button
                  type="button"
                  disabled={approvalSubmitting || result.approval_status === 'action_executed'}
                  onClick={() => handleHumanDecision('approve')}
                  className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold rounded-lg shadow-lg shadow-emerald-950 transition flex items-center space-x-1.5 disabled:opacity-40"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{approvalSubmitting ? "Executing..." : "Approve Action"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

