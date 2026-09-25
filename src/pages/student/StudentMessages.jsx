// src/pages/student/StudentMessages.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import Avatar from '../../components/Avatar';
import {
  getMyTeachers,
  getConversationWithTeacher,
  sendMessageToTeacher,
} from '../../lib/api';

function fmtTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fmtDay(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function StudentMessages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTeacherId = searchParams.get('teacher') || null;

  const [teachers, setTeachers] = useState([]);
  const [activeId, setActiveId] = useState(urlTeacherId);
  const [messages, setMessages] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const endRef = useRef(null);

  const loadTeachers = async () => {
    setLoadingList(true);
    try {
      const res = await getMyTeachers();
      setTeachers(res?.teachers || []);
    } catch (e) {
      setError(e.message || 'Failed to load teachers');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      setTeacherInfo(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingThread(true);
      setError('');
      try {
        const res = await getConversationWithTeacher(activeId);
        if (cancelled) return;
        setMessages(res?.messages || []);
        setTeacherInfo(res?.teacher || null);
        setTeachers((prev) =>
          prev.map((t) => (t.id === activeId ? { ...t, unreadCount: 0 } : t))
        );
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load messages');
      } finally {
        if (!cancelled) setLoadingThread(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  useEffect(() => {
    if (activeId) {
      setSearchParams({ teacher: activeId }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line
  }, [activeId]);

  useEffect(() => {
    if (!activeId && teachers.length > 0) {
      setActiveId(teachers[0].id);
    }
  }, [teachers, activeId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!activeId) return;
    const t = setInterval(async () => {
      try {
        const res = await getConversationWithTeacher(activeId);
        setMessages(res?.messages || []);
      } catch {
        /* silent */
      }
    }, 15000);
    return () => clearInterval(t);
  }, [activeId]);

  const visibleTeachers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) => (t.name || '').toLowerCase().includes(q));
  }, [teachers, search]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !activeId) return;

    setSending(true);
    setError('');
    try {
      const res = await sendMessageToTeacher(activeId, text);
      setInput('');
      if (res?.message) {
        setMessages((m) => [...m, res.message]);
      } else {
        const refreshed = await getConversationWithTeacher(activeId);
        setMessages(refreshed?.messages || []);
      }
      loadTeachers();
    } catch (err) {
      setError(err.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Messages" />
      <div className="flex-1 ml-[300px] min-w-0">
        <StudentHeader />

        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-black font-ebrima leading-tight">
              Messages
            </h1>
            <p className="text-sm text-black/50 mt-1 font-ebrima">
              Chat with your teachers.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <i className="bx bx-error-circle text-lg" aria-hidden="true" />
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-240px)] min-h-[520px]">
            <div className="lg:col-span-1 bg-white rounded-2xl border border-black/10 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-black/5">
                <div className="bg-[#F5F9FF] rounded-xl px-3 py-2 flex items-center gap-2">
                  <i className="bx bx-search text-black/40" aria-hidden="true" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search teachers…"
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingList ? (
                  <div className="py-10 text-center text-black/40 text-sm">
                    <i
                      className="bx bx-loader-alt animate-spin text-2xl"
                      aria-hidden="true"
                    />
                    <p className="mt-2">Loading…</p>
                  </div>
                ) : visibleTeachers.length === 0 ? (
                  <div className="py-10 px-6 text-center text-black/50">
                    <i
                      className="bx bx-user-x text-4xl text-black/15"
                      aria-hidden="true"
                    />
                    <p className="mt-3 font-ebrima font-bold text-sm">
                      No teachers assigned yet
                    </p>
                    <p className="text-xs mt-1 text-black/40">
                      You'll see your teacher here once they're assigned to your
                      category.
                    </p>
                  </div>
                ) : (
                  visibleTeachers.map((t) => {
                    const active = activeId === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveId(t.id)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-black/5 last:border-0 transition ${
                          active ? 'bg-[#F5F9FF]' : 'hover:bg-black/[0.02]'
                        }`}
                      >
                        <Avatar src={t.avatar_url} name={t.name} size={42} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-sm truncate ${
                                t.unreadCount > 0
                                  ? 'font-bold text-black'
                                  : 'font-semibold text-black/85'
                              }`}
                            >
                              {t.name}
                            </p>
                            {t.lastMessageAt && (
                              <span className="text-[10px] text-black/40 shrink-0">
                                {fmtTime(t.lastMessageAt)}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs truncate mt-0.5 ${
                              t.unreadCount > 0
                                ? 'text-black/70'
                                : 'text-black/45'
                            }`}
                          >
                            {t.lastMessage ||
                              (t.department
                                ? t.department
                                : 'Tap to start chatting')}
                          </p>
                          {t.unreadCount > 0 && (
                            <span className="inline-block mt-1 text-[10px] font-bold bg-[#1A73E8] text-white rounded-full px-2 py-0.5">
                              {t.unreadCount} new
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-black/10 overflow-hidden flex flex-col">
              {!activeId || !teacherInfo ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                  <i
                    className="bx bx-message-square-dots text-5xl text-black/15"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-black/55 font-ebrima font-bold">
                    Select a teacher to start messaging
                  </p>
                </div>
              ) : (
                <>
                  <div className="px-5 py-3 border-b border-black/5 flex items-center gap-3 bg-white">
                    <Avatar
                      src={teacherInfo.avatar_url}
                      name={teacherInfo.full_name}
                      size={40}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-black text-sm truncate">
                        {teacherInfo.full_name}
                      </p>
                      <p className="text-xs text-black/45 truncate">
                        {teacherInfo.department || teacherInfo.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 py-4 bg-[#FAFBFF]">
                    {loadingThread ? (
                      <div className="py-16 text-center text-black/40">
                        <i
                          className="bx bx-loader-alt animate-spin text-3xl"
                          aria-hidden="true"
                        />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="py-16 text-center text-black/45">
                        <i
                          className="bx bx-chat text-5xl text-black/15"
                          aria-hidden="true"
                        />
                        <p className="mt-3 text-sm">
                          No messages yet — say hello 👋
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((m, i) => {
                          const mine = m.sender_id !== teacherInfo.id;
                          const prev = messages[i - 1];
                          const showDay =
                            !prev ||
                            fmtDay(prev.created_at) !== fmtDay(m.created_at);
                          return (
                            <div key={m.id || i}>
                              {showDay && (
                                <div className="text-center text-[10px] font-bold text-black/40 uppercase tracking-wider my-3">
                                  {fmtDay(m.created_at)}
                                </div>
                              )}
                              <div
                                className={`flex ${
                                  mine ? 'justify-end' : 'justify-start'
                                }`}
                              >
                                <div
                                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap ${
                                    mine
                                      ? 'bg-[#1A73E8] text-white rounded-br-sm'
                                      : 'bg-white border border-black/10 text-black rounded-bl-sm'
                                  }`}
                                >
                                  {m.body || m.content}
                                  <div
                                    className={`text-[10px] mt-1 ${
                                      mine ? 'text-white/70' : 'text-black/40'
                                    } text-right`}
                                  >
                                    {fmtTime(m.created_at)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={endRef} />
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={send}
                    className="border-t border-black/5 p-3 flex items-center gap-2 bg-white"
                  >
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Message ${teacherInfo.full_name}…`}
                      className="flex-1 h-11 px-4 rounded-full border border-black/15 text-sm focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={sending || !input.trim()}
                      className="h-11 w-11 rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white flex items-center justify-center shadow-md hover:opacity-95 disabled:opacity-50 transition"
                      aria-label="Send"
                    >
                      <i
                        className={`bx ${
                          sending ? 'bx-loader-alt animate-spin' : 'bx-send'
                        } text-lg`}
                        aria-hidden="true"
                      />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}