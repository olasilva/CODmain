import React from 'react';
import StaffSidebar from './components/StaffSidebar';
import StudentHeader from '../student/components/StudentHeader';

const stats = [
  { label: 'Students', value: '1,284', accent: 'bg-blue-100 text-blue-700' },
  { label: 'Attendance', value: '94%', accent: 'bg-green-100 text-green-700' },
  { label: 'Assignments', value: '128', accent: 'bg-yellow-100 text-yellow-700' },
  { label: 'Performance', value: 'A+', accent: 'bg-pink-100 text-pink-700' },
];

export default function StaffDashboard() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StaffSidebar activeItem="Dashboard" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8">
            <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
              Staff Dashboard
            </h1>
            <p className="text-base text-black/60 font-ebrima pt-2">
              Welcome back. Here is your academy overview.
            </p>

            <div className="grid grid-cols-4 gap-6 pt-8">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-black/5 bg-[#F9FAFB] p-5">
                  <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${stat.accent}`}>
                    {stat.label}
                  </div>
                  <p className="mt-4 text-3xl font-bold text-black font-ebrima">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] p-8 text-white">
              <h2 className="text-[28px] font-bold font-ebrima">Today’s Overview</h2>
              <p className="mt-2 text-white/80">4 classes scheduled, 2 assignments pending review, and 12 students needing follow-up.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
