import React, { useEffect, useState } from 'react';
import { WeatherData, OceanCurrentData, Coordinate } from '../types';
import { fetchWeather, fetchOceanCurrents } from '../services/api';
import { CloudRain, Wind, Waves, Thermometer, Droplets, Compass, RefreshCw } from 'lucide-react';

interface EnvironmentalPanelProps {
  centerCoordinate?: Coordinate | null;
}

export const EnvironmentalPanel: React.FC<EnvironmentalPanelProps> = ({ centerCoordinate }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [ocean, setOcean] = useState<OceanCurrentData | null>(null);
  const [loading, setLoading] = useState(false);

  const lat = centerCoordinate?.latitude ?? 1.29;
  const lon = centerCoordinate?.longitude ?? 103.85;

  const loadData = async () => {
    setLoading(true);
    try {
      const [w, o] = await Promise.all([
        fetchWeather(lat, lon),
        fetchOceanCurrents(lat, lon)
      ]);
      setWeather(w);
      setOcean(o);
    } catch (e) {
      console.error('Error fetching environmental telemetry:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [lat, lon]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl text-slate-100 flex flex-col space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-blue-100 uppercase tracking-wider">Environmental Telemetry</h4>
            <div className="text-[10px] text-slate-400 font-mono">
              Coord: {lat.toFixed(2)}°, {lon.toFixed(2)}°
            </div>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="p-1 text-slate-400 hover:text-cyan-300 transition"
          title="Refresh environmental telemetry"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        {/* Wind */}
        <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center space-x-1">
            <Wind className="w-3 h-3 text-cyan-400" />
            <span>Wind Speed</span>
          </div>
          <div className="font-bold text-slate-100 mt-1">
            {weather ? `${weather.wind_speed_knots} kts` : '--'}
          </div>
          <div className="text-[10px] text-slate-500">Dir: {weather ? `${weather.wind_direction_deg}°` : '--'}</div>
        </div>

        {/* Waves */}
        <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center space-x-1">
            <Waves className="w-3 h-3 text-indigo-400" />
            <span>Wave Height</span>
          </div>
          <div className="font-bold text-slate-100 mt-1">
            {weather ? `${weather.wave_height_m} m` : '--'}
          </div>
          <div className="text-[10px] text-slate-500">{weather?.conditions || 'Nominal'}</div>
        </div>

        {/* Ocean Current */}
        <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center space-x-1">
            <Compass className="w-3 h-3 text-teal-400" />
            <span>Current Speed</span>
          </div>
          <div className="font-bold text-slate-100 mt-1">
            {ocean ? `${ocean.current_speed_knots} kts` : '--'}
          </div>
          <div className="text-[10px] text-slate-500">{ocean?.tidal_state || 'Slack'}</div>
        </div>

        {/* Sea Temp & Salinity */}
        <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center space-x-1">
            <Thermometer className="w-3 h-3 text-amber-400" />
            <span>Sea Temp</span>
          </div>
          <div className="font-bold text-slate-100 mt-1">
            {ocean ? `${ocean.sea_surface_temp_c} °C` : '--'}
          </div>
          <div className="text-[10px] text-slate-500">Salinity: {ocean?.salinity_psu || 35} PSU</div>
        </div>
      </div>
    </div>
  );
};
