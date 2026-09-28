// src/pages/student/StudentClasses.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getClasses,
  getSession,
  isLoggedIn,
  getProgrammes,
  getStudentSessions,
} from '../../lib/api';

const POLL_INTERVAL = 30000;

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

function getDaysLabel(cls) {
  if (Array.isArray(cls.days_of_week)) return cls.days_of_week.join(', ');
  if (typeof cls.days_of_week === 'string') return cls.days_of_week;
  if (typeof cls.days === 'string') return cls.days;
  if (Array.isArray(cls.days)) return cls.days.join(', ');

  if (typeof cls.schedule === 'string' && /[A-Za-z]{3}/.test(cls.schedule)) {
    return cls.schedule;
  }
  if (cls.schedule || cls.start_time || cls.startTime) {
    const d = new Date(cls.schedule || cls.start_time || cls.startTime);
    if (!isNaN(d)) return d.toLocaleDateString('en-NG', { weekday: 'long' });
  }
  return 'TBD';
}

function getDurationLabel(cls) {
  const parts = [];
  if (cls.start_date && cls.end_date) {
    parts.push(`${fmtDate(cls.start_date)} → ${fmtDate(cls.end_date)}`);
  } else if (cls.start_date) {
    parts.push(`Starts ${fmtDate(cls.start_date)}`);
  }
  if (cls.duration_minutes) parts.push(`${cls.duration_minutes} min/session`);
  else if (cls.duration) parts.push(cls.duration);
  if (cls.sessions_count) parts.push(`${cls.sessions_count} sessions`);
  return parts.join(' · ') || 'Ongoing';
}

