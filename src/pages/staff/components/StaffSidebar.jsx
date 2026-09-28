// src/pages/staff/components/StaffSidebar.jsx
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../../../assets/logo.jpg';
import LogoutModal from '../../student/components/LogoutModal';

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

const DashIcon = (p) => (
  <Icon path="M3 12l9-9 9 9M5 10v10h14V10" {...p} />
);
const CoursesIcon = (p) => (
  <Icon path="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V6a2 2 0 0 1 2-2h14v13" {...p} />
);
const StudentsIcon = (p) => (
  <Icon
    path="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
    {...p}
  />
);
const GradeIcon = (p) => (
  <Icon path="M4 4h16v16H4zm0 5h16M9 9v11" {...p} />
);
const AssignIcon = (p) => (
  <Icon
    path="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
    {...p}
  />
);
const SessionIcon = (p) => (
  <Icon
    path="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
    {...p}
  />
);
const AttendIcon = (p) => (
  <Icon
    path="M8 2v4m8-4v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm5 10l2 2 4-4"
    {...p}
  />
);
const MsgIcon = (p) => (
  <Icon
    path="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
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
  <Icon path="M3 12l9-9 9 9M5 10v10h4v-6h6v6h4V10" {...p} />
);

const menuItems = [
  { icon: DashIcon, label: 'Dashboard', path: '/staff/dashboard' },
  { icon: CoursesIcon, label: 'My Courses', path: '/staff/courses' },
  { icon: StudentsIcon, label: 'Students', path: '/staff/students' },
  { icon: GradeIcon, label: 'Grading', path: '/staff/grading' },
  { icon: AssignIcon, label: 'Assignments', path: '/staff/assignments' },
  { icon: SessionIcon, label: 'Sessions', path: '/staff/sessions' },
  { icon: AttendIcon, label: 'Attendance', path: '/staff/attendance' },
  { icon: MsgIcon, label: 'Messages', path: '/staff/messages' },
];

export default function StaffSidebar({
  activeItem,
  isOpen = false,
  onClose,
}) {
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      {/* Backdrop — mobile & tablet only */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`
          fixed left-0 top-0 h-screen w-[280px] sm:w-[300px] z-50
          bg-gradient-to-b from-[#1A73E8] to-[#0F4082] overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        aria-label="Staff navigation"
      >
        <div className="p-5 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <Link
              to="/staff/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 group min-w-0"
            >
              <img
                src={logo}
                alt="Clan of David"
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform shrink-0"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <span className="text-white text-lg lg:text-xl font-bold font-ebrima leading-tight truncate">
                Clan of David
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="lg:hidden text-white/80 hover:text-white transition p-1 shrink-0"
            >
              <i className="bx bx-x text-2xl" aria-hidden="true" />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    isActive || activeItem === item.label
                      ? 'bg-white/25 text-white font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-sm font-ebrima leading-tight truncate">
                  {item.label}
                </span>
              </NavLink>
            ))}

            <div className="my-3 lg:my-4 border-t border-white/10" />

            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition"
            >
              <HomeIcon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-ebrima">Back to Home</span>
            </Link>

            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition"
            >
              <LogoutIcon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-ebrima">Logout</span>
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