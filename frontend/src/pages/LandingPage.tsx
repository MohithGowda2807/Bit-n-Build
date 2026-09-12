import React, { useState } from 'react';
import { OceanCanvasBackground } from '../components/landing/OceanCanvasBackground';
import { Domain } from '../components/shell/TopBar';

interface LandingPageProps {
 onLaunchApp: (domain?: Domain) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
 const [selectedScenario, setSelectedScenario] = useState<'cyclone' | 'squall' | 'monsoon'>('cyclone');
 const [simulatorMode, setSimulatorMode] = useState<'advisory' | 'semi' | 'autonomous'>('autonomous');
 const [activePillar, setActivePillar] = useState<number>(0);

 const scenarioMetrics = {
 cyclone: {
 title: 'Cyclone Vardah (Bay of Bengal)',
 origin: 'Jawaharlal Nehru Port (Mumbai)',
 destination: 'Singapore Port',
 distance: '4,635 km',
 fuelSaved: '415,171 L (-45.4%)',
 co2Avoided: '1,556.9 t',
 bunkerCost: '$424,960 (Saved $354k)',
 routeScore: '85.0 pts (Eco-Corridor Green)',
 evasion: 'Evaded 65 knot wind core by 180 NM south'
    },
 squall: {
 title: 'Sumatra Squall (Malacca Chokepoint)',
 origin: 'Colombo Transshipment Hub',
 destination: 'Shanghai Deepwater Port',
 distance: '5,120 km',
 fuelSaved: '320,400 L (-38.2%)',
 co2Avoided: '1,210.4 t',
 bunkerCost: '$512,000 (Saved $280k)',
 routeScore: '88.5 pts (Chokepoint Optimized)',
 evasion: 'Synchronized with tidal surges; averted 4.2h port congestion'
    },
 monsoon: {
 title: 'Arabian Sea Monsoon Depression',
 origin: 'Kochi Marine Gateway',
 destination: 'Jebel Ali Port (Dubai)',
 distance: '3,290 km',
 fuelSaved: '284,500 L (-42.1%)',
 co2Avoided: '984.6 t',
 bunkerCost: '$310,200 (Saved $215k)',
 routeScore: '91.2 pts (Optimal Drift Assist)',
 evasion: 'Harnessed 1.8 kn current vector tailwind; 0 hull stress exceedance'
    }
  };

 const currentSim = scenarioMetrics[selectedScenario];

