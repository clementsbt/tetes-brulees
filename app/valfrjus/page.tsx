'use client';

import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';

// WMO Weather codes to French descriptions
const getWeatherDesc = (code: number): string => {
  const codes: Record<number, string> = {
    0: '☀️ Clair',
    1: '🌤️ Mainly Clear',
    2: '⛅ Partly Cloudy',
    3: '☁️ Cloudy',
    45: '🌫️ Brouillard',
    48: '🌫️ Brouillard givrant',
    51: '🌧️ Bruine légère',
    53: '🌧️ Bruine modérée',
    55: '🌧️ Bruine dense',
    61: '🌧️ Pluie légère',
    63: '🌧️ Pluie modérée',
    65: '🌧️ Pluie forte',
    71: '🌨️ Neige légère',
    73: '🌨️ Neige modérée',
    75: '🌨️ Neige forte',
    77: '❄️ Grêle',
    80: '🌦️ Averses',
    81: '🌦️ Averses',
    82: '🌦️ Averses fortes',
    85: '🌨️ Averses de neige',
    95: '⛈️ Orage',
  96: '⛈️ Orage avec grêle',
    99: '⛈️ Orage violent',
  };
  return codes[code] || '❓ Inconnu';
};

const getWindDirection = (deg: number): string => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(deg / 45) % 8;
  return dirs[idx];
};

interface DayForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weather: string;
  windSpeed: number;
  windDir: string;
}

interface MeteoData {
  current: {
    temp: number;
    wind: number;
    weather: string;
  };
  days: DayForecast[];
}

export default function ValfrejusPage() {
  const [meteo, setMeteo] = useState<MeteoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Punta Bagna - Valfréjus: 45.1325, 6.7143
    fetch('https://api.open-meteo.com/v1/forecast?latitude=45.1325&longitude=6.7143&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max&timezone=auto&forecast_days=7')
      .then(res => res.json())
      .then(data => {
        const daily = data.daily;
        const days: DayForecast[] = daily.time.map((t: string, i: number) => ({
          date: new Date(t).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
          tempMax: Math.round(daily.temperature_2m_max[i]),
          tempMin: Math.round(daily.temperature_2m_min[i]),
          weather: getWeatherDesc(daily.weather_code[i]),
          windSpeed: Math.round(daily.wind_speed_10m_max[i]),
          windDir: getWindDirection(data.current?.wind_direction_10m || 0),
        }));

        setMeteo({
          current: {
            temp: Math.round(data.current?.temperature_2m || 0),
            wind: Math.round(data.current?.wind_speed_10m || 0),
            weather: getWeatherDesc(data.current?.weather_code || 0),
          },
          days,
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur chargement météo');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🏔️ Punta Bagna - 2737m
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Current Weather */}
        {!loading && meteo && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ☁️ Maintenant
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">{meteo.current.temp}°</p>
                <p className="text-gray-500 text-sm">Temp</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{meteo.current.weather}</p>
                <p className="text-gray-500 text-sm">Météo</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{meteo.current.wind} km/h</p>
                <p className="text-gray-500 text-sm">Vent</p>
              </div>
            </div>
          </div>
        )}
        
        {/* 7 Day Forecast */}
        {!loading && meteo && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📅 Prévisions 7 jours
            </h3>
            <div className="space-y-3">
              {meteo.days.map((day, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="font-medium w-24">{day.date}</span>
                  <span className="w-24 text-center">{day.weather}</span>
                  <span className="w-20 text-right text-gray-600">
                    {day.tempMin}° / {day.tempMax}°
                  </span>
                  <span className="w-20 text-right">
                    💨 {day.windSpeed} km/h
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Chargement...</p>
          </div>
        )}
        
        {/* Source */}
        <p className="text-xs text-gray-400 mb-6">
          Source: Open-Meteo
        </p>
        
        {/* Spot Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Notre Terrain de Jeu</h2>
            <p className="text-gray-600">
              Valfréjus est le spot favorite des Têtes Brûlées pour le speedriding.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Accès</h3>
            <p className="text-gray-600">
              Station de ski familiale située en Savoie, accessible facilement depuis Lyon (2h30) et Chambéry (1h15).
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Conditions</h3>
            <p className="text-gray-600">
              Idéal pour le speedriding avec de nombreuses pistes adaptées et des décollages variés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}