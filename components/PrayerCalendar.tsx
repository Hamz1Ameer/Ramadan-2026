import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Calendar as CalendarIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Search,
  Bell,
  BellOff,
  Check,
} from "lucide-react";

const PrayerCalendar: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timings, setTimings] = useState<any[]>([]);
  const [activeLocation, setActiveLocation] = useState<{
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  } | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem("prayer_alerts");
    return saved
      ? JSON.parse(saved)
      : { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true };
  });

  const searchRef = useRef<HTMLDivElement>(null);

  const fetchCities = async (query: string) => {
    try {
      const res = await fetch(
        `https://secure.geonames.org/searchJSON?q=${query}&maxRows=5&featureClass=P&username=ameer`,
      );

      const data = await res.json();

      const formatted = data.geonames.map((item: any) => ({
        city: item.name,
        country: item.countryName,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lng),
      }));

      setSuggestions(formatted);
    } catch (error) {
      console.error("City search error:", error);
    }
  };

  const fetchCalendar = async (
    lat?: number,
    lng?: number,
    customCity?: string,
    customCountry?: string,
  ) => {
    setLoading(true);
    try {
      let url = `https://api.aladhan.com/v1/calendarByCity?city=${customCity || activeLocation?.city}&country=${customCountry || activeLocation?.country}&method=2&month=${month}&year=${year}`;
      if (lat !== undefined && lng !== undefined) {
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

  useEffect(() => {
    localStorage.setItem("prayer_alerts", JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        fetchCalendar(pos.coords.latitude, pos.coords.longitude);
      });
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.length > 2) {
      fetchCities(val);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (item: any) => {
    setSearchQuery("");
    setSuggestions([]);

    setActiveLocation({
      city: item.city,
      country: item.country,
      latitude: item.latitude,
      longitude: item.longitude,
    });

    fetchCalendar(item.latitude, item.longitude);
  };

  const toggleAlert = (prayer: string) => {
    setAlerts((prev) => ({ ...prev, [prayer]: !prev[prayer] }));
  };

  const requestNotifications = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          alert("Alhamdulillah! Notifications enabled.");
        }
      });
    }
  };

  const currentMonthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date(year, month - 1));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Search & Alerts Header */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-3xl">
              <Globe size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Prayer Hub
              </h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Global Times & Custom Alerts
              </p>
            </div>
          </div>

          <div className="relative flex-1 max-w-md" ref={searchRef}>
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Search City or Country..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500/10 text-sm font-black transition-all"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 max-h-60 overflow-y-auto overflow-x-hidden">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSuggestion(item)}
                    className="w-full text-left p-4 hover:bg-emerald-50 transition-colors flex items-center justify-between border-b border-slate-50 last:border-none"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800">
                        {item.city}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {item.country}
                      </span>
                    </div>
                    <MapPin size={14} className="text-emerald-500 opacity-30" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alerts Configuration */}
        <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Bell size={16} /> Notifications Settings
            </h3>
            <button
              onClick={requestNotifications}
              className="text-[10px] font-black text-emerald-600 hover:underline uppercase"
            >
              Enable Browser Alerts
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((prayer) => (
              <button
                key={prayer}
                onClick={() => toggleAlert(prayer)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                  alerts[prayer]
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-white border-slate-200 text-slate-400 hover:border-emerald-200"
                }`}
              >
                {alerts[prayer] ? <Bell size={12} /> : <BellOff size={12} />}
                {prayer}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Monthly Timetable
            </h2>
            <p className="text-slate-500 text-sm">
              {currentMonthName} {year} • {activeLocation?.city}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
            <button
              onClick={() => setMonth((m) => (m === 1 ? 12 : m - 1))}
              className="p-1.5 hover:bg-white rounded-xl transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 text-[11px] font-black uppercase tracking-widest min-w-[120px] text-center">
              {currentMonthName}
            </span>
            <button
              onClick={() => setMonth((m) => (m === 12 ? 1 : m + 1))}
              className="p-1.5 hover:bg-white rounded-xl transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-24 flex flex-col items-center gap-6 text-slate-300">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
            <p className="font-black uppercase tracking-widest text-xs">
              Fetching Accurate Data...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-50">
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Date / Hijri
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-emerald-700 tracking-widest">
                    Fajr (Suhoor)
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Dhuhr
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Asr
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-orange-700 tracking-widest">
                    Maghrib (Iftar)
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Isha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {timings.map((day, idx) => {
                  const dayNum = parseInt(day.date.readable.split(" ")[0]);
                  const isToday =
                    new Date().getDate() === dayNum &&
                    new Date().getMonth() + 1 === month;
                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-emerald-50/30 transition-colors ${isToday ? "bg-emerald-50/80" : ""}`}
                    >
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-black tracking-tight ${isToday ? "text-emerald-800" : "text-slate-800"}`}
                          >
                            {day.date.readable}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {day.date.hijri.day} {day.date.hijri.month.en}{" "}
                            {day.date.hijri.year} AH
                          </span>
                        </div>
                      </td>
                      <td
                        className={`p-6 font-black text-sm ${isToday ? "text-emerald-700" : "text-slate-700"}`}
                      >
                        <span className="bg-emerald-100/30 px-3 py-1.5 rounded-xl">
                          {day.timings.Fajr.split(" ")[0]}
                        </span>
                      </td>
                      <td className="p-6 font-bold text-slate-600 text-sm">
                        {day.timings.Dhuhr.split(" ")[0]}
                      </td>
                      <td className="p-6 font-bold text-slate-600 text-sm">
                        {day.timings.Asr.split(" ")[0]}
                      </td>
                      <td
                        className={`p-6 font-black text-sm ${isToday ? "text-orange-700" : "text-slate-700"}`}
                      >
                        <span className="bg-orange-100/30 px-3 py-1.5 rounded-xl">
                          {day.timings.Maghrib.split(" ")[0]}
                        </span>
                      </td>
                      <td className="p-6 font-bold text-slate-600 text-sm">
                        {day.timings.Isha.split(" ")[0]}
                      </td>
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
