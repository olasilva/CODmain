// src/pages/admin/components/AdminHeader.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.jpg';
import Avatar from '../../../components/Avatar';
import { getSession, logoutUser } from '../../../lib/api';

export default function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const session = getSession('admin') || {};
  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleLogout = () => {
    logoutUser('admin');
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-black/5 px-4 sm:px-6 py-3 flex items-center gap-3">
      {/* Hamburger — mobile only */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-black/5 text-black/70 transition"
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

      {/* Brand — logo + name */}
      <div className="flex items-center gap-2.5">
        <img
          src={logo}
          alt="Clan of David"
          className="w-9 h-9 rounded-lg object-cover shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="hidden sm:block">
          <p className="text-sm font-bold text-black font-ebrima leading-none">
            Clan of David
          </p>
          <p className="text-[10px] text-black/40 uppercase tracking-wider mt-0.5">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Date — hidden on very small screens */}
      <span className="hidden md:block text-xs text-black/50 font-ebrima">
        {today}
      </span>

      {/* Profile dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Account menu"
          className="flex items-center gap-2 rounded-full hover:bg-black/5 p-1 transition"
        >
          <Avatar
            src={session.avatar_url}
            name={session.full_name || session.name}
            size={36}
          />
        </button>

        {menuOpen && (
          <>
            {/* Click-away */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-black/10 shadow-lg overflow-hidden z-20">
              <div className="px-4 py-3 border-b border-black/5">
                <p className="text-sm font-bold text-black truncate">
                  {session.full_name || session.name || 'Admin'}
                </p>
                <p className="text-xs text-black/50 truncate">
                  {session.email || ''}
                </p>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/admin/settings');
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-black/70 hover:bg-black/5 transition"
              >
                Settings
              </button>
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
    </header>
  );
}