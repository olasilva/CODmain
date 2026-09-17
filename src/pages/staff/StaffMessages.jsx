// src/pages/staff/StaffMessages.jsx
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getStaffInbox,
  getStaffConversation,
  sendStaffMessage,
} from '../../lib/api';

export default function StaffMessages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inbox, setInbox] = useState([]);
  const [activeStudentId, setActiveStudentId] = useState(searchParams.get('student') || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  // Load inbox
  useEffect(() => {
    (async () => {
      try {
        const res = await getStaffInbox();
        setInbox(res?.inbox || []);
        if (!activeStudentId && res?.inbox?.length) {
          setActiveStudentId(res.inbox[0].studentId);
        }
      } catch (err) {
        setError(err.message || 'Failed to load inbox');
      } finally {
        setLoadingInbox(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load conversation when a student is selected
  useEffect(() => {
    if (!activeStudentId) return;
    setLoadingMsgs(true);
    getStaffConversation(activeStudentId)
      .then((res) => setMessages(res?.messages || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingMsgs(false));
  }, [activeStudentId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSelect = (studentId) => {
    setActiveStudentId(studentId);
    setSearchParams({ student: studentId });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeStudentId) return;
    const body = text.trim();
    setText('');

    // Optimistic
    const optimistic = {
      id: `tmp-${Date.now()}`,
      sender_id: 'me',
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
    } catch (err) {
      setError(err.message);
    }
  };

  const activeStudent = inbox.find((t) => t.studentId === activeStudentId);

  return (
    <div className="max-w-[1140px] mx-auto">
      <h1 className="text-[32px] font-bold text-black font-ebrima mb-6">Messages</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/10 overflow-hidden grid grid-cols-[280px_1fr]" style={{ height: '600px' }}>
        {/* Inbox list */}
        <div className="border-r border-black/10 overflow-y-auto">
          {loadingInbox && (
            <div className="p-6 text-center text-black/40 text-sm">Loading…</div>
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
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold">
                  {(t.studentName || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-sm text-black truncate">
                      {t.studentName}
                    </span>
                    {t.unreadCount > 0 && (
                      <span className="bg-[#1A73E8] text-white text-xs font-bold rounded-full px-2 py-0.5">
                        {t.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-black/50 truncate">{t.lastMessage}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat pane */}
        <div className="flex flex-col">
          {!activeStudentId ? (
            <div className="flex-1 flex items-center justify-center text-black/40 text-sm">
              Select a conversation
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-5 py-3 border-b border-black/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold text-sm">
                  {(activeStudent?.studentName || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-black text-sm">
                    {activeStudent?.studentName}
                  </div>
                  <div className="text-xs text-black/50">{activeStudent?.studentEmail}</div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#F8FAFC]">
                {loadingMsgs && <div className="text-center text-black/40 text-sm">Loading messages…</div>}
                {!loadingMsgs && messages.length === 0 && (
                  <div className="text-center text-black/40 text-sm py-10">
                    No messages yet. Say hi!
                  </div>
                )}
                {messages.map((m) => {
                  const mine = m.sender_id !== activeStudent?.studentId
                    ? true
                    : false;
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                          mine
                            ? 'bg-[#1A73E8] text-white rounded-br-md'
                            : 'bg-white border border-black/10 text-black rounded-bl-md'
                        }`}
                      >
                        {m.body}
                        <div className={`text-[10px] mt-1 ${mine ? 'text-white/70' : 'text-black/40'}`}>
                          {new Date(m.created_at).toLocaleTimeString('en-NG', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              {/* Composer */}
              <form onSubmit={handleSend} className="p-3 border-t border-black/10 flex gap-2">
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
                  className="px-5 h-11 bg-[#1A73E8] text-white font-bold rounded-full text-sm disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}