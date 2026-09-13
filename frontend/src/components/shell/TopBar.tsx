import React, { useEffect, useState } from 'react';
import { ROLES, ROLE_LABEL, Role } from '../../design/roles';
import { ImpactMetricsBar } from './ImpactMetricsBar';
import { DemoScenarioSwitcher } from './DemoScenarioSwitcher';
import { ReportExportModal } from '../reports/ReportExportModal';
import { API_BASE } from '../../services/api';
import { fetchSessionPolicy } from '../../services/surveillance';
import { session } from '../../services/session';
import { SignInDialog } from './SignInDialog';
import { Eyebrow, GhostLink, Mono, OutlinePill, Panel, PrimaryPill } from '../ui/primitives';

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
  role: Role;
  onRoleChange: (role: Role) => void;
  onGoToLanding?: () => void;
}

const API_URL_KEY = 'triton_api_url';

/** Lets a deployed build point at another backend; the URL is kept in this browser only. */
const ConnectionDialog: React.FC<{ live: boolean; onClose: () => void }> = ({ live, onClose }) => {
  const [url, setUrl] = useState(API_BASE);
  const save = (value: string | null) => {
    try {
      if (value && value.trim()) localStorage.setItem(API_URL_KEY, value.trim());
      else localStorage.removeItem(API_URL_KEY);
    } catch { /* private mode */ }
    window.location.reload();
  };
  return (
    <div className="fixed inset-0 z-[2000] bg-os-void/80 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-md p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-white">Backend connection</span>
          <Mono className={`text-xs ${live ? 'text-os-clear' : 'text-risk-moderate'}`}>{live ? 'connected' : 'not reachable'}</Mono>
        </div>
        <div className="flex flex-col gap-1.5">
          <Eyebrow>Current API endpoint</Eyebrow>
          <Mono className="text-xs text-os-fog break-all px-3 py-2 rounded-input bg-os-raised">{API_BASE || '(same origin)'}</Mono>
        </div>
        <div className="flex flex-col gap-1.5">
          <Eyebrow>Custom backend URL</Eyebrow>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://your-backend.onrender.com"
            className="os-mono bg-os-raised text-white text-sm border border-os-pewter rounded-input px-3 py-2 focus:outline-none focus:border-os-silver placeholder:text-os-slate"
          />
          <span className="text-xs text-os-ash">Leave blank to use the build's default. The page reloads after saving.</span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <OutlinePill onClick={() => save(null)}>Reset default</OutlinePill>
          <PrimaryPill onClick={() => save(url)}>Save and reconnect</PrimaryPill>
        </div>
      </Panel>
    </div>
  );
};

export const TopBar: React.FC<TopBarProps> = ({
  domain, onDomainChange, subtitle, live, counters = [], action, role, onRoleChange, onGoToLanding,
}) => {
  const [reportOpen, setReportOpen] = useState(false);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(session.signedIn);
  const [headerAllowed, setHeaderAllowed] = useState(true);

  useEffect(() => {
    fetchSessionPolicy().then(p => setHeaderAllowed(p.role_header_allowed)).catch(() => {});
    return session.subscribe(() => setSignedIn(session.signedIn));
  }, []);

  const signOut = () => { session.signOut(); onRoleChange(session.role); };

  return (
    <>
      <header className="h-14 flex items-center justify-between gap-4 px-5 bg-os-void shrink-0">
        <button onClick={onGoToLanding} className="flex items-center gap-3 shrink-0 text-left" title={onGoToLanding ? 'Back to the landing page' : undefined}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18M3 12h18" />
            <circle cx="12" cy="12" r="3" fill="#007afc" stroke="none" />
          </svg>
          <div className="flex flex-col leading-none gap-1">
            <span className="text-[15px] font-bold text-white tracking-tight">OceanSentinel</span>
            <span className="os-eyebrow text-os-slate truncate max-w-[220px]">{subtitle}</span>
          </div>
        </button>

        <nav className="flex items-center gap-1 shrink-0" aria-label="Domains">
          {DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => onDomainChange(d.id)}
              className={`text-sm font-medium px-4 py-2 rounded-pill transition-colors whitespace-nowrap ${
                domain === d.id ? 'bg-os-signal text-white' : 'text-os-fog hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </nav>

        <ImpactMetricsBar />

        <div className="flex items-center gap-3 shrink-0">
          {counters.length > 0 && (
            <div className="os-mono flex items-center gap-4 text-xs text-os-ash">
              {counters.map(c => (
                <span key={c.label} className={c.tone === 'critical' ? 'text-risk-critical' : ''}>
                  {c.value} <span className="text-os-slate">{c.label}</span>
                </span>
              ))}
            </div>
          )}
          <DemoScenarioSwitcher onNavigateDomain={dom => onDomainChange(dom as Domain)} />
          <GhostLink className="text-[13px]" onClick={() => setReportOpen(true)} title="Generate the executive briefing">Briefing</GhostLink>
          {onGoToLanding && <GhostLink className="text-[13px]" onClick={onGoToLanding} title="Back to the landing page">Portal</GhostLink>}
          {(headerAllowed || signedIn) && (
            <label className="flex items-center gap-2" title={signedIn ? 'Role comes from your account' : 'Dev shortcut: role sent with every request; the API enforces it'}>
              <span className="os-eyebrow text-os-slate">Role</span>
              <select
                value={role}
                disabled={signedIn}
                onChange={e => onRoleChange(e.target.value as Role)}
                className="os-mono text-xs bg-os-raised text-os-fog border border-os-pewter rounded-input px-2 py-1 focus:outline-none focus:border-os-silver disabled:opacity-70"
              >
                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              </select>
            </label>
          )}
          {signedIn ? (
            <button onClick={signOut} className="os-mono text-xs text-os-fog hover:text-white" title="Sign out">
              {session.user} · <span className="text-os-signal">Sign out</span>
            </button>
          ) : (
            <GhostLink className="text-[13px]" onClick={() => setSignInOpen(true)}>Sign in</GhostLink>
          )}
          <button
            onClick={() => setConnectionOpen(true)}
            title="Backend connection"
            className={`os-eyebrow flex items-center gap-1.5 px-[7px] py-1 rounded-badge text-white ${live ? 'bg-os-clear' : 'bg-os-steel'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-white ${live ? 'os-live-dot' : ''}`} />
            {live ? 'Live' : 'Offline'}
          </button>
          {action}
        </div>
      </header>

      {connectionOpen && <ConnectionDialog live={live} onClose={() => setConnectionOpen(false)} />}
      {signInOpen && <SignInDialog onClose={() => setSignInOpen(false)} onSignedIn={onRoleChange} />}
      <ReportExportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
};
