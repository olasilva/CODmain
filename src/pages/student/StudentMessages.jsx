// src/pages/student/StudentMessages.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import {
  getMessages,
  sendMessage,
  markMessageRead,
  getUnreadMessageCount,
  getSession,
  isLoggedIn,
} from '../../lib/api';

export default function StudentMessages() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const endRef = useRef(null);

  const session = getSession();
  const myUserId = session?.id;

  // ─── Auth guard + initial load ───
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // ─── Scroll chat to bottom when active thread changes ───
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThreadId, threads]);

  // ─── Fetch + group messages into threads ───
  const fetchMessages = async () => {
    try {
      setError('');
      const [messagesRes, unreadRes] = await Promise.all([
        getMessages(),
        getUnreadMessageCount(),
      ]);

      // Extract array from wrapper
      const messages = Array.isArray(messagesRes)
        ? messagesRes
        : messagesRes?.messages || [];

      // Group into threads by the OTHER person's user id
      const threadMap = {};
      messages.forEach((m) => {
        const otherId =
          m.sender_id === myUserId ? m.recipient_id : m.sender_id;
        if (!otherId) return;

        if (!threadMap[otherId]) {
          const other = m.sender_id === myUserId ? m.recipient : m.sender;
          threadMap[otherId] = {
            threadId: otherId,
            otherUser: other || { id: otherId, full_name: 'Unknown' },
            messages: [],
            lastMessage: null,
            unreadCount: 0,
          };
        }

        threadMap[otherId].messages.push({
          id: m.id,
          body: m.body || m.content || '',
          created_at: m.created_at,
          is_own: m.sender_id === myUserId,
          is_read: m.is_read,
        });

        // Track unread incoming
        if (m.sender_id !== myUserId && !m.is_read) {
          threadMap[otherId].unreadCount += 1;
        }
      });

      // Sort messages within each thread + capture last message
      const threadList = Object.values(threadMap).map((t) => {
        t.messages.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        t.lastMessage = t.messages[t.messages.length - 1];
        return t;
      });

      // Sort threads by most recent activity
      threadList.sort((a, b) => {
        const aTime = a.lastMessage ? new Date(a.lastMessage.created_at) : 0;
        const bTime = b.lastMessage ? new Date(b.lastMessage.created_at) : 0;
        return bTime - aTime;
      });

      setThreads(threadList);

      // Auto-select first thread
      if (!activeThreadId && threadList.length > 0) {
        setActiveThreadId(threadList[0].threadId);
      }

      setUnreadCount(unreadRes?.unread || 0);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // ─── Send message to active thread ───
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeThreadId) return;
    const body = newMessage.trim();
    setNewMessage('');

    // Optimistic append
    setThreads((prev) =>
      prev.map((t) => {
        if (t.threadId !== activeThreadId) return t;
        return {
          ...t,
          messages: [
            ...t.messages,
            {
              id: `tmp-${Date.now()}`,
              body,
              created_at: new Date().toISOString(),
              is_own: true,
              is_read: true,
            },
          ],
        };
      })
    );

    try {
      await sendMessage({ recipient_id: activeThreadId, body });
      await fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      await fetchMessages();
    }
  };

  // ─── Select thread + mark its messages read ───
  const handleSelectThread = async (threadId) => {
    setActiveThreadId(threadId);
    const thread = threads.find((t) => t.threadId === threadId);
    if (!thread) return;

    const unreadIds = thread.messages
      .filter((m) => !m.is_own && !m.is_read)
      .map((m) => m.id);

    if (unreadIds.length === 0) return;

    try {
      await Promise.all(unreadIds.map((id) => markMessageRead(id)));
      await fetchMessages();
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  // ─── Filter ───
  const q = searchQuery.trim().toLowerCase();
  const filteredThreads = threads.filter((t) => {
    if (!q) return true;
    const name = (t.otherUser?.full_name || '').toLowerCase();
    const last = (t.lastMessage?.body || '').toLowerCase();
    return name.includes(q) || last.includes(q);
  });

  const activeThread = threads.find((t) => t.threadId === activeThreadId);

  // ─── Loading screen ───
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Messages" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
                  Messages
                </h1>
                <p className="text-base text-black/60 font-ebrima pt-2">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread message${
                        unreadCount > 1 ? 's' : ''
                      }`
                    : 'No unread messages'}
                </p>
              </div>
              <button
                onClick={fetchMessages}
                className="px-4 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition"
              >
                🔄 Refresh
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="bg-white rounded-3xl border border-black/5 overflow-hidden mt-6">
              <div className="flex h-[693px] flex-wrap lg:flex-nowrap">
                {/* Conversation List */}
                <div className="w-full lg:w-[358px] lg:min-w-[358px] border-r border-black/10 flex flex-col">
                  <div className="p-4 border-b border-black/10">
                    <input
                      type="text"
                      placeholder="Search messages…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-black/20 rounded-full text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {filteredThreads.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 text-sm px-4">
                        <p>
                          {q
                            ? 'No conversations match your search.'
                            : 'No conversations yet.'}
                        </p>
                        {!q && (
                          <p className="text-xs mt-2">
                            Messages from your teachers will appear here.
                          </p>
                        )}
                      </div>
                    ) : (
                      filteredThreads.map((thread) => {
                        const name =
                          thread.otherUser?.full_name || 'Unknown';
                        const initial = name.charAt(0).toUpperCase();
                        const isActive =
                          thread.threadId === activeThreadId;
                        return (
                          <button
                            key={thread.threadId}
                            onClick={() =>
                              handleSelectThread(thread.threadId)
                            }
                            className={`w-full text-left p-4 border-b border-black/5 transition ${
                              isActive
                                ? 'bg-blue-50'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative shrink-0">
                                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1A73E8] flex items-center justify-center text-lg font-bold">
                                  {initial}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-bold text-black text-sm truncate">
                                    {name}
                                  </span>
                                  <span className="text-xs text-black/50 whitespace-nowrap">
                                    {thread.lastMessage?.created_at
                                      ? new Date(
                                          thread.lastMessage.created_at
                                        ).toLocaleDateString('en-NG', {
                                          day: 'numeric',
                                          month: 'short',
                                        })
                                      : ''}
                                  </span>
                                </div>
                                <p className="text-sm text-black/60 truncate mt-0.5">
                                  {thread.lastMessage?.body || 'No messages'}
                                </p>
                              </div>
                              {thread.unreadCount > 0 && (
                                <span className="bg-[#1A73E8] text-white text-xs font-bold rounded-full px-2 py-0.5 shrink-0">
                                  {thread.unreadCount}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Chat Area */}
                {activeThread ? (
                  <div className="flex-1 flex flex-col w-full lg:w-auto min-w-0">
                    {/* Header */}
                    <div className="p-4 border-b border-black/10 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1A73E8] flex items-center justify-center text-lg font-bold">
                        {(activeThread.otherUser?.full_name || '?')
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-black">
                          {activeThread.otherUser?.full_name || 'Unknown'}
                        </p>
                        <p className="text-xs text-black/50">
                          {activeThread.otherUser?.role === 'admin'
                            ? 'Administrator'
                            : activeThread.otherUser?.role === 'staff'
                            ? 'Teacher'
                            : ''}
                        </p>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#F8FAFC]">
                      {activeThread.messages.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 text-sm">
                          No messages yet. Send the first one below.
                        </div>
                      ) : (
                        activeThread.messages.map((msg, i) => (
                          <div
                            key={msg.id || i}
                            className={`flex ${
                              msg.is_own ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div className="max-w-[70%]">
                              <div
                                className={`px-4 py-2.5 text-sm rounded-2xl ${
                                  msg.is_own
                                    ? 'bg-[#1A73E8] text-white rounded-br-md'
                                    : 'bg-white border border-black/10 text-black rounded-bl-md'
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {msg.body}
                                </p>
                              </div>
                              <p
                                className={`text-xs text-black/40 mt-1 ${
                                  msg.is_own ? 'text-right' : ''
                                }`}
                              >
                                {msg.created_at
                                  ? new Date(
                                      msg.created_at
                                    ).toLocaleTimeString('en-NG', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : ''}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={endRef} />
                    </div>

                    {/* Composer */}
                    <div className="p-4 border-t border-black/10">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Type your message…"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="flex-1 px-4 py-3 border border-black/20 rounded-full focus:outline-none focus:border-blue-500 text-sm"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                          <svg
                            className="w-5 h-5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center px-6">
                      <p className="text-xl font-bold mb-1">
                        No conversation selected
                      </p>
                      <p className="text-sm">
                        Pick a thread from the left, or wait for your teachers
                        to message you.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}