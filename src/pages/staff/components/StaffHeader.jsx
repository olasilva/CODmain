// src/pages/staff/components/StaffHeader.jsx
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../../../components/Avatar';
import {
  getStaffMe,
  getStaffDashboardStats,
  getSession,
  logoutUser,
} from '../../../lib/api';

export default function StaffHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const [me, setMe] = useState(() => getSession('staff') || null);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    try {
      const [meRes, statsRes] = await Promise.allSettled([
        getStaffMe(),
        getStaffDashboardStats(),
      ]);
      if (meRes.status === 'fulfilled' && meRes.value?.user) {
        setMe(meRes.value.user);
      }
      if (statsRes.status === 'fulfilled') {
        setUnread(statsRes.value?.stats?.unreadMessages || 0);
      }
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    load();
    const t = window.setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, 30000);

    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.clearInterval(t);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  const handleLogout = () => {
    logoutUser('staff');
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-black/10">
      <div className="h-14 sm:h-16 px-3 sm:px-4 lg:px-6 flex items-center gap-2 sm:gap-3">
        {/* Hamburger — mobile & tablet only */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="lg:hidden h-10 w-10 rounded-xl border border-black/10 flex items-center justify-center hover:bg-black/5 transition shrink-0"
        >
          <i className="bx bx-menu text-2xl text-black/70" aria-hidden="true" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-black/40 leading-none">
            Staff
          </p>
          <p className="text-xs sm:text-sm font-bold text-black font-ebrima truncate mt-0.5">
            {me?.full_name || 'Dashboard'}
          </p>
        </div>

        {/* Messages */}
        <Link
          to="/staff/messages"
          className="relative h-9 sm:h-10 w-9 sm:w-10 rounded-xl flex items-center justify-center hover:bg-black/5 transition shrink-0"
          aria-label="Messages"
        >
          <i
            className="bx bx-message-rounded-dots text-xl sm:text-2xl text-black/70"
            aria-hidden="true"
          />
          {unread > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] rounded-full bg-[#FF2E96] text-white text-[9px] font-bold flex items-center justify-center px-1">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </Link>

        {/* Avatar */}
        <button
          type="button"
          onClick={() => navigate('/staff/dashboard')}
          className="h-9 sm:h-10 w-9 sm:w-10 rounded-full overflow-hidden shrink-0"
          aria-label="Dashboard"
        >
          <Avatar
            src={me?.avatar_url}
            name={me?.full_name || 'Staff'}
            size={40}
          />
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="h-9 sm:h-10 w-9 sm:w-10 rounded-xl flex items-center justify-center hover:bg-black/5 transition shrink-0"
        >
          <i
            className="bx bx-log-out text-xl text-black/60"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
}