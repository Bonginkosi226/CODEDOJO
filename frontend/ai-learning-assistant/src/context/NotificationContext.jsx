import React, { createContext, useContext, useState, useEffect } from 'react';

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

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
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

  // Sync to localStorage whenever notifications change
  useEffect(() => {
    try {
      localStorage.setItem('codedojo_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications to localStorage:', e);
    }
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
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
