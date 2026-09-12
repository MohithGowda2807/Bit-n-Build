import { describe, expect, it } from 'vitest';
import { formatClock, formatDuration, formatKm, formatLatLon } from './format';

describe('formatting for mono data', () => {
  it('formats ISO timestamps as HH:MM in UTC', () => {
    expect(formatClock('2026-09-12T10:30:00')).toBe('10:30');
    expect(formatClock('2026-09-12T08:05:00Z')).toBe('08:05');
  });

  it('formats durations in minutes, hours and minutes', () => {
    expect(formatDuration(60 * 60)).toBe('60 min');
    expect(formatDuration(45 * 60)).toBe('45 min');
    expect(formatDuration(190 * 60)).toBe('3 h 10 min');
  });

  it('formats kilometres to one decimal', () => {
    expect(formatKm(15.63)).toBe('15.6 km');
    expect(formatKm(0.777)).toBe('0.8 km');
  });

  it('formats coordinates with hemisphere letters', () => {
    expect(formatLatLon(12.45, 72.45)).toBe('12.4500 N 72.4500 E');
    expect(formatLatLon(-33.9, -18.4)).toBe('33.9000 S 18.4000 W');
  });
});
