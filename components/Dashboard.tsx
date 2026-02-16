import React, { useState, useEffect } from "react";
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  CloudMoon,
  MapPin,
  TrendingUp,
  Sparkles,
  Clock,
  ChevronRight,
  CheckCircle2,
  Trophy,
  History,
} from "lucide-react";
import DailyInspiration from "./DailyInspiration";

interface UserStats {
  fastsCompleted: number;
  totalSurahsListened: number;
  lastActiveDate: string;
  checklists: { [key: string]: boolean };
}

interface HijriDate {
  day: string;
  month: {
    number: number;
    en: string;
  };
  year: number;
}

export default function Dashboard() {
  const [locationName, setLocationName] = useState<string>(
    "Detecting Location...",
  );
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Persistent User Data
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem("nur_ramadan_stats_v2");
    if (saved) return JSON.parse(saved);
    return {
      fastsCompleted: 0,
      totalSurahsListened: 0,
      lastActiveDate: new Date().toLocaleDateString(),
      checklists: {},
    };
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("nur_ramadan_stats_v2", JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const geoData = await geoResponse.json();
          setLocationName(
            `${geoData.city || geoData.locality || "Unknown"}, ${geoData.countryName}`,
          );

          const response = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`,
          );
          const data = await response.json();
          setPrayerTimes(data.data.timings);
          setHijriDate(data.data.date.hijri);
        } catch (error) {
          console.error("Error fetching dashboard data", error);
          setLocationName("Location detection failed");
        }
      });
    }
  }, []);

  // Helper: Get total days in a Hijri year (simple civil approximation)
  const getHijriYearDays = (year: number) => {
    // Hijri leap years in 30-year cycle
    const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
    const cycleYear = year % 30;
    return leapYears.includes(cycleYear) ? 355 : 354;
  };

  // Helper: Get days in Hijri month (civil calculation)
  const getHijriMonthDays = (month: number, year: number) => {
    if (month % 2 !== 0) return 30; // odd months = 30
    if (month !== 12) return 29; // even months = 29
    return getHijriYearDays(year) === 355 ? 30 : 29; // Dhul Hijjah
  };

  // Helper: Get day of year
  const getHijriDayOfYear = (day: number, month: number, year: number) => {
    let total = 0;
    for (let m = 1; m < month; m++) {
      total += getHijriMonthDays(m, year);
    }
    return total + day;
  };

  // Calculate Ramadan Progress or Countdown dynamically from Hijri Date
  const getDynamicRamadanInfo = () => {
    if (!hijriDate) {
      return {
        status: "loading",
        primaryValue: "...",
        label: "Syncing",
        text: "Fetching Hijri Calendar...",
        progress: 0,
      };
    }

    const currentMonth = hijriDate.month.number;
    const currentDay = parseInt(hijriDate.day);
    const currentYear = hijriDate.year;

    const ramadanMonth = 9;

    const todayDayOfYear = getHijriDayOfYear(
      currentDay,
      currentMonth,
      currentYear,
    );
    const ramadanStartDayOfYear = getHijriDayOfYear(
      1,
      ramadanMonth,
      currentYear,
    );
    const yearDays = getHijriYearDays(currentYear);

    // 🔵 BEFORE RAMADAN
    if (todayDayOfYear < ramadanStartDayOfYear) {
      const daysLeft = ramadanStartDayOfYear - todayDayOfYear;

      return {
        status: "countdown",
        primaryValue: daysLeft,
        label: "Days to Ramadan",
        text: `${daysLeft} days until Ramadan ${currentYear} AH`,
        progress: 0,
      };
    }

    // 🟢 DURING RAMADAN
    if (currentMonth === 9) {
      const daysInRamadan = getHijriMonthDays(9, currentYear);
      const daysPassed = currentDay;
      const daysRemaining = daysInRamadan - daysPassed;

      return {
        status: "ongoing",
        primaryValue: daysPassed,
        label: "Days Passed",
        text: `Day ${daysPassed} of Ramadan`,
        progress: (daysPassed / daysInRamadan) * 100,
      };
    }

    // 🟣 AFTER RAMADAN → Countdown to NEXT Ramadan
    const daysUntilYearEnd = yearDays - todayDayOfYear;
    const nextRamadanStart = getHijriDayOfYear(
      1,
      ramadanMonth,
      currentYear + 1,
    );
    const daysLeft = daysUntilYearEnd + nextRamadanStart;

    return {
      status: "countdown",
      primaryValue: daysLeft,
      label: "Days to Next Ramadan",
      text: `${daysLeft} days until Ramadan ${currentYear + 1} AH`,
      progress: 0,
    };
  };

  const ramadanInfo = getDynamicRamadanInfo();

  const toggleCheck = (id: string) => {
    setUserStats((prev) => ({
      ...prev,
      checklists: { ...prev.checklists, [id]: !prev.checklists[id] },
    }));
  };

  const completedTasksCount = Object.values(userStats.checklists).filter(
    Boolean,
  ).length;
  const taskCompletionRate = (completedTasksCount / 6) * 100;

  const prayers = [
    {
      name: "Fajr",
      icon: <Sunrise size={20} />,
      time: prayerTimes?.Fajr || "--:--",
      label: "Suhoor End",
    },
    {
      name: "Dhuhr",
      icon: <Sun size={20} />,
      time: prayerTimes?.Dhuhr || "--:--",
      label: "Midday",
    },
    {
      name: "Asr",
      icon: <Sun size={20} />,
      time: prayerTimes?.Asr || "--:--",
      label: "Afternoon",
    },
    {
      name: "Maghrib",
      icon: <Sunset size={20} />,
      time: prayerTimes?.Maghrib || "--:--",
      label: "Iftar Time",
    },
    {
      name: "Isha",
      icon: <CloudMoon size={20} />,
      time: prayerTimes?.Isha || "--:--",
      label: "Night Prayer",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Hero Header */}
      <section className="bg-emerald-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-emerald-700">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-4xl font-black flex items-center gap-3">
              Salam, Welcome! <Sparkles className="text-yellow-400" />
            </h2>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="bg-emerald-700/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 border border-emerald-600/50">
                <MapPin size={14} className="text-emerald-300" />
                <span className="text-xs font-bold">{locationName}</span>
              </div>
              <div className="bg-emerald-700/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 border border-emerald-600/50">
                <Clock size={14} className="text-emerald-300" />
                <span className="text-xs font-bold">
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {hijriDate && (
                <div className="bg-emerald-700/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 border border-emerald-600/50">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-200">
                    {hijriDate.day} {hijriDate.month.en} {hijriDate.year} AH
                  </span>
                </div>
              )}
            </div>
            <p className="text-emerald-100/80 text-sm font-medium pt-2 italic">
              {ramadanInfo.status === "countdown"
                ? "Prepare your heart for the most blessed month."
                : "The best of people are those who are most beneficial to others."}
            </p>
          </div>

          {/* Countdown / Stats Tile */}
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 text-center min-w-[160px] shadow-2xl relative overflow-hidden group">
            <div className="text-5xl font-black mb-1 group-hover:scale-110 transition-transform duration-500">
              {ramadanInfo.primaryValue}
            </div>
            <div className="text-[10px] uppercase tracking-widest font-black opacity-80">
              {ramadanInfo.label}
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400/30"></div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 bg-emerald-700/40 w-80 h-80 rounded-full blur-[80px]"></div>
      </section>

      {/* Real-time Progress Section */}
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              Spiritual Progress
            </h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
              {ramadanInfo.text}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-black text-emerald-600">
                {Math.round(ramadanInfo.progress)}%
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Month Milestone
              </div>
            </div>
            <div className="w-px h-10 bg-slate-100"></div>
            <div className="text-right">
              <div className="text-3xl font-black text-sky-600">
                {completedTasksCount}
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Tasks Today
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="relative w-full h-6 bg-slate-50 rounded-full overflow-hidden mb-10 border border-slate-100 p-1">
          <div
            className={`h-full bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-800 rounded-full shadow-inner transition-all duration-1000 ease-in-out relative ${ramadanInfo.progress === 0 ? "w-2" : ""}`}
            style={{
              width:
                ramadanInfo.progress > 0 ? `${ramadanInfo.progress}%` : "2%",
            }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Consistency",
              val: `${Math.round(taskCompletionRate)}%`,
              color: "text-emerald-600",
              icon: <Trophy size={14} />,
            },
            {
              label: "Quran Listened",
              val: userStats.totalSurahsListened,
              color: "text-sky-600",
              icon: <Moon size={14} />,
            },
            {
              label: "Fasts Tracked",
              val: userStats.fastsCompleted,
              color: "text-indigo-600",
              icon: <History size={14} />,
            },
            {
              label: "Status",
              val: ramadanInfo.status === "ongoing" ? "Active" : "Awaiting",
              color: "text-amber-600",
              icon: <Sparkles size={14} />,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-slate-50/50 p-5 rounded-3xl text-center border border-slate-50 hover:border-emerald-100 hover:bg-white transition-all group cursor-default"
            >
              <div
                className={`flex justify-center mb-2 ${stat.color} opacity-30 group-hover:opacity-100 transition-opacity`}
              >
                {stat.icon}
              </div>
              <div className={`text-2xl font-black ${stat.color} mb-1`}>
                {stat.val}
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DailyInspiration />

      {/* Prayer Times Section */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black flex items-center gap-2">
            <Clock className="text-emerald-600" size={24} />
            Prayer Timetable
          </h3>
          <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full uppercase tracking-widest">
            {currentTime.toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {prayers.map((p) => (
            <div
              key={p.name}
              className="flex sm:flex-col items-center justify-between sm:justify-center p-5 rounded-[2rem] bg-slate-50/80 border border-slate-100 hover:border-emerald-200 transition-all hover:bg-white hover:shadow-xl group"
            >
              <div className="flex items-center sm:flex-col gap-4 sm:gap-2">
                <div className="text-emerald-600 sm:mb-2 group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <span className="text-xs text-slate-400 font-black uppercase tracking-widest">
                  {p.name}
                </span>
              </div>
              <div className="text-right sm:text-center mt-1">
                <span className="text-2xl font-black text-slate-800">
                  {p.time}
                </span>
                <p className="hidden sm:block text-[9px] text-slate-300 font-bold uppercase mt-2 tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                  {p.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist Section */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={24} />
            Sunnah Checklist
          </h3>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
            {completedTasksCount} / 6 Complete
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Morning & Evening Azkar", id: "azkar" },
            { label: "Read Quran (Min 20 mins)", id: "quran" },
            { label: "Give Daily Charity (Sadaqah)", id: "charity" },
            { label: "Prayed Taraweeh/Night Prayer", id: "taraweeh" },
            { label: "Kindness toward Family", id: "family" },
            { label: "Controlled Anger/Tongue", id: "self" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`flex items-center gap-4 p-5 rounded-3xl text-left transition-all border-2 ${
                userStats.checklists[item.id]
                  ? "bg-emerald-50 border-emerald-500/20 text-emerald-800"
                  : "bg-slate-50 border-transparent hover:border-emerald-100"
              }`}
            >
              <div
                className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  userStats.checklists[item.id]
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-white text-slate-200 border border-slate-100"
                }`}
              >
                {userStats.checklists[item.id] ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <div className="w-4 h-4 rounded-md border-2 border-slate-100" />
                )}
              </div>
              <span
                className={`text-sm font-black tracking-tight ${userStats.checklists[item.id] ? "text-emerald-900" : "text-slate-700"}`}
              >
                {item.label}
              </span>
              <ChevronRight
                size={14}
                className={`ml-auto opacity-20 ${userStats.checklists[item.id] ? "text-emerald-400" : "text-slate-400"}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
