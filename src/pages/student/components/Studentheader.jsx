// src/pages/student/components/StudentHeader.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../../../components/Avatar';
import { getSession, logoutUser } from '../../../lib/api';

export default function StudentHeader() {
  const navigate = useNavigate();
  const [session, setSessionState] = useState(() => getSession('student'));

  // Re-read session whenever:
  //  - localStorage changes in another tab (storage event)
  //  - our own upload dispatches 'session-updated'
  //  - the tab regains focus
  //  - every 5s as a fallback
  useEffect(() => {
    const refresh = () => setSessionState(getSession('student'));

    window.addEventListener('storage', refresh);
    window.addEventListener('session-updated', refresh);
    window.addEventListener('focus', refresh);

    const interval = setInterval(refresh, 5000);

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('session-updated', refresh);
      window.removeEventListener('focus', refresh);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logoutUser('student');
    navigate('/login', { replace: true });
  };

  return (
    <div className="h-[98px] bg-[#F3F4F6] border-b border-black/30 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Left — brand */}
      <Link to="/student/dashboard" className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#1A73E8] rounded-xl flex items-center justify-center text-white font-bold text-xl">
          C
        </div>
        <span className="text-3xl font-bold text-black font-ebrima leading-[22px]">
          Clan of David
        </span>
      </Link>

      {/* Right — actions + profile */}
      <div className="flex items-center gap-4">
        {/* Notifications bell */}
        <Link
          to="/student/notifications"
          title="Notifications"
          className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center text-black/60 transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </Link>

        {/* Messages */}
        <Link
          to="/student/messages"
          title="Messages"
          className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center text-black/60 transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </Link>

        {/* Avatar + name */}
        <div className="flex items-center gap-3 pl-4 border-l border-black/10">
          <Avatar
            src={session?.avatar_url}
            name={session?.fullName}
            size={48}
          />
          <div className="hidden md:block leading-tight">
            <div className="text-sm font-bold text-black">
              {session?.fullName?.split(' ')[0] || 'Student'}
            </div>
            <div className="text-xs text-black/50">
              {session?.email || ''}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Log out"
          className="ml-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-full transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}