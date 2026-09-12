import React, { useEffect, useRef, useState } from 'react';
import { askAnalyst, fetchAssistantStatus } from '../../services/surveillance';
import { Eyebrow, InfoBadge, Mono, Panel } from '../ui/primitives';
import { renderMarkdownLite } from '../../design/markdownLite';

interface Turn {
  role: 'user' | 'assistant';
  text: string;
  provider?: string;
  model?: string;
  seconds?: number;
  error?: boolean;
}

interface Props {
  initialQuestion?: string;
  onClose: () => void;
}

const SUGGESTIONS = [
  'Which vessels entered closures today?',
  'Show AIS gaps longer than 30 minutes',
  'Which cases are open and why?',
];

export const AnalystPanel: React.FC<Props> = ({ initialQuestion, onClose }) => {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState(initialQuestion ?? '');
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const askedInitial = useRef(false);

  useEffect(() => {
    fetchAssistantStatus().then(s => setConfigured(s.llm_configured)).catch(() => setConfigured(false));
  }, []);

  const ask = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed || busy) return;
    setTurns(t => [...t, { role: 'user', text: trimmed }]);
    setQuestion('');
    setBusy(true);
    const started = performance.now();
    try {
      const r = await askAnalyst(trimmed);
      setTurns(t => [...t, { role: 'assistant', text: r.answer, provider: r.provider, model: r.model, seconds: (performance.now() - started) / 1000 }]);
    } catch (e: any) {
      setTurns(t => [...t, { role: 'assistant', text: e.message || 'The analyst could not answer.', error: true }]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (initialQuestion && !askedInitial.current) { askedInitial.current = true; ask(initialQuestion); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [turns, busy]);

  return (
    <Panel className="w-[440px] h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-medium text-white">Ask the analyst</span>
          <span className="text-xs text-os-ash">Answers only from surveillance data. Never invents observations.</span>
        </div>
        <button onClick={onClose} className="text-os-ash hover:text-white" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M5 5l10 10M15 5L5 15" /></svg>
        </button>
      </div>

      <div className="flex-1 px-6 flex flex-col gap-5 overflow-auto">
        {configured === false && (
          <span className="text-sm text-os-fog">No LLM provider is configured on the backend. Set GEMINI_API_KEY, GROQ_API_KEY or OPENROUTER_API_KEY to enable the analyst.</span>
        )}
        {turns.map((t, i) => t.role === 'user' ? (
          <div key={i} className="flex justify-end">
            <span className="max-w-[320px] text-[15px] font-medium leading-normal text-os-fog px-4 py-3 bg-os-overlay rounded-[12px_12px_4px_12px]">{t.text}</span>
          </div>
        ) : (
          <div key={i} className="flex flex-col gap-2.5">
            <div className="text-[15px] leading-relaxed" style={{ color: t.error ? '#f0483e' : '#a0aaba' }}>{renderMarkdownLite(t.text, { monoNumbers: true })}</div>
            {t.provider && (
              <div className="flex items-center gap-2.5">
                <InfoBadge>{t.provider}</InfoBadge>
                <Mono className="text-[11px] text-os-slate">{t.model}{t.seconds ? ` · ${t.seconds.toFixed(1)} s` : ''}</Mono>
              </div>
            )}
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-os-signal os-live-dot" />
            <Eyebrow>Reading the evidence</Eyebrow>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 pt-4 pb-6 flex flex-col gap-3">
        {turns.length === 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => ask(s)} className="text-xs font-medium text-os-fog border border-os-pewter hover:text-white px-3 py-1 rounded-pill">{s}</button>
            ))}
          </div>
        )}
        <form className="flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-input bg-os-raised border border-os-pewter focus-within:border-os-silver"
          onSubmit={e => { e.preventDefault(); ask(question); }}>
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask about a vessel, zone, gap or case…"
            className="flex-1 bg-transparent text-[15px] text-white placeholder:text-os-slate focus:outline-none"
            disabled={busy || configured === false}
          />
          <button type="submit" disabled={busy || !question.trim()} aria-label="Ask"
            className="w-9 h-9 rounded-pill bg-os-signal hover:bg-os-signal-hover disabled:bg-os-steel flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#ffffff" strokeWidth="1.5"><path d="M8 13V3M3 8l5-5 5 5" /></svg>
          </button>
        </form>
      </div>
    </Panel>
  );
};
