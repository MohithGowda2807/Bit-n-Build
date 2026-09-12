import React from 'react';
import { riskColor, riskLabel, riskLevel, riskTint, RiskLevel, CLEAR_GREEN } from '../../design/risk';

/** Floating surface-1 panel, 24px radius, per DESIGN.md. */
export const Panel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...rest }) => (
  <div className={`bg-os-panel rounded-panel os-reveal ${className}`} {...rest}>{children}</div>
);

export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`os-eyebrow text-os-slate ${className}`}>{children}</span>
);

export const Mono: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className = '', children, ...rest }) => (
  <span className={`os-mono ${className}`} {...rest}>{children}</span>
);

export const RiskBadge: React.FC<{ level: RiskLevel | number; className?: string }> = ({ level, className = '' }) => {
  const lvl = typeof level === 'number' ? riskLevel(level) : level;
  return (
    <span
      className={`os-eyebrow inline-flex items-center px-[7px] py-1 rounded-badge ${className}`}
      style={{ background: riskTint(lvl), color: riskColor(lvl) }}
    >
      {riskLabel(lvl)}
    </span>
  );
};

export const InfoBadge: React.FC<{ children: React.ReactNode; tone?: 'info' | 'clear' | 'muted'; className?: string }> = ({
  children, tone = 'info', className = '',
}) => {
  const bg = tone === 'info' ? '#0062ca' : tone === 'clear' ? CLEAR_GREEN : '#333943';
  return (
    <span className={`os-eyebrow inline-flex items-center px-[7px] py-1 rounded-badge text-white ${className}`} style={{ background: bg }}>
      {children}
    </span>
  );
};

/** Event-type badge: risk tint by how alarming the event is. */
const EVENT_TONE: Record<string, RiskLevel> = {
  CASE_CREATED: 'CRITICAL',
  HIGH_RISK_VESSEL: 'HIGH',
  FISHING_PATTERN: 'ELEVATED',
  LOITERING: 'ELEVATED',
  ZONE_ENTRY: 'HIGH',
  AIS_GAP_DETECTED: 'MODERATE',
  VESSEL_RENDEZVOUS: 'MODERATE',
  BEHAVIOR_DEVIATION: 'MODERATE',
  ZONE_EXIT: 'LOW',
};

const EVENT_LABEL: Record<string, string> = {
  CASE_CREATED: 'Case',
  HIGH_RISK_VESSEL: 'Risk',
  FISHING_PATTERN: 'Fishing',
  LOITERING: 'Loiter',
  ZONE_ENTRY: 'Zone',
  ZONE_EXIT: 'Zone',
  AIS_GAP_DETECTED: 'AIS',
  VESSEL_RENDEZVOUS: 'Meet',
  BEHAVIOR_DEVIATION: 'Baseline',
};

export const EventBadge: React.FC<{ type: string }> = ({ type }) => {
  const lvl = EVENT_TONE[type] ?? 'LOW';
  return (
    <span className="os-eyebrow inline-flex items-center px-1.5 py-[3px] rounded-badge" style={{ background: riskTint(lvl), color: riskColor(lvl) }}>
      {EVENT_LABEL[type] ?? type.toLowerCase()}
    </span>
  );
};

export const RiskNumber: React.FC<{ score: number; size?: 'list' | 'display'; className?: string }> = ({ score, size = 'list', className = '' }) => (
  <span
    className={size === 'display'
      ? `font-bold text-[44px] leading-[1.14] tracking-[-0.88px] ${className}`
      : `os-mono font-medium text-[20px] leading-[1.2] ${className}`}
    style={{ color: riskColor(score) }}
  >
    {Math.round(score)}
  </span>
);

/** Segments proportional to factor weights; the engine caps the total, so this shows shares. */
export const FactorBar: React.FC<{ factors: { type: string; score: number }[] }> = ({ factors }) => {
  const toneFor = (type: string): RiskLevel =>
    type === 'FISHING_BEHAVIOR' ? 'CRITICAL' : type === 'ZONE_ACTIVITY' ? 'HIGH' : type === 'AIS_GAP' ? 'ELEVATED' : 'MODERATE';
// RENDEZVOUS and BEHAVIOR_DEVIATION share the moderate tone: supporting factors, never the headline.
  return (
    <div className="flex h-1 gap-0.5">
      {factors.map(f => (
        <div key={f.type} className="rounded-sm" style={{ flex: Math.max(f.score, 1), background: riskColor(toneFor(f.type)) }} />
      ))}
    </div>
  );
};

export const factorTone = (type: string): RiskLevel =>
  type === 'FISHING_BEHAVIOR' ? 'CRITICAL' : type === 'ZONE_ACTIVITY' ? 'HIGH' : type === 'AIS_GAP' ? 'ELEVATED' : 'MODERATE';

export const PrimaryPill: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...rest }) => (
  <button
    className={`text-sm font-medium text-white bg-os-signal hover:bg-os-signal-hover disabled:bg-os-steel disabled:text-os-ash px-5 py-2.5 rounded-pill transition-colors ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const OutlinePill: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...rest }) => (
  <button
    className={`text-sm font-medium text-white border border-os-silver hover:border-white px-5 py-2.5 rounded-pill transition-colors ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const GhostLink: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...rest }) => (
  <button className={`text-sm font-medium text-os-signal hover:text-os-signal-hover ${className}`} {...rest}>{children}</button>
);

export const FilterPill: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; size?: 'sm' | 'md' }> = ({
  active, onClick, children, size = 'md',
}) => (
  <button
    onClick={onClick}
    className={`${size === 'sm' ? 'text-xs px-3 py-1' : 'text-[13px] px-3.5 py-1.5'} font-medium rounded-pill transition-colors ${
      active ? 'bg-os-signal text-white' : 'text-os-fog border border-os-pewter bg-os-void/60 hover:text-white'
    }`}
  >
    {children}
  </button>
);

export const IconFrame: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...rest }) => (
  <button
    className={`w-8 h-8 rounded-input border border-os-pewter bg-os-void/70 flex items-center justify-center text-os-fog hover:text-white ${className}`}
    {...rest}
  >
    {children}
  </button>
);
