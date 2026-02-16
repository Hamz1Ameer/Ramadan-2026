
import React, { useState } from 'react';
import { DUAS } from '../constants';
import { Heart, Copy, Check, Search, Share2, Sparkles } from 'lucide-react';

export default function DuaGuide() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (dua: any) => {
    const text = `${dua.title}\n\n"${dua.arabic}"\n\n${dua.translation}\n\nShared via Ameer Ramadan Guide`;
    if (navigator.share) {
      navigator.share({ title: 'Ramadan Supplication', text }).catch(() => {});
    } else {
      copyToClipboard(text, 'share-all');
      alert('Content copied for sharing!');
    }
  };

  const filteredDuas = DUAS.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Supplications</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Connect with the Creator</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search Duas..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-100 focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDuas.map((dua, index) => (
          <div key={index} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col group transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
            <div className={`h-2 w-full ${
              dua.category === 'suhoor' ? 'bg-sky-400' :
              dua.category === 'iftar' ? 'bg-orange-400' :
              dua.category === 'last10' ? 'bg-indigo-600' : 'bg-emerald-500'
            }`}></div>
            
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl ${
                  dua.category === 'suhoor' ? 'bg-sky-50 text-sky-700' :
                  dua.category === 'iftar' ? 'bg-orange-50 text-orange-700' :
                  dua.category === 'last10' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {dua.category}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleShare(dua)}
                    className="p-2 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                  >
                    <Share2 size={16} />
                  </button>
                  <button 
                    onClick={() => copyToClipboard(dua.arabic, `dua-${index}`)}
                    className="p-2 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                  >
                    {copiedId === `dua-${index}` ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-6 group-hover:text-emerald-700 transition-colors">{dua.title}</h3>
              
              <div className="bg-emerald-50/30 p-8 rounded-[2.5rem] mb-8 text-center relative overflow-hidden">
                <p className="arabic text-3xl md:text-5xl text-emerald-900 leading-[1.6] font-bold" dir="rtl">
                  {dua.arabic}
                </p>
                <Sparkles className="absolute top-4 right-4 text-emerald-200/50" size={24} />
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="font-black text-slate-300 uppercase text-[9px] tracking-widest mb-2">Transliteration</h4>
                  <p className="text-slate-600 italic leading-relaxed text-sm font-medium">{dua.transliteration}</p>
                </div>
                <div className="pt-4 border-t border-slate-50">
                  <h4 className="font-black text-slate-300 uppercase text-[9px] tracking-widest mb-2">Translation</h4>
                  <p className="text-slate-800 font-bold leading-relaxed text-sm">{dua.translation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredDuas.length === 0 && (
        <div className="bg-white p-20 rounded-[2rem] text-center border-2 border-dashed border-slate-100">
           <Heart className="mx-auto text-slate-200 mb-4" size={48} />
           <p className="text-slate-400 font-bold uppercase text-xs">No supplications found matching your search</p>
        </div>
      )}
    </div>
  );
}
