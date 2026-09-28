// src/pages/staff/StaffSessions.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  getStaffMe,
  getStaffSessions,
  startStaffSession,
  endStaffSession,
} from '../../lib/api';

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function fmtTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function elapsedLabel(startedAt) {
  if (!startedAt) return '—';
  const ms = Date.now() - new Date(startedAt).getTime();
  const mins = Math.max(0, Math.floor(ms / 60000));
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hrs > 0) return `${hrs}h ${rem}m`;
  return `${mins}m`;
}

const EMPTY_FORM = {
  title: '',
  description: '',
  classIds: [],
  meetingUrl: '',
  meetingId: '',
  passcode: '',
  notify: true,
};

export default function StaffSessions() {
  const [me, setMe] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [endingId, setEndingId] = useState(null);
  const [, setTick] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [meRes, sessionsRes] = await Promise.allSettled([
        getStaffMe(),
        getStaffSessions(),
      ]);
      if (meRes.status === 'fulfilled') {
        setMe(meRes.value?.user || null);
        setClasses(meRes.value?.classes || []);
      }
      if (sessionsRes.status === 'fulfilled') {
        setSessions(sessionsRes.value?.sessions || []);
      }
    } catch (e) {
      setError(e.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const liveSessions = useMemo(
    () => sessions.filter((s) => s.status === 'live'),
    [sessions]
  );
  const recentSessions = useMemo(
    () => sessions.filter((s) => s.status !== 'live').slice(0, 40),
    [sessions]
  );

  const openModal = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setFormError('');
  };

  const toggleClass = (id) => {
    setForm((f) => ({
      ...f,
      classIds: f.classIds.includes(id)
        ? f.classIds.filter((x) => x !== id)
        : [...f.classIds, id],
    }));
  };

  const update = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (form.classIds.length === 0) {
      setFormError('Select at least one class');
      return;
    }
    if (!form.meetingUrl.trim()) {
      setFormError('Meeting link is required');
      return;
    }

    setSaving(true);
    try {
      const res = await startStaffSession({
        class_ids: form.classIds,
        title: form.title.trim(),
        description: form.description.trim() || null,
        meeting_url: form.meetingUrl.trim(),
        meeting_id: form.meetingId.trim() || null,
        passcode: form.passcode.trim() || null,
        notify: form.notify,
      });

      setShowModal(false);
      setForm(EMPTY_FORM);

      const count = res?.notified || 0;
      setSuccess(
        count > 0
          ? `Session started — ${count} student${count === 1 ? '' : 's'} notified`
          : 'Session started'
      );
      setTimeout(() => setSuccess(''), 4000);

      await load();
    } catch (err) {
      setFormError(err.message || 'Failed to start session');
    } finally {
      setSaving(false);
    }
  };

  const handleEnd = async (sessionId) => {
    if (
      !window.confirm(
        'End this session? Students will see it under "Recent Sessions".'
      )
    )
      return;
    setEndingId(sessionId);
    setError('');
    try {
      await endStaffSession(sessionId);
      setSuccess('Session ended');
      await load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to end session');
    } finally {
      setEndingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A73E8]" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima">
            Sessions
          </h1>
          <p className="text-sm text-black/50 mt-1 font-ebrima">
            Start a live class session — students get notified instantly.
          </p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white font-bold px-5 sm:px-6 py-3 text-sm shadow-md hover:opacity-95 transition"
        >
          <i className="bx bx-plus text-lg" aria-hidden="true" />
          New Session
        </button>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <i className="bx bx-error-circle text-lg" aria-hidden="true" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
          <i className="bx bx-check-circle text-lg" aria-hidden="true" />
          {success}
        </div>
      )}

      {liveSessions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black font-ebrima mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            Live now
            <span className="text-sm font-normal text-black/40">
              ({liveSessions.length})
            </span>
          </h2>
          <div className="space-y-3">
            {liveSessions.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border-2 border-red-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Live
                    </span>
                    <p className="font-bold text-black text-sm font-ebrima truncate">
                      {s.title}
                    </p>
                  </div>
                  <p className="text-xs text-black/50 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="inline-flex items-center gap-1">
                      <i className="bx bx-book" aria-hidden="true" />
                      {s.class?.title || s.class?.subject || 'Class'}
                    </span>
                    <span className="text-black/25">•</span>
                    <span className="inline-flex items-center gap-1">
                      <i className="bx bx-time" aria-hidden="true" />
                      Started {fmtTime(s.started_at)}
                    </span>
                    <span className="text-black/25">·</span>
                    <span className="font-bold text-red-600">
                      {elapsedLabel(s.started_at)}
                    </span>
                  </p>
                  {s.meeting_url && (
                    <a
                      href={s.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#1A73E8] hover:underline mt-1 inline-flex items-center gap-1"
                    >
                      <i className="bx bx-link" aria-hidden="true" />
                      {s.meeting_url}
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleEnd(s.id)}
                  disabled={endingId === s.id}
                  className="self-start sm:self-auto shrink-0 h-10 px-5 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <i className="bx bx-stop-circle text-lg" aria-hidden="true" />
                  {endingId === s.id ? 'Ending…' : 'End session'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-black font-ebrima mb-3 flex items-center gap-2">
          <i className="bx bx-history text-black/50" aria-hidden="true" />
          Recent sessions
          <span className="text-sm font-normal text-black/40">
            ({recentSessions.length})
          </span>
        </h2>

        {recentSessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/10 p-12 text-center">
            <i
              className="bx bx-time-five text-5xl text-black/15"
              aria-hidden="true"
            />
            <p className="mt-3 text-black/60 font-ebrima font-bold">
              No completed sessions yet
            </p>
            <p className="text-sm text-black/40 mt-1">
              Start a session above — it'll be logged here and shown to your
              students.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            <ul className="divide-y divide-black/5">
              {recentSessions.map((s) => (
                <li
                  key={s.id}
                  className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-black text-sm font-ebrima truncate">
                      {s.title}
                    </p>
                    <p className="text-xs text-black/50 mt-0.5 flex items-center gap-1.5">
                      <i className="bx bx-book" aria-hidden="true" />
                      {s.class?.title || s.class?.subject || 'Class'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-black/60 shrink-0">
                    <span className="inline-flex items-center gap-1.5">
                      <i className="bx bx-calendar" aria-hidden="true" />
                      {fmtDate(s.started_at)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <i className="bx bx-time" aria-hidden="true" />
                      {fmtTime(s.started_at)}
                    </span>
                    {s.duration_minutes != null && (
                      <span className="inline-flex items-center gap-1.5 font-bold text-[#1A73E8] bg-[#F5F9FF] rounded-full px-2.5 py-1">
                        <i className="bx bx-hourglass" aria-hidden="true" />
                        {s.duration_minutes} min
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-[640px] my-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-black/5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-black font-ebrima">
                  Start Live Session
                </h3>
                <p className="text-sm text-black/50 mt-1 font-ebrima">
                  The session goes live immediately. Students get notified.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                disabled={saving}
                className="h-9 w-9 rounded-full hover:bg-black/5 flex items-center justify-center transition disabled:opacity-50"
              >
                <i className="bx bx-x text-2xl text-black/60" aria-hidden="true" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto"
            >
              <Field label="Title" required>
                <input
                  value={form.title}
                  onChange={update('title')}
                  placeholder="e.g. Piano Theory — Week 4"
                  className="w-full h-11 px-4 rounded-xl border border-black/15 bg-white text-sm focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20"
                  required
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={update('description')}
                  rows={2}
                  placeholder="What students will learn today…"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/15 bg-white text-sm outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 resize-none"
                />
              </Field>

              <Field
                label={`Classes (${form.classIds.length} selected)`}
                required
              >
                {classes.length === 0 ? (
                  <p className="text-sm text-black/50 italic font-ebrima">
                    No classes assigned to you yet.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {classes.map((c) => {
                      const active = form.classIds.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleClass(c.id)}
                          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition inline-flex items-center gap-1.5 ${
                            active
                              ? 'border-[#1A73E8] bg-[#F5F9FF] text-[#1A73E8]'
                              : 'border-black/10 text-black/60 hover:border-black/30'
                          }`}
                        >
                          {active && (
                            <i className="bx bx-check text-base" aria-hidden="true" />
                          )}
                          {c.title || c.subject || 'Class'}
                        </button>
                      );
                    })}
                  </div>
                )}
              </Field>

              <Field label="Meeting Link" required>
                <input
                  type="url"
                  value={form.meetingUrl}
                  onChange={update('meetingUrl')}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full h-11 px-4 rounded-xl border border-black/15 bg-white text-sm focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20"
                  required
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Meeting ID">
                  <input
                    value={form.meetingId}
                    onChange={update('meetingId')}
                    placeholder="123 456 7890"
                    className="w-full h-11 px-4 rounded-xl border border-black/15 bg-white text-sm focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20"
                  />
                </Field>
                <Field label="Passcode">
                  <input
                    value={form.passcode}
                    onChange={update('passcode')}
                    placeholder="abcd1234"
                    className="w-full h-11 px-4 rounded-xl border border-black/15 bg-white text-sm focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20"
                  />
                </Field>
              </div>

              <label className="flex items-start gap-3 rounded-xl bg-[#F5F9FF] border border-black/10 px-4 py-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.notify}
                  onChange={update('notify')}
                  className="mt-0.5 h-4 w-4 accent-[#1A73E8]"
                />
                <div>
                  <span className="text-sm font-semibold text-black font-ebrima">
                    Notify students
                  </span>
                  <p className="text-xs text-black/50 mt-0.5">
                    Every student in the selected classes gets a portal
                    notification that the class is live.
                  </p>
                </div>
              </label>

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                  <i
                    className="bx bx-error-circle text-lg"
                    aria-hidden="true"
                  />
                  {formError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 h-12 rounded-full border border-black/10 text-sm font-bold text-black/70 hover:bg-black/5 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-12 rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white text-sm font-bold shadow-md hover:opacity-95 transition disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <i
                        className="bx bx-loader-alt animate-spin text-lg"
                        aria-hidden="true"
                      />
                      Starting…
                    </>
                  ) : (
                    <>
                      <i className="bx bx-broadcast text-lg" aria-hidden="true" />
                      Start Session
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-bold text-black/75 mb-1.5 font-ebrima">
        {label} {required && <span className="text-[#FF2E96]">*</span>}
      </label>
      {children}
    </div>
  );
}