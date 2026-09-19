import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Welcome to CodeDojo! 🥋',
    message: 'Start your coding journey with Java & Python in the Dojo Path experience.',
    time: 'Just now',
    date: 'Today at 12:45 PM',
    category: 'system',
    unread: true,
    iconType: 'sparkles'
  },
  {
    id: 'notif-2',
    title: 'Sensei AI Tutor Ready ⚡',
    message: 'Sensei is waiting to assist you with real-time hints in the Arcade editor.',
    time: '10m ago',
    date: 'Today at 12:35 PM',
    category: 'system',
    unread: true,
    iconType: 'zap'
  },
  {
    id: 'notif-3',
    title: 'Daily Ninja Streak Activated 🔥',
    message: 'You started your daily streak! Complete 1 lesson today to keep it active.',
    time: '1h ago',
    date: 'Today at 11:45 AM',
    category: 'achievements',
    unread: true,
    iconType: 'flame'
  },
  {
    id: 'notif-4',
    title: 'XP Reward Unlocked 🏆',
    message: 'Congratulations! You earned 100 XP for exploring the Arcade curriculum.',
    time: '3h ago',
    date: 'Today at 09:15 AM',
    category: 'achievements',
    unread: false,
    iconType: 'trophy'
  },
  {
    id: 'notif-5',
    title: 'New Module Available 📚',
    message: 'Python Object-Oriented Programming module is now live in the Dojo Path.',
    time: '1d ago',
    date: 'Yesterday at 04:00 PM',
    category: 'system',
    unread: false,
    iconType: 'book'
  }
];

const timeAgo = (iso) => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// Server notifications (e.g. teacher announcements) are stored per user in the
// database, so their read/deleted state persists across devices.
const fromServer = (n) => ({
  id: `srv-${n._id}`,
  title: n.title,
  message: n.message,
  time: timeAgo(n.createdAt),
  date: new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  category: n.category || 'system',
  unread: !n.readAt,
  iconType: 'sparkles'
});

const isServerId = (id) => typeof id === 'string' && id.startsWith('srv-');

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [serverNotifications, setServerNotifications] = useState([]);
  const [localNotifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('codedojo_notifications');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load notifications from localStorage:', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Sync the local (demo) notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('codedojo_notifications', JSON.stringify(localNotifications));
    } catch (e) {
      console.error('Failed to save notifications to localStorage:', e);
    }
  }, [localNotifications]);

  // Load server notifications now, then refresh every minute while logged in
  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let cancelled = false;
    const load = async () => {
      try {
        const res = await notificationService.list();
        if (!cancelled) setServerNotifications((res.data || []).map(fromServer));
      } catch {
        // Notifications are non-critical — ignore transient failures.
      }
    };

    load();
    const interval = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  // Server notifications only show while logged in
  const notifications = [...(isAuthenticated ? serverNotifications : []), ...localNotifications];

  const markAsRead = (id) => {
    if (isServerId(id)) {
      setServerNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
      notificationService.markRead(id.slice(4)).catch(() => {});
      return;
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setServerNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    notificationService.markAllRead().catch(() => {});
  };

  const deleteNotification = (id) => {
    if (isServerId(id)) {
      setServerNotifications((prev) => prev.filter((n) => n.id !== id));
      notificationService.remove(id.slice(4)).catch(() => {});
      return;
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setServerNotifications([]);
    notificationService.clear().catch(() => {});
  };

  const addNotification = (newNotif) => {
    const item = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'system',
      unread: true,
      iconType: 'sparkles',
      ...newNotif
    };
    setNotifications((prev) => [item, ...prev]);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
