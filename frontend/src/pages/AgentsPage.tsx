import React, { useEffect, useState } from 'react';
import { Eyebrow, FilterPill, InfoBadge, Mono, OutlinePill, Panel, PrimaryPill, RiskBadge } from '../components/ui/primitives';
import { dispatchOrchestrator, fetchAgentStatus, fetchVessels, submitHumanDecision } from '../services/api';
import { HumanApprovalResponse, OrchestratorResponse, Vessel } from '../types';
import { RiskLevel } from '../design/risk';
import { renderMarkdownLite } from '../design/markdownLite';
import { AgentTraceVisualizer } from '../components/agents/AgentTraceVisualizer';

const PRESETS = [
  'Assess navigation safety and MPA compliance for the active vessel',
  'Scan the fleet for speed violations, drift and dark-vessel anomalies',
  'Evaluate marine debris collision hazards along the current corridor',
  'Deploy autonomous cleanup ASV for Lakshadweep ghost net intercept',
  'Simulate dark trawler rendezvous and chemical slick containment',
  'Why is the highest-risk vessel suspicious right now?',
];


const FINDING_LEVEL: Record<string, RiskLevel> = { low: 'LOW', medium: 'ELEVATED', high: 'HIGH', critical: 'CRITICAL' };

interface AgentInfo { id: string; name: string; role: string; status: string; capabilities: string[] }
interface StatusInfo { framework: string; pipeline?: string[]; orchestrator_agent: { name: string; status: string; role: string }; agents: AgentInfo[] }

