import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, MapPin } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

function getWeatherIcon(code: number, className = "w-8 h-8") {
  if (code === 0) return <Sun className={className} />;
  if (code === 1 || code === 2) return <CloudSun className={className} />;
  if (code === 3) return <Cloud className={className} />;
  if (code === 45 || code === 48) return <CloudFog className={className} />;
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle className={className} />;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain className={className} />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow className={className} />;
  if ([95, 96, 99].includes(code)) return <CloudLightning className={className} />;
  return <Sun className={className} />;
}

function getWeatherDescription(code: number) {
  if (code === 0) return "Clear sky";
  if (code === 1 || code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Clear";
}

export function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>('');

  const fetchWeather = async () => {
    try {
      const locQuery = localStorage.getItem('projectLocation') || 'Colombo';
      
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locQuery)}&count=1`);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) return;
      
      const loc = geoData.results[0];
      setLocationName(loc.name);

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,weather_code&daily=precipitation_sum&timezone=auto`);
      const wData = await weatherRes.json();
      
      setWeatherData(wData);
    } catch (err) {
      console.error("Failed to fetch widget weather:", err);
    }
  };

  useEffect(() => {
    fetchWeather();

    const handleLocationChange = () => {
      fetchWeather();
    };

    window.addEventListener('locationChanged', handleLocationChange);
    return () => {
      window.removeEventListener('locationChanged', handleLocationChange);
    };
  }, []);

  if (!weatherData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="flex items-center mb-6">
          <div className="h-14 w-14 bg-slate-200 rounded-full mr-4"></div>
          <div>
            <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
        <div className="mt-auto">
          <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div className="h-24 bg-slate-100 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const chartData = weatherData.daily.time.map((time: string, i: number) => ({
    day: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
    rain: weatherData.daily.precipitation_sum[i],
  }));

  const startDay = chartData[0]?.day || 'Mon';
  const endDay = chartData[chartData.length - 1]?.day || 'Sun';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center">
          Weather condition
        </h3>
        <div className="flex items-center text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
          <MapPin className="w-3 h-3 mr-1" />
          {locationName}
        </div>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-full mr-4">
          {getWeatherIcon(weatherData.current.weather_code, "h-8 w-8")}
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight">{weatherData.current.temperature_2m}°C</div>
          <div className="text-sm text-slate-500 font-medium">{getWeatherDescription(weatherData.current.weather_code)}</div>
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Rainfall Forecast (mm)</p>
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ color: '#64748b', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="rain" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRain)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1 uppercase">
          <span>{startDay}</span>
          <span>{endDay}</span>
        </div>
      </div>
    </div>
  );
}
