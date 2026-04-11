import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, User, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full h-20 bg-white/95 backdrop-blur-xl border-b-4 border-slate-200">
      <div className="flex items-center justify-between h-full px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900 rounded-xl transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:block"></div>

        <div className="flex items-center gap-4">
          {/* Gamification XP Bar - "Motivation Fuel" */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-[2rem] border-2 border-slate-200 shadow-sm cursor-pointer hover:-translate-y-1 hover:border-slate-300 transition-all">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Level 1</span>
              <span className="text-xs font-bold text-amber-500">Novice Ninja</span>
            </div>
            <div className="w-24 h-3.5 bg-slate-200 rounded-full overflow-hidden shadow-inner border border-slate-300/50">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 w-[35%] rounded-full shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)]" 
              />
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 shadow-[0_3px_0_theme(colors.rose.600)] flex items-center justify-center text-white font-extrabold text-xs">
              XP
            </div>
          </div>

          {/* Notification Bell */}
          <button
            className="relative inline-flex items-center justify-center w-12 h-12 text-slate-500 hover:text-amber-500 hover:bg-amber-50 active:translate-y-[2px] rounded-2xl transition-all duration-200 group"
            aria-label="Notifications"
          >
            <Bell size={24} strokeWidth={2.5} className="group-hover:-rotate-12 transition-transform duration-200" />
            <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l-2 border-slate-200/60 h-10">
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-2xl hover:bg-slate-50 border-2 border-transparent hover:border-slate-200 active:translate-y-[2px] transition-all duration-200 cursor-pointer group">
              <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white shadow-[0_3px_0_theme(colors.indigo.600)] group-hover:scale-105 transition-transform duration-200 relative overflow-hidden">
                <User size={22} strokeWidth={3} className="relative top-[1px]" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </div>

              <div className="hidden sm:block">
                <p className="text-[14px] font-bold text-slate-800 leading-tight">
                  {user?.username || "User"}
                </p>
                <p className="text-[11px] font-bold text-slate-400 leading-tight">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
