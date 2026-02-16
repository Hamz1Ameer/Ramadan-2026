
import React from 'react';
import { RAMADAN_DOS_DONTS } from '../constants';
import { CheckCircle2, XCircle, Info, Sparkles, BookOpen } from 'lucide-react';

export default function Guide() {
  return (
    <div className="space-y-6 md:space-y-10 animate-in zoom-in-95 duration-500 pb-24">
      <div className="bg-emerald-800 p-8 md:p-12 rounded-[2rem] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <BookOpen size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">The Ramadan Blueprint</h2>
              <p className="text-emerald-200 font-medium">Spiritual Excellence for the Believer</p>
            </div>
          </div>
          <p className="max-w-2xl text-emerald-100/80 text-sm leading-relaxed">
            Ramadan is more than just refraining from food. It's a holistic detoxification of the soul, a time to realign your purpose and strengthen your connection with the Divine.
          </p>
        </div>
        <div className="absolute -bottom-12 -right-12 bg-white/5 w-64 h-64 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {RAMADAN_DOS_DONTS.map((section, idx) => (
          <div key={idx} className="space-y-6">
            <div className={`flex items-center gap-3 pb-2 border-b-2 ${idx === 0 ? 'border-emerald-100 text-emerald-700' : 'border-red-100 text-red-600'}`}>
              {idx === 0 ? <CheckCircle2 size={28} className="fill-emerald-100" /> : <XCircle size={28} className="fill-red-100" />}
              <h3 className="text-2xl font-black uppercase tracking-tighter">{section.title}</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {section.items.map((item, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-3xl bg-white border border-slate-100 items-center group hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${idx === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {i + 1}
                  </div>
                  <span className="text-slate-700 text-sm font-bold leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <Sparkles className="text-yellow-500" />
          The Three Stages of Ramadan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'First 10 Days', subtitle: 'Mercy (Rahmah)', desc: 'Seek Allah\'s infinite mercy for your soul.', color: 'emerald' },
            { title: 'Middle 10 Days', subtitle: 'Forgiveness (Maghfirah)', desc: 'A period of intense repentance and clearing sins.', color: 'sky' },
            { title: 'Last 10 Days', subtitle: 'Protection (Itqum-minan-nar)', desc: 'Seeking safety from the Hellfire and Laylatul Qadr.', color: 'indigo' },
          ].map((stage, i) => (
            <div key={i} className={`p-8 rounded-[2.5rem] bg-white border-2 border-slate-50 relative overflow-hidden group hover:border-${stage.color}-500 transition-all duration-500`}>
              <div className={`text-${stage.color}-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3`}>Stage {i + 1}</div>
              <h4 className="text-xl font-black text-slate-800 mb-2">{stage.title}</h4>
              <p className="text-slate-600 font-bold text-xs mb-4">{stage.subtitle}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{stage.desc}</p>
              <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity`}>
                <Info size={48} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
