import React, { useEffect, useState } from 'react';
import { OceanMap, Basemap } from '../components/OceanMap';
import { fetchVessels, fetchPorts, fetchZones } from '../services/api';
import { Vessel, Port, MarineZone } from '../types';

/**
 * Step 1 of the surveillance view: the map as the light source, on the Night basemap,
 * with system-styled layer chips. Watchlist, events and the vessel panel arrive in step 2.
 */
export const SurveillancePage: React.FC = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [zones, setZones] = useState<MarineZone[]>([]);
  const [basemap, setBasemap] = useState<Basemap>('night');
  const [selected, setSelected] = useState<Vessel | null>(null);

  useEffect(() => {
    Promise.all([fetchVessels(), fetchPorts(), fetchZones()])
      .then(([v, p, z]) => { setVessels(v); setPorts(p); setZones(z); })
      .catch(() => { /* the shell shows offline state; panels handle empties */ });
  }, []);

  return (
    <div className="relative flex-1 min-h-0">
      <OceanMap
        vessels={vessels}
        ports={ports}
        zones={zones}
        selectedVessel={selected}
        onSelectVessel={setSelected}
        origin={null}
        destination={null}
        activeRoute={null}
        alternativeRoutes={[]}
        selectedAlternativeIndex={null}
        onSelectAlternative={() => {}}
        mapSelectionMode={null}
        onSelectCoordinate={() => {}}
        replayPosition={null}
        basemap={basemap}
        onBasemapChange={setBasemap}
        showLayerBar={false}
      />

      {/* Basemap toggle: Chart keeps the current look, Night is the surveillance default. */}
      <div className="absolute top-4 right-4 z-[1000] flex gap-2 os-reveal">
        {(['night', 'chart'] as Basemap[]).map(b => (
          <button
            key={b}
            onClick={() => setBasemap(b)}
            className={`text-[13px] font-medium px-3.5 py-1.5 rounded-pill transition-colors ${
              basemap === b
                ? 'bg-os-signal text-white'
                : 'text-os-fog border border-os-pewter bg-os-void/60 hover:text-white'
            }`}
          >
            {b === 'night' ? 'Night' : 'Chart'}
          </button>
        ))}
      </div>
    </div>
  );
};
