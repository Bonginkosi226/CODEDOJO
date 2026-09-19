import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { Bell, User, Menu, Sparkles, Trophy, Zap, Flame, BookOpen, Check } from "lucide-react";

const ICON_MAP = {
  sparkles: { icon: Sparkles, bg: "bg-amber-100 text-amber-600" },
  zap: { icon: Zap, bg: "bg-indigo-100 text-indigo-600" },
  flame: { icon: Flame, bg: "bg-orange-100 text-orange-600" },
  trophy: { icon: Trophy, bg: "bg-emerald-100 text-emerald-600" },
  book: { icon: BookOpen, bg: "bg-sky-100 text-sky-600" }
};

// Mirrors backend/utils/xpUtils.js: Level = Floor(sqrt(XP / 100)) + 1
const xpForLevel = (level) => 100 * Math.pow(level - 1, 2);

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = user?.role === "admin";
  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const currentLevelFloor = xpForLevel(level);
  const nextLevelFloor = xpForLevel(level + 1);
  const levelProgress = Math.min(
    100,
    Math.max(0, ((xp - currentLevelFloor) / (nextLevelFloor - currentLevelFloor)) * 100)
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          {/* Student-only: XP bar and notification bell. Admins earn no XP and are
              never sent announcements, so both would be meaningless for them. */}
          {!isAdmin && (
          <>
          {/* Gamification XP Bar */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-[2rem] border-2 border-slate-200 shadow-sm cursor-pointer hover:-translate-y-1 hover:border-slate-300 transition-all">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Level {level}</span>
              <span className="text-xs font-bold text-amber-500">{xp} XP</span>
            </div>
            <div className="w-24 h-3.5 bg-slate-200 rounded-full overflow-hidden shadow-inner border border-slate-300/50">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)]"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 shadow-[0_3px_0_theme(colors.rose.600)] flex items-center justify-center text-white font-extrabold text-xs">
              XP
            </div>
          </div>

          {/* Notification Bell Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative inline-flex items-center justify-center w-12 h-12 text-slate-500 hover:text-amber-500 hover:bg-amber-50 active:translate-y-[2px] rounded-2xl transition-all duration-200 group"
              aria-label="Notifications"
            >
              <Bell size={24} strokeWidth={2.5} className="group-hover:-rotate-12 transition-transform duration-200" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-4 border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Popover Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b-2 border-slate-200">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-800 text-base">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold text-white bg-rose-500 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 hover:underline transition-all"
                    >
                      <Check size={14} /> Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y-2 divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 font-bold text-sm">
                      No notifications yet!
                    </div>
                  ) : (
                    notifications.map((item) => {
                      const iconInfo = ICON_MAP[item.iconType] || ICON_MAP.sparkles;
                      const IconComponent = iconInfo.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={() => markAsRead(item.id)}
                          className={`p-4 flex gap-3 transition-colors cursor-pointer ${
                            item.unread ? "bg-amber-50/50 hover:bg-amber-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-2xl ${iconInfo.bg} flex items-center justify-center shrink-0 shadow-sm`}>
                            <IconComponent size={20} strokeWidth={2.5} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className={`text-xs font-extrabold truncate ${item.unread ? "text-slate-900" : "text-slate-700"}`}>
                                {item.title}
                              </h4>
                              <span className="text-[10px] font-bold text-slate-400 shrink-0">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-2">
                              {item.message}
                            </p>
                          </div>

                          {item.unread && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 self-center shrink-0"></span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Popover Footer */}
                <div className="p-3 bg-slate-50 border-t-2 border-slate-200 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-extrabold text-amber-600 hover:text-amber-700 hover:underline inline-flex items-center gap-1"
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          </>
          )}

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
