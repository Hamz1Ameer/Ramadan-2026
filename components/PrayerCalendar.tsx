
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar as CalendarIcon, Loader2, ChevronLeft, ChevronRight, Globe, Search } from 'lucide-react';

const COUNTRIES = [
  { name: 'India', city: 'Mumbai', country: 'India' },
  { name: 'Saudi Arabia', city: 'Mecca', country: 'Saudi Arabia' },
  { name: 'USA', city: 'New York', country: 'USA' },
  { name: 'Australia', city: 'Sydney', country: 'Australia' },
  { name: 'Canada', city: 'Toronto', country: 'Canada' },
  { name: 'UK', city: 'London', country: 'UK' },
];

const PrayerCalendar: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timings, setTimings] = useState<any[]>([]);
  const [activeLocation, setActiveLocation] = useState(COUNTRIES[0]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchCity, setSearchCity] = useState("");

  const fetchCalendar = async (lat?: number, lng?: number, customCity?: string) => {
    setLoading(true);
    try {
      let url = `https://api.aladhan.com/v1/calendarByCity?city=${customCity || activeLocation.city}&country=${activeLocation.country}&method=2&month=${month}&year=${year}`;
      if (lat && lng) {
        url = `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lng}&method=2&month=${month}&year=${year}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setTimings(data.data);
    } catch (error) {
      console.error("Error fetching prayer calendar", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [month, year, activeLocation]);

  const useLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        fetchCalendar(pos.coords.latitude, pos.coords.longitude);
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity) {
      fetchCalendar(undefined, undefined, searchCity);
    }
  };

  const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month - 1));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Location Selection Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Select Region</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Global Prayer Timetable</p>
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search any city (e.g. Dubai)..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold"
            />
          </form>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {COUNTRIES.map((loc) => (
            <button
              key={loc.name}
              onClick={() => setActiveLocation(loc)}
              className={`p-4 rounded-2xl transition-all border-2 text-center flex flex-col items-center gap-1 group ${
                activeLocation.name === loc.name 
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                  : 'border-slate-50 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[10px] font-black uppercase tracking-tighter ${activeLocation.name === loc.name ? 'text-emerald-700' : 'text-slate-400'}`}>
                {loc.name}
              </span>
              <span className="text-sm font-bold truncate w-full">{loc.city}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Monthly Timetable</h2>
            <p className="text-slate-500 text-sm">Timings for {currentMonthName} {year}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={useLocation}
            className="flex items-center gap-2 bg-emerald-800 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-emerald-900 transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            <MapPin size={14} /> Detect Current Location
          </button>
          <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
            <button onClick={() => setMonth(m => m === 1 ? 12 : m - 1)} className="p-1.5 hover:bg-white rounded-xl transition-all shadow-sm"><ChevronLeft size={16} /></button>
            <span className="px-4 text-[11px] font-black uppercase tracking-widest min-w-[120px] text-center">{currentMonthName}</span>
            <button onClick={() => setMonth(m => m === 12 ? 1 : m + 1)} className="p-1.5 hover:bg-white rounded-xl transition-all shadow-sm"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-24 flex flex-col items-center gap-6 text-slate-300">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
            <p className="font-black uppercase tracking-widest text-xs">Aligning the Stars...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date / Hijri</th>
                  <th className="p-5 text-[10px] font-black uppercase text-emerald-700 tracking-widest">Fajr (Suhoor)</th>
                  <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Dhuhr</th>
                  <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Asr</th>
                  <th className="p-5 text-[10px] font-black uppercase text-orange-700 tracking-widest">Maghrib (Iftar)</th>
                  <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Isha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {timings.map((day, idx) => {
                  const dayNum = parseInt(day.date.readable.split(' ')[0]);
                  const isToday = new Date().getDate() === dayNum && new Date().getMonth() + 1 === month;
                  return (
                    <tr key={idx} className={`hover:bg-emerald-50/30 transition-colors ${isToday ? 'bg-emerald-50/80' : ''}`}>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className={`text-sm font-black tracking-tight ${isToday ? 'text-emerald-800' : 'text-slate-800'}`}>{day.date.readable}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{day.date.hijri.day} {day.date.hijri.month.en} {day.date.hijri.year} AH</span>
                        </div>
                      </td>
                      <td className={`p-5 font-black text-sm ${isToday ? 'text-emerald-700' : 'text-slate-700'}`}>
                         <span className="bg-emerald-100/50 px-2 py-1 rounded-lg">{day.timings.Fajr.split(' ')[0]}</span>
                      </td>
                      <td className="p-5 font-bold text-slate-600 text-sm">{day.timings.Dhuhr.split(' ')[0]}</td>
                      <td className="p-5 font-bold text-slate-600 text-sm">{day.timings.Asr.split(' ')[0]}</td>
                      <td className={`p-5 font-black text-sm ${isToday ? 'text-orange-700' : 'text-slate-700'}`}>
                         <span className="bg-orange-100/50 px-2 py-1 rounded-lg">{day.timings.Maghrib.split(' ')[0]}</span>
                      </td>
                      <td className="p-5 font-bold text-slate-600 text-sm">{day.timings.Isha.split(' ')[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerCalendar;