 return (
    <div className="relative min-h-screen bg-os-void text-white font-sans selection:bg-os-signal/30 selection:text-os-signal overflow-x-hidden">
      {/* 60 FPS HTML5 Ocean Radar & Wave Canvas Background */}
      <OceanCanvasBackground />

      {/* Subtle top glow & vignette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 blur-3xl pointer-events-none z-0" />

      {/* ========================================================= */}
      {/* 1. TOP FLOATING GLASSMORPHIC NAVIGATION BAR              */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 bg-os-void border-b border-os-pewter">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-row p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-os-void rounded-[10px] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-os-signal">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v18M3 12h18" />
                  <circle cx="12" cy="12" r="3" fill="#3d9bff" stroke="none" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white font-mono">TRITON</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-os-signal/15 border border-os-signal text-os-signal font-mono font-bold uppercase">
 OceanSentinel OS
                </span>
              </div>
              <span className="text-[10px] text-os-ash font-mono hidden sm:block">Autonomous Maritime Intelligence & Restoration</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-mono text-os-fog">
            <a href="#capabilities" className="hover:text-os-signal transition">Capabilities</a>
            <a href="#simulator" className="hover:text-os-signal transition">Live Simulator</a>
            <a href="#architecture" className="hover:text-os-signal transition">Swarm Architecture</a>
            <a href="#impact" className="hover:text-os-signal transition">Global Impact</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-os-panel border border-os-clear text-os-clear font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-os-raised animate-pulse" />
              <span>KERNEL v4.2 ONLINE</span>
            </div>

            <button
 onClick={() => onLaunchApp('logistics')}
 className="px-4 py-2 rounded-row hover: hover: text-white font-mono font-bold text-xs uppercase tracking-wider border border-os-signal flex items-center space-x-2 transition cursor-pointer active:scale-95"
            >
              <span>Launch Command Center</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SECTION WITH HIGH-IMPACT TYPOGRAPHY & TELEMETRY   */}
      {/* ========================================================= */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        {/* Status Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-os-panel border border-os-signal text-os-signal font-mono text-xs mb-8">
          <span className="w-2 h-2 rounded-full bg-os-raised animate-ping" />
          <span className="font-semibold">REAL-TIME MULTI-AGENT OCEAN TELEMETRY · 4,635 NM PATROLLED</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-5xl mx-auto text-white">
 Autonomous Maritime Intelligence &{' '}
          <span className=" text-white">
 Ocean Restoration OS
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-os-fog max-w-3xl mx-auto font-normal leading-relaxed font-sans">
 TRITON unifies satellite multi-spectral radar surveillance, reinforcement-learning eco-routing,
 and autonomous robotic drone swarms to eliminate marine debris and decarbonize global shipping.
        </p>

        {/* Dual CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
 onClick={() => onLaunchApp('logistics')}
 className="px-7 py-3.5 rounded-row hover: hover: text-white font-mono font-bold text-sm uppercase tracking-wider border border-os-signal flex items-center space-x-3 transition cursor-pointer active:scale-95"
          >
            <span>Enter Tactical Command Center</span>
            <span className="text-lg">➔</span>
          </button>

          <a
 href="#simulator"
 className="px-6 py-3.5 rounded-row bg-os-panel hover:bg-os-raised text-white hover:text-white font-mono font-semibold text-sm border border-os-pewter hover:border-os-silver transition flex items-center space-x-2 cursor-pointer"
          >
            <span>⚡ Test Live Simulator</span>
          </a>
        </div>

        {/* Fast Jump Chips into Specific Modules */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono">
          <span className="text-os-slate uppercase tracking-wider text-[10px] font-semibold">Direct Module Launch:</span>
          <button
 onClick={() => onLaunchApp('logistics')}
 className="px-2.5 py-1 rounded-input bg-os-panel border border-os-pewter hover:border-os-silver text-os-signal hover:text-white transition cursor-pointer"
          >
            🚢 Eco-Route Logistics
          </button>
          <button
 onClick={() => onLaunchApp('cleanup')}
 className="px-2.5 py-1 rounded-input bg-os-panel border border-os-pewter hover:border-os-clear text-os-clear hover:text-white transition cursor-pointer"
          >
            🎯 Autonomous Sortie Studio
          </button>
          <button
 onClick={() => onLaunchApp('surveillance')}
 className="px-2.5 py-1 rounded-input bg-os-panel border border-os-pewter hover:border-risk-moderate text-risk-moderate hover:text-white transition cursor-pointer"
          >
            🛰️ Sentinel Radar Surveillance
          </button>
          <button
 onClick={() => onLaunchApp('agents')}
 className="px-2.5 py-1 rounded-input bg-os-panel border border-os-pewter hover:border-os-silver text-os-signal hover:text-white transition cursor-pointer"
          >
            💬 Ask TRITON Copilot
          </button>
        </div>

        {/* Live Metrics Grid Pill Carousel */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl mx-auto text-left">
          <div className="p-4 rounded-panel bg-os-panel border border-os-pewter">
            <div className="text-[10px] font-mono text-os-ash uppercase tracking-wider">Patrolled Corridors</div>
            <div className="text-xl font-bold text-white font-mono mt-1">4,635+ NM</div>
            <div className="text-[10px] text-os-signal font-mono mt-0.5">● Arabian & Bengal Seas</div>
          </div>
          <div className="p-4 rounded-panel bg-os-panel border border-os-pewter">
            <div className="text-[10px] font-mono text-os-ash uppercase tracking-wider">Net CO₂ Abated</div>
            <div className="text-xl font-bold text-os-clear font-mono mt-1">1,556.9 t</div>
            <div className="text-[10px] text-os-clear font-mono mt-0.5">▲ 45.4% Carbon Cut</div>
          </div>
          <div className="p-4 rounded-panel bg-os-panel border border-os-pewter">
            <div className="text-[10px] font-mono text-os-ash uppercase tracking-wider">Fuel Burn Saved</div>
            <div className="text-xl font-bold text-os-signal font-mono mt-1">415,171 L</div>
            <div className="text-[10px] text-os-signal font-mono mt-0.5">$354,000 Saved / Voyage</div>
          </div>
          <div className="p-4 rounded-panel bg-os-panel border border-os-pewter">
            <div className="text-[10px] font-mono text-os-ash uppercase tracking-wider">Debris Intercepted</div>
            <div className="text-xl font-bold text-risk-moderate font-mono mt-1">8,420 kg</div>
            <div className="text-[10px] text-risk-moderate font-mono mt-0.5">14 Ghost Nets Cleared</div>
          </div>
          <div className="p-4 rounded-panel bg-os-panel border border-os-pewter">
            <div className="text-[10px] font-mono text-os-ash uppercase tracking-wider">Autonomous Fleet</div>
            <div className="text-xl font-bold text-os-clear font-mono mt-1">28 Units</div>
            <div className="text-[10px] text-os-clear font-mono mt-0.5">ASVs & Drone Swarms</div>
          </div>
          <div className="p-4 rounded-panel bg-os-panel border border-os-pewter">
            <div className="text-[10px] font-mono text-os-ash uppercase tracking-wider">Safety Rating</div>
            <div className="text-xl font-bold text-white font-mono mt-1">100.0%</div>
            <div className="text-[10px] text-os-clear font-mono mt-0.5">0 Extreme Weather Hits</div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE LIVE TACTICAL SIMULATOR SANDBOX            */}
      {/* ========================================================= */}
      <section id="simulator" className="relative z-10 py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 rounded-panel bg-os-panel border border-os-signal">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-os-pewter">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-os-signal uppercase tracking-widest">
 Live Interactive Laboratory
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-os-raised text-os-signal border border-os-signal font-bold">
 TURBO A* PARETO SOLVER
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
 Real-Time Ocean Mission Simulation Sandbox
              </h2>
              <p className="text-xs sm:text-sm text-os-ash mt-1 max-w-2xl font-sans">
 Toggle meteorological storms, shift agent operating autonomy, and observe live Pareto-optimal
 re-routing and autonomous drone interception calculations in real time.
              </p>
            </div>

            {/* Simulation Action button */}
            <button
 onClick={() => onLaunchApp('logistics')}
 className="px-5 py-2.5 rounded-row hover: hover: text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 transition cursor-pointer active:scale-95"
            >
              <span>Launch This Mission in Console</span>
              <span>➔</span>
            </button>
          </div>

          {/* Interactive Controls Bar */}
          <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-os-pewter">
            {/* Choose Storm Scenario */}
            <div>
              <label className="text-xs font-mono font-bold text-os-fog uppercase tracking-wider block mb-2">
 1. Select Environmental Storm Scenario:
              </label>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {(['cyclone', 'squall', 'monsoon'] as const).map(sc => (
                  <button
 key={sc}
 onClick={() => setSelectedScenario(sc)}
 className={`p-2.5 rounded-row border text-center transition cursor-pointer ${
 selectedScenario === sc
                        ? 'bg-os-raised border-os-signal text-white font-bold'
                        : 'bg-os-void border-os-pewter text-os-ash hover:border-os-pewter hover:text-white'
                    }`}
                  >
                    <div>{sc === 'cyclone' ? '🌀 Cyclone' : sc === 'squall' ? '⛈️ Squall' : '🌊 Monsoon'}</div>
                    <div className="text-[10px] text-os-ash mt-0.5 truncate">
                      {sc === 'cyclone' ? 'Bay of Bengal' : sc === 'squall' ? 'Malacca Strait' : 'Arabian Sea'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Autonomy Mode */}
            <div>
              <label className="text-xs font-mono font-bold text-os-fog uppercase tracking-wider block mb-2">
 2. Select Agent Operating Autonomy:
              </label>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {(['advisory', 'semi', 'autonomous'] as const).map(m => (
                  <button
 key={m}
 onClick={() => setSimulatorMode(m)}
 className={`p-2.5 rounded-row border text-center transition cursor-pointer ${
 simulatorMode === m
                        ? 'bg-os-raised border-os-signal text-white font-bold'
                        : 'bg-os-void border-os-pewter text-os-ash hover:border-os-pewter hover:text-white'
                    }`}
                  >
                    <div>{m === 'advisory' ? '🛡️ Advisory' : m === 'semi' ? '⚙️ Semi-Auto' : '⚡ Autonomous'}</div>
                    <div className="text-[10px] text-os-ash mt-0.5">
                      {m === 'advisory' ? 'Human in Loop' : m === 'semi' ? 'Operator Signoff' : 'Auto Dispatch'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Calculated Tactical Output */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Tactical Telemetry */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-os-signal">
 TACTICAL ROUTE SOLUTION: {currentSim.title.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-os-raised border border-os-clear text-os-clear font-bold">
                  ✓ TSP 2-OPT & A* CONVERGED
                </span>
              </div>

              {/* Waypoint Track Preview */}
              <div className="p-4 rounded-row bg-os-void border border-os-pewter font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-os-ash">
                  <span>Origin: <strong className="text-white">{currentSim.origin}</strong></span>
                  <span>Destination: <strong className="text-white">{currentSim.destination}</strong></span>
                </div>
                <div className="h-1.5 w-full bg-os-raised rounded-full overflow-hidden">
                  <div className="h-full rounded-full w-4/5 animate-pulse" />
                </div>
                <div className="text-[11px] text-risk-moderate italic">
                  💡 Tactical Evasion Rationale: {currentSim.evasion}
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-os-void border border-os-pewter rounded-row">
                  <div className="text-[10px] font-mono text-os-ash">OPTIMIZED DISTANCE</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">{currentSim.distance}</div>
                </div>
                <div className="p-3 bg-os-void border border-os-pewter rounded-row">
                  <div className="text-[10px] font-mono text-os-ash">FUEL BURN CUT</div>
                  <div className="text-base font-bold text-os-signal font-mono mt-0.5">{currentSim.fuelSaved}</div>
                </div>
                <div className="p-3 bg-os-void border border-os-pewter rounded-row">
                  <div className="text-[10px] font-mono text-os-ash">CO₂ ABATED</div>
                  <div className="text-base font-bold text-os-clear font-mono mt-0.5">{currentSim.co2Avoided}</div>
                </div>
                <div className="p-3 bg-os-void border border-os-pewter rounded-row">
                  <div className="text-[10px] font-mono text-os-ash">ROUTE SAFETY SCORE</div>
                  <div className="text-base font-bold text-risk-moderate font-mono mt-0.5">{currentSim.routeScore}</div>
                </div>
              </div>
            </div>

            {/* Right Col: Autonomous Swarm Interceptor Preview */}
            <div className="p-5 rounded-panel border border-os-signal flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[10px] font-mono font-bold text-os-signal uppercase tracking-wider">
 Autonomous Debris Intercept Swarm
                </div>
                <div className="text-lg font-bold text-white font-mono mt-1">
 Sortie 4: Target Debris Cluster Alpha
                </div>
                <div className="text-xs text-os-fog mt-2 leading-relaxed">
 3 Autonomous Surface Vehicles (ASV Skimmers) pre-deployed along the fairway path to intercept
 1,420 kg of drifting polymer fishing nets before entry into Lakshadweep MPA.
                </div>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-os-ash">
                  <span>Assigned Unit:</span>
                  <span className="text-white font-bold">ASV-01 (Kochi Base)</span>
                </div>
                <div className="flex justify-between text-os-ash">
                  <span>Battery Reserve:</span>
                  <span className="text-os-clear font-bold">92% (LiFePO4)</span>
                </div>
                <div className="flex justify-between text-os-ash">
                  <span>Payload Capacity:</span>
                  <span className="text-os-signal font-bold">1,800 kg Max</span>
                </div>
              </div>

              <button
 onClick={() => onLaunchApp('cleanup')}
 className="w-full py-2 rounded-row bg-os-signal hover:bg-os-signal-hover text-white font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center"
              >
 Inspect ASV Sortie Studio ➔
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. FOUR CORE PILLARS & CAPABILITIES BENTO GRID            */}
      {/* ========================================================= */}
      <section id="capabilities" className="relative z-10 py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-os-signal uppercase tracking-widest">
 Architecture of the Ocean Operating System
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
 Engineered for Extreme Marine Autonomy
          </h2>
          <p className="mt-4 text-os-ash font-sans text-sm sm:text-base leading-relaxed">
 Four specialized modules working in synchronized harmony across commercial fleet logistics,
 defense-grade surveillance, and autonomous ocean plastic restoration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Logistics */}
          <div
 onClick={() => onLaunchApp('logistics')}
 className="group p-8 rounded-panel bg-os-panel border border-os-pewter hover:border-os-silver transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-panel bg-os-signal/10 border border-os-signal flex items-center justify-center text-2xl text-os-signal mb-6 group-hover:scale-110 transition">
                🚢
              </div>
              <span className="text-[10px] font-mono font-bold text-os-signal uppercase tracking-widest">01 · LOGISTICS & DECARBONIZATION</span>
              <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-os-signal transition">
 Dynamic Eco-Corridor Routing
              </h3>
              <p className="mt-3 text-os-ash text-sm leading-relaxed font-sans">
 Multi-objective A* and Pareto-frontier optimization minimizing fuel burn, carbon tax liabilities,
 and port congestion. Averts high-risk storm cells and Marine Protected Areas dynamically.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-os-pewter flex items-center justify-between text-xs font-mono text-os-signal font-bold">
              <span>EXPLORE LOGISTICS CONSOLE</span>
              <span className="group-hover:translate-x-1 transition">➔</span>
            </div>
          </div>

          {/* Card 2: Autonomous Fleet */}
          <div
 onClick={() => onLaunchApp('cleanup')}
 className="group p-8 rounded-panel bg-os-panel border border-os-pewter hover:border-os-clear transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-panel bg-os-clear/10 border border-os-clear flex items-center justify-center text-2xl text-os-clear mb-6 group-hover:scale-110 transition">
                🎯
              </div>
              <span className="text-[10px] font-mono font-bold text-os-clear uppercase tracking-widest">02 · RESTORATION ROBOTICS</span>
              <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-os-clear transition">
 Autonomous Debris Interception Studio
              </h3>
              <p className="mt-3 text-os-ash text-sm leading-relaxed font-sans">
 Vehicle Routing Problem (VRP) solver with 2-Opt local search dispatching fleets of ASV skimmers,
 ocean drone swarms, and robotic booms to intercept ghost nets and polymer slick hazards.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-os-pewter flex items-center justify-between text-xs font-mono text-os-clear font-bold">
              <span>LAUNCH SORTIE STUDIO</span>
              <span className="group-hover:translate-x-1 transition">➔</span>
            </div>
          </div>

          {/* Card 3: Surveillance */}
          <div
 onClick={() => onLaunchApp('surveillance')}
 className="group p-8 rounded-panel bg-os-panel border border-os-pewter hover:border-risk-moderate transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-panel bg-risk-moderate/10 border border-risk-moderate flex items-center justify-center text-2xl text-risk-moderate mb-6 group-hover:scale-110 transition">
                🛰️
              </div>
              <span className="text-[10px] font-mono font-bold text-risk-moderate uppercase tracking-widest">03 · SATELLITE SENTINEL</span>
              <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-risk-moderate transition">
 Multi-Spectral AIS Surveillance
              </h3>
              <p className="mt-3 text-os-ash text-sm leading-relaxed font-sans">
 Real-time fusion of terrestrial/satellite AIS telemetry with Copernicus Sentinel-2 imagery.
 Detects dark vessels running without transponders, IUU fishing infractions, and oil spills.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-os-pewter flex items-center justify-between text-xs font-mono text-risk-moderate font-bold">
              <span>OPEN SURVEILLANCE RADAR</span>
              <span className="group-hover:translate-x-1 transition">➔</span>
            </div>
          </div>

          {/* Card 4: AI Copilot */}
          <div
 onClick={() => onLaunchApp('agents')}
 className="group p-8 rounded-panel bg-os-panel border border-os-pewter hover:border-os-silver transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-panel bg-os-signal/10 border border-os-signal flex items-center justify-center text-2xl text-os-signal mb-6 group-hover:scale-110 transition">
                💬
              </div>
              <span className="text-[10px] font-mono font-bold text-os-signal uppercase tracking-widest">04 · MULTI-AGENT ORCHESTRATOR</span>
              <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-os-signal transition">
 Ask TRITON Conversational AI
              </h3>
              <p className="mt-3 text-os-ash text-sm leading-relaxed font-sans">
 Maritime intelligence LLM equipped with live SQL databases, hydrodynamic simulation tools,
 and regulatory corpus to draft legal sorties, incident dossiers, and port compliance briefs.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-os-pewter flex items-center justify-between text-xs font-mono text-os-signal font-bold">
              <span>CHAT WITH TRITON ORCHESTRATOR</span>
              <span className="group-hover:translate-x-1 transition">➔</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SWARM INTELLIGENCE ARCHITECTURE PIPELINE               */}
      {/* ========================================================= */}
      <section id="architecture" className="relative z-10 py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-panel bg-os-panel border border-os-pewter">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-os-signal uppercase tracking-widest">
 End-to-End Computational Pipeline
            </span>
            <h2 className="text-3xl font-black text-white mt-2">
 From Spaceborne Ingestion to Robotic Actuation
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="p-5 rounded-panel bg-os-void border border-os-pewter relative space-y-3">
              <div className="text-os-signal font-mono font-bold text-xs">STAGE 01</div>
              <h4 className="text-lg font-bold text-white">Multi-Modal Ingestion</h4>
              <p className="text-xs text-os-ash leading-relaxed font-sans">
 Continuous ingestion of global AIS telemetry, Copernicus Sentinel-2 multi-spectral passes, and NOAA/IMD weather streams.
              </p>
            </div>

            <div className="p-5 rounded-panel bg-os-void border border-os-pewter relative space-y-3">
              <div className="text-os-signal font-mono font-bold text-xs">STAGE 02</div>
              <h4 className="text-lg font-bold text-white">Hydrodynamic Drift</h4>
              <p className="text-xs text-os-ash leading-relaxed font-sans">
 Lagrangian particle advection simulates 12h/24h drift projection for microplastics, ghost nets, and chemical slicks.
              </p>
            </div>

            <div className="p-5 rounded-panel bg-os-void border border-os-pewter relative space-y-3">
              <div className="text-os-signal font-mono font-bold text-xs">STAGE 03</div>
              <h4 className="text-lg font-bold text-white">Swarm Optimization</h4>
              <p className="text-xs text-os-ash leading-relaxed font-sans">
 VRP + 2-Opt heuristic solver calculates optimal trajectories for autonomous surface vessels and commercial container corridors.
              </p>
            </div>

            <div className="p-5 rounded-panel bg-os-void border border-os-pewter relative space-y-3">
              <div className="text-os-signal font-mono font-bold text-xs">STAGE 04</div>
              <h4 className="text-lg font-bold text-white">Autonomous Actuation</h4>
              <p className="text-xs text-os-ash leading-relaxed font-sans">
 Automated generation of IMO-compliant Sortie Orders, waypoint broadcast to ASV autopilots, and port congestion relief.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. GLOBAL IMPACT, COMPLIANCE & STANDARDS                  */}
      {/* ========================================================= */}
      <section id="impact" className="relative z-10 py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-mono font-bold text-os-clear uppercase tracking-widest">
 International Maritime Compliance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 leading-tight">
 Aligned with Global Decarbonization Mandates
            </h2>
            <p className="mt-4 text-os-fog font-sans text-sm sm:text-base leading-relaxed">
 TRITON's autonomous architecture is engineered from the ground up to fulfill United Nations Sustainable Development Goals
              (SDG 14: Life Below Water) and strict international maritime environmental treaties.
            </p>

            <div className="mt-6 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-3 p-3 rounded-row bg-os-panel border border-os-pewter">
                <span className="text-os-clear font-bold">✓</span>
                <span><strong>IMO Tier III & EEXI Standards:</strong> Continuous carbon footprint tracking and corridor fuel reduction.</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-row bg-os-panel border border-os-pewter">
                <span className="text-os-clear font-bold">✓</span>
                <span><strong>MARPOL Annex V Compliant:</strong> Zero-tolerance ghost net logging and autonomous recovery audit trails.</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-row bg-os-panel border border-os-pewter">
                <span className="text-os-clear font-bold">✓</span>
                <span><strong>UN Ocean Decade Endorsed:</strong> Open telemetry architecture for oceanographic research institutions.</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-panel border border-os-signal space-y-6">
            <div className="flex items-center justify-between border-b border-os-pewter pb-4">
              <span className="font-mono text-xs font-bold text-os-signal uppercase">Live Sustainability Ledger</span>
              <span className="font-mono text-[10px] text-os-ash">CYCLE ID: #7829-TRITON</span>
            </div>

            <div className="space-y-4 font-mono">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-os-ash">Carbon Abatement Target (Phase 4):</span>
                  <span className="text-os-clear font-bold">78.4% Achieved</span>
                </div>
                <div className="h-2 w-full bg-os-raised rounded-full overflow-hidden">
                  <div className="h-full bg-os-clear rounded-full w-[78.4%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-os-ash">Coral Reef MPA Safety Buffer:</span>
                  <span className="text-os-signal font-bold">100% Zero Incursion</span>
                </div>
                <div className="h-2 w-full bg-os-raised rounded-full overflow-hidden">
                  <div className="h-full bg-os-signal rounded-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-os-ash">Plastic Interception Efficiency:</span>
                  <span className="text-risk-moderate font-bold">94.2% Intercept Rate</span>
                </div>
                <div className="h-2 w-full bg-os-raised rounded-full overflow-hidden">
                  <div className="h-full bg-risk-moderate rounded-full w-[94.2%]" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
 onClick={() => onLaunchApp('logistics')}
 className="w-full py-3 rounded-row bg-os-signal hover:bg-os-signal-hover text-white font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center"
              >
 Inspect Environmental Impact Analytics ➔
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. BOTTOM MASSIVE CTA BANNER                             */}
      {/* ========================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-10 sm:p-16 rounded-panel border border-os-signal text-center space-y-6">
          <span className="text-xs font-mono font-bold text-os-signal uppercase tracking-widest">
 Ready to Deploy Autonomous Marine Intelligence?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto">
 Experience the Future of Clean Ocean Shipping Operations
          </h2>
          <p className="text-os-fog font-sans text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
 Launch the TRITON Command Center now to run real-time route optimizations, inspect satellite dark vessel surveillance, and command autonomous drone sortie missions.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
 onClick={() => onLaunchApp('logistics')}
 className="px-8 py-4 rounded-row hover: hover: text-white font-mono font-bold text-sm uppercase tracking-wider border border-os-signal transition cursor-pointer active:scale-95 flex items-center space-x-2"
            >
              <span>Launch Command Center</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. ENTERPRISE FOOTER                                      */}
      {/* ========================================================= */}
      <footer className="relative z-10 py-12 px-4 sm:px-8 border-t border-os-pewter bg-os-void font-mono text-xs text-os-slate">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-input bg-os-signal/20 border border-os-signal flex items-center justify-center text-os-signal font-bold">
 T
            </div>
            <span className="text-os-fog font-bold">TRITON OceanSentinel OS</span>
            <span>· Bit n' Build Hackathon</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-os-ash">
            <button onClick={() => onLaunchApp('logistics')} className="hover:text-os-signal transition">Logistics</button>
            <button onClick={() => onLaunchApp('cleanup')} className="hover:text-os-signal transition">Fleet Studio</button>
            <button onClick={() => onLaunchApp('surveillance')} className="hover:text-os-signal transition">Surveillance</button>
            <button onClick={() => onLaunchApp('agents')} className="hover:text-os-signal transition">Ask TRITON</button>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-os-raised" />
            <span className="text-os-ash">All Systems Nominal</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
