import seedRaw from './seedData.json';
import { Vessel, Port, Debris, MarineZone, Mission, Storm } from '../types';

export const FALLBACK_PORTS: Port[] = seedRaw.ports as unknown as Port[];
export const FALLBACK_VESSELS: Vessel[] = seedRaw.vessels as unknown as Vessel[];
export const FALLBACK_DEBRIS: Debris[] = seedRaw.debris as unknown as Debris[];
export const FALLBACK_ZONES: MarineZone[] = seedRaw.zones as unknown as MarineZone[];
export const FALLBACK_MISSIONS: Mission[] = seedRaw.missions as unknown as Mission[];

export const FALLBACK_STORMS: Storm[] = [
  {
    id: 1,
    name: "Cyclone Vardah",
    storm_type: "cyclone",
    severity: "critical",
    center_latitude: 13.2,
    center_longitude: 83.5,
    radius_km: 260.0,
    wind_speed_knots: 75.0,
    movement_direction_deg: 295.0,
    movement_speed_knots: 9.0,
    is_active: true,
    source: "IMD / JTWC Synthetic",
    created_at: new Date().toISOString()
  }
];
