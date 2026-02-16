
import React, { useState, useRef, useEffect } from 'react';
import { QARIS, SURAHS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Music, Search, Disc, Volume2, ListMusic } from 'lucide-react';

export default function QuranPlayer() {
  const [selectedQari, setSelectedQari] = useState(QARIS[0]);
  const [selectedSurah, setSelectedSurah] = useState(SURAHS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = `${selectedQari.server}${selectedSurah.id}.mp3`;
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.error("Playback error", e));
        }
      }
    }
  }, [selectedQari, selectedSurah]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const incrementStats = () => {
    const saved = localStorage.getItem('nur_ramadan_stats_v2');
    let stats = saved ? JSON.parse(saved) : { fastsCompleted: 0, totalSurahsListened: 0, lastActiveDate: new Date().toLocaleDateString(), checklists: {} };
    stats.totalSurahsListened += 1;
    localStorage.setItem('nur_ramadan_stats_v2', JSON.stringify(stats));
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredSurahs = SURAHS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.includes(searchQuery)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Player Main Section */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Music size={120} />
          </div>
          
          <div className="relative mb-10">
            <div className={`w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-[10px] border-emerald-50 shadow-2xl relative z-10 ${isPlaying ? 'animate-spin-slow' : ''}`}>
              <img src={selectedQari.photo} alt={selectedQari.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-4 right-4 bg-emerald-600 p-4 rounded-full text-white shadow-lg z-20 border-4 border-white">
              <Disc className={isPlaying ? 'animate-spin' : ''} size={28} />
            </div>
            <div className={`absolute -inset-2 bg-emerald-500/10 rounded-full blur-xl transition-all duration-1000 ${isPlaying ? 'scale-125 opacity-100' : 'scale-100 opacity-0'}`}></div>
          </div>

          <div className="z-10">
            <h2 className="text-3xl font-black text-slate-800 mb-2">{selectedSurah.name}</h2>
            <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] mb-10 italic">Recited by {selectedQari.name}</p>
          </div>

          <div className="w-full mb-10 z-10">
            <div className="flex justify-between text-[11px] font-black text-slate-400 mb-3 uppercase tracking-tighter">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden cursor-pointer border border-slate-100">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-700 transition-all duration-300 relative shadow-inner" 
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 z-10">
            <button 
              className="text-slate-300 hover:text-emerald-600 transition-all active:scale-90 p-3"
              onClick={() => {
                const idx = SURAHS.findIndex(s => s.id === selectedSurah.id);
                if (idx > 0) setSelectedSurah(SURAHS[idx - 1]);
              }}
            >
              <SkipBack size={32} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-emerald-700 transition-all active:scale-95 hover:shadow-emerald-200"
            >
              {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
            </button>
            <button 
              className="text-slate-300 hover:text-emerald-600 transition-all active:scale-90 p-3"
              onClick={() => {
                const idx = SURAHS.findIndex(s => s.id === selectedSurah.id);
                if (idx < SURAHS.length - 1) setSelectedSurah(SURAHS[idx + 1]);
              }}
            >
              <SkipForward size={32} />
            </button>
          </div>

          <audio 
            ref={audioRef} 
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              incrementStats();
              const idx = SURAHS.findIndex(s => s.id === selectedSurah.id);
              if (idx < SURAHS.length - 1) {
                setSelectedSurah(SURAHS[idx + 1]);
              } else {
                setIsPlaying(false);
              }
            }}
          />
        </div>

        {/* Qari Selection */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black mb-6 flex items-center gap-3">
            <Volume2 size={24} className="text-emerald-600" />
            Renowned Reciters
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {QARIS.map((qari) => (
              <button
                key={qari.id}
                onClick={() => setSelectedQari(qari)}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all border-2 ${
                  selectedQari.id === qari.id 
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                    : 'border-slate-50 hover:bg-slate-50'
                }`}
              >
                <img src={qari.photo} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md" alt="" />
                <span className="text-[10px] md:text-xs font-black text-left leading-tight tracking-tighter uppercase">{qari.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Surah List Section */}
      <div className="lg:col-span-5 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col h-[600px] lg:h-auto lg:max-h-[950px] overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3 tracking-tight">
            <ListMusic size={24} className="text-emerald-600" />
            The Holy Quran
          </h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Surah name or number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-emerald-500/10 text-sm font-black shadow-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.id}
              onClick={() => setSelectedSurah(surah)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                selectedSurah.id === surah.id 
                  ? 'bg-emerald-600 text-white shadow-2xl scale-[1.02] z-10' 
                  : 'hover:bg-emerald-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black shadow-inner transition-all ${
                   selectedSurah.id === surah.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white'
                }`}>
                  {surah.id}
                </span>
                <span className="font-black text-sm tracking-wide">{surah.name}</span>
              </div>
              {selectedSurah.id === surah.id ? (
                <div className="flex gap-1 items-end h-4">
                   <div className="w-1 bg-white/50 h-2 animate-bounce"></div>
                   <div className="w-1 bg-white/80 h-4 animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1 bg-white/50 h-3 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              ) : (
                <Play size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
              )}
            </button>
          ))}
          {filteredSurahs.length === 0 && (
            <div className="p-10 text-center text-slate-400 text-sm font-black uppercase opacity-20">
              No results found
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
