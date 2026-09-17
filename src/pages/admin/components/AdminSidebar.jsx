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
  NewsIcon,          // 👈 add this to BoxIcons.jsx
} from '../../../components/BoxIcons';
import logo from '../../../assets/logo.jpg';

const menuItems = [
  { icon: DashboardIcon, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: PeopleIcon, label: 'Students', path: '/admin/students' },
  { icon: PeopleIcon, label: 'Staff', path: '/admin/staff' },
  { icon: CoursesIcon, label: 'Courses', path: '/admin/courses' },
  { icon: PaymentsIcon, label: 'Payments', path: '/admin/payments' },
  { icon: ReportsIcon, label: 'Reports', path: '/admin/reports' },
  { icon: NewsIcon, label: 'Blog & News', path: '/admin/blog' },   // 👈 NEW
  { icon: SettingsIcon, label: 'Settings', path: '/admin/settings' },
];

export default function AdminSidebar({ activeItem }) {
  return (
    <div className="w-[300px] min-h-screen bg-[#1A73E8] fixed left-0 top-0 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
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

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
    </div>
  );
}