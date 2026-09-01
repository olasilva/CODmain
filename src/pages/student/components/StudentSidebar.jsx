// src/pages/student/components/StudentSidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import { DashboardIcon, CoursesIcon, ClassesIcon, AssignmentsIcon, ResultsIcon, MessageIcon, NotificationsIcon, SettingsIcon, LogoutIcon } from '../../../components/BoxIcons';
import logo from '../../../assets/logo.jpg';

const menuItems = [
  { icon: DashboardIcon, label: 'Dashboard', path: '/student/dashboard' },
  { icon: CoursesIcon, label: 'My Courses', path: '/student/courses' },
  { icon: ClassesIcon, label: 'Classes', path: '/student/classes' },
  { icon: AssignmentsIcon, label: 'Assignments', path: '/student/assignments' },
  { icon: ResultsIcon, label: 'Results', path: '/student/results' },
  { icon: MessageIcon, label: 'Messages', path: '/student/messages' },
  { icon: NotificationsIcon, label: 'Notifications', path: '/student/notifications' },
  { icon: SettingsIcon, label: 'Settings', path: '/student/settings' },
];

export default function StudentSidebar({ activeItem }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <div className="w-[300px] min-h-screen bg-[#1A73E8] fixed left-0 top-0 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <img src={logo} alt="Clan of David" className="w-12 h-12 rounded-xl object-cover" />
            <span className="text-white text-2xl font-bold font-ebrima">Clan of David</span>
          </div>

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

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogoutIcon className="w-6 h-6" />
              <span className="text-[24px] font-medium font-sf-compact leading-[36px]">
                Logout
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
      />
    </>
  );
}