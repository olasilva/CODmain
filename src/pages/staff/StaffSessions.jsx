import React from 'react';
import StaffSidebar from './components/StaffSidebar';
import StudentHeader from '../student/components/StudentHeader';

export default function StaffSessions() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StaffSidebar activeItem="Sessions" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8">
            <h1 className="text-[36px] font-bold text-black font-ebrima">Sessions</h1>
            <p className="text-base text-black/60 font-ebrima pt-2">Class schedule and workshop sessions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
