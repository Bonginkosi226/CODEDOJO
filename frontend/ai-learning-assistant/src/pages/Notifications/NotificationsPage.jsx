import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Filter, 
  Sparkles, 
  Zap, 
  Trophy, 
  Flame, 
  BookOpen, 
  CheckCircle2,
  BellOff
} from 'lucide-react';

const ICON_MAP = {
  sparkles: { icon: Sparkles, bg: "bg-amber-100 text-amber-600 border-amber-200" },
  zap: { icon: Zap, bg: "bg-indigo-100 text-indigo-600 border-indigo-200" },
  flame: { icon: Flame, bg: "bg-orange-100 text-orange-600 border-orange-200" },
  trophy: { icon: Trophy, bg: "bg-emerald-100 text-emerald-600 border-emerald-200" },
  book: { icon: BookOpen, bg: "bg-sky-100 text-sky-600 border-sky-200" }
};

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return n.unread;
    if (activeFilter === 'system') return n.category === 'system';
    if (activeFilter === 'achievements') return n.category === 'achievements';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center text-amber-600 shadow-sm">
              <Bell size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Notifications Center</h1>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">
                Stay updated with your learning milestones, streaks, and announcements.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border-2 border-amber-200 rounded-2xl text-xs font-bold transition-all duration-150 active:translate-y-[2px]"
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 border-2 border-slate-200 hover:border-rose-200 rounded-2xl text-xs font-bold transition-all duration-150 active:translate-y-[2px]"
            >
              <Trash2 size={16} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar & Counters */}
      <div className="bg-white p-3 rounded-3xl border-4 border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Notifications', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'achievements', label: 'Achievements', count: notifications.filter(n => n.category === 'achievements').length },
            { id: 'system', label: 'System', count: notifications.filter(n => n.category === 'system').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-150 ${
                activeFilter === tab.id
                  ? 'bg-amber-500 text-white shadow-[0_3px_0_theme(colors.amber.600)] translate-y-[-2px]'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeFilter === tab.id ? 'bg-white/30 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-400 px-3">
          <Filter size={14} /> Filtered View
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl border-4 border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto border-2 border-slate-200">
              <BellOff size={32} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-700">All quiet in the Dojo!</h3>
              <p className="text-sm font-semibold text-slate-400 mt-1">
                {activeFilter === 'unread' 
                  ? "You've read all your notifications!" 
                  : "No notifications found for this filter."}
              </p>
            </div>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const iconInfo = ICON_MAP[item.iconType] || ICON_MAP.sparkles;
            const IconComponent = iconInfo.icon;
            return (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`group relative p-5 rounded-3xl border-4 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  item.unread
                    ? 'bg-amber-50/40 border-amber-300 shadow-md hover:border-amber-400 hover:shadow-lg'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl border-2 ${iconInfo.bg} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                    <IconComponent size={24} strokeWidth={2.5} />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-base font-extrabold ${item.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                        {item.title}
                      </h3>
                      {item.unread && (
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                      {item.message}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 pt-1">
                      {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {item.unread && (
                    <button
                      onClick={(e) => { e.stopPropagation(); markAsRead(item.id); }}
                      className="p-2 text-amber-600 hover:bg-amber-100 rounded-xl transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(item.id); }}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete notification"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
