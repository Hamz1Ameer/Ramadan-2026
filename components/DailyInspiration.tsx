
import React from 'react';
import { HADITHS, DUAS } from '../constants';
import { Quote, Share2, Heart, Sparkles } from 'lucide-react';

const DailyInspiration: React.FC = () => {
  // Use current date to seed selection so it stays same all day
  const dayIndex = new Date().getDate() % HADITHS.length;
  const hadith = HADITHS[dayIndex];
  const duaIndex = new Date().getDate() % DUAS.length;
  const dua = DUAS[duaIndex];

  const handleShare = (title: string, content: string) => {
    const text = `${title}\n\n"${content}"\n\nShared via Ameer Ramadan Guide`;
    if (navigator.share) {
      navigator.share({ title: 'Ramadan Inspiration', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <Quote size={20} className="fill-emerald-100" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Hadith of the Day</h3>
          </div>
          <button 
            onClick={() => handleShare('Hadith of the Day', hadith.content)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <Share2 size={16} />
          </button>
        </div>
        <p className="text-slate-800 font-medium text-lg leading-relaxed mb-4">
          "{hadith.content}"
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-bold text-slate-400">— {hadith.source}</span>
          <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full">
            <Sparkles size={12} className="text-emerald-500" />
            <span className="text-[10px] text-emerald-700 font-bold uppercase">{hadith.benefit}</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors"></div>
      </div>

      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden group">
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Heart size={20} className="fill-white/20" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Daily Supplication</h3>
          </div>
          <button 
            onClick={() => handleShare('Daily Dua', dua.translation)}
            className="p-2 hover:bg-white/10 rounded-full text-white/60 transition-colors"
          >
            <Share2 size={16} />
          </button>
        </div>
        <div className="relative z-10">
          <p className="arabic text-2xl text-center mb-4 leading-loose">{dua.arabic}</p>
          <p className="text-emerald-50 text-sm italic mb-2 text-center opacity-80">{dua.transliteration}</p>
          <p className="text-white font-medium text-sm text-center leading-relaxed">
            {dua.translation}
          </p>
        </div>
        <div className="absolute bottom-0 right-0 -mb-8 -mr-8 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
      </div>
    </div>
  );
};

export default DailyInspiration;
