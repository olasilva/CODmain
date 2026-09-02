// src/pages/student/StudentNotifications.jsx
import React, { useState } from 'react';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';

const notifications = [
  {
    id: 1,
    icon: 'assignment',
    iconBg: 'bg-yellow-100',
    title: 'New Assignment Posted',
    description: 'Prof. Adebayo posted a new assignment in Guitar Fundamentals',
    time: '5 minutes ago',
    unread: true,
    borderColor: 'border-blue-500/30'
  },
  {
    id: 2,
    icon: 'star',
    iconBg: 'bg-green-100',
    title: 'Grade Posted',
    description: 'Your Music Theory Quiz has been graded: 14/15',
    time: '1 hour ago',
    unread: true,
    borderColor: 'border-blue-500/30'
  },
  {
    id: 3,
    icon: '🔔',
    iconBg: 'bg-blue-100',
    title: 'Class Starting Soon',
    description: 'Guitar Fundamentals starts in 30 minutes',
    time: '2 hours ago',
    unread: false,
    borderColor: 'border-transparent'
  },
  {
    id: 4,
    icon: '💬',
    iconBg: 'bg-pink-100',
    title: 'New Message',
    description: 'Mr. Okonkwo sent you a message',
    time: '3 hours ago',
    unread: false,
    borderColor: 'border-transparent'
  },
  {
    id: 5,
    icon: '📢',
    iconBg: 'bg-red-100',
    title: 'School Announcement',
    description: 'Term 3 examination timetable has been published',
    time: 'Yesterday',
    unread: false,
    borderColor: 'border-transparent'
  },
  {
    id: 6,
    icon: '💳',
    iconBg: 'bg-teal-100',
    title: 'Payment Reminder',
    description: 'Term fees payment due in 5 days',
    time: 'Yesterday',
    unread: false,
    borderColor: 'border-transparent'
  },
  {
    id: 7,
    icon: '⏰',
    iconBg: 'bg-yellow-100',
    title: 'Assignment Due Soon',
    description: 'Mathematics Assignment due tomorrow at 11:59 PM',
    time: '2 days ago',
    unread: false,
    borderColor: 'border-transparent'
  }
];

export default function StudentNotifications() {
  const [notifList, setNotifList] = useState(notifications);

  const markAllAsRead = () => {
    setNotifList(prev =>
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  const dismissNotification = (id) => {
    setNotifList(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifList.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Notifications" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
                  Notifications
                </h1>
                <p className="text-base text-black/60 font-ebrima pt-2">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition"
                >
                  Mark all as read
                </button>
                <button className="px-4 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition">
                  Settings
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3 pt-8">
              {notifList.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-5 bg-white rounded-2xl border ${notif.borderColor} transition hover:shadow-sm ${
                    notif.unread ? 'border-blue-500/30' : 'border-black/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${notif.iconBg} rounded-full flex items-center justify-center text-2xl shrink-0`}>
                      {notif.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-black font-ebrima">{notif.title}</h3>
                        {notif.unread && (
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 ml-2 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-black/70 font-ebrima pt-1">{notif.description}</p>
                      <p className="text-xs text-black/60 font-ebrima pt-1">{notif.time}</p>
                    </div>
                    <button
                      onClick={() => dismissNotification(notif.id)}
                      className="p-1 hover:bg-gray-100 rounded-full shrink-0"
                    >
                      <svg className="w-5 h-5 text-black/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}