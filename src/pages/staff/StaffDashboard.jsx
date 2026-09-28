// src/pages/staff/StaffDashboard.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getStaffMe,
  getStaffDashboardStats,
  getAttendanceHistory,
  getStaffInbox,
  getStaffAssignments,
  getSession,
} from '../../lib/api';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [me, setMe] = useState(null);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    pendingSubmissions: 0,
    unreadMessages: 0,
  });
  const [attendance, setAttendance] = useState(null);
  const [recentInbox, setRecentInbox] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);

  useEffect(() => {
    const session = getSession('staff');
    if (session) setMe(session);

    (async () => {
      setLoading(true);
      setError('');
      try {
        const [meRes, statsRes, attRes, inboxRes, asgRes] =
          await Promise.allSettled([
            getStaffMe(),
            getStaffDashboardStats(),
            getAttendanceHistory(7),
            getStaffInbox(),
            getStaffAssignments(),
          ]);

        if (meRes.status === 'fulfilled') {
          const u = meRes.value?.user;
          if (u) setMe(u);
          setClasses(meRes.value?.classes || []);
        }

        if (statsRes.status === 'fulfilled') {
          setStats((s) => ({ ...s, ...(statsRes.value?.stats || {}) }));
        }

        if (attRes.status === 'fulfilled') {
          setAttendance(attRes.value?.summary || null);
        }

        if (inboxRes.status === 'fulfilled') {
          setRecentInbox((inboxRes.value?.inbox || []).slice(0, 4));
        }

        if (asgRes.status === 'fulfilled') {
          setRecentAssignments((asgRes.value?.assignments || []).slice(0, 4));
        }
      } catch (e) {
        setError(e.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const firstName = (
    me?.full_name ||
    me?.fullName ||
    me?.name ||
    'Teacher'
  ).split(' ')[0];

  const attendanceRate = attendance?.rate ?? 0;

  const statCards = [
    {
      label: 'Students',
      value: stats.totalStudents,
      icon: 'bx-group',
      accent: 'bg-blue-100 text-blue-700',
      to: '/staff/students',
    },
    {
      label: 'Classes',
      value: stats.totalClasses,
      icon: 'bx-book',
      accent: 'bg-purple-100 text-purple-700',
      to: '/staff/courses',
    },
    {
      label: 'Attendance (7d)',
      value: `${attendanceRate}%`,
      icon: 'bx-calendar-check',
      accent:
        attendanceRate >= 90
          ? 'bg-green-100 text-green-700'
          : attendanceRate >= 75
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-red-100 text-red-600',
      to: '/staff/attendance',
    },
    {
      label: 'Pending reviews',
      value: stats.pendingSubmissions,
      icon: 'bx-time-five',
      accent:
        stats.pendingSubmissions > 0
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-black/5 text-black/60',
      to: '/staff/assignments',
    },
  ];

  return (
    <div className="w-full">
      {/* Welcome */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 mb-4">
        <h1 className="text-xl sm:text-2xl lg:text-[36px] font-bold text-black font-ebrima leading-tight">
          Welcome back, {firstName}!
        </h1>
        <p className="text-sm sm:text-base text-black/60 font-ebrima pt-2">
          Here's a snapshot of your classes, students, and pending work.
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        {statCards.map((s) => (
          <button
            key={s.label}
            onClick={() => navigate(s.to)}
            className="bg-white rounded-2xl border border-black/10 p-3 sm:p-5 text-left transition hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-3 gap-2">
              <span
                className={`inline-flex rounded-full px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide ${s.accent}`}
              >
                {s.label}
              </span>
              <span className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F9FF] text-[#1A73E8] shrink-0">
                <i className={`bx ${s.icon} text-lg`} aria-hidden="true" />
              </span>
            </div>
            <p className="text-xl sm:text-3xl font-bold text-black font-ebrima">
              {loading ? '…' : s.value}
            </p>
          </button>
        ))}
      </div>

      {/* Main grid: attendance + unread */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Attendance widget */}
        <div className="bg-white rounded-2xl border border-black/10 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#F5F9FF] text-[#1A73E8] shrink-0">
                <i
                  className="bx bx-calendar-check text-lg sm:text-xl"
                  aria-hidden="true"
                />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-black font-ebrima truncate">
                Attendance (7 days)
              </h2>
            </div>
            <Link
              to="/staff/attendance"
              className="text-xs font-bold text-[#1A73E8] hover:underline font-ebrima shrink-0"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="text-sm text-black/40">Loading…</div>
          ) : !attendance || attendance.total === 0 ? (
            <div className="py-4 text-sm text-black/50 font-ebrima">
              No attendance marked yet.
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between mb-2">
                <span className="text-sm text-black/50 font-ebrima">
                  Attendance rate
                </span>
                <span
                  className={`text-xl sm:text-2xl font-bold font-ebrima ${
                    attendanceRate >= 90
                      ? 'text-green-600'
                      : attendanceRate >= 75
                      ? 'text-yellow-600'
                      : 'text-red-500'
                  }`}
                >
                  {attendanceRate}%
                </span>
              </div>
              <div className="h-2.5 bg-black/5 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1A73E8] to-[#34A853] transition-all duration-700"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <MiniStat
                  label="Present"
                  value={attendance.present}
                  color="text-green-600"
                />
                <MiniStat
                  label="Late"
                  value={attendance.late}
                  color="text-yellow-600"
                />
                <MiniStat
                  label="Absent"
                  value={attendance.absent}
                  color="text-red-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Unread messages */}
        <div className="bg-white rounded-2xl border border-black/10 p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#F5F9FF] text-[#1A73E8] shrink-0">
                <i
                  className="bx bx-message-rounded-dots text-lg sm:text-xl"
                  aria-hidden="true"
                />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-black font-ebrima truncate">
                Messages
              </h2>
            </div>
            <Link
              to="/staff/messages"
              className="text-xs font-bold text-[#1A73E8] hover:underline font-ebrima shrink-0"
            >
              Open inbox
            </Link>
          </div>

          {loading ? (
            <div className="text-sm text-black/40">Loading…</div>
          ) : recentInbox.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center py-6">
              <div>
                <i
                  className="bx bx-inbox text-4xl text-black/15"
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm text-black/50 font-ebrima">
                  No conversations yet
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-black/5 -mx-2">
              {recentInbox.map((t) => (
                <li key={t.studentId || t.studentEmail}>
                  <button
                    onClick={() =>
                      navigate(
                        `/staff/messages${
                          t.studentId ? `?student=${t.studentId}` : ''
                        }`
                      )
                    }
                    className="w-full text-left px-2 py-2.5 flex items-start gap-3 rounded-lg hover:bg-black/[0.03] transition"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F9FF] text-[#1A73E8] font-bold text-sm">
                      {(t.studentName || '?').charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-black truncate">
                          {t.studentName}
                        </p>
                        {t.unreadCount > 0 && (
                          <span className="shrink-0 text-[10px] font-bold bg-[#1A73E8] text-white rounded-full px-1.5 py-0.5">
                            {t.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-black/45 truncate">
                        {t.lastMessage}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between text-xs">
            <span className="text-black/40 font-ebrima">Unread total</span>
            <span className="font-bold text-black font-ebrima">
              {stats.unreadMessages || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Assignments + classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent assignments */}
        <div className="bg-white rounded-2xl border border-black/10 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#F5F9FF] text-[#1A73E8] shrink-0">
                <i
                  className="bx bx-book-open text-lg sm:text-xl"
                  aria-hidden="true"
                />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-black font-ebrima truncate">
                Recent assignments
              </h2>
            </div>
            <Link
              to="/staff/assignments"
              className="text-xs font-bold text-[#1A73E8] hover:underline font-ebrima shrink-0"
            >
              Manage
            </Link>
          </div>

          {loading ? (
            <div className="text-sm text-black/40">Loading…</div>
          ) : recentAssignments.length === 0 ? (
            <div className="py-6 text-center">
              <i
                className="bx bx-book text-4xl text-black/15"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm text-black/50 font-ebrima">
                No assignments yet
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentAssignments.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-black/10 p-3 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-black truncate font-ebrima">
                      {a.title}
                    </p>
                    <p className="text-xs text-black/45 mt-0.5 truncate">
                      {a.class?.title || 'Class'}
                      {a.due_date && (
                        <>
                          {' · '}
                          Due{' '}
                          {new Date(a.due_date).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </>
                      )}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5 ${
                      a.pendingCount > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {a.pendingCount > 0
                      ? `${a.pendingCount} pending`
                      : 'Up to date'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Classes */}
        <div className="bg-white rounded-2xl border border-black/10 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#F5F9FF] text-[#1A73E8] shrink-0">
                <i className="bx bx-book text-lg sm:text-xl" aria-hidden="true" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-black font-ebrima truncate">
                Your classes
              </h2>
            </div>
            <span className="text-xs text-black/40 font-ebrima shrink-0">
              {classes.length} assigned
            </span>
          </div>

          {loading ? (
            <div className="text-sm text-black/40">Loading…</div>
          ) : classes.length === 0 ? (
            <div className="py-6 text-center">
              <i
                className="bx bx-book-open text-4xl text-black/15"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm text-black/50 font-ebrima">
                No classes assigned yet
              </p>
              <p className="text-xs text-black/40 mt-1">
                Ask the admin to assign you to a class.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {classes.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F9FF] border border-[#1A73E8]/15 px-3 py-1.5 text-xs font-bold text-[#1A73E8]"
                >
                  <i className="bx bx-book" aria-hidden="true" />
                  {c.title || c.subject || 'Class'}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-4 rounded-3xl bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] p-5 sm:p-6 lg:p-8 text-white">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-ebrima">
          Ready for your next class?
        </h2>
        <p className="mt-2 text-white/85 text-sm sm:text-base">
          Schedule an online session or mark today's attendance.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/staff/sessions"
            className="inline-flex items-center gap-2 rounded-full bg-white text-[#1A73E8] font-bold px-4 sm:px-5 py-2.5 text-xs sm:text-sm shadow-md hover:shadow-lg transition"
          >
            <i className="bx bx-video" aria-hidden="true" />
            Start a session
          </Link>
          <Link
            to="/staff/attendance"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 text-white font-bold px-4 sm:px-5 py-2.5 text-xs sm:text-sm hover:bg-white/10 transition"
          >
            <i className="bx bx-calendar-check" aria-hidden="true" />
            Mark attendance
          </Link>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div>
      <p className={`text-lg font-bold font-ebrima ${color}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-black/40 font-ebrima mt-0.5">
        {label}
      </p>
    </div>
  );
}