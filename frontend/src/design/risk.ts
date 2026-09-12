/** Risk bands and colors from design/DESIGN.md. Risk colors are used only on risk. */

export const RISK_LEVELS = ['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

const RISK_HEX: Record<RiskLevel, string> = {
  LOW: '#a0aaba',
  MODERATE: '#e2a33a',
  ELEVATED: '#f0873a',
  HIGH: '#f2643e',
  CRITICAL: '#f0483e',
};

export const CLEAR_GREEN = '#2fae6e';

export function riskLevel(score: number): RiskLevel {
  if (score > 80) return 'CRITICAL';
  if (score > 60) return 'HIGH';
  if (score > 40) return 'ELEVATED';
  if (score > 20) return 'MODERATE';
  return 'LOW';
}

function toLevel(value: RiskLevel | number): RiskLevel {
  return typeof value === 'number' ? riskLevel(value) : value;
}

export function riskColor(value: RiskLevel | number): string {
  return RISK_HEX[toLevel(value)];
}

export function riskTint(value: RiskLevel | number, alpha = 0.12): string {
  const hex = RISK_HEX[toLevel(value)];
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function riskLabel(level: RiskLevel): string {
  return level.charAt(0) + level.slice(1).toLowerCase();
}
