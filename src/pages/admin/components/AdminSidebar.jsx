// src/pages/admin/components/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  DashboardIcon,
  PeopleIcon,
  CoursesIcon,
  PaymentsIcon,
  ReportsIcon,
  SettingsIcon,
  LogoutIcon,
  NewsIcon,
} from '../../../components/BoxIcons';
import logo from '../../../assets/logo.jpg';

const menuItems = [
  { icon: DashboardIcon, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: PeopleIcon, label: 'Students', path: '/admin/students' },
  { icon: PeopleIcon, label: 'Staff', path: '/admin/staff' },
  { icon: CoursesIcon, label: 'Courses', path: '/admin/courses' },
  { icon: PaymentsIcon, label: 'Payments', path: '/admin/payments' },
  { icon: ReportsIcon, label: 'Reports', path: '/admin/reports' },
  { icon: NewsIcon, label: 'Blog & News', path: '/admin/blog' },

  // Messages — inline SVG (no external icon needed)
  {
    icon: (props) => (
      <svg
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Messages',
    path: '/admin/messages',
  },

  { icon: SettingsIcon, label: 'Settings', path: '/admin/settings' },
];

export default function AdminSidebar({ activeItem, isOpen = false, onClose }) {
  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen w-[300px] z-50
        bg-[#1A73E8] overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      <div className="p-8">
        {/* Logo + close button (mobile only) */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Clan of David"
              className="w-12 h-12 rounded-xl object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-white text-2xl font-bold font-ebrima">
              Clan of David
            </span>
          </div>

          {/* Close X — mobile only */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden text-white/80 hover:text-white transition p-1"
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

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors ${
                  isActive || activeItem === item.label
                    ? 'bg-white/30 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[24px] font-medium font-sf-compact leading-[36px]">
                {item.label}
              </span>
            </NavLink>
          ))}

          {/* Divider */}
          <div className="my-4 border-t border-white/10" />

          {/* Logout */}
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-white/80 hover:bg-white/10 hover:text-white transition-colors">
            <LogoutIcon className="w-6 h-6" />
            <span className="text-[24px] font-medium font-sf-compact leading-[36px]">
              Logout
            </span>
          </button>
        </nav>
      </div>
    </aside>
  );
}