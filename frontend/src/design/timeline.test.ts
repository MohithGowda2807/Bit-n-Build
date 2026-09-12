import { describe, expect, it } from 'vitest';
import { buildTimeline } from './timeline';

const ev = (key: string, event_type: string, timestamp: string, extra: Record<string, any> = {}) =>
  ({ key, event_type, vessel_id: 1, timestamp, payload: {}, ...extra });

describe('buildTimeline', () => {
  it('orders entries oldest first', () => {
    const entries = buildTimeline([
      ev('b', 'ZONE_ENTRY', '2026-09-12T11:00:00'),
      ev('a', 'AIS_GAP_DETECTED', '2026-09-12T10:00:00'),
    ]);
    expect(entries.map(e => e.event_type)).toEqual(['AIS_GAP_DETECTED', 'ZONE_ENTRY']);
  });

  it('drops the live duplicate of a stored event', () => {
    const entries = buildTimeline([
      ev('db-1', 'ZONE_ENTRY', '2026-09-12T11:00:00', { zone_name: 'Silent Bank' }),
      ev('live-x', 'ZONE_ENTRY', '2026-09-12T11:00:00', { zone_name: 'Silent Bank' }),
    ]);
    expect(entries).toHaveLength(1);
  });

  it('keeps one entry when the same stored event arrives twice with different payload detail', () => {
    const entries = buildTimeline([
      ev('db-8', 'VESSEL_RENDEZVOUS', '2026-09-12T10:14:00', { payload: { other_vessel_id: 2 } }),
      ev('db-8', 'VESSEL_RENDEZVOUS', '2026-09-12T10:14:00'),
    ]);
    expect(entries).toHaveLength(1);
  });

  it('marks the first entry of each new hour as a boundary', () => {
    const entries = buildTimeline([
      ev('a', 'ZONE_ENTRY', '2026-09-12T10:05:00'),
      ev('b', 'ZONE_EXIT', '2026-09-12T10:40:00'),
      ev('c', 'AIS_GAP_DETECTED', '2026-09-12T11:10:00'),
    ]);
    expect(entries.map(e => e.hourBoundary)).toEqual([true, false, true]);
  });
});
