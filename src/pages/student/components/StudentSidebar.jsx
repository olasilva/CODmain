// src/pages/student/components/StudentSidebar.jsx
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../../../assets/logo.jpg';
import LogoutModal from './LogoutModal';

// ─── Icons (inline SVG wrappers so the sidebar works standalone) ───
const Icon = ({ path, className = 'w-6 h-6', ...rest }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    <path d={path} />
  </svg>
);

const DashboardIcon = (p) => (
  <Icon path="M3 12l9-9 9 9M5 10v10h14V10" {...p} />
);
const CoursesIcon = (p) => (
  <Icon
    path="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V6a2 2 0 0 1 2-2h14v13M6.5 17A2.5 2.5 0 0 0 4 19.5"
    {...p}
  />
);
const ClassesIcon = (p) => (
  <Icon
    path="M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4M3 17l9 4 9-4"
    {...p}
  />
);
const AssignmentIcon = (p) => (
  <Icon
    path="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m-6 9h6m-6 4h6"
    {...p}
  />
);
const ResultsIcon = (p) => (
  <Icon path="M4 4h16v16H4zm0 5h16M9 9v11" {...p} />
);
const AttendanceIcon = (p) => (
  <Icon
    path="M8 2v4m8-4v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm5 10l2 2 4-4"
    {...p}
  />
);
const LearnIcon = (p) => (
  <Icon
    path="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2V4zm20 0h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8V4z"
    {...p}
  />
);
const MessagesIcon = (p) => (
  <Icon
    path="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
    {...p}
  />
);
const BellIcon = (p) => (
  <Icon
    path="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
    {...p}
  />
);
const SettingsIcon = (p) => (
  <Icon
    path="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2.1-1.6-2-3.4-2.4.9a7.5 7.5 0 0 0-2.1-1.2L14.5 2h-5l-.4 2.5a7.5 7.5 0 0 0-2.1 1.2l-2.4-.9-2 3.4 2.1 1.6c-.1.4-.1.8-.1 1.2s0 .8.1 1.2l-2.1 1.6 2 3.4 2.4-.9c.6.5 1.3.9 2.1 1.2l.4 2.5h5l.4-2.5c.8-.3 1.5-.7 2.1-1.2l2.4.9 2-3.4-2.1-1.6c.1-.4.1-.8.1-1.2z"
    {...p}
  />
);
const LogoutIcon = (p) => (
  <Icon
    path="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
    {...p}
  />
);
const HomeIcon = (p) => (
  <Icon
    path="M3 12l9-9 9 9M5 10v10h4v-6h6v6h4V10"
    {...p}
  />
);

const menuItems = [
  { icon: DashboardIcon, label: 'Dashboard', path: '/student/dashboard' },
  { icon: CoursesIcon, label: 'Courses', path: '/student/courses' },
  { icon: ClassesIcon, label: 'Classes', path: '/student/classes' },
  { icon: AssignmentIcon, label: 'Assignments', path: '/student/assignments' },
  { icon: AttendanceIcon, label: 'Attendance', path: '/student/attendance' },
  { icon: LearnIcon, label: 'Learn More', path: '/student/learn-more' },
  { icon: ResultsIcon, label: 'Results', path: '/student/results' },
  { icon: MessagesIcon, label: 'Messages', path: '/student/messages' },
  { icon: BellIcon, label: 'Notifications', path: '/student/notifications' },
  { icon: SettingsIcon, label: 'Settings', path: '/student/settings' },
];

export default function StudentSidebar({
  activeItem,
  isOpen = false,
  onClose,
}) {
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <aside
        className={`
          fixed left-0 top-0 h-screen w-[300px] z-50
          bg-gradient-to-b from-[#1A73E8] to-[#0F4082] overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-6 sm:p-8">
          {/* Logo row + close button */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/student/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 group min-w-0"
              aria-label="Go to dashboard"
            >
              <img
                src={logo}
                alt="Clan of David"
                className="w-12 h-12 rounded-xl object-cover shadow-md transition-transform duration-200 group-hover:scale-105 shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-white text-xl sm:text-2xl font-bold font-ebrima leading-tight truncate">
                Clan of David
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="lg:hidden text-white/80 hover:text-white transition p-1 shrink-0"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>

          {/* Nav */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-colors ${
                    isActive || activeItem === item.label
                      ? 'bg-white/25 text-white font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-[15px] font-ebrima leading-tight truncate">
                  {item.label}
                </span>
              </NavLink>
            ))}

            {/* Divider */}
            <div className="my-4 border-t border-white/10" />

            {/* Back to Home */}
            <Link
              to="/"
              onClick={onClose}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <HomeIcon className="w-5 h-5 shrink-0" />
              <span className="text-[15px] font-ebrima leading-tight">
                Back to Home
              </span>
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogoutIcon className="w-5 h-5 shrink-0" />
              <span className="text-[15px] font-ebrima leading-tight">
                Logout
              </span>
            </button>
          </nav>
        </div>
      </aside>

      <LogoutModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
      />
    </>
  );
}