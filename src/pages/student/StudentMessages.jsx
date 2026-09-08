// src/pages/student/StudentMessages.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import { getMessages, sendMessage, markMessageRead, getUnreadMessageCount } from '../../lib/api';
import { getSession, isLoggedIn } from '../../lib/api';

export default function StudentMessages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    fetchMessages();
    
    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchMessages = async () => {
    try {
      const [messagesData, unreadData] = await Promise.all([
        getMessages(),
        getUnreadMessageCount()
      ]);
      
      setConversations(messagesData || []);
      setUnreadCount(unreadData?.unread_count || 0);
      
      if (!selectedConversation && messagesData && messagesData.length > 0) {
        setSelectedConversation(messagesData[0]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    try {
      await sendMessage({
        recipientId: selectedConversation.id,
        content: newMessage.trim(),
        subject: selectedConversation.subject || 'Message'
      });
      
      setNewMessage('');
      // Refresh messages
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const handleSelectConversation = async (conv) => {
    setSelectedConversation(conv);
    if (!conv.is_read) {
      try {
        await markMessageRead(conv.id);
        await fetchMessages();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
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
                  {unreadCount > 0 ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'No unread messages'}
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
                {/* Conversation List - Left Side */}
                <div className="w-full lg:w-[358px] lg:min-w-[358px] border-r border-black/10 flex flex-col">
                  {/* Search Bar */}
                  <div className="p-4 border-b border-black/10">
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-black/20 rounded-full text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Conversations */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No conversations</p>
                      </div>
                    ) : (
                      filteredConversations.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv)}
                          className={`p-4 border-b border-black/5 cursor-pointer transition ${
                            selectedConversation?.id === conv.id
                              ? 'bg-blue-100/50'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-blue-200/20 rounded-full flex items-center justify-center text-2xl">
                                {conv.avatar || '👤'}
                              </div>
                              {conv.is_online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-black text-sm truncate">{conv.fullName || 'Unknown'}</span>
                                <span className="text-xs text-black/60 whitespace-nowrap ml-2">
                                  {conv.created_at ? new Date(conv.created_at).toLocaleString() : ''}
                                </span>
                              </div>
                              <p className="text-xs text-black/60 truncate">{conv.subject || 'No subject'}</p>
                              <p className="text-sm text-black/70 truncate mt-1">{conv.lastMessage || conv.content}</p>
                            </div>
                            {!conv.is_read && (
                              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                                •
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Chat Area - Right Side */}
                {selectedConversation ? (
                  <div className="flex-1 flex flex-col w-full lg:w-auto">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-black/10 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-200/20 rounded-full flex items-center justify-center text-2xl">
                            {selectedConversation.avatar || '👤'}
                          </div>
                          {selectedConversation.is_online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-black">{selectedConversation.fullName || 'Unknown'}</p>
                          <p className="text-sm text-black/60">{selectedConversation.is_online ? 'Online' : 'Offline'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {selectedConversation.messages?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No messages yet</p>
                          <p className="text-sm">Send a message to start the conversation</p>
                        </div>
                      ) : (
                        selectedConversation.messages?.map((msg, index) => (
                          <div
                            key={msg.id || index}
                            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="max-w-[70%]">
                              {!msg.isOwn && (
                                <p className="text-xs text-black/60 mb-1 pl-1">{selectedConversation.fullName}</p>
                              )}
                              <div
                                className={`p-3 rounded-2xl ${
                                  msg.isOwn
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-black/5 text-black rounded-bl-none'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              </div>
                              <p className={`text-xs text-black/60 mt-1 ${msg.isOwn ? 'text-right pr-1' : 'pl-1'}`}>
                                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-black/10">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1 px-4 py-3 border border-black/20 rounded-full focus:outline-none focus:border-blue-500 text-sm"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <p className="text-xl">Select a conversation</p>
                      <p className="text-sm">Choose a conversation from the list to start messaging</p>
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