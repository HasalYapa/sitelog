import React, { useState, useEffect } from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Search, Sun, Wind, Droplets, MapPin, Calendar, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

export function WeatherDashboard() {
  const [locationQuery, setLocationQuery] = useState(() => {
    return localStorage.getItem('projectLocation') || 'Colombo';
  });
  const [targetDate, setTargetDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [weatherData, setWeatherData] = useState<any>(null);
  const [locationDetails, setLocationDetails] = useState<any>(null);

  const fetchWeather = async () => {
    if (!locationQuery) return;
    setLoading(true);
    setError('');
    try {
      // 1. Geocode
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationQuery)}&count=1`);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Location not found');
      }
      
      const loc = geoData.results[0];
      setLocationDetails(loc);

      localStorage.setItem('projectLocation', locationQuery);
      window.dispatchEvent(new Event('locationChanged'));

      // 2. Fetch Weather
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`);
      const wData = await weatherRes.json();
      
      setWeatherData(wData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather();
  };

  const chartData = weatherData?.daily?.time.map((time: string, i: number) => ({
    date: new Date(time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    rawDate: time,
    maxTemp: weatherData.daily.temperature_2m_max[i],
    minTemp: weatherData.daily.temperature_2m_min[i],
    precipitation: weatherData.daily.precipitation_sum[i],
  })) || [];

  const selectedDayWeather = weatherData?.daily?.time?.indexOf(targetDate) ?? -1;

  return (
    <div className="space-y-6">
      
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Project Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              placeholder="e.g. New York, London, Colombo"
              required
            />
          </div>
        </div>
        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Date</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="date" 
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              required
            />
          </div>
        </div>
        <div className="md:col-span-3">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50"
          >
            {loading ? 'Searching...' : <><Search className="w-4 h-4 mr-2" /> Check Weather</>}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center">
          {error}
        </div>
      )}

      {weatherData && locationDetails && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-brand-blue text-white p-6 pb-8">
              <h3 className="text-xl font-bold tracking-tight mb-1">{locationDetails.name}</h3>
              <p className="text-blue-200 text-sm">{locationDetails.country}</p>
              
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <div className="text-5xl font-bold">
                    {weatherData.current.temperature_2m}°C
                  </div>
                  <div className="text-blue-100 mt-2 font-medium">
                    {getWeatherDescription(weatherData.current.weather_code)}
                  </div>
                </div>
                <div className="text-white/90">
                  {getWeatherIcon(weatherData.current.weather_code, "w-16 h-16")}
                </div>
              </div>
            </div>
            <div className="px-6 py-5 bg-white divide-y divide-slate-100">
              <div className="py-3 flex justify-between items-center text-sm">
                <span className="flex items-center text-slate-500"><Wind className="w-4 h-4 mr-2" /> Wind Speed</span>
                <span className="font-semibold text-slate-800">{weatherData.current.wind_speed_10m} km/h</span>
              </div>
              <div className="py-3 flex justify-between items-center text-sm">
                <span className="flex items-center text-slate-500"><Droplets className="w-4 h-4 mr-2" /> Humidity</span>
                <span className="font-semibold text-slate-800">{weatherData.current.relative_humidity_2m}%</span>
              </div>
              {selectedDayWeather !== -1 && (
                <div className="py-3 flex justify-between items-center text-sm bg-orange-50 -mx-6 px-6 border-l-4 border-brand-orange mt-2">
                  <span className="flex items-center text-slate-700 font-medium"><Calendar className="w-4 h-4 mr-2 text-brand-orange" /> Target Date ({targetDate})</span>
                  <span className="font-bold text-brand-orange">
                    {weatherData.daily.precipitation_sum[selectedDayWeather]}mm rain
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-800 mb-6">Temperature Forecast (7 Days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTempMax" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTempMin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
                    />
                    <Area type="monotone" dataKey="maxTemp" name="Max Temp (°C)" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorTempMax)" />
                    <Area type="monotone" dataKey="minTemp" name="Min Temp (°C)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTempMin)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Daily Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Condition</th>
                      <th className="px-4 py-3 font-semibold text-right">Max Temp</th>
                      <th className="px-4 py-3 font-semibold text-right">Min Temp</th>
                      <th className="px-4 py-3 font-semibold text-right">Rainfall</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {weatherData.daily.time.map((time: string, i: number) => {
                      const isTarget = time === targetDate;
                      return (
                        <tr key={time} className={`${isTarget ? 'bg-orange-50/50' : 'hover:bg-slate-50'}`}>
                          <td className="px-4 py-3 font-medium text-slate-900 flex items-center">
                            {isTarget && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange mr-2"></span>}
                            {new Date(time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-4 py-3 text-slate-600 flex items-center">
                            <span className="mr-2 text-brand-blue">{getWeatherIcon(weatherData.daily.weather_code[i], "w-4 h-4")}</span>
                            {getWeatherDescription(weatherData.daily.weather_code[i])}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-700">{weatherData.daily.temperature_2m_max[i]}°C</td>
                          <td className="px-4 py-3 text-right text-slate-700">{weatherData.daily.temperature_2m_min[i]}°C</td>
                          <td className="px-4 py-3 text-right text-slate-700">{weatherData.daily.precipitation_sum[i]} mm</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
