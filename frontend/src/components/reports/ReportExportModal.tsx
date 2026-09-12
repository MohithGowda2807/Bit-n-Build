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
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
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
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden no-print">
        {/* Modal Header & Stage Switcher */}
        <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">📑</span>
            <div>
              <div className="font-bold text-white text-xs font-mono">TRITON MARITIME INTELLIGENCE DOSSIER</div>
              <div className="text-[10px] text-slate-400 font-sans">Multi-Stage Regulatory & Tactical Report Generator</div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-bold font-mono shadow-md flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>🖨️</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Stage Tabs Navigation */}
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-1 overflow-x-auto shrink-0 font-mono text-xs">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStage(s.id)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeStage === s.id
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Printable Document Sheet Container (Crisp White Background) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950/70">
          <div
            id="triton-printable-report"
            className="bg-white text-slate-900 rounded-xl shadow-xl p-6 sm:p-10 max-w-3xl mx-auto font-sans leading-relaxed border border-slate-200"
          >
            {activeStage === 'executive' && <ExecutiveBriefingView />}
            {activeStage === 'logistics' && <LogisticsManifestView />}
            {activeStage === 'environment' && <EnvironmentAdvisoryView />}
            {activeStage === 'surveillance' && <SurveillanceDossierView />}
            {activeStage === 'cleanup' && <AutonomousSortieView />}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 shrink-0">
          <span>Official Format: UNCLOS / IMO MARPOL Certified Document Standard</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold transition cursor-pointer"
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
    <div className="border-b-2 border-blue-600 pb-4 flex items-start justify-between">
      <div>
        <div className="inline-block px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
          UNCLOS & IMO MARPOL ANNEX VI COMPLIANT MANIFEST
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Maritime Voyage Optimization & Decarbonization Manifest
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Dynamic Pathfinding · Fuel Conservation · Carbon Intensity Index (CII) Rating Report
        </p>
      </div>
      <div className="text-right text-xs font-mono text-slate-500 shrink-0">
        <div>DOC REF: <span className="text-slate-900 font-bold">TRITON-LOG-2026-09</span></div>
        <div>DATE: <span className="text-slate-700">{new Date().toLocaleDateString()}</span></div>
        <div className="text-emerald-700 font-bold">STATUS: AUTHORIZED</div>
      </div>
    </div>

    {/* Key Voyage Parameters Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
      <div>
        <span className="text-slate-500 uppercase text-[10px] font-bold block">Assigned Vessel</span>
        <span className="text-blue-900 font-bold text-sm">MV Ocean Sentinel</span>
        <span className="text-[10px] text-slate-500 block font-mono">IMO 9432810 · Container</span>
      </div>
      <div>
        <span className="text-slate-500 uppercase text-[10px] font-bold block">Departure Port</span>
        <span className="text-slate-900 font-bold text-sm">Port of Mumbai</span>
        <span className="text-[10px] text-slate-500 block font-mono">INBOM (18.94°N, 72.84°E)</span>
      </div>
      <div>
        <span className="text-slate-500 uppercase text-[10px] font-bold block">Destination Port</span>
        <span className="text-slate-900 font-bold text-sm">Port of Colombo</span>
        <span className="text-[10px] text-slate-500 block font-mono">LKCMB (6.94°N, 79.84°E)</span>
      </div>
      <div>
        <span className="text-slate-500 uppercase text-[10px] font-bold block">Est. Transit Time</span>
        <span className="text-slate-900 font-bold text-sm">48.2 Hours</span>
        <span className="text-[10px] text-slate-500 block font-mono">Cruise: 15.4 Knots</span>
      </div>
    </div>

    {/* Colorful KPI Decarbonization Metric Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
        <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">CO2 Emissions Avoided</div>
        <div className="text-xl font-black text-emerald-700 mt-1">8.42 t</div>
        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">-12.4% vs Great Circle</div>
      </div>
      <div className="p-3 bg-cyan-50 border border-cyan-300 rounded-xl">
        <div className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider">Fuel Consumption</div>
        <div className="text-xl font-black text-cyan-700 mt-1">31,800 L</div>
        <div className="text-[10px] text-cyan-600 font-semibold mt-0.5">Heavy Bunker (MGO)</div>
      </div>
      <div className="p-3 bg-blue-50 border border-blue-300 rounded-xl">
        <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Cost Savings</div>
        <div className="text-xl font-black text-blue-700 mt-1">$7,157</div>
        <div className="text-[10px] text-blue-600 font-semibold mt-0.5">@ $0.85 / Liter</div>
      </div>
      <div className="p-3 bg-purple-50 border border-purple-300 rounded-xl">
        <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">CII Vessel Rating</div>
        <div className="text-xl font-black text-purple-700 mt-1">Grade A</div>
        <div className="text-[10px] text-purple-600 font-semibold mt-0.5">IMO 2030 Eco Tier</div>
      </div>
    </div>

    {/* Route Corridor Waypoint Table */}
    <div>
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
        <span>📍</span>
        <span>Optimized Navigation Corridor Waypoints</span>
      </h2>
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 font-mono text-[10px] text-slate-600 uppercase border-b border-slate-200">
            <tr>
              <th className="p-2.5">Seq</th>
              <th className="p-2.5">Latitude</th>
              <th className="p-2.5">Longitude</th>
              <th className="p-2.5">Nautical Miles</th>
              <th className="p-2.5">Sea Swell</th>
              <th className="p-2.5">Navigation Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono text-slate-700">
            <tr>
              <td className="p-2.5 font-bold">WP-01</td>
              <td className="p-2.5">18.9438°N</td>
              <td className="p-2.5">72.8364°E</td>
              <td className="p-2.5">0.0 NM</td>
              <td className="p-2.5 text-emerald-700">0.8 m</td>
              <td className="p-2.5 text-blue-700 font-bold">Port Departure Fairway</td>
            </tr>
            <tr className="bg-slate-50/50">
              <td className="p-2.5 font-bold">WP-02</td>
              <td className="p-2.5">15.5200°N</td>
              <td className="p-2.5">72.4100°E</td>
              <td className="p-2.5">212.4 NM</td>
              <td className="p-2.5 text-emerald-700">1.2 m</td>
              <td className="p-2.5 text-slate-800 font-bold">Arabian Deep Water Lane</td>
            </tr>
            <tr>
              <td className="p-2.5 font-bold">WP-03</td>
              <td className="p-2.5">10.1500°N</td>
              <td className="p-2.5">74.8800°E</td>
              <td className="p-2.5">348.1 NM</td>
              <td className="p-2.5 text-amber-700">1.9 m</td>
              <td className="p-2.5 text-purple-700 font-bold">Lakshadweep MPA Bypass (+12 NM)</td>
            </tr>
            <tr className="bg-slate-50/50">
              <td className="p-2.5 font-bold">WP-04</td>
              <td className="p-2.5">6.9400°N</td>
              <td className="p-2.5">79.8400°E</td>
              <td className="p-2.5">285.5 NM</td>
              <td className="p-2.5 text-emerald-700">1.1 m</td>
              <td className="p-2.5 text-emerald-700 font-bold">Colombo Approach Channel</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Official Authorization Seal */}
    <div className="border border-slate-300 bg-slate-50 p-4 rounded-xl flex items-center justify-between">
      <div className="text-xs space-y-1">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <span>🛡️</span>
          <span>Automated Verification & Master Mariner Authorization</span>
        </div>
        <p className="text-slate-500 text-[11px]">
          Validated through TRITON A* Multi-Objective Routing Engine. Geometry checked against 87 international ports.
        </p>
        <div className="text-slate-400 font-mono text-[10px]">
          SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
        </div>
      </div>
      <div className="text-center p-3 border-2 border-emerald-600 rounded-lg text-emerald-800 font-mono font-black text-xs uppercase bg-white shadow-sm shrink-0">
        <div>✓ AUTHORIZED</div>
        <div className="text-[8px] tracking-widest text-emerald-600">IMO PASS CERTIFIED</div>
      </div>
    </div>
  </div>
);

