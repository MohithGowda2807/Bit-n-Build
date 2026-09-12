import React from 'react';
import { ROLES, ROLE_LABEL, Role } from '../../design/roles';

export type Domain = 'logistics' | 'environment' | 'surveillance' | 'cleanup' | 'agents';

const DOMAINS: { id: Domain; label: string }[] = [
  { id: 'logistics', label: 'Logistics' },
  { id: 'environment', label: 'Environment' },
  { id: 'surveillance', label: 'Surveillance' },
  { id: 'cleanup', label: 'Cleanup' },
  { id: 'agents', label: 'Agents' },
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
}

export const TopBar: React.FC<TopBarProps> = ({ domain, onDomainChange, subtitle, live, counters = [], action, role, onRoleChange }) => (
  <header className="h-14 flex items-center justify-between px-5 bg-os-void shrink-0">
    <div className="flex items-center gap-3">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18M3 12h18" />
        <circle cx="12" cy="12" r="3" fill="#007afc" stroke="none" />
      </svg>
      <div className="flex flex-col leading-none gap-1">
        <span className="text-[15px] font-bold text-white tracking-tight">OceanSentinel</span>
        <span className="os-eyebrow text-os-slate">{subtitle}</span>
      </div>
    </div>

    <nav className="flex items-center gap-1" aria-label="Domains">
      {DOMAINS.map(d => (
        <button
          key={d.id}
          onClick={() => onDomainChange(d.id)}
          className={`text-sm font-medium px-4 py-2 rounded-pill transition-colors ${
            domain === d.id ? 'bg-os-signal text-white' : 'text-os-fog hover:text-white'
          }`}
        >
          {d.label}
        </button>
      ))}
    </nav>

    <div className="flex items-center gap-4">
      {counters.length > 0 && (
        <div className="os-mono flex items-center gap-4 text-xs text-os-ash">
          {counters.map(c => (
            <span key={c.label} className={c.tone === 'critical' ? 'text-risk-critical' : ''}>
              {c.value} <span className="text-os-slate">{c.label}</span>
            </span>
          ))}
        </div>
      )}
      <label className="flex items-center gap-2" title="Role sent with every request; the API enforces it">
        <span className="os-eyebrow text-os-slate">Role</span>
        <select
          value={role}
          onChange={e => onRoleChange(e.target.value as Role)}
          className="os-mono text-xs bg-os-raised text-os-fog border border-os-pewter rounded-input px-2 py-1 focus:outline-none focus:border-os-silver"
        >
          {ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
        </select>
      </label>
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
);
