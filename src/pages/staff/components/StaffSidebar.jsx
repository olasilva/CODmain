// src/pages/staff/components/StaffSidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import StaffLogoutModal from './StaffLogoutModal';
import { DashboardIcon, CoursesIcon, PeopleIcon, GradingIcon, AssignmentsIcon, SessionsIcon, AttendanceIcon, LogoutIcon } from '../../../components/BoxIcons';
import logo from '../../../assets/logo.jpg';

const menuItems = [
  { icon: DashboardIcon, label: 'Dashboard', path: '/staff/dashboard' },
  { icon: CoursesIcon, label: 'My Courses', path: '/staff/courses' },
  { icon: PeopleIcon, label: 'Students', path: '/staff/students' },
  { icon: GradingIcon, label: 'Grading', path: '/staff/grading' },
  { icon: AssignmentsIcon, label: 'Assignments', path: '/staff/assignments' },
  { icon: SessionsIcon, label: 'Sessions', path: '/staff/sessions' },
  { icon: AttendanceIcon, label: 'Attendance', path: '/staff/attendance' },
];

export default function StaffSidebar({ activeItem }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <div className="w-[300px] min-h-screen bg-[#1A73E8] fixed left-0 top-0 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <img src={logo} alt="Clan of David" className="w-12 h-12 rounded-xl object-cover" />
            <span className="text-white text-2xl font-bold font-ebrima">Clan of David</span>
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
      <StaffLogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
      />
    </>
  );
}