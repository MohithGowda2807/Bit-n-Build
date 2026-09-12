import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Activity } from 'lucide-react';
import { RouteDetail } from '../types';

interface RouteReplayProps {
  route: RouteDetail | null;
  onUpdateReplayPosition: (pos: [number, number] | null) => void;
}

export const RouteReplay: React.FC<RouteReplayProps> = ({ route, onUpdateReplayPosition }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const timerRef = useRef<any>(null);

  const coords = route?.geometry?.coordinates || []; // [lon, lat]

  useEffect(() => {
    if (!route || coords.length === 0) {
      setIsPlaying(false);
      setProgress(0);
      onUpdateReplayPosition(null);
      return;
    }
  }, [route]);

  useEffect(() => {
    if (isPlaying && coords.length > 1) {
      timerRef.current = setInterval(() => {
        setProgress(prev => {
          const next = prev + 0.5 * speedMultiplier;
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return next;
        });
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speedMultiplier, coords.length]);

  useEffect(() => {
    if (coords.length > 1) {
      const idx = Math.min(
        coords.length - 1,
        Math.floor((progress / 100) * (coords.length - 1))
      );
      const coord = coords[idx];
      // Leaflet uses [lat, lon]
      onUpdateReplayPosition([coord[1], coord[0]]);
    }
  }, [progress, coords]);

  if (!route || coords.length === 0) return null;

  const currentDist = (route.distance_km * (progress / 100)).toFixed(0);
  const remainingDist = (route.distance_km * (1 - progress / 100)).toFixed(0);
  const currentFuel = (route.estimated_fuel_liters * (progress / 100)).toFixed(0);

  return (
    <div className="bg-[#09152b] border border-slate-800 rounded-xl p-4 shadow-xl space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-pink-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
            Voyage Simulation & Route Playback
          </span>
        </div>
        <div className="text-xs text-slate-400">
          Progress: <span className="text-pink-400 font-bold">{progress.toFixed(1)}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-cyan-500 to-pink-500 h-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Telemetry row */}
      <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
        <div>
          <span>Sailed: </span>
          <span className="text-white font-bold">{currentDist} km</span>
        </div>
        <div>
          <span>Remaining: </span>
          <span className="text-white font-bold">{remainingDist} km</span>
        </div>
        <div>
          <span>Fuel Consumed: </span>
          <span className="text-amber-300 font-bold">{Number(currentFuel).toLocaleString()} L</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-pink-500/20"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY ROUTE'}</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setProgress(0);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
            title="Reset Simulation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Speed multiplier */}
        <div className="flex items-center space-x-1">
          <FastForward className="h-3.5 w-3.5 text-slate-500 mr-1" />
          {[1, 2, 5, 10].map(mult => (
            <button
              key={mult}
              onClick={() => setSpeedMultiplier(mult)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                speedMultiplier === mult
                  ? 'bg-pink-500/30 text-pink-300 border border-pink-500/50'
                  : 'bg-slate-900 text-slate-500 hover:text-slate-300'
              }`}
            >
              {mult}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
