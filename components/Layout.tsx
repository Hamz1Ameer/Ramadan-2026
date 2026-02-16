import React from "react";
import { NAV_ITEMS } from "../constants";
import { NavigationTab } from "../types";
import { Moon, Star, Bell } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-emerald-800 text-white p-4 flex items-center justify-between shadow-lg sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-700 rounded-lg">
            <Moon className="fill-yellow-400 text-yellow-400" size={20} />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Ameer Ramadan</h1>
        </div>
        <button className="p-2 hover:bg-emerald-700 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full border-2 border-emerald-800"></span>
        </button>
      </header>

      {/* Sidebar Navigation (Desktop) */}
      <nav className="hidden md:flex flex-col w-72 bg-emerald-900 text-white h-screen sticky top-0 shadow-2xl">
        <div className="p-8 flex items-center gap-4">
          <div className="p-3 bg-emerald-800 rounded-2xl shadow-lg transform -rotate-3">
            <Moon className="fill-yellow-400 text-yellow-400" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black leading-none">Ameer</h1>
            <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest mt-1">
              Ramadan Companion
            </p>
          </div>
        </div>

        <div className="flex-1 mt-6 px-4 space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as NavigationTab)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${
                activeTab === item.id
                  ? "bg-emerald-700 text-white shadow-xl scale-[1.02]"
                  : "text-emerald-100/70 hover:bg-emerald-800 hover:text-white"
              }`}
            >
              <span
                className={`transition-transform duration-200 group-hover:scale-110 ${activeTab === item.id ? "text-yellow-400" : ""}`}
              >
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-wide">
                {item.label}
              </span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>
              )}
            </button>
          ))}
        </div>

        <div className="p-8">
          <div className="bg-emerald-800/40 rounded-3xl p-5 border border-emerald-700/50">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <Star size={14} className="fill-yellow-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Blessed Month
              </span>
            </div>
            <p className="text-[11px] text-emerald-200 leading-relaxed font-medium">
              May this month bring peace, health, and prosperity to your life.
            </p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 md:p-10">{children}</div>
      </main>

      {/* Improved Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 px-2 pt-2 pb-6 flex justify-around items-center z-50">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as NavigationTab)}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
                isActive ? "text-emerald-700 scale-110" : "text-slate-400"
              }`}
            >
              {isActive && (
                <div className="absolute -top-1 w-6 h-1 bg-emerald-600 rounded-full shadow-[0_0_10px_rgba(5,150,105,0.4)]"></div>
              )}
              <div
                className={`transition-all duration-300 ${isActive ? "bg-emerald-100 p-2 rounded-xl text-emerald-700" : ""}`}
              >
                {/* Fix: Casting item.icon to React.ReactElement<any> resolves the 'size' property error during cloning */}
                {React.cloneElement(item.icon as React.ReactElement<any>, {
                  size: isActive ? 24 : 20,
                })}
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-tighter transition-all duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
