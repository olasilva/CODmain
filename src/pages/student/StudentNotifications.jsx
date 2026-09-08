// src/pages/student/StudentNotifications.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../lib/api';
import { getSession, isLoggedIn } from '../../lib/api';

export default function StudentNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    fetchNotifications();
    
    // Set up real-time polling (every 30 seconds)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Notifications" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
                  Notifications
                </h1>
                <p className="text-base text-black/60 font-ebrima pt-2">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition"
                  >
                    Mark all as read
                  </button>
                )}
                <button 
                  onClick={fetchNotifications}
                  className="px-4 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Notifications List */}
            <div className="space-y-3 pt-8">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-xl">No notifications</p>
                  <p className="text-sm mt-2">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-5 bg-white rounded-2xl border transition hover:shadow-sm ${
                      !notif.is_read ? 'border-blue-500/30' : 'border-black/5'
                    }`}
                    onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                    style={{ cursor: !notif.is_read ? 'pointer' : 'default' }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${
                        notif.type === 'success' ? 'bg-green-100' :
                        notif.type === 'warning' ? 'bg-yellow-100' :
                        notif.type === 'error' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        {notif.type === 'success' ? '✅' :
                         notif.type === 'warning' ? '⚠️' :
                         notif.type === 'error' ? '❌' :
                         '🔔'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-black font-ebrima">{notif.title}</h3>
                          {!notif.is_read && (
                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 ml-2 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-black/70 font-ebrima pt-1">{notif.message}</p>
                        <p className="text-xs text-black/60 font-ebrima pt-1">
                          {notif.created_at ? new Date(notif.created_at).toLocaleString() : 'Just now'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismiss(notif.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full shrink-0"
                      >
                        <svg className="w-5 h-5 text-black/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}