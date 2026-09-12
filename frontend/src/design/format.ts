/** Formatting for data set in mono: times, durations, distances, coordinates. */

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** HH:MM in UTC. Backend timestamps are naive UTC; treat missing zone as UTC. */
export function formatClock(iso: string): string {
  const normalized = /[zZ]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`;
  const d = new Date(normalized);
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 120) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function formatKm(km: number): string {
  return `${km.toFixed(1)} km`;
}

export function formatLatLon(lat: number, lon: number): string {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)} ${ns} ${Math.abs(lon).toFixed(4)} ${ew}`;
}
