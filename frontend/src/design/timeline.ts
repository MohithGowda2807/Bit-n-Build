/** Vessel timeline: every detection in time order, oldest first, with hour boundaries marked. */

export interface TimelineSource {
  key: string;
  event_type: string;
  vessel_id: number | null;
  timestamp: string;
  payload: Record<string, any>;
  zone_name?: string | null;
}

export interface TimelineEntry extends TimelineSource {
  hourBoundary: boolean;
}

function utcHour(iso: string): string {
  const normalized = /[zZ]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`;
  const d = new Date(normalized);
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}-${d.getUTCHours()}`;
}

function identity(e: TimelineSource): string {
  return `${e.event_type}|${e.timestamp}|${e.zone_name ?? ''}|${e.payload?.other_vessel_id ?? ''}`;
}

export function buildTimeline(events: TimelineSource[]): TimelineEntry[] {
  const seen = new Set<string>();
  const ordered = [...events]
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .filter(e => {
      if (seen.has(e.key) || seen.has(identity(e))) return false;
      seen.add(e.key);
      seen.add(identity(e));
      return true;
    });
  let lastHour: string | null = null;
  return ordered.map(e => {
    const hour = utcHour(e.timestamp);
    const hourBoundary = hour !== lastHour;
    lastHour = hour;
    return { ...e, hourBoundary };
  });
}
