import { describe, expect, it } from 'vitest';
import { darkSpans, timeProgress } from './replay';

describe('timeProgress', () => {
  it('maps a simulated time onto the scenario span', () => {
    expect(timeProgress('2026-09-12T10:00:00', '2026-09-12T14:00:00', '2026-09-12T11:00:00')).toBeCloseTo(0.25);
  });

  it('clamps to the span and treats naive timestamps as UTC', () => {
    expect(timeProgress('2026-09-12T10:00:00', '2026-09-12T14:00:00', '2026-09-12T09:00:00Z')).toBe(0);
    expect(timeProgress('2026-09-12T10:00:00', '2026-09-12T14:00:00', '2026-09-12T15:00:00')).toBe(1);
  });
});

describe('darkSpans', () => {
  it('turns start/end fractions into bar segments', () => {
    expect(darkSpans([{ mmsi: '1', name: 'A', start: 0.375, end: 0.625 }])).toEqual([{ start: 0.375, width: 0.25 }]);
  });
});
