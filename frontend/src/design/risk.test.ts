import { describe, expect, it } from 'vitest';
import { riskLevel, riskColor, riskTint, RISK_LEVELS } from './risk';

describe('risk level bands (spec section 35)', () => {
  it('maps scores to the five bands', () => {
    expect(riskLevel(0)).toBe('LOW');
    expect(riskLevel(20)).toBe('LOW');
    expect(riskLevel(21)).toBe('MODERATE');
    expect(riskLevel(40)).toBe('MODERATE');
    expect(riskLevel(41)).toBe('ELEVATED');
    expect(riskLevel(60)).toBe('ELEVATED');
    expect(riskLevel(61)).toBe('HIGH');
    expect(riskLevel(80)).toBe('HIGH');
    expect(riskLevel(81)).toBe('CRITICAL');
    expect(riskLevel(100)).toBe('CRITICAL');
  });

  it('exposes the levels in ascending order', () => {
    expect(RISK_LEVELS).toEqual(['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL']);
  });
});

describe('risk colors follow DESIGN.md', () => {
  it('uses the documented hex per level', () => {
    expect(riskColor('LOW')).toBe('#a0aaba');
    expect(riskColor('MODERATE')).toBe('#e2a33a');
    expect(riskColor('ELEVATED')).toBe('#f0873a');
    expect(riskColor('HIGH')).toBe('#f2643e');
    expect(riskColor('CRITICAL')).toBe('#f0483e');
  });

  it('derives the 12 percent tint from the same color', () => {
    expect(riskTint('CRITICAL')).toBe('rgba(240,72,62,0.12)');
    expect(riskTint('LOW')).toBe('rgba(160,170,186,0.12)');
  });

  it('accepts a score as well as a level', () => {
    expect(riskColor(100)).toBe('#f0483e');
    expect(riskColor(38)).toBe('#e2a33a');
  });
});