export const AgentsPage: React.FC = () => {
  const [status, setStatus] = useState<StatusInfo | null>(null);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [vesselId, setVesselId] = useState<number | undefined>(undefined);
  const [query, setQuery] = useState(PRESETS[0]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<OrchestratorResponse & { assistant_answer?: string | null; assistant_provider?: string | null } | null>(null);
  const [receipt, setReceipt] = useState<HumanApprovalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgentStatus().then(setStatus).catch(() => {});
    fetchVessels().then(v => { setVessels(v); if (v.length) setVesselId(v[0].id); }).catch(() => {});
  }, []);

  const run = async (q = query) => {
    if (!q.trim() || busy) return;
    setBusy(true); setError(null); setReceipt(null);
    try {
      setResult(await dispatchOrchestrator({ query: q, vessel_id: vesselId }));
    } catch (e: any) {
      setError(e.message || 'Orchestration failed');
    } finally {
      setBusy(false);
    }
  };

  const decide = async (decision: 'approve' | 'replan' | 'reject') => {
    if (!result) return;
    setBusy(true);
    try { setReceipt(await submitHumanDecision({ mission_id: result.mission_id, decision })); }
    catch (e: any) { setError(e.message || 'Decision failed'); }
    finally { setBusy(false); }
  };

  const pending = result?.requires_human_approval && !receipt;

  return (
    <div className="flex-1 min-h-0 grid grid-cols-12 gap-4 p-4">
      {/* Roster */}
      <Panel className="col-span-4 p-6 flex flex-col gap-5 overflow-auto">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-medium text-white">Agent roster</span>
          <Mono className="text-xs text-os-slate">{status?.framework ?? 'loading…'}</Mono>
        </div>
        {status && (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 px-3 py-3 rounded-row bg-os-raised shadow-[inset_2px_0_0_#007afc]">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-sm font-medium text-white">{status.orchestrator_agent.name}</span>
                <span className="text-xs text-os-ash">{status.orchestrator_agent.role}</span>
              </div>
              <InfoBadge tone="clear">{status.orchestrator_agent.status}</InfoBadge>
            </div>
            {status.agents.map(a => (
              <div key={a.id} className="flex flex-col gap-2 py-3 border-b border-os-raised last:border-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-white">{a.name}</span>
                  <InfoBadge tone={a.status === 'active' ? 'clear' : 'muted'}>{a.status}</InfoBadge>
                </div>
                <span className="text-xs text-os-ash">{a.role}</span>
                <div className="flex flex-wrap gap-1.5">
                  {a.capabilities.map(c => <Mono key={c} className="text-[11px] text-os-fog px-2 py-0.5 rounded-badge bg-os-raised">{c.replace(/_/g, ' ')}</Mono>)}
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Eyebrow>Phase 3 surveillance crew</Eyebrow>
              <span className="text-xs text-os-ash leading-relaxed">AIS, Fishing, Anomaly and Investigation agents run on Groq, Gemini and OpenRouter with automatic fallback. The Vessel Watch agent above reads their risk engine; questions fall through to the analyst.</span>
            </div>
          </div>
        )}
      </Panel>

      {/* Console */}
      <div className="col-span-8 flex flex-col gap-4 min-h-0">
        <Panel className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-white">Ask TRITON</span>
            <Mono className="text-xs text-os-slate">orchestrator · specialists · compliance · human approval</Mono>
          </div>
          <form className="flex gap-3" onSubmit={e => { e.preventDefault(); run(); }}>
            <input value={query} onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-os-raised text-white text-[15px] border border-os-pewter rounded-input px-4 py-2.5 focus:outline-none focus:border-os-silver placeholder:text-os-slate"
              placeholder="Describe the mission or ask a question…" />
            <select value={vesselId ?? ''} onChange={e => setVesselId(e.target.value ? Number(e.target.value) : undefined)}
              className="bg-os-raised text-white text-sm border border-os-pewter rounded-input px-3 py-2 focus:outline-none w-56">
              <option value="">Fleet wide</option>
              {vessels.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <PrimaryPill type="submit" disabled={busy}>{busy ? 'Running…' : 'Run'}</PrimaryPill>
          </form>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(p => <FilterPill key={p} size="sm" active={query === p} onClick={() => { setQuery(p); run(p); }}>{p}</FilterPill>)}
          </div>
          {error && <span className="text-xs" style={{ color: '#f0483e' }}>{error}</span>}
        </Panel>

        {result && (
          <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
            <Panel className="col-span-7 p-6 flex flex-col gap-4 overflow-auto">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Mono className="text-xs text-os-slate">{result.mission_id}</Mono>
                  <InfoBadge tone={pending ? 'info' : 'muted'}>{(receipt?.approval_status ?? result.approval_status ?? 'auto_cleared').replace(/_/g, ' ')}</InfoBadge>
                </div>
                <Mono className="text-xs text-os-slate">{result.execution_time_ms.toFixed(0)} ms</Mono>
              </div>
              <span className="text-[15px] leading-relaxed text-white font-medium">{result.orchestrator_decision}</span>

              <Eyebrow>Findings</Eyebrow>
              <div className="flex flex-col">
                {result.agent_findings.map((f, i) => (
                  <div key={f.agent_name} className={`flex gap-3 py-3 ${i < result.agent_findings.length - 1 ? 'border-b border-os-raised' : ''}`}>
                    <RiskBadge level={FINDING_LEVEL[f.risk_level] ?? 'LOW'} className="mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-sm font-medium text-white">{f.agent_name}</span>
                      <span className="text-sm text-os-fog leading-relaxed">{f.summary}</span>
                    </div>
                  </div>
                ))}
              </div>

              {result.compliance_report && (
                <>
                  <Eyebrow>Compliance report</Eyebrow>
                  <span className="text-sm text-os-fog leading-relaxed">{result.compliance_report}</span>
                </>
              )}

              {result.assistant_answer && (
                <>
                  <div className="flex items-center gap-2"><Eyebrow>Analyst</Eyebrow>{result.assistant_provider && <InfoBadge>{result.assistant_provider}</InfoBadge>}</div>
                  <div className="text-sm text-os-fog leading-relaxed">{renderMarkdownLite(result.assistant_answer, { monoNumbers: true })}</div>
                </>
              )}

              <div className="pt-2 border-t border-os-raised">
                <AgentTraceVisualizer
                  traces={(result as any).agent_traces}
                  domainImpact={(result as any).domain_impact}
                />
              </div>
            </Panel>


            <Panel className="col-span-5 p-6 flex flex-col gap-4 overflow-auto">
              <span className="text-lg font-medium text-white">Human approval</span>
              {result.proposed_action ? (
                <div className="flex flex-col gap-2">
                  <Eyebrow>Proposed action</Eyebrow>
                  <span className="text-[15px] text-os-fog leading-relaxed">{result.proposed_action}</span>
                </div>
              ) : <span className="text-sm text-os-ash">Nothing to approve. The orchestrator cleared this mission automatically.</span>}
              {result.recommendations.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Eyebrow>Recommendations</Eyebrow>
                  {result.recommendations.map((r, i) => <span key={i} className="text-sm text-os-fog leading-relaxed">· {r}</span>)}
                </div>
              )}
              {pending && (
                <div className="flex gap-2 mt-auto">
                  <PrimaryPill className="flex-1" disabled={busy} onClick={() => decide('approve')}>Approve</PrimaryPill>
                  <OutlinePill className="flex-1" disabled={busy} onClick={() => decide('replan')}>Replan</OutlinePill>
                  <OutlinePill className="flex-1" disabled={busy} onClick={() => decide('reject')}>Reject</OutlinePill>
                </div>
              )}
              {receipt && (
                <div className="flex flex-col gap-1.5 mt-auto px-3 py-3 rounded-row bg-os-raised">
                  <div className="flex items-center gap-2"><InfoBadge tone="clear">{receipt.decision}</InfoBadge><Mono className="text-xs text-os-slate">{receipt.approval_status.replace(/_/g, ' ')}</Mono></div>
                  <span className="text-sm text-os-fog leading-relaxed">{receipt.action_result}</span>
                </div>
              )}
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
};
