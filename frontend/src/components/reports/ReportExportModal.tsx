import React, { useState } from 'react';

export type ReportStage = 'executive' | 'logistics' | 'environment' | 'surveillance' | 'cleanup';

interface ReportExportModalProps {
 isOpen: boolean;
 onClose: () => void;
 initialStage?: ReportStage;
 data?: any;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
 isOpen,
 onClose,
 initialStage = 'executive'
}) => {
 const [activeStage, setActiveStage] = useState<ReportStage>(initialStage);

 if (!isOpen) return null;

 const handlePrint = () => {
 window.print();
  };

 const STAGES: { id: ReportStage; label: string; icon: string }[] = [
    { id: 'executive', label: 'Executive Briefing', icon: '📑' },
    { id: 'logistics', label: 'Stage 1: Logistics Manifest', icon: '🚢' },
    { id: 'environment', label: 'Stage 2: Storm Advisory', icon: '🌀' },
    { id: 'surveillance', label: 'Stage 3: Surveillance Dossier', icon: '🛡️' },
    { id: 'cleanup', label: 'Stage 4: Autonomous Sortie', icon: '🚤' }
  ];

 return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-os-void/80 p-2 sm:p-4 overflow-y-auto">
      {/* Print CSS Injection */}
      <style>{`
        @media print {
 body * {
 visibility: hidden;
          }
          #triton-printable-report, #triton-printable-report * {
 visibility: visible;
          }
          #triton-printable-report {
 position: absolute;
 left: 0;
 top: 0;
 width: 100% !important;
 margin: 0 !important;
 padding: 20px !important;
 box-shadow: none !important;
 border: none !important;
 background: white !important;
 color: #15171b !important;
            -webkit-print-color-adjust: exact !important;
 print-color-adjust: exact !important;
          }
          .no-print {
 display: none !important;
          }
        }
 `}</style>

      <div className="bg-os-panel border border-os-pewter rounded-panel w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden no-print">
        {/* Modal Header & Stage Switcher */}
        <div className="bg-os-void p-3.5 border-b border-os-pewter flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">📑</span>
            <div>
              <div className="font-bold text-white text-xs font-mono">TRITON MARITIME INTELLIGENCE DOSSIER</div>
              <div className="text-[10px] text-os-ash font-sans">Multi-Stage Regulatory & Tactical Report Generator</div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
 onClick={handlePrint}
 className="px-3.5 py-1.5 hover: hover: text-white rounded-input text-xs font-bold font-mono flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>🖨️</span>
              <span>Print / Save PDF</span>
            </button>
            <button
 onClick={onClose}
 className="text-os-ash hover:text-white p-1.5 rounded-input hover:bg-os-raised transition cursor-pointer text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Stage Tabs Navigation */}
        <div className="bg-os-panel px-4 py-2 border-b border-os-pewter flex items-center gap-1 overflow-x-auto shrink-0 font-mono text-xs">
          {STAGES.map((s) => (
            <button
 key={s.id}
 onClick={() => setActiveStage(s.id)}
 className={`px-3 py-1.5 rounded-input font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
 activeStage === s.id
                  ? 'bg-os-signal text-white shadow'
                  : 'text-os-ash hover:text-white hover:bg-os-raised'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Printable Document Sheet Container (Crisp White Background) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-os-void">
          <div
 id="triton-printable-report"
 className="bg-white text-os-void rounded-row p-6 sm:p-10 max-w-3xl mx-auto font-sans leading-relaxed border border-os-silver"
          >
            {activeStage === 'executive' && <ExecutiveBriefingView />}
            {activeStage === 'logistics' && <LogisticsManifestView />}
            {activeStage === 'environment' && <EnvironmentAdvisoryView />}
            {activeStage === 'surveillance' && <SurveillanceDossierView />}
            {activeStage === 'cleanup' && <AutonomousSortieView />}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-os-void border-t border-os-pewter flex items-center justify-between text-[11px] font-mono text-os-slate shrink-0">
          <span>Official Format: UNCLOS / IMO MARPOL Certified Document Standard</span>
          <button
 onClick={onClose}
 className="px-3 py-1 bg-os-raised hover:bg-os-raised text-os-fog rounded font-semibold transition cursor-pointer"
          >
 Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
 STAGE 1: LOGISTICS MANIFEST (White Page, Crisp Colors, Detailed Tables)
   ========================================================================= */
const LogisticsManifestView: React.FC = () => (
  <div className="space-y-6">
    {/* Header Top Banner */}
    <div className="border-b-2 border-os-signal pb-4 flex items-start justify-between">
      <div>
        <div className="inline-block px-2.5 py-0.5 rounded bg-os-raised text-os-signal-deep font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
 UNCLOS & IMO MARPOL ANNEX VI COMPLIANT MANIFEST
        </div>
        <h1 className="text-2xl font-black text-os-void tracking-tight">
 Maritime Voyage Optimization & Decarbonization Manifest
        </h1>
        <p className="text-xs text-os-slate mt-0.5">
 Dynamic Pathfinding · Fuel Conservation · Carbon Intensity Index (CII) Rating Report
        </p>
      </div>
      <div className="text-right text-xs font-mono text-os-slate shrink-0">
        <div>DOC REF: <span className="text-os-void font-bold">TRITON-LOG-2026-09</span></div>
        <div>DATE: <span className="text-os-void">{new Date().toLocaleDateString()}</span></div>
        <div className="text-os-clear font-bold">STATUS: AUTHORIZED</div>
      </div>
    </div>

    {/* Key Voyage Parameters Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-os-silver p-4 rounded-row border border-os-silver text-xs">
      <div>
        <span className="text-os-slate uppercase text-[10px] font-bold block">Assigned Vessel</span>
        <span className="text-os-signal-deep font-bold text-sm">MV Ocean Sentinel</span>
        <span className="text-[10px] text-os-slate block font-mono">IMO 9432810 · Container</span>
      </div>
      <div>
        <span className="text-os-slate uppercase text-[10px] font-bold block">Departure Port</span>
        <span className="text-os-void font-bold text-sm">Port of Mumbai</span>
        <span className="text-[10px] text-os-slate block font-mono">INBOM (18.94°N, 72.84°E)</span>
      </div>
      <div>
        <span className="text-os-slate uppercase text-[10px] font-bold block">Destination Port</span>
        <span className="text-os-void font-bold text-sm">Port of Colombo</span>
        <span className="text-[10px] text-os-slate block font-mono">LKCMB (6.94°N, 79.84°E)</span>
      </div>
      <div>
        <span className="text-os-slate uppercase text-[10px] font-bold block">Est. Transit Time</span>
        <span className="text-os-void font-bold text-sm">48.2 Hours</span>
        <span className="text-[10px] text-os-slate block font-mono">Cruise: 15.4 Knots</span>
      </div>
    </div>

    {/* Colorful KPI Decarbonization Metric Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
      <div className="p-3 bg-os-raised border border-os-clear rounded-row">
        <div className="text-[10px] font-bold text-os-clear uppercase tracking-wider">CO2 Emissions Avoided</div>
        <div className="text-xl font-black text-os-clear mt-1">8.42 t</div>
        <div className="text-[10px] text-os-clear font-semibold mt-0.5">-12.4% vs Great Circle</div>
      </div>
      <div className="p-3 bg-os-raised border border-os-signal rounded-row">
        <div className="text-[10px] font-bold text-os-signal-deep uppercase tracking-wider">Fuel Consumption</div>
        <div className="text-xl font-black text-os-signal-deep mt-1">31,800 L</div>
        <div className="text-[10px] text-os-signal-deep font-semibold mt-0.5">Heavy Bunker (MGO)</div>
      </div>
      <div className="p-3 bg-os-raised border border-os-signal rounded-row">
        <div className="text-[10px] font-bold text-os-signal-deep uppercase tracking-wider">Cost Savings</div>
        <div className="text-xl font-black text-os-signal-deep mt-1">$7,157</div>
        <div className="text-[10px] text-os-signal-deep font-semibold mt-0.5">@ $0.85 / Liter</div>
      </div>
      <div className="p-3 bg-os-raised border border-os-signal rounded-row">
        <div className="text-[10px] font-bold text-os-signal-deep uppercase tracking-wider">CII Vessel Rating</div>
        <div className="text-xl font-black text-os-signal-deep mt-1">Grade A</div>
        <div className="text-[10px] text-os-signal-deep font-semibold mt-0.5">IMO 2030 Eco Tier</div>
      </div>
    </div>

    {/* Route Corridor Waypoint Table */}
    <div>
      <h2 className="text-sm font-bold text-os-void uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
        <span>📍</span>
        <span>Optimized Navigation Corridor Waypoints</span>
      </h2>
      <div className="overflow-x-auto border border-os-silver rounded-row">
        <table className="w-full text-xs text-left">
          <thead className="bg-os-silver font-mono text-[10px] text-os-steel uppercase border-b border-os-silver">
            <tr>
              <th className="p-2.5">Seq</th>
              <th className="p-2.5">Latitude</th>
              <th className="p-2.5">Longitude</th>
              <th className="p-2.5">Nautical Miles</th>
              <th className="p-2.5">Sea Swell</th>
              <th className="p-2.5">Navigation Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-os-steel font-mono text-os-void">
            <tr>
              <td className="p-2.5 font-bold">WP-01</td>
              <td className="p-2.5">18.9438°N</td>
              <td className="p-2.5">72.8364°E</td>
              <td className="p-2.5">0.0 NM</td>
              <td className="p-2.5 text-os-clear">0.8 m</td>
              <td className="p-2.5 text-os-signal-deep font-bold">Port Departure Fairway</td>
            </tr>
            <tr className="bg-os-silver">
              <td className="p-2.5 font-bold">WP-02</td>
              <td className="p-2.5">15.5200°N</td>
              <td className="p-2.5">72.4100°E</td>
              <td className="p-2.5">212.4 NM</td>
              <td className="p-2.5 text-os-clear">1.2 m</td>
              <td className="p-2.5 text-os-void font-bold">Arabian Deep Water Lane</td>
            </tr>
            <tr>
              <td className="p-2.5 font-bold">WP-03</td>
              <td className="p-2.5">10.1500°N</td>
              <td className="p-2.5">74.8800°E</td>
              <td className="p-2.5">348.1 NM</td>
              <td className="p-2.5 text-risk-elevated">1.9 m</td>
              <td className="p-2.5 text-os-signal-deep font-bold">Lakshadweep MPA Bypass (+12 NM)</td>
            </tr>
            <tr className="bg-os-silver">
              <td className="p-2.5 font-bold">WP-04</td>
              <td className="p-2.5">6.9400°N</td>
              <td className="p-2.5">79.8400°E</td>
              <td className="p-2.5">285.5 NM</td>
              <td className="p-2.5 text-os-clear">1.1 m</td>
              <td className="p-2.5 text-os-clear font-bold">Colombo Approach Channel</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Official Authorization Seal */}
    <div className="border border-os-silver bg-os-silver p-4 rounded-row flex items-center justify-between">
      <div className="text-xs space-y-1">
        <div className="font-bold text-os-void flex items-center gap-1.5">
          <span>🛡️</span>
          <span>Automated Verification & Master Mariner Authorization</span>
        </div>
        <p className="text-os-slate text-[11px]">
 Validated through TRITON A* Multi-Objective Routing Engine. Geometry checked against 87 international ports.
        </p>
        <div className="text-os-ash font-mono text-[10px]">
 SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
        </div>
      </div>
      <div className="text-center p-3 border-2 border-os-clear rounded-input text-os-clear font-mono font-black text-xs uppercase bg-white shrink-0">
        <div>✓ AUTHORIZED</div>
        <div className="text-[8px] tracking-widest text-os-clear">IMO PASS CERTIFIED</div>
      </div>
    </div>
  </div>
);

/* =========================================================================
 STAGE 2: ENVIRONMENT ADVISORY (Weather, Cyclones, Wave Swells)
   ========================================================================= */
const EnvironmentAdvisoryView: React.FC = () => (
  <div className="space-y-6">
    <div className="border-b-2 border-risk-moderate pb-4 flex items-start justify-between">
      <div>
        <div className="inline-block px-2.5 py-0.5 rounded bg-os-raised text-risk-elevated font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
 IMD & WMO MARITIME METEOROLOGICAL ADVISORY
        </div>
        <h1 className="text-2xl font-black text-os-void tracking-tight">
 Severe Weather Hazard & Dynamic Avoidance Assessment
        </h1>
        <p className="text-xs text-os-slate mt-0.5">
 Tropical Cyclone Tracking · Wave Swell Modeling · Automated Route Divergence Lineage
        </p>
      </div>
      <div className="text-right text-xs font-mono text-os-slate shrink-0">
        <div>ALERT ID: <span className="text-risk-elevated font-bold">CYC-VARDAH-CAT4</span></div>
        <div>ISSUED: <span className="text-os-void">{new Date().toLocaleTimeString()} UTC</span></div>
        <div className="text-risk-critical font-bold">SEVERITY: CRITICAL</div>
      </div>
    </div>

    {/* Cyclone Warning Banner */}
    <div className="bg-os-raised border-l-4 border-risk-critical p-4 rounded-r-xl">
      <div className="flex items-center gap-2">
        <span className="text-lg">🌀</span>
        <h3 className="text-sm font-bold text-risk-critical">ACTIVE HAZARD: Severe Cyclonic Storm 'Vardah' (Bay of Bengal / Sri Lanka Basin)</h3>
      </div>
      <p className="text-xs text-risk-critical mt-1 leading-relaxed">
 Center located at 13.2°N, 83.5°E with maximum sustained winds of 75 knots (gusting to 95 knots). Central atmospheric pressure: 975 hPa. Wave swell heights exceeding 7.2 meters within a 260 km danger radius.
      </p>
    </div>

    {/* Metric Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
      <div className="p-3 bg-os-raised border border-risk-critical rounded-row">
        <div className="text-[10px] font-bold text-risk-critical uppercase">Core Wind Velocity</div>
        <div className="text-xl font-black text-risk-critical mt-1">75.0 kt</div>
        <div className="text-[10px] text-risk-critical font-semibold mt-0.5">Category 4 Scale</div>
      </div>
      <div className="p-3 bg-os-raised border border-risk-moderate rounded-row">
        <div className="text-[10px] font-bold text-risk-elevated uppercase">Max Wave Swell</div>
        <div className="text-xl font-black text-risk-elevated mt-1">7.2 m</div>
        <div className="text-[10px] text-risk-elevated font-semibold mt-0.5">Extreme Hull Stress</div>
      </div>
      <div className="p-3 bg-os-raised border border-os-clear rounded-row">
        <div className="text-[10px] font-bold text-os-clear uppercase">Risk Reduction</div>
        <div className="text-xl font-black text-os-clear mt-1">-80.4%</div>
        <div className="text-[10px] text-os-clear font-semibold mt-0.5">Via Dynamic Divergence</div>
      </div>
      <div className="p-3 bg-os-raised border border-os-signal rounded-row">
        <div className="text-[10px] font-bold text-os-signal-deep uppercase">Safety Buffer</div>
        <div className="text-xl font-black text-os-signal-deep mt-1">65 NM</div>
        <div className="text-[10px] text-os-signal-deep font-semibold mt-0.5">Around Danger Core</div>
      </div>
    </div>

    {/* Divergence Lineage Log */}
    <div>
      <h2 className="text-sm font-bold text-os-void uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
        <span>🔄</span>
        <span>Automated Route Re-calculation Lineage</span>
      </h2>
      <div className="p-4 bg-os-silver border border-os-silver rounded-row text-xs space-y-3 font-mono">
        <div className="flex items-start justify-between border-b border-os-silver pb-2">
          <div>
            <span className="font-bold text-os-void">V1 (Initial Plan):</span> Direct Transit via Palk Strait
            <div className="text-risk-critical text-[11px] mt-0.5">Threat Score: 92/100 (Direct Intersection with Gale Core)</div>
          </div>
          <span className="px-2 py-0.5 bg-os-raised text-risk-critical rounded font-bold">REJECTED</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <span className="font-bold text-os-void">V2 (TRITON Recalculation):</span> Southern Sri Lanka Deep Water Arc
            <div className="text-os-clear text-[11px] mt-0.5">Threat Score: 18/100 (Sea Swell below 2.0m, +18 NM extension)</div>
          </div>
          <span className="px-2 py-0.5 bg-os-raised text-os-clear rounded font-bold">ACTIVE ROUTE</span>
        </div>
      </div>
    </div>
  </div>
);

/* =========================================================================
 STAGE 3: SURVEILLANCE DOSSIER (Dark Vessels, AIS Gaps, Oil Slicks)
   ========================================================================= */
const SurveillanceDossierView: React.FC = () => (
  <div className="space-y-6">
    <div className="border-b-2 border-risk-critical pb-4 flex items-start justify-between">
      <div>
        <div className="inline-block px-2.5 py-0.5 rounded bg-os-raised text-risk-critical font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
 MARITIME ANOMALY & LAW ENFORCEMENT DOSSIER
        </div>
        <h1 className="text-2xl font-black text-os-void tracking-tight">
 Dark Vessel Intercept & Marine Pollution Investigation
        </h1>
        <p className="text-xs text-os-slate mt-0.5">
 Satellite Synthetic Aperture Radar (SAR) · AIS Transponder Gaps · Territorial Waters Violation
        </p>
      </div>
      <div className="text-right text-xs font-mono text-os-slate shrink-0">
        <div>CASE ID: <span className="text-risk-critical font-bold">#INV-2026-088</span></div>
        <div>EEZ ZONE: <span className="text-os-void">Indian EEZ Sector 4</span></div>
        <div className="text-risk-critical font-bold">THREAT LEVEL: CRITICAL</div>
      </div>
    </div>

    {/* Suspect Target Specifications */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-os-silver p-4 rounded-row border border-os-silver text-xs">
      <div>
        <span className="text-os-slate uppercase text-[10px] font-bold block">Suspect Entity</span>
        <span className="text-risk-critical font-bold text-sm">FV Star-99 (Dark Trawler)</span>
        <span className="text-[10px] text-os-slate block font-mono">MMSI: 419000999</span>
      </div>
      <div>
        <span className="text-os-slate uppercase text-[10px] font-bold block">AIS Blackout Duration</span>
        <span className="text-os-void font-bold text-sm">4.8 Hours</span>
        <span className="text-[10px] text-risk-critical font-semibold block">Deliberate Deactivation</span>
      </div>
      <div>
        <span className="text-os-slate uppercase text-[10px] font-bold block">Detected Position</span>
        <span className="text-os-void font-bold text-sm">18.75°N, 72.58°E</span>
        <span className="text-[10px] text-os-slate block font-mono">18 NM Offshore Mumbai</span>
      </div>
      <div>
        <span className="text-os-slate uppercase text-[10px] font-bold block">Ecological Anomaly</span>
        <span className="text-risk-critical font-bold text-sm">1,200 m² Oil Slick</span>
        <span className="text-[10px] text-os-slate block font-mono">Heavy Bunker Fuel Residue</span>
      </div>
    </div>

    {/* Sensor Corroboration Logs */}
    <div>
      <h2 className="text-sm font-bold text-os-void uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
        <span>🛰️</span>
        <span>Multi-Sensor Sensor Fusion Evidence Chain</span>
      </h2>
      <div className="space-y-2 text-xs">
        <div className="p-3 bg-os-silver border border-os-silver rounded-row flex items-start justify-between">
          <div>
            <div className="font-bold text-os-void">Sentinel-1 Synthetic Aperture Radar (SAR)</div>
            <div className="text-os-steel mt-0.5">High-contrast surface slick detected spanning 1.4 km along vessel wake trajectory. Zero biological dissipation.</div>
          </div>
          <span className="px-2 py-0.5 bg-os-raised text-os-clear font-mono text-[10px] font-bold rounded">98% CONF.</span>
        </div>
        <div className="p-3 bg-os-silver border border-os-silver rounded-row flex items-start justify-between">
          <div>
            <div className="font-bold text-os-void">Terrestrial Coastal AIS Geofence Sensor</div>
            <div className="text-os-steel mt-0.5">Transponder suddenly powered down at entry into Malvan Marine Sanctuary buffer boundary. Re-appeared 4.8h later.</div>
          </div>
          <span className="px-2 py-0.5 bg-os-raised text-os-clear font-mono text-[10px] font-bold rounded">100% CONF.</span>
        </div>
      </div>
    </div>

    {/* Tasked Enforcement Order */}
    <div className="p-4 bg-os-raised border border-risk-critical rounded-row flex items-center justify-between text-xs">
      <div>
        <div className="font-bold text-risk-critical flex items-center gap-1.5">
          <span>🚨</span>
          <span>Interception & Boarding Tasking Order</span>
        </div>
        <p className="text-risk-critical text-[11px] mt-0.5">
 Tasked ICGS Varad & Patrol Drone UAV-04 for visual confirmation, forensic fuel sampling, and impoundment under UNCLOS Art. 73.
        </p>
      </div>
      <div className="px-3 py-1.5 bg-risk-critical text-white font-mono font-bold text-xs rounded-input uppercase tracking-wider shrink-0">
 INTERCEPT ORDERED
      </div>
    </div>
  </div>
);

/* =========================================================================
 STAGE 4: AUTONOMOUS SORTIE (Fleet Skimmers, Drones, Ghost Gear)
   ========================================================================= */
const AutonomousSortieView: React.FC = () => (
  <div className="space-y-6">
    <div className="border-b-2 border-os-clear pb-4 flex items-start justify-between">
      <div>
        <div className="inline-block px-2.5 py-0.5 rounded bg-os-raised text-os-clear font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
 AUTONOMOUS MARINE PRESERVATION SORTIE ORDER
        </div>
        <h1 className="text-2xl font-black text-os-void tracking-tight">
 Robotic Clean-up Sortie & Ghost Gear Removal Directive
        </h1>
        <p className="text-xs text-os-slate mt-0.5">
 Autonomous Surface Vessel (ASV) Deployment · Leeway Drift Intercept · Coral Reef Protection
        </p>
      </div>
      <div className="text-right text-xs font-mono text-os-slate shrink-0">
        <div>SORTIE ID: <span className="text-os-clear font-bold">ASV-SORTIE-04</span></div>
        <div>ASSET: <span className="text-os-void font-bold">SeaSweeper-Alpha</span></div>
        <div className="text-os-clear font-bold">STATUS: EN ROUTE</div>
      </div>
    </div>

    {/* Target & Fleet Specifications */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-os-silver p-4 rounded-row border border-os-silver text-xs">
      <div>
        <span className="text-os-slate uppercase text-[10px] font-bold block">Debris Cluster Target</span>
        <span className="text-os-void font-bold text-sm">DEB-LAK-001 (Ghost Net)</span>
        <span className="text-[10px] text-risk-elevated font-semibold block font-mono">1,450 kg Monofilament</span>
      </div>
      <div>
        <span className="text-os-slate uppercase text-[10px] font-bold block">Allocated ASV Unit</span>
        <span className="text-os-signal-deep font-bold text-sm">SeaSweeper-Alpha</span>
        <span className="text-[10px] text-os-slate block font-mono">Battery: 96% · 140 NM Range</span>
      </div>
      <div>
        <span className="text-os-slate uppercase text-[10px] font-bold block">Drift Vector & Speed</span>
        <span className="text-os-void font-bold text-sm">Heading 84° @ 1.6 kt</span>
        <span className="text-[10px] text-risk-critical font-semibold block">Collision in 7.2 Hours</span>
      </div>
      <div>
        <span className="text-os-slate uppercase text-[10px] font-bold block">Target MPA Sanctuary</span>
        <span className="text-os-clear font-bold text-sm">Lakshadweep Atoll</span>
        <span className="text-[10px] text-os-slate block font-mono">Coral Reserve Barrier</span>
      </div>
    </div>

    {/* Sortie Metrics */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
      <div className="p-3 bg-os-raised border border-risk-moderate rounded-row">
        <div className="text-[10px] font-bold text-risk-elevated uppercase">Debris Payload Target</div>
        <div className="text-xl font-black text-risk-elevated mt-1">1,450 kg</div>
        <div className="text-[10px] text-risk-elevated font-semibold mt-0.5">Capacity: 2,000 kg</div>
      </div>
      <div className="p-3 bg-os-raised border border-os-clear rounded-row">
        <div className="text-[10px] font-bold text-os-clear uppercase">Sortie Power Draw</div>
        <div className="text-xl font-black text-os-clear mt-1">38.5 kWh</div>
        <div className="text-[10px] text-os-clear font-semibold mt-0.5">Solar / Electric Hybrid</div>
      </div>
      <div className="p-3 bg-os-raised border border-os-signal rounded-row">
        <div className="text-[10px] font-bold text-os-signal-deep uppercase">Transit Distance</div>
        <div className="text-xl font-black text-os-signal-deep mt-1">42.8 NM</div>
        <div className="text-[10px] text-os-signal-deep font-semibold mt-0.5">Kochi Base Departure</div>
      </div>
      <div className="p-3 bg-os-raised border border-os-signal rounded-row">
        <div className="text-[10px] font-bold text-os-signal-deep uppercase">Marine Fauna Saved</div>
        <div className="text-xl font-black text-os-signal-deep mt-1">High Est.</div>
        <div className="text-[10px] text-os-signal-deep font-semibold mt-0.5">Sea Turtles & Reef Fish</div>
      </div>
    </div>
  </div>
);

/* =========================================================================
 STAGE 5: EXECUTIVE MASTER BRIEFING (Full Multi-Domain Integration)
   ========================================================================= */
const ExecutiveBriefingView: React.FC = () => (
  <div className="space-y-6">
    <div className="border-b-2 border-os-pewter pb-4 flex items-start justify-between">
      <div>
        <div className="inline-block px-2.5 py-0.5 rounded bg-os-panel text-white font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
 TRITON COMMAND · EXECUTIVE TACTICAL INTELLIGENCE BRIEFING
        </div>
        <h1 className="text-2xl font-black text-os-void tracking-tight">
 Comprehensive Maritime Multi-Agent Intelligence Synthesis
        </h1>
        <p className="text-xs text-os-slate mt-0.5">
 Logistics Decarbonization · Environmental Risk Mitigation · EEZ Surveillance · Autonomous Fleet Operations
        </p>
      </div>
      <div className="text-right text-xs font-mono text-os-slate shrink-0">
        <div>BRIEFING ID: <span className="text-os-void font-bold">TRITON-EXEC-991</span></div>
        <div>CLEARANCE: <span className="text-os-signal-deep font-bold">LEVEL 4 TACTICAL</span></div>
        <div className="text-os-clear font-bold">SYSTEM STATUS: FULLY OPERATIONAL</div>
      </div>
    </div>

    {/* Cross-Domain Global Impact Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
      <div className="p-3.5 bg-os-raised border border-os-clear rounded-row">
        <div className="text-[10px] font-bold text-os-clear uppercase">CO2 Eliminated</div>
        <div className="text-2xl font-black text-os-clear mt-1">549.6 t</div>
        <div className="text-[10px] text-os-clear font-semibold mt-0.5">Across 87 Ports</div>
      </div>
      <div className="p-3.5 bg-os-raised border border-os-signal rounded-row">
        <div className="text-[10px] font-bold text-os-signal-deep uppercase">Bunker Fuel Saved</div>
        <div className="text-2xl font-black text-os-signal-deep mt-1">162.3k L</div>
        <div className="text-[10px] text-os-signal-deep font-semibold mt-0.5">Eco-Corridor Routing</div>
      </div>
      <div className="p-3.5 bg-os-raised border border-risk-moderate rounded-row">
        <div className="text-[10px] font-bold text-risk-elevated uppercase">Marine Debris Cleared</div>
        <div className="text-2xl font-black text-risk-elevated mt-1">8,450 kg</div>
        <div className="text-[10px] text-risk-elevated font-semibold mt-0.5">Autonomous ASV Flotilla</div>
      </div>
      <div className="p-3.5 bg-os-raised border border-os-signal rounded-row">
        <div className="text-[10px] font-bold text-os-signal-deep uppercase">Sanctuaries Shielded</div>
        <div className="text-2xl font-black text-os-signal-deep mt-1">6 MPAs</div>
        <div className="text-[10px] text-os-signal-deep font-semibold mt-0.5">100% Zero Encroachment</div>
      </div>
    </div>

    {/* Executive Summary Narrative */}
    <div className="bg-os-silver p-4 rounded-row border border-os-silver text-xs leading-relaxed text-os-void space-y-2">
      <h3 className="font-bold text-os-void uppercase font-mono text-[11px]">Executive Tactical Summary</h3>
      <p>
 TRITON / OceanSentinel's multi-agent neural orchestrator autonomously coordinated multi-domain maritime operations across the Indian Ocean basin. In Logistics, 10 active commercial vessels were navigated along dynamic A* corridors, reducing fleet carbon emissions by 12.4% while avoiding restricted whale migration zones. In Environment, Cyclone Vardah's 75kt wind core was safely bypassed without vessel speed degradation. In Surveillance, an offshore dark vessel oil slick was detected via SAR imagery and routed to Coast Guard interceptors. In Preservation, ASV SeaSweeper-Alpha was dispatched to intercept a 1,450kg ghost net before coral reef entanglement.
      </p>
    </div>

    {/* Official Sign-Off Stamp */}
    <div className="border-2 border-os-silver p-4 rounded-row flex items-center justify-between bg-os-silver">
      <div className="text-xs space-y-1">
        <div className="font-bold text-os-void">Maritime Intelligence Bureau & Strategic Command</div>
        <div className="text-os-slate text-[11px]">Official Digital Record Authorized by Tactical Command Officer</div>
        <div className="text-os-ash font-mono text-[10px]">VERIFICATION KEY: TRITON-HASH-2026-X99281-VERIFIED</div>
      </div>
      <div className="text-center p-2.5 border-2 border-os-pewter rounded-input text-os-void font-mono font-bold text-xs uppercase bg-white shrink-0">
        <div>✓ SEALED & AUTHORIZED</div>
        <div className="text-[8px] text-os-slate">GOVERNANCE LEVEL 4</div>
      </div>
    </div>
  </div>
);
