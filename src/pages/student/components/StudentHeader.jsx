// src/pages/student/components/StudentHeader.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../../../components/Avatar';
import { getSession, logoutUser } from '../../../lib/api';

export default function StudentHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getSession('student'));
  }, []);

  const handleLogout = () => {
    logoutUser('student');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-black/5">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-black/5 text-black/70 transition shrink-0"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page title / breadcrumb (hidden on tiny screens) */}
        <div className="hidden sm:block min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-black/40">
            Student
          </p>
          <p className="text-sm font-bold text-black font-ebrima truncate">
            Dashboard
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Profile menu */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Account menu"
            className="flex items-center gap-2 rounded-full hover:bg-black/5 p-1 transition"
          >
            <Avatar
              src={user?.avatar_url}
              name={user?.full_name || user?.fullName}
              size={36}
            />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-black/10 shadow-lg overflow-hidden z-20">
                <div className="px-4 py-3 border-b border-black/5">
                  <p className="text-sm font-bold text-black truncate">
                    {user?.full_name || user?.fullName || 'Student'}
                  </p>
                  <p className="text-xs text-black/50 truncate">
                    {user?.email || ''}
                  </p>
                </div>
                <Link
                  to="/student/settings"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-left px-4 py-2.5 text-sm text-black/70 hover:bg-black/5 transition"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t border-black/5"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}