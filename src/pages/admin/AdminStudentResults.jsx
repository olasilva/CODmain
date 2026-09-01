// src/pages/admin/AdminStudentResults.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

const results = [
  { subject: 'Mathematics', term: '1st Term', score: 85, grade: 'A', remark: 'Excellent' },
  { subject: 'English Language', term: '1st Term', score: 78, grade: 'B', remark: 'Good' },
  { subject: 'Music', term: '1st Term', score: 92, grade: 'A', remark: 'Outstanding' },
  { subject: 'Science', term: '1st Term', score: 74, grade: 'B', remark: 'Good' },
  { subject: 'Social Studies', term: '1st Term', score: 80, grade: 'A', remark: 'Excellent' },
];

export default function AdminStudentResults() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <AdminSidebar activeItem="Students" />
      <div className="flex-1 ml-[300px]">
        <AdminHeader />
        
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          {/* Back Button */}
          <Link to="/admin/students" className="inline-flex items-center gap-2 text-[#1A73E8] font-bold mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Students
          </Link>

          {/* Profile Header */}
          <div className="bg-white rounded-2xl border border-black/10 p-8 flex items-center gap-8 mb-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-3xl font-bold text-[#1A73E8]">
              C
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-black font-ebrima">Chidi Okonkwo</h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-[#1A73E8] font-bold">STU-001</span>
                <span className="text-black/40">•</span>
                <span className="text-black/60">Primary 3</span>
                <span className="text-black/40">•</span>
                <span className="text-black/60">Music</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">Active</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-black/50">Enrolled</p>
              <p className="font-bold text-black">10 Jan 2025</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button className="px-6 py-2.5 bg-white text-gray-500 rounded-xl font-bold text-sm border border-black/15 hover:bg-gray-50 transition">
              Profile
            </button>
            <button className="px-6 py-2.5 bg-[#1A73E8] text-white rounded-xl font-bold text-sm">
              Results
            </button>
          </div>

          {/* Results Summary */}
          <div className="bg-white rounded-2xl border border-black/10 p-6 flex items-center gap-8 mb-6">
            <div>
              <p className="text-sm text-black/50">Average Score</p>
              <p className="text-3xl font-bold text-[#1A73E8]">82%</p>
            </div>
            <div className="w-px h-12 bg-black/10" />
            <div>
              <p className="text-sm text-black/50">Subjects</p>
              <p className="text-3xl font-bold text-black">5</p>
            </div>
            <div className="w-px h-12 bg-black/10" />
            <div>
              <p className="text-sm text-black/50">Term</p>
              <p className="text-lg font-bold text-black">1st Term</p>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FA] border-b border-black/10">
                  <tr>
                    <th className="text-left py-3.5 px-6 text-sm font-bold text-black/55">Subject</th>
                    <th className="text-left py-3.5 px-6 text-sm font-bold text-black/55">Term</th>
                    <th className="text-left py-3.5 px-6 text-sm font-bold text-black/55">Score</th>
                    <th className="text-left py-3.5 px-6 text-sm font-bold text-black/55">Grade</th>
                    <th className="text-left py-3.5 px-6 text-sm font-bold text-black/55">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                      <td className="py-3 px-6 font-bold text-black">{result.subject}</td>
                      <td className="py-3 px-6 text-black/60">{result.term}</td>
                      <td className="py-3 px-6 font-bold text-black">{result.score}</td>
                      <td className="py-3 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          result.grade === 'A' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-[#1A73E8]'
                        }`}>
                          {result.grade}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-black/60">{result.remark}</td>
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