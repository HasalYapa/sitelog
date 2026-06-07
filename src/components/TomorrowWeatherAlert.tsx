import React, { useEffect, useState } from 'react';
import { CloudRain, Sun, Cloud, X } from 'lucide-react';

export function TomorrowWeatherAlert() {
  const [tomorrowWeather, setTomorrowWeather] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    async function fetchTomorrowWeather() {
      try {
        const loc = localStorage.getItem('projectLocation') || 'Colombo';
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}&count=1`);
        const geoData = await geoRes.json();
        
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,precipitation_probability_max&timezone=auto`);
          const wData = await weatherRes.json();
          
          if (wData.daily) {
            setTomorrowWeather({
              code: wData.daily.weather_code[1],
              temp: wData.daily.temperature_2m_max[1],
              precipProb: wData.daily.precipitation_probability_max[1],
              location: loc
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch weather for tomorrow", error);
      }
    }
    fetchTomorrowWeather();
  }, []);

  if (!isVisible || !tomorrowWeather) return null;

  const isRaining = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(tomorrowWeather.code);
  const isCloudy = [1, 2, 3, 45, 48].includes(tomorrowWeather.code);

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Clear sky';
    if ([1, 2, 3].includes(code)) return 'Partly cloudy';
    if ([45, 48].includes(code)) return 'Foggy';
    if ([51, 53, 55].includes(code)) return 'Drizzle';
    if ([61, 63, 65].includes(code)) return 'Rain expected';
    if ([80, 81, 82].includes(code)) return 'Rain showers';
    if ([95, 96, 99].includes(code)) return 'Thunderstorms';
    return 'Mixed conditions';
  };

  const desc = getWeatherDescription(tomorrowWeather.code);

  return (
    <div className={`rounded-xl p-4 flex items-start gap-4 shadow-sm border animate-in fade-in slide-in-from-top-4 ${isRaining ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-blue-50 border-blue-200 text-blue-900'}`}>
       <div className={`p-2 rounded-full ${isRaining ? 'bg-amber-100' : 'bg-blue-100'}`}>
         {isRaining ? (
           <CloudRain className="w-5 h-5 text-amber-600" />
         ) : isCloudy ? (
           <Cloud className="w-5 h-5 text-blue-600" />
         ) : (
           <Sun className="w-5 h-5 text-blue-600" />
         )}
       </div>
       <div className="flex-1">
         <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
           Tomorrow's Work Plan Advisory - {tomorrowWeather.location}
           {isRaining && <span className="bg-amber-200 text-amber-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Caution</span>}
         </h3>
         <p className="text-sm mt-1 opacity-90 leading-relaxed">
           {isRaining 
             ? `Notification: ${desc} expected tomorrow with a ${tomorrowWeather.precipProb}% chance of precipitation. Please adjust outdoor schedules (e.g., exterior plastering, roofing, concreting) and review the task assignments accordingly.` 
             : `Notification: ${desc} expected tomorrow. Max temp: ${tomorrowWeather.temp}°C. Weather is favorable for scheduled outdoor project tasks.`}
         </p>
       </div>
       <button 
         onClick={() => setIsVisible(false)} 
         className="p-1 opacity-50 hover:opacity-100 hover:bg-black/5 rounded-lg transition-all"
       >
         <X className="w-5 h-5" />
       </button>
    </div>
  );
}
