// src/pages/staff/StaffAttendance.jsx
import { useEffect, useMemo, useState } from 'react';
import StaffSidebar from './components/StaffSidebar';
import StudentHeader from '../student/components/Studentheader';
import { getAttendanceSubmissions } from '../../lib/api';
import Avatar from '../../components/Avatar';

const STATUS_STYLES = {
  present: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: 'Present',
    icon: 'bx-check',
  },
  absent: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    label: 'Absent',
    icon: 'bx-x',
  },
  late: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    label: 'Late',
    icon: 'bx-time',
  },
  excused: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    label: 'Excused',
    icon: 'bx-info-circle',
  },
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function StaffAttendance() {
  const [date, setDate] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async (isoDate) => {
    setLoading(true);
    setError('');
    try {
      const res = await getAttendanceSubmissions(isoDate);
      setSubmissions(res?.submissions || []);
      setSummary(res?.summary || null);
    } catch (e) {
      setError(e.message || 'Could not load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(date);
    // eslint-disable-next-line
  }, [date]);

  const visible = useMemo(() => {
    let list = submissions;
    if (filter !== 'all') list = list.filter((r) => r.status === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) => {
        const hay = [r.student_name, r.student_code, r.course, r.teacher]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });
    }
    return list;
  }, [submissions, filter, search]);

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString('en-NG', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StaffSidebar activeItem="Attendance" />
      <div className="flex-1 ml-[300px] min-w-0">
        <StudentHeader />

        <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima leading-tight">
                Attendance
              </h1>
              <p className="text-sm text-black/50 mt-1 font-ebrima">
                Student-submitted attendance for your classes.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="bg-white rounded-xl border border-black/15 px-4 py-2 flex items-center gap-2">
                <i
                  className="bx bx-calendar text-[#1A73E8] text-lg"
                  aria-hidden="true"
                />
                <input
                  type="date"
                  value={date}
                  max={todayISO()}
                  onChange={(e) => setDate(e.target.value)}
                  className="outline-none bg-transparent text-sm font-ebrima"
                />
              </div>
              {date && (
                <button
                  onClick={() => setDate('')}
                  className="px-4 py-2 rounded-xl bg-white border border-black/15 text-xs font-bold text-black/60 hover:bg-black/5 transition"
                >
                  Clear date
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

          {/* Summary cards */}
          {summary && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              <SummaryCard
                label="Total"
                value={summary.total}
                color="text-[#1A73E8]"
                bg="bg-[#F5F9FF]"
                icon="bx-list-ul"
              />
              <SummaryCard
                label="Present"
                value={summary.present}
                color="text-green-600"
                bg="bg-green-50"
                icon="bx-check-circle"
              />
              <SummaryCard
                label="Late"
                value={summary.late}
                color="text-yellow-600"
                bg="bg-yellow-50"
                icon="bx-time"
              />
              <SummaryCard
                label="Absent"
                value={summary.absent}
                color="text-red-500"
                bg="bg-red-50"
                icon="bx-x-circle"
              />
              <SummaryCard
                label="Students"
                value={summary.uniqueStudents}
                color="text-[#0F4082]"
                bg="bg-blue-50"
                icon="bx-group"
              />
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
            <div className="flex-1 bg-white rounded-xl border border-black/15 px-4 py-2.5 flex items-center gap-2.5">
              <i
                className="bx bx-search text-lg text-gray-400"
                aria-hidden="true"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student, course, or teacher…"
                className="flex-1 outline-none bg-transparent text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'present', 'late', 'absent', 'excused'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                    filter === f
                      ? 'bg-[#1A73E8] text-white border-2 border-[#1A73E8]'
                      : 'bg-white text-black/60 border border-black/15 hover:bg-black/5'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-black/50">
                <i
                  className="bx bx-loader-alt animate-spin text-3xl"
                  aria-hidden="true"
                />
                <p className="mt-2 font-ebrima">Loading submissions…</p>
              </div>
            ) : visible.length === 0 ? (
              <div className="py-16 px-6 text-center">
                <i
                  className="bx bx-inbox text-5xl text-black/15"
                  aria-hidden="true"
                />
                <p className="mt-3 text-black/60 font-ebrima font-bold">
                  {submissions.length === 0
                    ? 'No submissions yet'
                    : 'No matches for this filter'}
                </p>
                <p className="text-black/40 text-sm mt-1">
                  {submissions.length === 0
                    ? 'Students will appear here once they submit their attendance.'
                    : 'Try a different filter or search.'}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-black/5">
                {visible.map((r) => {
                  const st = STATUS_STYLES[r.status] || STATUS_STYLES.present;
                  return (
                    <li
                      key={r.id}
                      className="px-5 py-4 flex items-start justify-between gap-3 flex-wrap"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <Avatar
                          src={r.student_avatar}
                          name={r.student_name}
                          size={40}
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-black text-sm font-ebrima truncate">
                            {r.student_name}
                          </p>
                          <p className="text-xs text-black/40 font-mono">
                            {r.student_code}
                          </p>
                          <p className="text-xs text-black/60 mt-1 font-ebrima">
                            <i className="bx bx-book mr-1" aria-hidden="true" />
                            {r.course || 'Course'}
                            {r.teacher && (
                              <>
                                {' · '}
                                <i
                                  className="bx bx-user mr-1"
                                  aria-hidden="true"
                                />
                                {r.teacher}
                              </>
                            )}
                          </p>
                          <p className="text-[10px] text-black/35 mt-0.5 font-ebrima">
                            {fmtDate(r.date)}
                          </p>
                          {r.notes && (
                            <p className="text-xs text-black/50 italic mt-1">
                              {r.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${st.bg} ${st.text}`}
                      >
                        {st.label}
                      </span>
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

function SummaryCard({ label, value, color, bg, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-black/10 p-4 flex items-center gap-3">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}
      >
        <i className={`bx ${icon} text-xl`} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-black/50 font-ebrima">{label}</p>
        <p className={`text-lg font-bold font-ebrima ${color}`}>{value}</p>
      </div>
    </div>
  );
}