export default function StudentClasses() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [, forceTick] = useState(0);
  const pollRef = useRef(null);
  const lastFetchRef = useRef(0);

  const [selectedClass, setSelectedClass] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchClasses = useCallback(async (showSpinner = false) => {
    try {
      if (showSpinner) setRefreshing(true);
      const data = await getClasses();
      const list = Array.isArray(data) ? data : data?.classes || [];
      setClasses(list);
      setError('');

      try {
        await fetchSessions();
      } catch {
        setRecordings([]);
        setLiveSessions([]);
        setRecentSessions([]);
      }

      lastFetchRef.current = Date.now();
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  async function fetchSessions() {
    try {
      const res = await getStudentSessions();
      const recs = (res?.recordings || []).map((s) => ({
        id: s.id,
        title: s.title,
        instructor: s.instructor,
        date: s.date,
        duration: s.duration,
        url: s.url,
      }));
      setRecordings(recs);
      setLiveSessions(res?.live || []);
      setRecentSessions((res?.recent || []).slice(0, 6));
    } catch {
      setRecordings([]);
      setLiveSessions([]);
      setRecentSessions([]);
    }
  }

  useEffect(() => {
    if (!isLoggedIn('student') || !getSession('student')) {
      navigate('/login');
      return;
    }
    fetchClasses(true);

    const tickId = window.setInterval(() => forceTick((n) => n + 1), 30000);

    const startPoll = () => {
      if (pollRef.current) return;
      pollRef.current = window.setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchClasses(false);
        }
      }, POLL_INTERVAL);
    };

    const stopPoll = () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        if (Date.now() - lastFetchRef.current > 5000) fetchClasses(false);
        startPoll();
      } else {
        stopPoll();
      }
    };

    startPoll();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onVisibility);

    return () => {
      stopPoll();
      window.clearInterval(tickId);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onVisibility);
    };
  }, [navigate, fetchClasses]);

  const getStatusInfo = (cls) => {
    const now = new Date();
    const schedule = cls.schedule || cls.start_time || cls.startTime;
    if (!schedule) {
      return {
        label: 'Scheduled',
        color: 'border-blue-500',
        text: 'text-blue-600',
        bg: 'bg-blue-100',
      };
    }
    const classTime = new Date(schedule);
    const diff = classTime - now;
    const durationMs = (cls.duration_minutes || 60) * 60 * 1000;

    if (diff <= 0 && diff > -durationMs) {
      return {
        label: 'Live',
        color: 'border-red-500',
        text: 'text-red-600',
        bg: 'bg-red-100',
      };
    }
    if (diff <= -durationMs) {
      return {
        label: 'Ended',
        color: 'border-gray-400',
        text: 'text-gray-600',
        bg: 'bg-gray-100',
      };
    }
    if (diff < 3600000) {
      return {
        label: 'Starting Soon',
        color: 'border-yellow-500',
        text: 'text-yellow-700',
        bg: 'bg-yellow-100',
      };
    }
    return {
      label: 'Scheduled',
      color: 'border-blue-500',
      text: 'text-blue-600',
      bg: 'bg-blue-100',
    };
  };

  const openDetails = async (cls) => {
    setSelectedClass(cls);
    setModalOpen(true);
    setSuggestLoading(true);
    setSuggestions([]);

    try {
      const res = await getProgrammes();
      const list = Array.isArray(res) ? res : res?.programmes || [];
      const current = (cls.subject || cls.title || cls.name || '').toLowerCase();

      const filtered = list
        .filter((p) => {
          const name = (p.title || p.name || '').toLowerCase();
          return name && !name.includes(current) && !current.includes(name);
        })
        .slice(0, 3);

      setSuggestions(filtered);
    } catch {
      setSuggestions([]);
    } finally {
      setSuggestLoading(false);
    }
  };

  const closeDetails = () => {
    setModalOpen(false);
    setSelectedClass(null);
    setSuggestions([]);
  };

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDetails();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A73E8] mx-auto" />
          <p className="mt-4 text-black/50 font-ebrima">Loading your classes…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
          <div>
            <h1 className="text-[28px] sm:text-[36px] font-bold text-black font-ebrima leading-tight">
              My Classes
            </h1>
            <p className="text-sm sm:text-base text-black/60 font-ebrima pt-2">
              Your upcoming schedule and class recordings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live updates
            </span>
            <button
              onClick={() => fetchClasses(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-[#1A73E8]/10 text-[#1A73E8] hover:bg-[#1A73E8]/20 transition disabled:opacity-50"
            >
              <i className="bx bx-refresh text-base" aria-hidden="true" />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-8 pt-8 flex-wrap lg:flex-nowrap">
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-xl sm:text-2xl font-bold text-black font-ebrima mb-4">
              Upcoming Classes
            </h2>
            <div className="space-y-4">
              {classes.length === 0 ? (
                <div className="text-center py-8 text-black/50 font-ebrima">
                  No upcoming classes
                </div>
              ) : (
                classes.map((cls) => {
                  const status = getStatusInfo(cls);
                  const schedule = cls.schedule || cls.start_time || cls.startTime;
                  const instructor =
                    cls.instructor?.full_name ||
                    cls.instructor?.name ||
                    cls.instructor ||
                    'TBA';
                  const location = cls.location || cls.mode || 'Online';
                  const duration =
                    cls.duration || `${cls.duration_minutes || 60} min`;

                  return (
                    <div
                      key={cls.id}
                      className={`bg-white rounded-2xl border border-black/5 p-5 sm:p-6 flex flex-wrap md:flex-nowrap items-center gap-4 border-l-4 ${status.color}`}
                    >
                      <div className="min-w-[80px] text-center">
                        <p className="text-lg font-bold text-black font-ebrima">
                          {schedule ? fmtTime(schedule) : 'TBD'}
                        </p>
                        <p className="text-xs text-black/60 font-ebrima">
                          {schedule ? fmtDate(schedule) : 'TBD'}
                        </p>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-black font-ebrima">
                          {cls.name || cls.title}
                        </h3>
                        <div className="flex items-center gap-3 pt-1.5 text-sm text-black/60 flex-wrap">
                          <span className="inline-flex items-center gap-1.5">
                            <i className="bx bx-user text-base text-[#1A73E8]" aria-hidden="true" />
                            {instructor}
                          </span>
                          <span className="text-black/25">•</span>
                          <span className="inline-flex items-center gap-1.5">
                            <i className="bx bx-map-pin text-base text-[#1A73E8]" aria-hidden="true" />
                            {location}
                          </span>
                          <span className="text-black/25">•</span>
                          <span className="inline-flex items-center gap-1.5">
                            <i className="bx bx-time text-base text-[#1A73E8]" aria-hidden="true" />
                            {duration}
                          </span>
                        </div>
                      </div>

                      <div className="text-right min-w-[140px]">
                        <span
                          className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}
                        >
                          {status.label}
                        </span>
                        {status.label === 'Live' ? (
                          <a
                            href={cls.join_url || cls.meeting_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 px-5 py-2 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition block w-full text-center"
                          >
                            <i className="bx bx-video text-base align-middle mr-1" aria-hidden="true" />
                            Join Now
                          </a>
                        ) : (
                          <button
                            onClick={() => openDetails(cls)}
                            className="mt-2 px-5 py-2 bg-[#1A73E8] text-white rounded-full text-sm font-bold hover:opacity-95 transition block w-full"
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="w-full md:w-[300px] min-w-[250px] space-y-4">
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <h3 className="text-xl font-bold text-black font-ebrima mb-4">
                Recent Sessions
              </h3>

              {liveSessions.length > 0 && (
                <div className="mb-4 space-y-2">
                  {liveSessions.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-xl border-2 border-red-200 bg-red-50/50 p-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                          Live now
                        </span>
                      </div>
                      <p className="text-sm font-bold text-black truncate">
                        {s.title}
                      </p>
                      <p className="text-xs text-black/60 mt-0.5 truncate">
                        {s.instructor?.full_name || 'Your teacher'}
                      </p>
                      <a
                        href={s.meeting_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-2 inline-flex items-center gap-1.5 text-xs font-bold ${
                          s.meeting_url
                            ? 'text-red-600 hover:underline'
                            : 'text-black/30 cursor-not-allowed'
                        }`}
                        onClick={(e) => !s.meeting_url && e.preventDefault()}
                      >
                        <i className="bx bx-video" aria-hidden="true" />
                        Join now
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {recentSessions.length === 0 && liveSessions.length === 0 ? (
                <p className="text-sm text-black/50 font-ebrima py-4 text-center">
                  No sessions yet
                </p>
              ) : (
                <div className="space-y-2.5">
                  {recentSessions.map((s) => (
                    <div
                      key={s.id}
                      className="border border-black/10 rounded-xl p-3"
                    >
                      <p className="text-sm font-bold text-black truncate">
                        {s.title}
                      </p>
                      <p className="text-xs text-black/60 mt-0.5 truncate">
                        <i className="bx bx-book mr-1" aria-hidden="true" />
                        {s.class?.title || s.class?.subject || 'Class'}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-black/50">
                        <span className="inline-flex items-center gap-1">
                          <i className="bx bx-calendar" aria-hidden="true" />
                          {s.started_at
                            ? new Date(s.started_at).toLocaleDateString('en-NG', {
                                day: 'numeric',
                                month: 'short',
                              })
                            : '—'}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <i className="bx bx-time" aria-hidden="true" />
                          {s.started_at
                            ? new Date(s.started_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—'}
                        </span>
                        {s.duration_minutes != null && (
                          <span className="inline-flex items-center gap-1 font-bold text-[#1A73E8]">
                            {s.duration_minutes}m
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <h3 className="text-xl font-bold text-black font-ebrima mb-4">
                Recent Recordings
              </h3>
              <div className="space-y-3">
                {recordings.length === 0 ? (
                  <div className="text-center py-4 text-black/50 text-sm font-ebrima">
                    No recordings available
                  </div>
                ) : (
                  recordings.map((rec) => (
                    <a
                      key={rec.id}
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-black/10 rounded-xl p-4 hover:border-[#1A73E8]/40 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#1A73E8]/10 rounded-lg flex items-center justify-center shrink-0">
                          <i className="bx bx-play-circle text-2xl text-[#1A73E8]" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-black truncate">
                            {rec.title}
                          </p>
                          <p className="text-xs text-black/60">{rec.instructor}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-black/60 mt-2">
                        <span>{rec.date ? fmtDate(rec.date) : ''}</span>
                        <span>{rec.duration}</span>
                      </div>
                    </a>
                  ))
                )}
              </div>
              <button
                onClick={() => navigate('/student/learn-more')}
                className="w-full mt-4 py-2.5 bg-[#1A73E8] text-white rounded-full text-sm font-bold hover:opacity-95 transition"
              >
                Browse Learning Videos
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && selectedClass && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeDetails}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-[720px] my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-br from-[#1A73E8] to-[#0F4082] rounded-t-3xl p-6 sm:p-8 text-white">
              <button
                type="button"
                onClick={closeDetails}
                aria-label="Close"
                className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition"
              >
                <i className="bx bx-x text-xl" aria-hidden="true" />
              </button>

              {selectedClass.subject && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  <i className="bx bx-purchase-tag" aria-hidden="true" />
                  {selectedClass.subject}
                </span>
              )}
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold font-ebrima leading-tight">
                {selectedClass.name || selectedClass.title || 'Class details'}
              </h2>
              {selectedClass.description && (
                <p className="mt-2 text-sm text-white/85 leading-relaxed">
                  {selectedClass.description}
                </p>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-black/45 mb-3">
                  Lecturer
                </h3>
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-black/10 bg-[#FAFBFF]">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#1A73E8] to-[#0F4082] text-white font-bold text-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {selectedClass.instructor?.avatar_url ? (
                      <img
                        src={selectedClass.instructor.avatar_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (selectedClass.instructor?.full_name ||
                        selectedClass.instructor?.name ||
                        selectedClass.instructor ||
                        'T')
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((s) => s[0]?.toUpperCase())
                        .join('')
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-black font-ebrima truncate">
                      {selectedClass.instructor?.full_name ||
                        selectedClass.instructor?.name ||
                        selectedClass.instructor ||
                        'TBA'}
                    </p>
                    {selectedClass.instructor?.department && (
                      <p className="text-sm text-black/55 truncate">
                        {selectedClass.instructor.department}
                      </p>
                    )}
                    {selectedClass.instructor?.email && (
                      <p className="text-xs text-black/40 truncate">
                        {selectedClass.instructor.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-black/45 mb-3">
                  Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoTile
                    icon="bx-calendar"
                    label="Days"
                    value={getDaysLabel(selectedClass)}
                  />
                  <InfoTile
                    icon="bx-time"
                    label="Time"
                    value={
                      selectedClass.schedule || selectedClass.start_time
                        ? fmtTime(
                            selectedClass.schedule ||
                              selectedClass.start_time ||
                              selectedClass.startTime
                          )
                        : 'TBD'
                    }
                  />
                  <InfoTile
                    icon="bx-hourglass"
                    label="Duration"
                    value={getDurationLabel(selectedClass)}
                  />
                  <InfoTile
                    icon="bx-map-pin"
                    label="Location"
                    value={selectedClass.location || selectedClass.mode || 'Online'}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-black/45 mb-3">
                  You might also like
                </h3>

                {suggestLoading ? (
                  <div className="py-6 text-center text-black/40">
                    <i
                      className="bx bx-loader-alt animate-spin text-2xl"
                      aria-hidden="true"
                    />
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-black/15 p-6 text-center text-sm text-black/50 font-ebrima">
                    No new suggestions right now — check back soon.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {suggestions.map((s) => (
                      <button
                        key={s.id || s._id || s.title}
                        onClick={() => {
                          closeDetails();
                          navigate('/programmes');
                        }}
                        className="text-left rounded-2xl border border-black/10 p-4 hover:shadow-md hover:border-[#1A73E8]/40 transition"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A73E8]/10 text-[#1A73E8] mb-3">
                          <i className="bx bx-book-open text-lg" aria-hidden="true" />
                        </span>
                        <p className="font-bold text-black text-sm font-ebrima leading-tight line-clamp-2">
                          {s.title || s.name || 'Programme'}
                        </p>
                        {s.track_name && (
                          <p className="text-xs text-black/50 mt-1 truncate">
                            {s.track_name}
                          </p>
                        )}
                        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#1A73E8]">
                          View
                          <i className="bx bx-right-arrow-alt" aria-hidden="true" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 sm:px-8 py-4 border-t border-black/5 flex justify-end gap-3 rounded-b-3xl">
              <button
                onClick={closeDetails}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-black/70 bg-black/5 hover:bg-black/10 transition"
              >
                Close
              </button>
              {getStatusInfo(selectedClass).label === 'Live' && (
                <a
                  href={selectedClass.join_url || selectedClass.meeting_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] hover:opacity-95 transition"
                >
                  <i className="bx bx-video" aria-hidden="true" />
                  Join class
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoTile({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl border border-black/10 bg-white">
      <span className="h-9 w-9 shrink-0 rounded-xl bg-[#F5F9FF] text-[#1A73E8] flex items-center justify-center">
        <i className={`bx ${icon} text-lg`} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-black/45">
          {label}
        </p>
        <p className="text-sm font-bold text-black font-ebrima truncate">
          {value || 'TBD'}
        </p>
      </div>
    </div>
  );
}