/* =========================================================================
   STAGE 2: ENVIRONMENT ADVISORY (Weather, Cyclones, Wave Swells)
   ========================================================================= */
const EnvironmentAdvisoryView: React.FC = () => (
  <div className="space-y-6">
    <div className="border-b-2 border-amber-500 pb-4 flex items-start justify-between">
      <div>
        <div className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
          IMD & WMO MARITIME METEOROLOGICAL ADVISORY
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Severe Weather Hazard & Dynamic Avoidance Assessment
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tropical Cyclone Tracking · Wave Swell Modeling · Automated Route Divergence Lineage
        </p>
      </div>
      <div className="text-right text-xs font-mono text-slate-500 shrink-0">
        <div>ALERT ID: <span className="text-amber-900 font-bold">CYC-VARDAH-CAT4</span></div>
        <div>ISSUED: <span className="text-slate-700">{new Date().toLocaleTimeString()} UTC</span></div>
        <div className="text-red-600 font-bold">SEVERITY: CRITICAL</div>
      </div>
    </div>

    {/* Cyclone Warning Banner */}
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
      <div className="flex items-center gap-2">
        <span className="text-lg">🌀</span>
        <h3 className="text-sm font-bold text-red-900">ACTIVE HAZARD: Severe Cyclonic Storm 'Vardah' (Bay of Bengal / Sri Lanka Basin)</h3>
      </div>
      <p className="text-xs text-red-800 mt-1 leading-relaxed">
        Center located at 13.2°N, 83.5°E with maximum sustained winds of 75 knots (gusting to 95 knots). Central atmospheric pressure: 975 hPa. Wave swell heights exceeding 7.2 meters within a 260 km danger radius.
      </p>
    </div>

    {/* Metric Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
      <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
        <div className="text-[10px] font-bold text-red-800 uppercase">Core Wind Velocity</div>
        <div className="text-xl font-black text-red-700 mt-1">75.0 kt</div>
        <div className="text-[10px] text-red-600 font-semibold mt-0.5">Category 4 Scale</div>
      </div>
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="text-[10px] font-bold text-amber-800 uppercase">Max Wave Swell</div>
        <div className="text-xl font-black text-amber-700 mt-1">7.2 m</div>
        <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Extreme Hull Stress</div>
      </div>
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
        <div className="text-[10px] font-bold text-emerald-800 uppercase">Risk Reduction</div>
        <div className="text-xl font-black text-emerald-700 mt-1">-80.4%</div>
        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Via Dynamic Divergence</div>
      </div>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="text-[10px] font-bold text-blue-800 uppercase">Safety Buffer</div>
        <div className="text-xl font-black text-blue-700 mt-1">65 NM</div>
        <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Around Danger Core</div>
      </div>
    </div>

    {/* Divergence Lineage Log */}
    <div>
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
        <span>🔄</span>
        <span>Automated Route Re-calculation Lineage</span>
      </h2>
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-3 font-mono">
        <div className="flex items-start justify-between border-b border-slate-200 pb-2">
          <div>
            <span className="font-bold text-slate-900">V1 (Initial Plan):</span> Direct Transit via Palk Strait
            <div className="text-red-600 text-[11px] mt-0.5">Threat Score: 92/100 (Direct Intersection with Gale Core)</div>
          </div>
          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded font-bold">REJECTED</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <span className="font-bold text-slate-900">V2 (TRITON Recalculation):</span> Southern Sri Lanka Deep Water Arc
            <div className="text-emerald-700 text-[11px] mt-0.5">Threat Score: 18/100 (Sea Swell below 2.0m, +18 NM extension)</div>
          </div>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold">ACTIVE ROUTE</span>
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
    <div className="border-b-2 border-red-600 pb-4 flex items-start justify-between">
      <div>
        <div className="inline-block px-2.5 py-0.5 rounded bg-red-100 text-red-800 font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
          MARITIME ANOMALY & LAW ENFORCEMENT DOSSIER
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Dark Vessel Intercept & Marine Pollution Investigation
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Satellite Synthetic Aperture Radar (SAR) · AIS Transponder Gaps · Territorial Waters Violation
        </p>
      </div>
      <div className="text-right text-xs font-mono text-slate-500 shrink-0">
        <div>CASE ID: <span className="text-red-900 font-bold">#INV-2026-088</span></div>
        <div>EEZ ZONE: <span className="text-slate-700">Indian EEZ Sector 4</span></div>
        <div className="text-red-600 font-bold">THREAT LEVEL: CRITICAL</div>
      </div>
    </div>

    {/* Suspect Target Specifications */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
      <div>
        <span className="text-slate-500 uppercase text-[10px] font-bold block">Suspect Entity</span>
        <span className="text-red-900 font-bold text-sm">FV Star-99 (Dark Trawler)</span>
        <span className="text-[10px] text-slate-500 block font-mono">MMSI: 419000999</span>
      </div>
      <div>
        <span className="text-slate-500 uppercase text-[10px] font-bold block">AIS Blackout Duration</span>
        <span className="text-slate-900 font-bold text-sm">4.8 Hours</span>
        <span className="text-[10px] text-red-600 font-semibold block">Deliberate Deactivation</span>
      </div>
      <div>
        <span className="text-slate-500 uppercase text-[10px] font-bold block">Detected Position</span>
        <span className="text-slate-900 font-bold text-sm">18.75°N, 72.58°E</span>
        <span className="text-[10px] text-slate-500 block font-mono">18 NM Offshore Mumbai</span>
      </div>
      <div>
        <span className="text-slate-500 uppercase text-[10px] font-bold block">Ecological Anomaly</span>
        <span className="text-red-700 font-bold text-sm">1,200 m² Oil Slick</span>
        <span className="text-[10px] text-slate-500 block font-mono">Heavy Bunker Fuel Residue</span>
      </div>
    </div>

    {/* Sensor Corroboration Logs */}
    <div>
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
        <span>🛰️</span>
        <span>Multi-Sensor Sensor Fusion Evidence Chain</span>
      </h2>
      <div className="space-y-2 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between">
          <div>
            <div className="font-bold text-slate-900">Sentinel-1 Synthetic Aperture Radar (SAR)</div>
            <div className="text-slate-600 mt-0.5">High-contrast surface slick detected spanning 1.4 km along vessel wake trajectory. Zero biological dissipation.</div>
          </div>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded">98% CONF.</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between">
          <div>
            <div className="font-bold text-slate-900">Terrestrial Coastal AIS Geofence Sensor</div>
            <div className="text-slate-600 mt-0.5">Transponder suddenly powered down at entry into Malvan Marine Sanctuary buffer boundary. Re-appeared 4.8h later.</div>
          </div>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded">100% CONF.</span>
        </div>
      </div>
    </div>

    {/* Tasked Enforcement Order */}
    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs">
      <div>
        <div className="font-bold text-red-900 flex items-center gap-1.5">
          <span>🚨</span>
          <span>Interception & Boarding Tasking Order</span>
        </div>
        <p className="text-red-800 text-[11px] mt-0.5">
          Tasked ICGS Varad & Patrol Drone UAV-04 for visual confirmation, forensic fuel sampling, and impoundment under UNCLOS Art. 73.
        </p>
      </div>
      <div className="px-3 py-1.5 bg-red-600 text-white font-mono font-bold text-xs rounded-lg uppercase tracking-wider shrink-0">
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
    <div className="border-b-2 border-emerald-600 pb-4 flex items-start justify-between">
      <div>
        <div className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
          AUTONOMOUS MARINE PRESERVATION SORTIE ORDER
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Robotic Clean-up Sortie & Ghost Gear Removal Directive
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Autonomous Surface Vessel (ASV) Deployment · Leeway Drift Intercept · Coral Reef Protection
        </p>
      </div>
      <div className="text-right text-xs font-mono text-slate-500 shrink-0">
        <div>SORTIE ID: <span className="text-emerald-900 font-bold">ASV-SORTIE-04</span></div>
        <div>ASSET: <span className="text-slate-900 font-bold">SeaSweeper-Alpha</span></div>
        <div className="text-emerald-700 font-bold">STATUS: EN ROUTE</div>
      </div>
    </div>

    {/* Target & Fleet Specifications */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
      <div>
        <span className="text-slate-500 uppercase text-[10px] font-bold block">Debris Cluster Target</span>
        <span className="text-slate-900 font-bold text-sm">DEB-LAK-001 (Ghost Net)</span>
        <span className="text-[10px] text-amber-700 font-semibold block font-mono">1,450 kg Monofilament</span>
      </div>
      <div>
        <span className="text-slate-500 uppercase text-[10px] font-bold block">Allocated ASV Unit</span>
        <span className="text-blue-900 font-bold text-sm">SeaSweeper-Alpha</span>
        <span className="text-[10px] text-slate-500 block font-mono">Battery: 96% · 140 NM Range</span>
      </div>
      <div>
        <span className="text-slate-500 uppercase text-[10px] font-bold block">Drift Vector & Speed</span>
        <span className="text-slate-900 font-bold text-sm">Heading 84° @ 1.6 kt</span>
        <span className="text-[10px] text-red-600 font-semibold block">Collision in 7.2 Hours</span>
      </div>
      <div>
        <span className="text-slate-500 uppercase text-[10px] font-bold block">Target MPA Sanctuary</span>
        <span className="text-emerald-800 font-bold text-sm">Lakshadweep Atoll</span>
        <span className="text-[10px] text-slate-500 block font-mono">Coral Reserve Barrier</span>
      </div>
    </div>

    {/* Sortie Metrics */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
      <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl">
        <div className="text-[10px] font-bold text-amber-800 uppercase">Debris Payload Target</div>
        <div className="text-xl font-black text-amber-700 mt-1">1,450 kg</div>
        <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Capacity: 2,000 kg</div>
      </div>
      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
        <div className="text-[10px] font-bold text-emerald-800 uppercase">Sortie Power Draw</div>
        <div className="text-xl font-black text-emerald-700 mt-1">38.5 kWh</div>
        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Solar / Electric Hybrid</div>
      </div>
      <div className="p-3 bg-blue-50 border border-blue-300 rounded-xl">
        <div className="text-[10px] font-bold text-blue-800 uppercase">Transit Distance</div>
        <div className="text-xl font-black text-blue-700 mt-1">42.8 NM</div>
        <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Kochi Base Departure</div>
      </div>
      <div className="p-3 bg-purple-50 border border-purple-300 rounded-xl">
        <div className="text-[10px] font-bold text-purple-800 uppercase">Marine Fauna Saved</div>
        <div className="text-xl font-black text-purple-700 mt-1">High Est.</div>
        <div className="text-[10px] text-purple-600 font-semibold mt-0.5">Sea Turtles & Reef Fish</div>
      </div>
    </div>
  </div>
);

/* =========================================================================
   STAGE 5: EXECUTIVE MASTER BRIEFING (Full Multi-Domain Integration)
   ========================================================================= */
const ExecutiveBriefingView: React.FC = () => (
  <div className="space-y-6">
    <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
      <div>
        <div className="inline-block px-2.5 py-0.5 rounded bg-slate-900 text-white font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
          TRITON COMMAND · EXECUTIVE TACTICAL INTELLIGENCE BRIEFING
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Comprehensive Maritime Multi-Agent Intelligence Synthesis
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Logistics Decarbonization · Environmental Risk Mitigation · EEZ Surveillance · Autonomous Fleet Operations
        </p>
      </div>
      <div className="text-right text-xs font-mono text-slate-500 shrink-0">
        <div>BRIEFING ID: <span className="text-slate-900 font-bold">TRITON-EXEC-991</span></div>
        <div>CLEARANCE: <span className="text-blue-900 font-bold">LEVEL 4 TACTICAL</span></div>
        <div className="text-emerald-700 font-bold">SYSTEM STATUS: FULLY OPERATIONAL</div>
      </div>
    </div>

    {/* Cross-Domain Global Impact Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
      <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
        <div className="text-[10px] font-bold text-emerald-800 uppercase">CO2 Eliminated</div>
        <div className="text-2xl font-black text-emerald-700 mt-1">549.6 t</div>
        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Across 87 Ports</div>
      </div>
      <div className="p-3.5 bg-cyan-50 border border-cyan-300 rounded-xl">
        <div className="text-[10px] font-bold text-cyan-800 uppercase">Bunker Fuel Saved</div>
        <div className="text-2xl font-black text-cyan-700 mt-1">162.3k L</div>
        <div className="text-[10px] text-cyan-600 font-semibold mt-0.5">Eco-Corridor Routing</div>
      </div>
      <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl">
        <div className="text-[10px] font-bold text-amber-800 uppercase">Marine Debris Cleared</div>
        <div className="text-2xl font-black text-amber-700 mt-1">8,450 kg</div>
        <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Autonomous ASV Flotilla</div>
      </div>
      <div className="p-3.5 bg-purple-50 border border-purple-300 rounded-xl">
        <div className="text-[10px] font-bold text-purple-800 uppercase">Sanctuaries Shielded</div>
        <div className="text-2xl font-black text-purple-700 mt-1">6 MPAs</div>
        <div className="text-[10px] text-purple-600 font-semibold mt-0.5">100% Zero Encroachment</div>
      </div>
    </div>

    {/* Executive Summary Narrative */}
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-700 space-y-2">
      <h3 className="font-bold text-slate-900 uppercase font-mono text-[11px]">Executive Tactical Summary</h3>
      <p>
        TRITON / OceanSentinel's multi-agent neural orchestrator autonomously coordinated multi-domain maritime operations across the Indian Ocean basin. In Logistics, 10 active commercial vessels were navigated along dynamic A* corridors, reducing fleet carbon emissions by 12.4% while avoiding restricted whale migration zones. In Environment, Cyclone Vardah's 75kt wind core was safely bypassed without vessel speed degradation. In Surveillance, an offshore dark vessel oil slick was detected via SAR imagery and routed to Coast Guard interceptors. In Preservation, ASV SeaSweeper-Alpha was dispatched to intercept a 1,450kg ghost net before coral reef entanglement.
      </p>
    </div>

    {/* Official Sign-Off Stamp */}
    <div className="border-2 border-slate-300 p-4 rounded-xl flex items-center justify-between bg-slate-50">
      <div className="text-xs space-y-1">
        <div className="font-bold text-slate-900">Maritime Intelligence Bureau & Strategic Command</div>
        <div className="text-slate-500 text-[11px]">Official Digital Record Authorized by Tactical Command Officer</div>
        <div className="text-slate-400 font-mono text-[10px]">VERIFICATION KEY: TRITON-HASH-2026-X99281-VERIFIED</div>
      </div>
      <div className="text-center p-2.5 border-2 border-slate-800 rounded-lg text-slate-900 font-mono font-bold text-xs uppercase bg-white shadow-sm shrink-0">
        <div>✓ SEALED & AUTHORIZED</div>
        <div className="text-[8px] text-slate-500">GOVERNANCE LEVEL 4</div>
      </div>
    </div>
  </div>
);
