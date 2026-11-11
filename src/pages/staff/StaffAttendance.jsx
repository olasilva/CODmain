// src/pages/staff/StaffAttendance.jsx
import { useEffect, useMemo, useState } from 'react';
import Avatar from '../../components/Avatar';
import {
  getAttendanceStudents,
  markStaffAttendance,
  getAttendanceSubmissions,
  approveStaffAttendance,
  bulkApproveStaffAttendance,
} from '../../lib/api';

const STATUS_STYLES = {
  present: { bg: 'bg-green-100', text: 'text-green-700', label: 'Present' },
  absent: { bg: 'bg-red-100', text: 'text-red-600', label: 'Absent' },
  late: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Late' },
  excused: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Excused' },
};

const APPROVAL_STYLES = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' },
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  rejected: { bg: 'bg-red-100', text: 'text-red-600', label: 'Rejected' },
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function StaffAttendance() {
  const [date, setDate] = useState(todayISO());
  const [submissions, setSubmissions] = useState([]);
  const [roster, setRoster] = useState([]);
  const [attendanceDraft, setAttendanceDraft] = useState({});
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rosterLoading, setRosterLoading] = useState(true);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);
  const [bulkBusy, setBulkBusy] = useState(false);

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

  useEffect(() => {
    let active = true;
    setRosterLoading(true);
    getAttendanceStudents(date)
      .then((res) => {
        if (!active) return;
        const students = res?.students || [];
        setRoster(students);
        setAttendanceDraft(
          Object.fromEntries(
            students.map((student) => [
              String(student.id || student.student_id),
              student.attendance_status || '',
            ])
          )
        );
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load student roster');
      })
      .finally(() => {
        if (active) setRosterLoading(false);
      });
    return () => {
      active = false;
    };
  }, [date]);

  const handleSaveAttendance = async () => {
    const records = roster.map((student) => ({
      studentId: student.id || student.student_id,
      status: attendanceDraft[String(student.id || student.student_id)],
    }));
    if (records.some((record) => !record.studentId || !record.status)) {
      setError('Select an attendance status for every student before saving.');
      return;
    }

    setSavingAttendance(true);
    setError('');
    try {
      await markStaffAttendance(date, records);
      await load(date);
      setAttendanceDraft(
        Object.fromEntries(
          records.map((record) => [String(record.studentId), record.status])
        )
      );
    } catch (err) {
      setError(err.message || 'Could not save attendance');
    } finally {
      setSavingAttendance(false);
    }
  };

  const visible = useMemo(() => {
    let list = submissions;
    if (filter !== 'all') {
      if (filter === 'pending') {
        list = list.filter(
          (r) => (r.approval_status || 'pending') === 'pending'
        );
      } else {
        list = list.filter((r) => r.status === filter);
      }
    }
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

  const pendingIds = useMemo(
    () =>
      submissions
        .filter((r) => (r.approval_status || 'pending') === 'pending')
        .map((r) => r.id),
    [submissions]
  );

  const handleApprove = async (id, approval) => {
    setBusyId(id);
    try {
      await approveStaffAttendance(id, approval);
      setSubmissions((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, approval_status: approval } : r
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to update');
    } finally {
      setBusyId(null);
    }
  };

  const handleBulk = async (approval) => {
    if (pendingIds.length === 0) return;
    if (
      !window.confirm(
        `${approval === 'approved' ? 'Approve' : 'Reject'} ${
          pendingIds.length
        } pending records?`
      )
    )
      return;
    setBulkBusy(true);
    try {
      await bulkApproveStaffAttendance(pendingIds, approval);
      setSubmissions((prev) =>
        prev.map((r) =>
          (r.approval_status || 'pending') === 'pending'
            ? { ...r, approval_status: approval }
            : r
        )
      );
    } catch (err) {
      setError(err.message || 'Bulk action failed');
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima">
            Attendance
          </h1>
          <p className="text-sm text-black/50 mt-1 font-ebrima">
            Record attendance for your students and review submitted records.
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
              className="px-4 py-2 rounded-xl bg-white border border-black/15 text-xs font-bold text-black/60 hover:bg-black/5"
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

      <section className="mb-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
        <div className="flex flex-col gap-3 border-b border-black/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-bold text-black font-ebrima">Record Attendance</h2>
            <p className="mt-1 text-xs text-black/45">Select a status for each student.</p>
          </div>
          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={rosterLoading || savingAttendance || roster.length === 0}
            className="rounded-lg bg-[#1A73E8] px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingAttendance ? 'Saving…' : 'Save attendance'}
          </button>
        </div>
        {rosterLoading ? (
          <p className="px-5 py-8 text-center text-sm text-black/45">Loading student roster…</p>
        ) : roster.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-black/45">No students assigned for attendance.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {roster.map((student) => {
              const studentKey = String(student.id || student.student_id);
              return (
                <li key={studentKey} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-black">
                      {student.full_name || student.student_name || student.name || 'Student'}
                    </p>
                    <p className="mt-0.5 text-xs text-black/45">
                      {student.student_code || student.student_id || student.class_name || student.class || ''}
                    </p>
                  </div>
                  <select
                    aria-label={`Attendance status for ${student.full_name || student.student_name || student.name || 'student'}`}
                    value={attendanceDraft[studentKey] || ''}
                    onChange={(event) =>
                      setAttendanceDraft((current) => ({
                        ...current,
                        [studentKey]: event.target.value,
                      }))
                    }
                    className="h-10 min-w-36 rounded-lg border border-black/15 bg-white px-3 text-sm"
                  >
                    <option value="">Select status</option>
                    {Object.entries(STATUS_STYLES).map(([value, status]) => (
                      <option key={value} value={value}>{status.label}</option>
                    ))}
                  </select>
                </li>
              );
            })}
          </ul>
        )}
      </section>

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
          {['all', 'pending', 'present', 'late', 'absent', 'excused'].map(
            (f) => (
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
            )
          )}
        </div>
      </div>

      {pendingIds.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-sm font-bold text-amber-800">
            {pendingIds.length} pending record
            {pendingIds.length === 1 ? '' : 's'}
          </span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => handleBulk('rejected')}
              disabled={bulkBusy}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-red-200 text-red-600 bg-white hover:bg-red-50 disabled:opacity-50"
            >
              Reject all
            </button>
            <button
              onClick={() => handleBulk('approved')}
              disabled={bulkBusy}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {bulkBusy ? 'Working…' : 'Approve all'}
            </button>
          </div>
        </div>
      )}

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
              {submissions.length === 0 ? 'No submissions yet' : 'No matches'}
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
              const ap =
                APPROVAL_STYLES[r.approval_status || 'pending'] ||
                APPROVAL_STYLES.pending;
              const isPending =
                (r.approval_status || 'pending') === 'pending';
              const isBusy = busyId === r.id;

              return (
                <li
                  key={r.id}
                  className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
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

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${st.bg} ${st.text}`}
                    >
                      {st.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${ap.bg} ${ap.text}`}
                    >
                      {ap.label}
                    </span>

                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleApprove(r.id, 'rejected')}
                          disabled={isBusy}
                          className="h-8 px-3 rounded-full text-xs font-bold border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(r.id, 'approved')}
                          disabled={isBusy}
                          className="h-8 px-3 rounded-full text-xs font-bold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {isBusy ? '…' : 'Approve'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleApprove(r.id, 'pending')}
                        disabled={isBusy}
                        className="h-8 px-3 rounded-full text-xs font-bold border border-black/15 text-black/60 hover:bg-black/5 disabled:opacity-50"
                      >
                        Undo
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
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