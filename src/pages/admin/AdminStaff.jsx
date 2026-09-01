// src/pages/admin/AdminStaff.jsx
import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

const staff = [
  { id: 'STF-001', name: 'Mr. Joseph Adewale', role: 'Head Teacher', type: 'Admin', email: 'j.adewale@school.edu.ng', joined: '5 Sep 2020', status: 'Active' },
  { id: 'STF-002', name: 'Mrs. Grace Okonkwo', role: 'Class Teacher P3', type: 'Teaching', email: 'g.okonkwo@school.edu.ng', joined: '10 Jan 2021', status: 'Active' },
  { id: 'STF-003', name: 'Mr. Emeka Nwosu', role: 'Music Teacher', type: 'Teaching', email: 'e.nwosu@school.edu.ng', joined: '15 Mar 2021', status: 'Active' },
  { id: 'STF-004', name: 'Miss Fatima Usman', role: 'Class Teacher P1', type: 'Teaching', email: 'f.usman@school.edu.ng', joined: '20 Sep 2021', status: 'Active' },
  { id: 'STF-005', name: 'Mr. Tunde Bakare', role: 'Sports Coach', type: 'Teaching', email: 't.bakare@school.edu.ng', joined: '5 Jan 2022', status: 'Active' },
  { id: 'STF-006', name: 'Mrs. Amaka Eze', role: 'Secretary', type: 'Admin', email: 'a.eze@school.edu.ng', joined: '10 Mar 2022', status: 'Active' },
  { id: 'STF-007', name: 'Mr. Chukwudi Obi', role: 'IT Coordinator', type: 'Admin', email: 'c.obi@school.edu.ng', joined: '15 Sep 2022', status: 'Active' },
  { id: 'STF-008', name: 'Miss Ngozi Dike', role: 'Class Teacher P5', type: 'Teaching', email: 'n.dike@school.edu.ng', joined: '20 Jan 2023', status: 'On Leave' },
];

const stats = [
  { label: 'Total Staff', value: 28, color: 'text-black' },
  { label: 'Teaching Staff', value: 22, color: 'text-[#34A853]' },
  { label: 'Admin Staff', value: 6, color: 'text-[#1A73E8]' },
  { label: 'On Leave', value: 2, color: 'text-[#E6AC00]' },
];

export default function AdminStaff() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const getStatusColor = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-600';
    if (status === 'On Leave') return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-500';
  };

  const getTypeBadge = (type) => {
    return type === 'Teaching' 
      ? 'bg-blue-100 text-[#1A73E8]' 
      : 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <AdminSidebar activeItem="Staff" />
      <div className="flex-1 ml-[300px]">
        <AdminHeader />
        
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
              Staff Management
            </h1>
            <button className="px-5 py-3 bg-[#1A73E8] rounded-xl text-white font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Staff
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl border border-black/15 p-4">
                <p className="text-sm text-black/60 font-ebrima">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} font-ebrima mt-1`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 bg-white rounded-xl border border-black/15 px-4 py-2.5 flex items-center gap-2.5">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search staff by name or ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none bg-transparent text-sm"
              />
            </div>
            {['All', 'Teaching', 'Admin', 'On Leave'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                  activeFilter === filter
                    ? 'bg-[#1A73E8] text-white border-2 border-[#1A73E8]'
                    : 'bg-white text-gray-500 border border-black/15 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FA] border-b border-black/10">
                  <tr>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Staff ID</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Name</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Role</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Type</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Email</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Date Joined</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Status</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member, index) => (
                    <tr key={member.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                      <td className="py-3 px-5 text-[#1A73E8] font-bold text-sm">{member.id}</td>
                      <td className="py-3 px-5 font-bold text-black">{member.name}</td>
                      <td className="py-3 px-5 text-black/60">{member.role}</td>
                      <td className="py-3 px-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeBadge(member.type)}`}>
                          {member.type}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-black/60 text-sm">{member.email}</td>
                      <td className="py-3 px-5 text-black/60">{member.joined}</td>
                      <td className="py-3 px-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <svg className="w-4 h-4 text-[#1A73E8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </div>
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