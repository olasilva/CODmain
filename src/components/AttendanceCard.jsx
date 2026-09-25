// src/components/AttendanceCard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyAttendance } from '../lib/api';

const STATUS_STYLES = {
  present: { bg: 'bg-green-100', text: 'text-green-700', icon: 'bx-check' },
  absent: { bg: 'bg-red-100', text: 'text-red-600', icon: 'bx-x' },
  late: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'bx-time' },
  excused: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'bx-info-circle' },
};

export default function AttendanceCard() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyAttendance(30);
        setRecords(res?.records || []);
        setSummary(res?.summary || null);
      } catch (e) {
        setError(e.message || 'Could not load attendance');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-black/10 p-6">
        <div className="flex items-center gap-2 text-black/40 text-sm">
          <i className="bx bx-loader-alt animate-spin text-lg" aria-hidden="true" />
          Loading attendance…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-sm">
        <i className="bx bx-error-circle text-lg mr-1" aria-hidden="true" />
        {error}
      </div>
    );
  }

  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const iso = d.toISOString().slice(0, 10);
    const rec = records.find((r) => r.date === iso);
    return { date: d, iso, status: rec?.status || null };
  });

  return (
    <div className="bg-white rounded-2xl border border-black/10 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F9FF] text-[#1A73E8]">
            <i className="bx bx-calendar-check text-xl" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold text-black font-ebrima">Attendance</h2>
        </div>
        <div className="flex items-center gap-2">
          {summary && (
            <span
              className={`text-xs font-bold rounded-full px-3 py-1 ${
                summary.attendanceRate >= 90
                  ? 'bg-green-100 text-green-700'
                  : summary.attendanceRate >= 75
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {summary.attendanceRate}%
            </span>
          )}
          <Link
            to="/student/attendance"
            className="text-xs font-bold text-[#1A73E8] hover:underline font-ebrima"
          >
            View all
          </Link>
        </div>
      </div>

      {summary && summary.total > 0 && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-black/50 font-ebrima mb-1.5">
            <span>Attendance rate (last 30 days)</span>
            <span className="font-bold text-black">
              {summary.present + summary.late}/{summary.total} days
            </span>
          </div>
          <div className="h-2.5 bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1A73E8] to-[#34A853] transition-all duration-700"
              style={{ width: `${summary.attendanceRate}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-black/40 font-ebrima mb-3">
          Last 14 days
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {last14.map(({ date, iso, status }) => {
            const style = status ? STATUS_STYLES[status] : null;
            const dayLabel = date
              .toLocaleDateString('en-NG', { weekday: 'short' })
              .slice(0, 2);
            const dateLabel = date.getDate();
            return (
              <div key={iso} className="flex flex-col items-center gap-1" title={iso}>
                <span className="text-[10px] text-black/40 font-ebrima">
                  {dayLabel}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    style ? `${style.bg} ${style.text}` : 'bg-black/5 text-black/30'
                  }`}
                >
                  {style ? (
                    <i className={`bx ${style.icon} text-sm`} aria-hidden="true" />
                  ) : (
                    dateLabel
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-black/5">
          <Stat label="Present" value={summary.present} color="text-green-600" />
          <Stat label="Absent" value={summary.absent} color="text-red-500" />
          <Stat label="Late" value={summary.late} color="text-yellow-600" />
          <Stat label="Excused" value={summary.excused} color="text-blue-600" />
        </div>
      )}

      {summary?.total === 0 && (
        <div className="text-center py-4 text-sm text-black/40 font-ebrima">
          No attendance recorded yet.
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="text-center">
      <p className={`text-lg font-bold font-ebrima ${color}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-black/40 font-ebrima mt-0.5">
        {label}
      </p>
    </div>
  );
}