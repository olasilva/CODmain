// src/pages/student/StudentNotifications.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../lib/api';

const TYPE_STYLES = {
  info: { icon: 'bx-info-circle', color: 'text-[#1A73E8]', bg: 'bg-[#F5F9FF]' },
  success: { icon: 'bx-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
  warning: { icon: 'bx-error', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  error: { icon: 'bx-x-circle', color: 'text-red-600', bg: 'bg-red-50' },
  assignment: { icon: 'bx-book', color: 'text-[#1A73E8]', bg: 'bg-[#F5F9FF]' },
  grade: { icon: 'bx-line-chart', color: 'text-purple-600', bg: 'bg-purple-50' },
  message: { icon: 'bx-message-rounded', color: 'text-[#1A73E8]', bg: 'bg-[#F5F9FF]' },
  teacher_assigned: { icon: 'bx-user-check', color: 'text-[#1A73E8]', bg: 'bg-[#F5F9FF]' },
  general: { icon: 'bx-bell', color: 'text-black/70', bg: 'bg-black/5' },
};

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
  });
}

export default function StudentNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all | unread
  const [markingAll, setMarkingAll] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getNotifications();
      setNotifications(Array.isArray(res) ? res : []);
    } catch (e) {
      setError(e.message || 'Could not load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const visible = useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.is_read);
    return notifications;
  }, [notifications, filter]);

  // Handle click on a notification
  const handleClick = async (n) => {
    // 1. Optimistically mark as read in UI
    setNotifications((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x))
    );

    // 2. Fire the API (don't block navigation)
    if (!n.is_read) {
      markNotificationRead(n.id).catch((err) => {
        console.warn('Mark read failed:', err.message);
      });
    }

    // 3. Navigate to the link if present
    if (n.link) {
      navigate(n.link);
    }
  };

  const handleMarkAll = async () => {
    if (unreadCount === 0) return;
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (e) {
      setError(e.message || 'Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Notifications" />
      <div className="flex-1 ml-[300px] min-w-0">
        <StudentHeader />

        <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima leading-tight">
                Notifications
              </h1>
              <p className="text-sm text-black/50 mt-1 font-ebrima">
                {notifications.length} total
                {unreadCount > 0 && (
                  <>
                    {' · '}
                    <span className="text-[#1A73E8] font-bold">
                      {unreadCount} unread
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={load}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-black/15 rounded-xl text-black/70 font-bold text-xs hover:bg-black/5 transition"
              >
                <i className="bx bx-refresh text-lg" aria-hidden="true" />
                Refresh
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  disabled={markingAll}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A73E8] text-white rounded-xl font-bold text-xs hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  <i
                    className={`bx ${
                      markingAll ? 'bx-loader-alt animate-spin' : 'bx-check-double'
                    } text-lg`}
                    aria-hidden="true"
                  />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <i className="bx bx-error-circle text-lg" aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: `Unread (${unreadCount})` },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  filter === f.key
                    ? 'bg-[#1A73E8] text-white border-2 border-[#1A73E8]'
                    : 'bg-white text-black/60 border border-black/15 hover:bg-black/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-black/50">
                <i
                  className="bx bx-loader-alt animate-spin text-3xl"
                  aria-hidden="true"
                />
                <p className="mt-2 font-ebrima">Loading notifications…</p>
              </div>
            ) : visible.length === 0 ? (
              <div className="py-16 px-6 text-center">
                <i
                  className="bx bx-bell-off text-5xl text-black/15"
                  aria-hidden="true"
                />
                <p className="mt-3 text-black/60 font-ebrima font-bold">
                  {notifications.length === 0
                    ? 'No notifications yet'
                    : 'No unread notifications'}
                </p>
                <p className="text-black/40 text-sm mt-1">
                  {notifications.length === 0
                    ? "You'll see updates about your classes, teachers, and fees here."
                    : 'Switch to "All" to see everything.'}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-black/5">
                {visible.map((n) => {
                  const st = TYPE_STYLES[n.type] || TYPE_STYLES.general;
                  const clickable = Boolean(n.link);
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => handleClick(n)}
                        className={`w-full text-left px-5 py-4 transition flex items-start gap-3 ${
                          clickable
                            ? 'cursor-pointer hover:bg-blue-50/40'
                            : 'cursor-default'
                        } ${!n.is_read ? 'bg-[#F5F9FF]' : 'bg-white'}`}
                      >
                        {/* Icon */}
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${st.bg} ${st.color}`}
                        >
                          <i className={`bx ${st.icon} text-xl`} aria-hidden="true" />
                        </span>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p
                              className={`text-sm font-ebrima truncate ${
                                !n.is_read
                                  ? 'font-bold text-black'
                                  : 'font-semibold text-black/80'
                              }`}
                            >
                              {n.title}
                            </p>
                            {!n.is_read && (
                              <span className="shrink-0 w-2 h-2 rounded-full bg-[#1A73E8]" />
                            )}
                          </div>
                          <p className="text-xs text-black/60 font-ebrima leading-relaxed line-clamp-2">
                            {n.message}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-black/40 font-ebrima">
                              {timeAgo(n.created_at)}
                            </span>
                            {clickable && (
                              <span className="text-[10px] font-bold text-[#1A73E8] flex items-center gap-0.5">
                                Tap to open
                                <i className="bx bx-right-arrow-alt" aria-hidden="true" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Chevron */}
                        {clickable && (
                          <i
                            className="bx bx-chevron-right text-xl text-black/25 shrink-0 mt-1"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}