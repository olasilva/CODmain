// src/pages/student/StudentMessages.jsx
import React, { useState } from 'react';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';

const conversations = [
  {
    id: 1,
    name: 'Prof. Adebayo',
    role: 'Guitar Instructor',
    avatar: '👨‍🏫',
    lastMessage: 'Great progress on your last assignment!',
    time: '10 mins ago',
    unread: 2,
    online: true,
    messages: [
      { id: 1, sender: 'Prof. Adebayo', text: 'Hi Immanuel, I reviewed your guitar practice log.', time: '10:15 AM', isOwn: false },
      { id: 2, sender: 'Me', text: 'Thank you, Professor! How did I do?', time: '10:17 AM', isOwn: true },
      { id: 3, sender: 'Prof. Adebayo', text: 'Great progress on your last assignment! Your finger positioning has improved significantly.', time: '10:20 AM', isOwn: false },
      { id: 4, sender: 'Prof. Adebayo', text: 'Keep focusing on the chord transitions we discussed in class.', time: '10:20 AM', isOwn: false },
      { id: 5, sender: 'Me', text: 'I will! Thank you for the feedback. Should I continue with the same exercises?', time: '10:25 AM', isOwn: true },
    ]
  },
  {
    id: 2,
    name: 'Mr. Okonkwo',
    role: 'Mathematics Teacher',
    avatar: '👨‍💼',
    lastMessage: 'Don\'t forget about tomorrow\'s quiz',
    time: '1 hour ago',
    unread: 0,
    online: true,
    messages: []
  },
  {
    id: 3,
    name: 'Mrs. Johnson',
    role: 'English Teacher',
    avatar: '👩‍🏫',
    lastMessage: 'I\'ve reviewed your essay draft',
    time: '3 hours ago',
    unread: 1,
    online: false,
    messages: []
  },
  {
    id: 4,
    name: 'Class Group - MUS101',
    role: '4 members',
    avatar: '👥',
    lastMessage: 'Sarah: Anyone free for practice session?',
    time: 'Yesterday',
    unread: 0,
    online: false,
    messages: []
  }
];

export default function StudentMessages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Messages" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8">
            <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
              Messages
            </h1>
            <p className="text-base text-black/60 font-ebrima pt-2">
              Communicate with your instructors and classmates
            </p>

            <div className="bg-white rounded-3xl border border-black/5 overflow-hidden mt-6">
              <div className="flex h-[693px]">
                {/* Conversation List - Left Side */}
                <div className="w-[358px] min-w-[358px] border-r border-black/10 flex flex-col">
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
                    {filteredConversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-4 border-b border-black/5 cursor-pointer transition ${
                          selectedConversation?.id === conv.id
                            ? 'bg-blue-100/50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-blue-200/20 rounded-full flex items-center justify-center text-2xl">
                              {conv.avatar}
                            </div>
                            {conv.online && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-black text-sm truncate">{conv.name}</span>
                              <span className="text-xs text-black/60 whitespace-nowrap ml-2">{conv.time}</span>
                            </div>
                            <p className="text-xs text-black/60 truncate">{conv.role}</p>
                            <p className="text-sm text-black/70 truncate mt-1">{conv.lastMessage}</p>
                          </div>
                          {conv.unread > 0 && (
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {conv.unread}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Area - Right Side */}
                {selectedConversation && (
                  <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-black/10 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-200/20 rounded-full flex items-center justify-center text-2xl">
                            {selectedConversation.avatar}
                          </div>
                          {selectedConversation.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-black">{selectedConversation.name}</p>
                          <p className="text-sm text-black/60">{selectedConversation.online ? 'Online' : 'Offline'}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg className="w-6 h-6 text-black/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {selectedConversation.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="max-w-[70%]">
                            {!msg.isOwn && (
                              <p className="text-xs text-black/60 mb-1 pl-1">{selectedConversation.name}</p>
                            )}
                            <div
                              className={`p-3 rounded-2xl ${
                                msg.isOwn
                                  ? 'bg-blue-600 text-white rounded-br-none'
                                  : 'bg-black/5 text-black rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm">{msg.text}</p>
                            </div>
                            <p className={`text-xs text-black/60 mt-1 ${msg.isOwn ? 'text-right pr-1' : 'pl-1'}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-black/10">
                      <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <svg className="w-6 h-6 text-black/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 13.5l-7 7-7-7" />
                            <path d="M5 6.5l7 7 7-7" />
                          </svg>
                        </button>
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
                          className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                        >
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                          </svg>
                        </button>
                      </div>
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