/** Split an AIS track into observed and estimated (no AIS) segments for the map. */

export interface TrackPointLike {
  timestamp: string;
  latitude: number;
  longitude: number;
}

export interface GapLike {
  start_time: string;
  end_time: string | null;
}

export type LatLng = [number, number];

export interface TrackSegment {
  kind: 'observed' | 'estimated';
  points: LatLng[];
}

function ms(iso: string): number {
  return new Date(/[zZ]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`).getTime();
}

export function splitTrackAtGaps(track: TrackPointLike[], gaps: GapLike[]): TrackSegment[] {
  if (track.length === 0) return [];
  const sorted = [...track].sort((a, b) => ms(a.timestamp) - ms(b.timestamp));
  const gapStarts = new Set(gaps.filter(g => g.end_time !== null).map(g => ms(g.start_time)));
  const openGapStart = gaps.find(g => g.end_time === null);

  const segments: TrackSegment[] = [];
  let current: LatLng[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    current.push([p.latitude, p.longitude]);
    const next = sorted[i + 1];
    if (next && gapStarts.has(ms(p.timestamp))) {
      segments.push({ kind: 'observed', points: current });
      segments.push({ kind: 'estimated', points: [[p.latitude, p.longitude], [next.latitude, next.longitude]] });
      current = [];
    }
  }
  if (current.length) segments.push({ kind: 'observed', points: current });

  if (openGapStart) {
    const last = sorted[sorted.length - 1];
    if (ms(openGapStart.start_time) === ms(last.timestamp)) {
      segments.push({ kind: 'estimated', points: [[last.latitude, last.longitude]] });
    }
  }
  return segments;
}
