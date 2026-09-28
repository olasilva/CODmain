// src/pages/student/StudentLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/StudentHeader';

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Backdrop — mobile only */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 w-full min-w-0 lg:ml-[300px]">
        <StudentHeader onMenuClick={() => setSidebarOpen(true)} />
        <Outlet />
      </div>
    </div>
  );
}