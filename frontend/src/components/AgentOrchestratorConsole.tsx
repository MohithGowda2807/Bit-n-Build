import React, { useState } from 'react';
import { Vessel, OrchestratorResponse, AgentFinding } from '../types';
import { dispatchOrchestrator, triggerAisSimulation } from '../services/api';
import { Bot, Send, ShieldAlert, CheckCircle2, Clock, Waves, Compass, AlertTriangle, RefreshCw } from 'lucide-react';

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
    return <ShieldAlert className="w-4 h-4 text-emerald-400" />;
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

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl text-slate-100 flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-cyan-600/20 text-cyan-400 rounded-lg border border-cyan-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-cyan-100 tracking-wide uppercase">TRITON Multi-Agent Orchestrator</h3>
            <p className="text-xs text-slate-400">Autonomous CrewAI Coordinator & Specialist Agents</p>
          </div>
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
          <div className="md:col-span-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter operational directive for TRITON Orchestrator..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
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
                <span>Dispatch Mission</span>
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

      {/* Orchestrator & 4 Agents Execution HUD */}
      {result && (
        <div className="space-y-3 pt-2 border-t border-slate-800 animate-fadeIn">
          {/* Master Directive Card */}
          <div className="p-3 bg-slate-950/80 border border-cyan-500/40 rounded-lg">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-cyan-400 font-bold">MISSION ID: {result.mission_id}</span>
                <span className="px-1.5 py-0.2 bg-cyan-900/60 text-cyan-200 text-[10px] rounded font-mono">STATUS: {result.status.toUpperCase()}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-400 text-[11px] font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{result.execution_time_ms} ms</span>
              </div>
            </div>

            <div className="mt-2">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Orchestrator Directive:</div>
              <p className="text-sm font-mono text-cyan-100 mt-1 font-medium bg-slate-900/60 p-2 rounded border border-slate-800">
                {result.orchestrator_decision}
              </p>
            </div>

            {result.recommendations.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Recommendations:</div>
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

          {/* 4 Agent Finding Cards */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Specialist Agent Reports (4 Active):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {result.agent_findings.map((finding, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-lg space-y-1.5 transition"
                >
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
                  {finding.details && Object.keys(finding.details).length > 0 && (
                    <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-400 pt-1">
                      {Object.entries(finding.details).map(([k, v]) => (
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
        </div>
      )}
    </div>
  );
};
