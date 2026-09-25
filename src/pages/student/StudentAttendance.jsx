// src/pages/student/StudentAttendance.jsx
import { useEffect, useState } from 'react';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import {
  getMyAttendance,
  submitMyAttendance,
  getMyEnrolledClasses,
} from '../../lib/api';

const STATUS_OPTIONS = [
  {
    value: 'present',
    label: 'Present',
    icon: 'bx-check-circle',
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200',
  },
  {
    value: 'late',
    label: 'Late',
    icon: 'bx-time',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50 border-yellow-200',
  },
  {
    value: 'excused',
    label: 'Excused',
    icon: 'bx-info-circle',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
  },
];

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

export default function StudentAttendance() {
  // Form
  const [date, setDate] = useState(todayISO());
  const [course, setCourse] = useState('');
  const [teacher, setTeacher] = useState('');
  const [status, setStatus] = useState('present');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Data
  const [classes, setClasses] = useState([]);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [attRes, classRes] = await Promise.allSettled([
        getMyAttendance(90),
        getMyEnrolledClasses(),
      ]);
      if (attRes.status === 'fulfilled') {
        setRecords(attRes.value?.records || []);
        setSummary(attRes.value?.summary || null);
      }
      if (classRes.status === 'fulfilled') {
        setClasses(classRes.value?.classes || []);
      }
    } catch (e) {
      setLoadError(e.message || 'Could not load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleClassChange = (classId) => {
    setCourse(classId);
    const cls = classes.find((c) => c.id === classId);
    if (cls?.instructor?.full_name) {
      setTeacher(cls.instructor.full_name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!date || !course || !teacher) {
      setFormError('Please fill in the date, course, and teacher.');
      return;
    }

    setSubmitting(true);
    try {
      const cls = classes.find((c) => c.id === course);
      const courseName = cls?.title || cls?.subject || course;

      await submitMyAttendance({
        date,
        course: courseName,
        teacher: teacher.trim(),
        status,
        notes: notes.trim() || null,
      });

      setFormSuccess('Attendance submitted successfully.');
      setNotes('');
      await load();
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      setFormError(err.message || 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString('en-NG', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Attendance" />
      <div className="flex-1 ml-[300px] min-w-0">
        <StudentHeader />

        <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima leading-tight">
              My Attendance
            </h1>
            <p className="text-sm text-black/50 mt-1 font-ebrima">
              Submit your attendance for each class you attended.
            </p>
          </div>

          {/* Summary strip */}
          {summary && summary.total > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
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
                label="Excused"
                value={summary.excused}
                color="text-blue-600"
                bg="bg-blue-50"
                icon="bx-info-circle"
              />
              <SummaryCard
                label="Rate"
                value={`${summary.attendanceRate}%`}
                color="text-[#1A73E8]"
                bg="bg-[#F5F9FF]"
                icon="bx-line-chart"
              />
            </div>
          )}

          {/* Submit form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-black/10 p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F9FF] text-[#1A73E8]">
                <i className="bx bx-calendar-plus text-xl" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold text-black font-ebrima">
                Submit Attendance
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase tracking-wide">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  max={todayISO()}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-black/15 bg-white text-sm focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition font-ebrima"
                  required
                />
              </div>

              {/* Course */}
              <div>
                <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase tracking-wide">
                  Course
                </label>
                {classes.length > 0 ? (
                  <select
                    value={course}
                    onChange={(e) => handleClassChange(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-black/15 bg-white text-sm focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition font-ebrima"
                    required
                  >
                    <option value="" disabled>
                      Select a course
                    </option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title || c.subject || 'Class'}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. Piano Theory"
                    className="w-full h-12 px-4 rounded-xl border border-black/15 bg-white text-sm focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition font-ebrima"
                    required
                  />
                )}
                {classes.length === 0 && !loading && (
                  <p className="text-xs text-black/40 mt-1.5 font-ebrima">
                    No enrolled classes — type the course name.
                  </p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {/* Teacher */}
              <div>
                <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase tracking-wide">
                  Teacher
                </label>
                <input
                  type="text"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  placeholder="e.g. Mrs. Grace Okonkwo"
                  className="w-full h-12 px-4 rounded-xl border border-black/15 bg-white text-sm focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition font-ebrima"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase tracking-wide">
                  Status
                </label>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setStatus(s.value)}
                      className={`flex-1 h-12 rounded-xl border-2 text-xs font-bold transition inline-flex items-center justify-center gap-1.5 ${
                        status === s.value
                          ? `${s.bg} ${s.color} border-current`
                          : 'border-black/10 bg-white text-black/50 hover:border-black/20'
                      }`}
                    >
                      <i className={`bx ${s.icon} text-base`} aria-hidden="true" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase tracking-wide">
                Notes (optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional info…"
                className="w-full h-12 px-4 rounded-xl border border-black/15 bg-white text-sm focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition font-ebrima"
              />
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                <i className="bx bx-error-circle text-lg" aria-hidden="true" />
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                <i className="bx bx-check-circle text-lg" aria-hidden="true" />
                {formSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-full font-bold text-sm font-ebrima inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white shadow-md hover:opacity-95 active:scale-[0.98] transition disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <i
                    className="bx bx-loader-alt animate-spin text-lg"
                    aria-hidden="true"
                  />
                  Submitting…
                </>
              ) : (
                <>
                  <i className="bx bx-send text-lg" aria-hidden="true" />
                  Submit Attendance
                </>
              )}
            </button>
          </form>

          {/* History */}
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-black font-ebrima">
                My Submissions
              </h2>
              <span className="text-xs text-black/40 font-ebrima">
                {records.length} record{records.length === 1 ? '' : 's'}
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-black/50">
                <i
                  className="bx bx-loader-alt animate-spin text-3xl"
                  aria-hidden="true"
                />
                <p className="mt-2 font-ebrima">Loading…</p>
              </div>
            ) : records.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <i
                  className="bx bx-calendar-x text-5xl text-black/15"
                  aria-hidden="true"
                />
                <p className="mt-3 text-black/60 font-ebrima font-bold">
                  No attendance submitted yet
                </p>
                <p className="text-black/40 text-sm mt-1">
                  Use the form above to submit your first entry.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-black/5">
                {records.map((r) => {
                  const st = STATUS_STYLES[r.status] || STATUS_STYLES.present;
                  return (
                    <li
                      key={r.id}
                      className="px-5 py-4 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${st.bg} ${st.text}`}
                        >
                          <i
                            className={`bx ${st.icon} text-xl`}
                            aria-hidden="true"
                          />
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-black text-sm font-ebrima truncate">
                            {r.course || 'Attendance'}
                          </p>
                          <p className="text-xs text-black/50 font-ebrima mt-0.5">
                            {fmtDate(r.date)}
                            {r.teacher ? ` · ${r.teacher}` : ''}
                          </p>
                          {r.notes && (
                            <p className="text-xs text-black/40 mt-1 italic">
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