import { describe, expect, it } from 'vitest';
import { splitTrackAtGaps } from './track';

const p = (t: string, lat: number, lon: number) => ({ timestamp: t, latitude: lat, longitude: lon });

describe('splitTrackAtGaps', () => {
  it('returns one observed segment when there are no gaps', () => {
    const track = [p('2026-09-12T08:00:00', 12, 72), p('2026-09-12T08:05:00', 12.1, 72.1)];
    expect(splitTrackAtGaps(track, [])).toEqual([
      { kind: 'observed', points: [[12, 72], [12.1, 72.1]] },
    ]);
  });

  it('inserts an estimated segment across each gap', () => {
    const track = [
      p('2026-09-12T08:00:00', 12.0, 72.0),
      p('2026-09-12T08:05:00', 12.1, 72.1),
      p('2026-09-12T09:15:00', 12.5, 72.5),
      p('2026-09-12T09:20:00', 12.6, 72.6),
    ];
    const gaps = [{ start_time: '2026-09-12T08:05:00', end_time: '2026-09-12T09:15:00' }];
    expect(splitTrackAtGaps(track, gaps)).toEqual([
      { kind: 'observed', points: [[12.0, 72.0], [12.1, 72.1]] },
      { kind: 'estimated', points: [[12.1, 72.1], [12.5, 72.5]] },
      { kind: 'observed', points: [[12.5, 72.5], [12.6, 72.6]] },
    ]);
  });

  it('leaves an open gap as a trailing estimated stub of one point', () => {
    const track = [p('2026-09-12T08:00:00', 12, 72), p('2026-09-12T08:05:00', 12.1, 72.1)];
    const gaps = [{ start_time: '2026-09-12T08:05:00', end_time: null }];
    expect(splitTrackAtGaps(track, gaps)).toEqual([
      { kind: 'observed', points: [[12, 72], [12.1, 72.1]] },
      { kind: 'estimated', points: [[12.1, 72.1]] },
    ]);
  });
});
