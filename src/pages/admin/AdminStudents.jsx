// src/pages/admin/AdminStudents.jsx
import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import AdminAddStudentModal from './components/AdminStudentModal';

const students = [
  { id: 'STU-001', name: 'Chidi Okonkwo', class: 'Primary 3', programme: 'Music', guardian: 'Mr. Okonkwo', enrolled: '10 Jan 2025', status: 'Active' },
  { id: 'STU-002', name: 'Aisha Mohammed', class: 'Primary 5', programme: 'Regular', guardian: 'Alhaji Mohammed', enrolled: '15 Jan 2025', status: 'Active' },
  { id: 'STU-003', name: 'Emeka Chike', class: 'Primary 2', programme: 'Mixed', guardian: 'Mrs. Chike', enrolled: '20 Jan 2025', status: 'Active' },
  { id: 'STU-004', name: 'Ngozi Eze', class: 'Primary 4', programme: 'Regular', guardian: 'Dr. Eze', enrolled: '5 Feb 2025', status: 'Active' },
  { id: 'STU-005', name: 'Tunde Adeyemi', class: 'Primary 1', programme: 'Regular', guardian: 'Mr. Adeyemi', enrolled: '10 Feb 2025', status: 'Active' },
  { id: 'STU-006', name: 'Fatima Bello', class: 'Primary 6', programme: 'Music', guardian: 'Mrs. Bello', enrolled: '15 Feb 2025', status: 'Active' },
  { id: 'STU-007', name: 'Obinna Nwosu', class: 'Primary 3', programme: 'Mixed', guardian: 'Mr. Nwosu', enrolled: '20 Feb 2025', status: 'Inactive' },
  { id: 'STU-008', name: 'Chioma Obi', class: 'Primary 4', programme: 'Regular', guardian: 'Mr. Obi', enrolled: '25 Feb 2025', status: 'Active' },
  { id: 'STU-009', name: 'Adaeze Okeke', class: 'Primary 5', programme: 'Regular', guardian: 'Mr. Okeke', enrolled: '1 Mar 2025', status: 'Active' },
  { id: 'STU-010', name: 'Yusuf Ibrahim', class: 'Primary 2', programme: 'Mixed', guardian: 'Mr. Ibrahim', enrolled: '5 Mar 2025', status: 'Active' },
];

const stats = [
  { label: 'Total Students', value: 10, color: 'text-black' },
  { label: 'Active', value: 9, color: 'text-[#34A853]' },
  { label: 'Inactive', value: 1, color: 'text-[#EA4335]' },
  { label: 'New This Term', value: 10, color: 'text-[#1A73E8]' },
];

export default function AdminStudents() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-600' 
      : 'bg-red-100 text-red-500';
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <AdminSidebar activeItem="Students" />
      <div className="flex-1 ml-[300px]">
        <AdminHeader />
        
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
              Students
            </h1>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 bg-[#1A73E8] rounded-xl text-white font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Student
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
                placeholder="Search students by name or ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none bg-transparent text-sm"
              />
            </div>
            {['All', 'Active', 'Inactive'].map((filter) => (
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
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Student ID</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Name</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Class</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Programme</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Guardian</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Date Enrolled</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Status</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                      <td className="py-3 px-5 text-[#1A73E8] font-bold text-sm">{student.id}</td>
                      <td className="py-3 px-5 font-bold text-black">{student.name}</td>
                      <td className="py-3 px-5 text-black/60">{student.class}</td>
                      <td className="py-3 px-5 text-black/60">{student.programme}</td>
                      <td className="py-3 px-5 text-black/60">{student.guardian}</td>
                      <td className="py-3 px-5 text-black/60">{student.enrolled}</td>
                      <td className="py-3 px-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(student.status)}`}>
                          {student.status}
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
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <svg className="w-4 h-4 text-[#EA4335]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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

      {/* Add Student Modal */}
      <AdminAddStudentModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </div>
  );
}