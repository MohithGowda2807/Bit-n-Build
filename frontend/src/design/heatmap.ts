/** Heat layer styling: cells coloured by the riskiest vessel seen there, faded by relative activity. */
import { riskColor } from './risk';
import { HeatCell } from '../types/surveillance';

const MIN_OPACITY = 0.08;
const MAX_OPACITY = 0.55;

export function cellBounds(cell: HeatCell, cellDegrees: number): [[number, number], [number, number]] {
  return [[cell.lat, cell.lon], [cell.lat + cellDegrees, cell.lon + cellDegrees]];
}

export function heatStyle(cell: HeatCell): { fillColor: string; fillOpacity: number; color: string; weight: number } {
  const fillColor = riskColor(cell.max_risk);
  const fillOpacity = MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * Math.min(1, Math.max(0, cell.intensity));
  return { fillColor, fillOpacity, color: fillColor, weight: 0 };
}
