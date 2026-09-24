// src/pages/admin/AdminMessages.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  getContactMessages,
  markContactMessageRead,
  replyToContactMessage,
  deleteContactMessage,
} from '../../lib/api';
import Avatar from '../../components/Avatar';

function fmt(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  // Reply state
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getContactMessages();
      setMessages(res?.messages || []);
    } catch (e) {
      setError(e.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.is_read).length,
    [messages]
  );

  const visible = useMemo(() => {
    let list = messages;
    if (filter === 'unread') list = list.filter((m) => !m.is_read);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((m) => {
        const hay = [m.name, m.email, m.phone, m.subject, m.message]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });
    }
    return list;
  }, [messages, filter, search]);

  const open = async (m) => {
    setOpenId(m.id);
    setReplyText('');
    setReplySuccess('');
    if (!m.is_read) {
      try {
        setBusyId(m.id);
        await markContactMessageRead(m.id);
        setMessages((prev) =>
          prev.map((x) =>
            x.id === m.id
              ? { ...x, is_read: true, read_at: new Date().toISOString() }
              : x
          )
        );
      } catch (e) {
        console.warn('Mark read failed:', e.message);
      } finally {
        setBusyId(null);
      }
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !openId) return;
    setSendingReply(true);
    setReplySuccess('');
    try {
      const res = await replyToContactMessage(openId, replyText);
      setMessages((prev) =>
        prev.map((x) =>
          x.id === openId
            ? {
                ...x,
                admin_reply: replyText,
                admin_reply_at: new Date().toISOString(),
                is_read: true,
              }
            : x
        )
      );
      setReplySuccess(
        res?.emailed
          ? 'Reply sent — the sender will receive it by email.'
          : 'Reply saved. (Email delivery failed.)'
      );
      setReplyText('');
      setTimeout(() => setReplySuccess(''), 5000);
    } catch (e) {
      setError(e.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message permanently?')) return;
    try {
      setBusyId(id);
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (openId === id) setOpenId(null);
    } catch (e) {
      alert(e.message || 'Failed to delete');
    } finally {
      setBusyId(null);
    }
  };

  const selected = messages.find((m) => m.id === openId) || null;

  return (
    <div className="w-full max-w-[1140px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima leading-tight">
            Messages
          </h1>
          <p className="text-sm text-black/50 mt-1 font-ebrima">
            {messages.length} total
            {unreadCount > 0 && (
              <>
                {' · '}
                <span className="text-[#1A73E8] font-bold">
                  {unreadCount} unread
                </span>
              </>
            )}
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-black/15 rounded-xl text-black/70 font-bold text-sm hover:bg-gray-50 transition"
        >
          <i className="bx bx-refresh text-lg" aria-hidden="true" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <i className="bx bx-error-circle text-lg" aria-hidden="true" />
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
        <div className="flex-1 bg-white rounded-xl border border-black/15 px-4 py-2.5 flex items-center gap-2.5">
          <i className="bx bx-search text-lg text-gray-400" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, subject…"
            className="flex-1 outline-none bg-transparent text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-black/40 hover:text-black transition"
              aria-label="Clear"
            >
              <i className="bx bx-x text-lg" aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: `Unread (${unreadCount})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                filter === f.key
                  ? 'bg-[#1A73E8] text-white border-2 border-[#1A73E8]'
                  : 'bg-white text-gray-500 border border-black/15 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-black/10 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-black/50">
              <i
                className="bx bx-loader-alt animate-spin text-3xl"
                aria-hidden="true"
              />
              <p className="mt-2 font-ebrima">Loading messages…</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <i
                className="bx bx-envelope text-5xl text-black/15"
                aria-hidden="true"
              />
              <p className="mt-3 text-black/60 font-ebrima font-bold">
                {messages.length === 0 ? 'No messages yet' : 'No matches'}
              </p>
              <p className="text-black/40 text-sm mt-1">
                {messages.length === 0
                  ? 'Contact form submissions will appear here.'
                  : 'Try a different filter or search.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-black/5 max-h-[70vh] overflow-y-auto">
              {visible.map((m) => {
                const isOpen = openId === m.id;
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => open(m)}
                      className={`w-full text-left px-4 py-3 transition ${
                        isOpen ? 'bg-[#F5F9FF]' : 'hover:bg-black/[0.02]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar src={null} name={m.name} size={40} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-sm truncate ${
                                m.is_read
                                  ? 'text-black/70'
                                  : 'text-black font-bold'
                              }`}
                            >
                              {m.name}
                            </p>
                            {!m.is_read && (
                              <span className="shrink-0 w-2 h-2 rounded-full bg-[#1A73E8]" />
                            )}
                          </div>
                          <p className="text-xs text-black/50 truncate">
                            {m.subject || '(no subject)'}
                          </p>
                          <p className="text-xs text-black/40 mt-0.5 truncate">
                            {m.email}
                          </p>
                          <p className="text-[10px] text-black/30 mt-1">
                            {fmt(m.created_at)}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-black/10 p-6">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <i
                className="bx bx-message-square-detail text-5xl text-black/15"
                aria-hidden="true"
              />
              <p className="mt-3 text-black/60 font-ebrima font-bold">
                Select a message
              </p>
              <p className="text-black/40 text-sm mt-1">
                Click a message on the left to read it.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-black/5">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-black font-ebrima truncate">
                    {selected.subject || '(no subject)'}
                  </h2>
                  <p className="text-sm text-black/50 mt-0.5 truncate">
                    From{' '}
                    <span className="text-black/70 font-semibold">
                      {selected.name}
                    </span>{' '}
                    &lt;{selected.email}&gt;
                  </p>
                  {selected.phone && (
                    <p className="text-sm text-black/50">
                      Phone: {selected.phone}
                    </p>
                  )}
                  <p className="text-xs text-black/40 mt-1">
                    {fmt(selected.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  disabled={busyId === selected.id}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition disabled:opacity-50"
                >
                  <i className="bx bx-trash text-base" aria-hidden="true" />
                  Delete
                </button>
              </div>

              <div className="text-sm text-black/70 leading-relaxed whitespace-pre-wrap break-words mb-6">
                {selected.message}
              </div>

              {/* Previous reply (if any) */}
              {selected.admin_reply && (
                <div className="mb-6 rounded-xl bg-[#F5F9FF] border border-blue-100 p-4">
                  <p className="text-xs font-bold text-[#1A73E8] uppercase tracking-wide mb-1">
                    Your previous reply
                  </p>
                  <p className="text-sm text-black/70 whitespace-pre-wrap break-words">
                    {selected.admin_reply}
                  </p>
                  <p className="text-xs text-black/40 mt-2">
                    Sent {fmt(selected.admin_reply_at)}
                  </p>
                </div>
              )}

              {/* Reply form */}
              <div className="pt-4 border-t border-black/5">
                <label className="block text-xs font-bold text-black/70 mb-2 uppercase tracking-wide">
                  Reply by Email
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                  placeholder={`Write your reply to ${selected.name}…`}
                  className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition resize-y"
                />
                {replySuccess && (
                  <p className="mt-2 text-sm text-green-700 flex items-center gap-1.5">
                    <i className="bx bx-check-circle" aria-hidden="true" />
                    {replySuccess}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={handleReply}
                    disabled={sendingReply || !replyText.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A73E8] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <i
                      className={`bx ${
                        sendingReply ? 'bx-loader-alt animate-spin' : 'bx-send'
                      } text-base`}
                      aria-hidden="true"
                    />
                    {sendingReply ? 'Sending…' : 'Send Reply'}
                  </button>
                  {selected.phone && (
                    <a
                      href={`tel:${selected.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-black/15 text-black/70 rounded-xl text-sm font-bold hover:bg-black/5 transition"
                    >
                      <i className="bx bx-phone text-base" aria-hidden="true" />
                      Call {selected.phone}
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}