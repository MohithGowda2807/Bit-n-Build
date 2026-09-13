import { describe, expect, it } from 'vitest';
import { cellBounds, heatStyle } from './heatmap';

describe('heat layer', () => {
  it('turns a south-west corner and cell size into Leaflet bounds', () => {
    expect(cellBounds({ lat: 12, lon: 72, positions: 1, events: 0, max_risk: 0, intensity: 0.2 }, 0.25))
      .toEqual([[12, 72], [12.25, 72.25]]);
  });

  it('colours by the riskiest vessel seen and fades by intensity', () => {
    const hot = heatStyle({ lat: 12, lon: 72, positions: 9, events: 4, max_risk: 100, intensity: 1 });
    const cool = heatStyle({ lat: 12, lon: 72, positions: 1, events: 0, max_risk: 0, intensity: 0.1 });
    expect(hot.fillColor).toBe('#f0483e');
    expect(cool.fillColor).toBe('#a0aaba');
    expect(hot.fillOpacity).toBeGreaterThan(cool.fillOpacity);
    expect(cool.fillOpacity).toBeGreaterThan(0);
    expect(hot.fillOpacity).toBeLessThanOrEqual(0.55);
  });
});
