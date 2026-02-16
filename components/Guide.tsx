import React from "react";
import { RAMADAN_DOS_DONTS, STAGE_DUAS } from "../constants";
import {
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
  BookOpen,
  Quote,
  Shield,
  Heart,
} from "lucide-react";

export default function Guide() {
  return (
    <div className="space-y-6 md:space-y-12 animate-in zoom-in-95 duration-500 pb-24">
      {/* Hero Header */}
      <div className="bg-emerald-800 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-emerald-700">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/10 p-4 rounded-[1.5rem] backdrop-blur-xl border border-white/20">
              <BookOpen size={36} className="text-yellow-400" />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
                Spiritual Blueprint
              </h2>
              <p className="text-emerald-200 font-bold uppercase tracking-widest text-[10px] mt-1">
                Authentic Guidance for the Month of Mercy
              </p>
            </div>
          </div>
          <p className="text-emerald-100/80 text-sm md:text-base leading-relaxed font-medium">
            Ramadan is a holistic detoxification of the soul. It is a time to
            realign your purpose, sharpen your discipline, and strengthen your
            bond with the Creator.
          </p>
        </div>
        <div className="absolute -bottom-20 -right-20 bg-emerald-600/20 w-80 h-80 rounded-full blur-[80px]"></div>
      </div>

      {/* The Three Stages Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Sparkles className="text-yellow-500" size={28} />
          <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            The Three Stages of Ramadan
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Days 1-10: Rahmah",
              subtitle: "The Mercy of Allah",
              desc: "Refocus on self-improvement and seeking Allah's infinite mercy.",
              color: "emerald",
              icon: <Heart size={24} />,
              dua: STAGE_DUAS[0],
            },
            {
              title: "Days 11-20: Maghfirah",
              subtitle: "The Forgiveness",
              desc: "A period of intense repentance and clearing the heart of grudges.",
              color: "sky",
              icon: <Quote size={24} />,
              dua: STAGE_DUAS[1],
            },
            {
              title: "Days 21-30: Itqum-minan-nar",
              subtitle: "Protection from Fire",
              desc: "Seeking safety from the Hellfire and witnessing Laylatul Qadr.",
              color: "indigo",
              icon: <Shield size={24} />,
              dua: STAGE_DUAS[2],
            },
          ].map((stage, i) => (
            <div
              key={i}
              className={`flex flex-col rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group`}
            >
              <div
                className={`p-8 bg-${stage.color}-50/50 border-b border-${stage.color}-100 flex-1`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-${stage.color}-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-${stage.color}-200`}
                >
                  {stage.icon}
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-2">
                  {stage.title}
                </h4>
                <p
                  className={`text-${stage.color}-600 font-black text-[10px] uppercase tracking-widest mb-4`}
                >
                  {stage.subtitle}
                </p>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 font-medium">
                  {stage.desc}
                </p>
              </div>

              <div className="p-8 bg-white space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-1 h-4 bg-${stage.color}-500 rounded-full`}
                  ></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Authentic Dua
                  </span>
                </div>
                <p
                  className="arabic text-2xl text-slate-800 leading-relaxed text-center py-2"
                  dir="rtl"
                >
                  {stage.dua.arabic}
                </p>
                <div className="space-y-2 text-center">
                  <p
                    className={`text-[10px] italic font-bold text-${stage.color}-700 opacity-60`}
                  >
                    {stage.dua.transliteration}
                  </p>
                  <p className="text-[11px] font-black text-slate-600 leading-tight">
                    {stage.dua.translation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dos & Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        {RAMADAN_DOS_DONTS.map((section, idx) => (
          <div key={idx} className="space-y-8">
            <div
              className={`flex items-center gap-4 pb-4 border-b-2 ${idx === 0 ? "border-emerald-100 text-emerald-800" : "border-red-100 text-red-600"}`}
            >
              <div
                className={`p-3 rounded-2xl ${idx === 0 ? "bg-emerald-50" : "bg-red-50"}`}
              >
                {idx === 0 ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                {section.title}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-5 p-6 rounded-[2rem] bg-white border border-slate-100 items-start hover:border-emerald-200 hover:shadow-md transition-all duration-300"
                >
                  <div
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${idx === 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-slate-700 text-sm font-bold leading-relaxed pt-1">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
