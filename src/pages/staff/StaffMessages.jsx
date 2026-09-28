// src/pages/staff/StaffMessages.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import {
  getStaffInbox,
  getStaffConversation,
  sendStaffMessage,
  getSession,
} from '../../lib/api';

function fmtTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function StaffMessages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inbox, setInbox] = useState([]);
  const [activeStudentId, setActiveStudentId] = useState(
    searchParams.get('student') || null
  );
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  const staffUserId = getSession('staff')?.id || null;

  const loadInbox = useCallback(async () => {
    try {
      const res = await getStaffInbox();
      const list = res?.inbox || [];
      setInbox(list);
      if (!activeStudentId && list.length) {
        setActiveStudentId(list[0].studentId);
      }
    } catch (err) {
      setError(err.message || 'Failed to load inbox');
    } finally {
      setLoadingInbox(false);
    }
  }, [activeStudentId]);

  useEffect(() => {
    loadInbox();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') loadInbox();
    }, 15000);
    return () => clearInterval(t);
  }, [loadInbox]);

  useEffect(() => {
    if (!activeStudentId) return;
    let cancelled = false;
    setLoadingMsgs(true);
    getStaffConversation(activeStudentId)
      .then((res) => {
        if (!cancelled) setMessages(res?.messages || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingMsgs(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeStudentId]);

  useEffect(() => {
    if (!activeStudentId) return;
    const t = setInterval(async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const res = await getStaffConversation(activeStudentId);
        setMessages(res?.messages || []);
      } catch {
        /* silent */
      }
    }, 12000);
    return () => clearInterval(t);
  }, [activeStudentId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelect = (studentId) => {
    setActiveStudentId(studentId);
    setSearchParams({ student: studentId });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeStudentId) return;
    const body = text.trim();
    setText('');

    const optimistic = {
      id: `tmp-${Date.now()}`,
      sender_id: staffUserId,
      recipient_id: 'them',
      body,
      created_at: new Date().toISOString(),
      is_read: true,
    };
    setMessages((m) => [...m, optimistic]);

    try {
      await sendStaffMessage({ studentId: activeStudentId, body });
      const fresh = await getStaffConversation(activeStudentId);
      setMessages(fresh?.messages || []);
      loadInbox();
    } catch (err) {
      setError(err.message);
    }
  };

  const activeStudent = inbox.find((t) => t.studentId === activeStudentId);

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima mb-6">
        Messages
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div
        className="bg-white rounded-2xl border border-black/10 overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr]"
        style={{ height: 'calc(100vh - 240px)', minHeight: '520px' }}
      >
        <div className="border-b md:border-b-0 md:border-r border-black/10 overflow-y-auto max-h-[240px] md:max-h-none">
          {loadingInbox && (
            <div className="p-6 text-center text-black/40 text-sm">
              Loading…
            </div>
          )}
          {!loadingInbox && inbox.length === 0 && (
            <div className="p-6 text-center text-black/40 text-sm">
              No conversations yet.
            </div>
          )}
          {inbox.map((t) => (
            <button
              key={t.studentId}
              onClick={() => handleSelect(t.studentId)}
              className={`w-full text-left p-4 border-b border-black/5 hover:bg-blue-50 transition ${
                t.studentId === activeStudentId ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar src={t.avatar_url} name={t.studentName} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bold text-sm text-black truncate">
                      {t.studentName}
                    </span>
                    {t.unreadCount > 0 && (
                      <span className="bg-[#FF2E96] text-white text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0">
                        {t.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-black/50 truncate">
                    {t.lastMessage}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col min-h-0">
          {!activeStudentId ? (
            <div className="flex-1 flex items-center justify-center text-black/40 text-sm">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="px-5 py-3 border-b border-black/10 flex items-center gap-3 shrink-0">
                <Avatar
                  src={activeStudent?.avatar_url}
                  name={activeStudent?.studentName}
                  size={36}
                />
                <div className="min-w-0">
                  <div className="font-bold text-black text-sm truncate">
                    {activeStudent?.studentName}
                  </div>
                  <div className="text-xs text-black/50 truncate">
                    {activeStudent?.studentEmail}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#F8FAFC]">
                {loadingMsgs && (
                  <div className="text-center text-black/40 text-sm">
                    Loading messages…
                  </div>
                )}
                {!loadingMsgs && messages.length === 0 && (
                  <div className="text-center text-black/40 text-sm py-10">
                    No messages yet. Say hi!
                  </div>
                )}
                {messages.map((m) => {
                  const mine = staffUserId && m.sender_id === staffUserId;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${
                        mine ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm break-words whitespace-pre-wrap ${
                          mine
                            ? 'bg-[#1A73E8] text-white rounded-br-md'
                            : 'bg-white border border-black/10 text-black rounded-bl-md'
                        }`}
                      >
                        {m.body || m.content}
                        <div
                          className={`text-[10px] mt-1 ${
                            mine ? 'text-white/70' : 'text-black/40'
                          }`}
                        >
                          {fmtTime(m.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="p-3 border-t border-black/10 flex gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 h-11 px-4 border border-black/15 rounded-full outline-none focus:border-[#1A73E8] text-sm"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="h-11 w-11 rounded-full bg-[#1A73E8] text-white flex items-center justify-center disabled:opacity-50"
                  aria-label="Send"
                >
                  <i className="bx bx-send text-lg" aria-hidden="true" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}