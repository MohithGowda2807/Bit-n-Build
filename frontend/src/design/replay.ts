/** Replay timeline helpers: progress is measured in scenario time, so the cursor jumps across dark windows. */

export interface ReplayDarkWindow {
  mmsi: string;
  name: string;
  /** Fractions of the scenario span, 0 to 1. */
  start: number;
  end: number;
}

function utcMillis(iso: string): number {
  const normalized = /[zZ]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`;
  return Date.parse(normalized);
}

export function timeProgress(startIso: string, endIso: string, simTimeIso: string): number {
  const start = utcMillis(startIso);
  const span = utcMillis(endIso) - start;
  if (span <= 0) return 1;
  const fraction = (utcMillis(simTimeIso) - start) / span;
  return Math.min(1, Math.max(0, fraction));
}

export function darkSpans(windows: ReplayDarkWindow[]): { start: number; width: number }[] {
  return windows.map(w => ({ start: w.start, width: w.end - w.start }));
}
