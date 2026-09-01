// src/pages/admin/AdminCourses.jsx
import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

const courses = [
  {
    id: 'CRS-001',
    name: 'English Language',
    teacher: 'Mrs. Grace Okonkwo',
    classes: 'P1–P6',
    students: 342,
    schedule: 'Mon, Wed, Fri',
    status: 'Active'
  },
  {
    id: 'CRS-002',
    name: 'Mathematics',
    teacher: 'Mr. Joseph Adewale',
    classes: 'P1–P6',
    students: 342,
    schedule: 'Mon, Tue, Thu',
    status: 'Active'
  },
  {
    id: 'CRS-003',
    name: 'Basic Science',
    teacher: 'Miss Fatima Usman',
    classes: 'P3–P6',
    students: 214,
    schedule: 'Tue, Thu',
    status: 'Active'
  },
  {
    id: 'CRS-004',
    name: 'Social Studies',
    teacher: 'Mrs. Grace Okonkwo',
    classes: 'P1–P4',
    students: 178,
    schedule: 'Wed, Fri',
    status: 'Active'
  },
  {
    id: 'CRS-005',
    name: 'Music',
    teacher: 'Mr. Emeka Nwosu',
    classes: 'All',
    students: 89,
    schedule: 'Thursday',
    status: 'Active'
  },
  {
    id: 'CRS-006',
    name: 'Physical Education',
    teacher: 'Mr. Tunde Bakare',
    classes: 'All',
    students: 342,
    schedule: 'Friday',
    status: 'Active'
  },
  {
    id: 'CRS-007',
    name: 'French Language',
    teacher: 'Miss Ngozi Dike',
    classes: 'P4–P6',
    students: 98,
    schedule: 'Tue, Thu',
    status: 'Active'
  },
  {
    id: 'CRS-008',
    name: 'Computer Studies',
    teacher: 'Mr. Chukwudi Obi',
    classes: 'P4–P6',
    students: 98,
    schedule: 'Wednesday',
    status: 'Active'
  },
  {
    id: 'CRS-009',
    name: 'Civic Education',
    teacher: 'Mr. Joseph Adewale',
    classes: 'P1–P6',
    students: 342,
    schedule: 'Mon, Thu',
    status: 'Active'
  },
  {
    id: 'CRS-010',
    name: 'Yoruba Language',
    teacher: 'Mrs. Amaka Eze',
    classes: 'P1–P6',
    students: 342,
    schedule: 'Tue, Fri',
    status: 'Active'
  }
];

const stats = [
  { label: 'Total Courses', value: 10, color: 'text-black' },
  { label: 'Active', value: 10, color: 'text-[#34A853]' },
  { label: 'Total Enrolled', value: 342, color: 'text-[#1A73E8]' },
];

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <AdminSidebar activeItem="Courses" />
      <div className="flex-1 ml-[300px]">
        <AdminHeader />
        
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
              Courses
            </h1>
            <button className="px-5 py-3 bg-[#1A73E8] rounded-xl text-white font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Course
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl border border-black/15 p-4">
                <p className="text-sm text-black/60 font-ebrima">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} font-ebrima mt-1`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 bg-white rounded-xl border border-black/15 px-4 py-2.5 flex items-center gap-2.5 mb-6">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search courses or teachers…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none bg-transparent text-sm"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FA] border-b border-black/10">
                  <tr>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Course ID</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Course Name</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Teacher</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Classes</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Students</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Schedule</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Status</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course, index) => (
                    <tr key={course.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                      <td className="py-3 px-5 text-[#1A73E8] font-bold text-sm">{course.id}</td>
                      <td className="py-3 px-5 font-bold text-black">{course.name}</td>
                      <td className="py-3 px-5 text-black/60">{course.teacher}</td>
                      <td className="py-3 px-5 text-black/60">{course.classes}</td>
                      <td className="py-3 px-5 font-bold text-black">{course.students}</td>
                      <td className="py-3 px-5 text-black/60">{course.schedule}</td>
                      <td className="py-3 px-5">
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">
                          {course.status}
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
    </div>
  );
}