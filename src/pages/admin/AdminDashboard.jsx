// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

const stats = [
  { label: 'Total Students', value: '342', color: 'text-black' },
  { label: 'Active Staff', value: '28', color: 'text-black' },
  { label: 'Revenue (Term)', value: '₦12.4M', color: 'text-[#34A853]' },
  { label: 'Pending Approvals', value: '7', color: 'text-black' },
];

const recentRegistrations = [
  { name: 'Chidi Okonkwo', programme: 'Music', date: '18 June 2026', status: 'Pending' },
  { name: 'Aisha Mohammed', programme: 'Regular', date: '17 June 2026', status: 'Approved' },
  { name: 'Emeka Chike', programme: 'Mixed', date: '16 June 2026', status: 'Approved' },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <AdminSidebar activeItem="Dashboard" />
      <div className="flex-1 ml-[300px]">
        <AdminHeader />
        
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <h1 className="text-[36px] font-bold text-black font-ebrima leading-[44px] mb-6">
            Dashboard Overview
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-3xl border border-black/30 p-6 text-center">
                <p className="text-sm text-black/80 font-ebrima mb-2">{stat.label}</p>
                <p className={`text-[35px] font-bold ${stat.color} font-ebrima`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Registrations */}
          <div className="bg-white rounded-3xl border border-black/30 p-6">
            <h2 className="text-2xl font-bold text-black/70 font-ebrima mb-4">
              Recent Registrations
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/30">
                    <th className="text-left py-3 text-sm font-bold text-black/80">Student</th>
                    <th className="text-left py-3 text-sm font-bold text-black/80">Programme</th>
                    <th className="text-left py-3 text-sm font-bold text-black/80">Date</th>
                    <th className="text-left py-3 text-sm font-bold text-black/80">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.map((reg, index) => (
                    <tr key={index} className="border-b border-black/10 last:border-0">
                      <td className="py-3 font-ebrima text-lg">{reg.name}</td>
                      <td className="py-3 font-ebrima text-lg">{reg.programme}</td>
                      <td className="py-3 font-ebrima text-lg">{reg.date}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          reg.status === 'Approved' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}