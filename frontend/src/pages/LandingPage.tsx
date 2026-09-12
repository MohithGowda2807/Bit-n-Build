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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* 60 FPS HTML5 Ocean Radar & Wave Canvas Background */}
      <OceanCanvasBackground />

      {/* Subtle top glow & vignette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-600/15 via-blue-600/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* ========================================================= */}
      {/* 1. TOP FLOATING GLASSMORPHIC NAVIGATION BAR              */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-cyan-400">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v18M3 12h18" />
                  <circle cx="12" cy="12" r="3" fill="#38bdf8" stroke="none" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white font-mono">TRITON</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold uppercase">
                  OceanSentinel OS
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:block">Autonomous Maritime Intelligence & Restoration</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-mono text-slate-300">
            <a href="#capabilities" className="hover:text-cyan-300 transition">Capabilities</a>
            <a href="#simulator" className="hover:text-cyan-300 transition">Live Simulator</a>
            <a href="#architecture" className="hover:text-cyan-300 transition">Swarm Architecture</a>
            <a href="#impact" className="hover:text-cyan-300 transition">Global Impact</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>KERNEL v4.2 ONLINE</span>
            </div>

            <button
              onClick={() => onLaunchApp('logistics')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/60 border border-cyan-400/40 flex items-center space-x-2 transition cursor-pointer active:scale-95"
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
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs shadow-xl shadow-cyan-950/30 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold">REAL-TIME MULTI-AGENT OCEAN TELEMETRY · 4,635 NM PATROLLED</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-5xl mx-auto text-white">
          Autonomous Maritime Intelligence &{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
            Ocean Restoration OS
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed font-sans">
          TRITON unifies satellite multi-spectral radar surveillance, reinforcement-learning eco-routing,
          and autonomous robotic drone swarms to eliminate marine debris and decarbonize global shipping.
        </p>

        {/* Dual CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onLaunchApp('logistics')}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-sm uppercase tracking-wider shadow-2xl shadow-cyan-950/80 border border-cyan-400/50 flex items-center space-x-3 transition cursor-pointer active:scale-95"
          >
            <span>Enter Tactical Command Center</span>
            <span className="text-lg">➔</span>
          </button>

          <a
            href="#simulator"
            className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-mono font-semibold text-sm border border-slate-700 hover:border-cyan-500/60 shadow-xl transition flex items-center space-x-2 cursor-pointer"
          >
            <span>⚡ Test Live Simulator</span>
          </a>
        </div>

        {/* Fast Jump Chips into Specific Modules */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">Direct Module Launch:</span>
          <button
            onClick={() => onLaunchApp('logistics')}
            className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500 text-cyan-300 hover:text-white transition cursor-pointer"
          >
            🚢 Eco-Route Logistics
          </button>
          <button
            onClick={() => onLaunchApp('cleanup')}
            className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-emerald-500 text-emerald-300 hover:text-white transition cursor-pointer"
          >
            🎯 Autonomous Sortie Studio
          </button>
          <button
            onClick={() => onLaunchApp('surveillance')}
            className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-500 text-amber-300 hover:text-white transition cursor-pointer"
          >
            🛰️ Sentinel Radar Surveillance
          </button>
          <button
            onClick={() => onLaunchApp('agents')}
            className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-purple-500 text-purple-300 hover:text-white transition cursor-pointer"
          >
            💬 Ask TRITON Copilot
          </button>
        </div>

        {/* Live Metrics Grid Pill Carousel */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Patrolled Corridors</div>
            <div className="text-xl font-bold text-white font-mono mt-1">4,635+ NM</div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">● Arabian & Bengal Seas</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Net CO₂ Abated</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">1,556.9 t</div>
            <div className="text-[10px] text-emerald-500 font-mono mt-0.5">▲ 45.4% Carbon Cut</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Fuel Burn Saved</div>
            <div className="text-xl font-bold text-cyan-300 font-mono mt-1">415,171 L</div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">$354,000 Saved / Voyage</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Debris Intercepted</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-1">8,420 kg</div>
            <div className="text-[10px] text-amber-500 font-mono mt-0.5">14 Ghost Nets Cleared</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Autonomous Fleet</div>
            <div className="text-xl font-bold text-teal-400 font-mono mt-1">28 Units</div>
            <div className="text-[10px] text-teal-500 font-mono mt-0.5">ASVs & Drone Swarms</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Safety Rating</div>
            <div className="text-xl font-bold text-white font-mono mt-1">100.0%</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">0 Extreme Weather Hits</div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE LIVE TACTICAL SIMULATOR SANDBOX            */}
      {/* ========================================================= */}
      <section id="simulator" className="relative z-10 py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-cyan-500/40 shadow-2xl shadow-cyan-950/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  Live Interactive Laboratory
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                  TURBO A* PARETO SOLVER
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Real-Time Ocean Mission Simulation Sandbox
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
                Toggle meteorological storms, shift agent operating autonomy, and observe live Pareto-optimal
                re-routing and autonomous drone interception calculations in real time.
              </p>
            </div>

            {/* Simulation Action button */}
            <button
              onClick={() => onLaunchApp('logistics')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 shrink-0 transition cursor-pointer active:scale-95"
            >
              <span>Launch This Mission in Console</span>
              <span>➔</span>
            </button>
          </div>

          {/* Interactive Controls Bar */}
          <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-800">
            {/* Choose Storm Scenario */}
            <div>
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block mb-2">
                1. Select Environmental Storm Scenario:
              </label>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {(['cyclone', 'squall', 'monsoon'] as const).map(sc => (
                  <button
                    key={sc}
                    onClick={() => setSelectedScenario(sc)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      selectedScenario === sc
                        ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md shadow-cyan-950/50 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div>{sc === 'cyclone' ? '🌀 Cyclone' : sc === 'squall' ? '⛈️ Squall' : '🌊 Monsoon'}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {sc === 'cyclone' ? 'Bay of Bengal' : sc === 'squall' ? 'Malacca Strait' : 'Arabian Sea'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Autonomy Mode */}
            <div>
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block mb-2">
                2. Select Agent Operating Autonomy:
              </label>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {(['advisory', 'semi', 'autonomous'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setSimulatorMode(m)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      simulatorMode === m
                        ? 'bg-blue-950/80 border-blue-400 text-white shadow-md font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div>{m === 'advisory' ? '🛡️ Advisory' : m === 'semi' ? '⚙️ Semi-Auto' : '⚡ Autonomous'}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
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
                <span className="text-xs font-mono font-bold text-cyan-300">
                  TACTICAL ROUTE SOLUTION: {currentSim.title.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
                  ✓ TSP 2-OPT & A* CONVERGED
                </span>
              </div>

              {/* Waypoint Track Preview */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Origin: <strong className="text-white">{currentSim.origin}</strong></span>
                  <span>Destination: <strong className="text-white">{currentSim.destination}</strong></span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 rounded-full w-4/5 animate-pulse" />
                </div>
                <div className="text-[11px] text-amber-300 italic">
                  💡 Tactical Evasion Rationale: {currentSim.evasion}
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="text-[10px] font-mono text-slate-400">OPTIMIZED DISTANCE</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">{currentSim.distance}</div>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="text-[10px] font-mono text-slate-400">FUEL BURN CUT</div>
                  <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">{currentSim.fuelSaved}</div>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="text-[10px] font-mono text-slate-400">CO₂ ABATED</div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">{currentSim.co2Avoided}</div>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="text-[10px] font-mono text-slate-400">ROUTE SAFETY SCORE</div>
                  <div className="text-base font-bold text-amber-400 font-mono mt-0.5">{currentSim.routeScore}</div>
                </div>
              </div>
            </div>

            {/* Right Col: Autonomous Swarm Interceptor Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-950 to-blue-950/40 border border-cyan-500/30 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Autonomous Debris Intercept Swarm
                </div>
                <div className="text-lg font-bold text-white font-mono mt-1">
                  Sortie 4: Target Debris Cluster Alpha
                </div>
                <div className="text-xs text-slate-300 mt-2 leading-relaxed">
                  3 Autonomous Surface Vehicles (ASV Skimmers) pre-deployed along the fairway path to intercept
                  1,420 kg of drifting polymer fishing nets before entry into Lakshadweep MPA.
                </div>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Assigned Unit:</span>
                  <span className="text-white font-bold">ASV-01 (Kochi Base)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Battery Reserve:</span>
                  <span className="text-emerald-400 font-bold">92% (LiFePO4)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Payload Capacity:</span>
                  <span className="text-cyan-300 font-bold">1,800 kg Max</span>
                </div>
              </div>

              <button
                onClick={() => onLaunchApp('cleanup')}
                className="w-full py-2 rounded-xl bg-cyan-700/80 hover:bg-cyan-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center"
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
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Architecture of the Ocean Operating System
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
            Engineered for Extreme Marine Autonomy
          </h2>
          <p className="mt-4 text-slate-400 font-sans text-sm sm:text-base leading-relaxed">
            Four specialized modules working in synchronized harmony across commercial fleet logistics,
            defense-grade surveillance, and autonomous ocean plastic restoration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Logistics */}
          <div
            onClick={() => onLaunchApp('logistics')}
            className="group p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/60 shadow-xl transition-all duration-300 hover:shadow-cyan-950/40 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl text-cyan-400 mb-6 group-hover:scale-110 transition">
                🚢
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">01 · LOGISTICS & DECARBONIZATION</span>
              <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-cyan-300 transition">
                Dynamic Eco-Corridor Routing
              </h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed font-sans">
                Multi-objective A* and Pareto-frontier optimization minimizing fuel burn, carbon tax liabilities,
                and port congestion. Averts high-risk storm cells and Marine Protected Areas dynamically.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-400 font-bold">
              <span>EXPLORE LOGISTICS CONSOLE</span>
              <span className="group-hover:translate-x-1 transition">➔</span>
            </div>
          </div>

          {/* Card 2: Autonomous Fleet */}
          <div
            onClick={() => onLaunchApp('cleanup')}
            className="group p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-emerald-500/60 shadow-xl transition-all duration-300 hover:shadow-emerald-950/40 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl text-emerald-400 mb-6 group-hover:scale-110 transition">
                🎯
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">02 · RESTORATION ROBOTICS</span>
              <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-emerald-300 transition">
                Autonomous Debris Interception Studio
              </h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed font-sans">
                Vehicle Routing Problem (VRP) solver with 2-Opt local search dispatching fleets of ASV skimmers,
                ocean drone swarms, and robotic booms to intercept ghost nets and polymer slick hazards.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
              <span>LAUNCH SORTIE STUDIO</span>
              <span className="group-hover:translate-x-1 transition">➔</span>
            </div>
          </div>

          {/* Card 3: Surveillance */}
          <div
            onClick={() => onLaunchApp('surveillance')}
            className="group p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-amber-500/60 shadow-xl transition-all duration-300 hover:shadow-amber-950/40 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl text-amber-400 mb-6 group-hover:scale-110 transition">
                🛰️
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">03 · SATELLITE SENTINEL</span>
              <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-amber-300 transition">
                Multi-Spectral AIS Surveillance
              </h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed font-sans">
                Real-time fusion of terrestrial/satellite AIS telemetry with Copernicus Sentinel-2 imagery.
                Detects dark vessels running without transponders, IUU fishing infractions, and oil spills.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
              <span>OPEN SURVEILLANCE RADAR</span>
              <span className="group-hover:translate-x-1 transition">➔</span>
            </div>
          </div>

          {/* Card 4: AI Copilot */}
          <div
            onClick={() => onLaunchApp('agents')}
            className="group p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-purple-500/60 shadow-xl transition-all duration-300 hover:shadow-purple-950/40 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl text-purple-400 mb-6 group-hover:scale-110 transition">
                💬
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">04 · MULTI-AGENT ORCHESTRATOR</span>
              <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-purple-300 transition">
                Ask TRITON Conversational AI
              </h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed font-sans">
                Maritime intelligence LLM equipped with live SQL databases, hydrodynamic simulation tools,
                and regulatory corpus to draft legal sorties, incident dossiers, and port compliance briefs.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-purple-400 font-bold">
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
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              End-to-End Computational Pipeline
            </span>
            <h2 className="text-3xl font-black text-white mt-2">
              From Spaceborne Ingestion to Robotic Actuation
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative space-y-3">
              <div className="text-cyan-400 font-mono font-bold text-xs">STAGE 01</div>
              <h4 className="text-lg font-bold text-white">Multi-Modal Ingestion</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Continuous ingestion of global AIS telemetry, Copernicus Sentinel-2 multi-spectral passes, and NOAA/IMD weather streams.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative space-y-3">
              <div className="text-cyan-400 font-mono font-bold text-xs">STAGE 02</div>
              <h4 className="text-lg font-bold text-white">Hydrodynamic Drift</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Lagrangian particle advection simulates 12h/24h drift projection for microplastics, ghost nets, and chemical slicks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative space-y-3">
              <div className="text-cyan-400 font-mono font-bold text-xs">STAGE 03</div>
              <h4 className="text-lg font-bold text-white">Swarm Optimization</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                VRP + 2-Opt heuristic solver calculates optimal trajectories for autonomous surface vessels and commercial container corridors.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative space-y-3">
              <div className="text-cyan-400 font-mono font-bold text-xs">STAGE 04</div>
              <h4 className="text-lg font-bold text-white">Autonomous Actuation</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
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
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              International Maritime Compliance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 leading-tight">
              Aligned with Global Decarbonization Mandates
            </h2>
            <p className="mt-4 text-slate-300 font-sans text-sm sm:text-base leading-relaxed">
              TRITON's autonomous architecture is engineered from the ground up to fulfill United Nations Sustainable Development Goals
              (SDG 14: Life Below Water) and strict international maritime environmental treaties.
            </p>

            <div className="mt-6 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>IMO Tier III & EEXI Standards:</strong> Continuous carbon footprint tracking and corridor fuel reduction.</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>MARPOL Annex V Compliant:</strong> Zero-tolerance ghost net logging and autonomous recovery audit trails.</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>UN Ocean Decade Endorsed:</strong> Open telemetry architecture for oceanographic research institutions.</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-500/40 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="font-mono text-xs font-bold text-cyan-300 uppercase">Live Sustainability Ledger</span>
              <span className="font-mono text-[10px] text-slate-400">CYCLE ID: #7829-TRITON</span>
            </div>

            <div className="space-y-4 font-mono">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Carbon Abatement Target (Phase 4):</span>
                  <span className="text-emerald-400 font-bold">78.4% Achieved</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[78.4%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Coral Reef MPA Safety Buffer:</span>
                  <span className="text-cyan-400 font-bold">100% Zero Incursion</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Plastic Interception Efficiency:</span>
                  <span className="text-amber-400 font-bold">94.2% Intercept Rate</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[94.2%]" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onLaunchApp('logistics')}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center"
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
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-blue-900/50 via-cyan-900/40 to-slate-900/90 border border-cyan-500/50 shadow-2xl text-center space-y-6">
          <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
            Ready to Deploy Autonomous Marine Intelligence?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto">
            Experience the Future of Clean Ocean Shipping Operations
          </h2>
          <p className="text-slate-300 font-sans text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Launch the TRITON Command Center now to run real-time route optimizations, inspect satellite dark vessel surveillance, and command autonomous drone sortie missions.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onLaunchApp('logistics')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-sm uppercase tracking-wider shadow-2xl shadow-cyan-950 border border-cyan-400/50 transition cursor-pointer active:scale-95 flex items-center space-x-2"
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
      <footer className="relative z-10 py-12 px-4 sm:px-8 border-t border-slate-900 bg-slate-950 font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
              T
            </div>
            <span className="text-slate-300 font-bold">TRITON OceanSentinel OS</span>
            <span>· Bit n' Build Hackathon</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <button onClick={() => onLaunchApp('logistics')} className="hover:text-cyan-300 transition">Logistics</button>
            <button onClick={() => onLaunchApp('cleanup')} className="hover:text-cyan-300 transition">Fleet Studio</button>
            <button onClick={() => onLaunchApp('surveillance')} className="hover:text-cyan-300 transition">Surveillance</button>
            <button onClick={() => onLaunchApp('agents')} className="hover:text-cyan-300 transition">Ask TRITON</button>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">All Systems Nominal</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
