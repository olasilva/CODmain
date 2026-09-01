// src/pages/admin/AdminStudentProfile.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

export default function AdminStudentProfile() {
  const student = {
    name: 'Chidi Okonkwo',
    id: 'STU-001',
    class: 'Primary 3',
    programme: 'Music',
    status: 'Active',
    enrolled: '10 Jan 2025',
    dob: '14 Mar 2017',
    gender: 'Male',
    address: '12 Aba Rd, Port Harcourt',
    guardian: 'Mr. Okonkwo',
    guardianPhone: '08012345678'
  };

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
              <h1 className="text-2xl font-bold text-black font-ebrima">{student.name}</h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-[#1A73E8] font-bold">{student.id}</span>
                <span className="text-black/40">•</span>
                <span className="text-black/60">{student.class}</span>
                <span className="text-black/40">•</span>
                <span className="text-black/60">{student.programme}</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">
                  {student.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-black/50">Enrolled</p>
              <p className="font-bold text-black">{student.enrolled}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button className="px-6 py-2.5 bg-[#1A73E8] text-white rounded-xl font-bold text-sm">
              Profile
            </button>
            <button className="px-6 py-2.5 bg-white text-gray-500 rounded-xl font-bold text-sm border border-black/15 hover:bg-gray-50 transition">
              Results
            </button>
          </div>

          {/* Profile Cards */}
          <div className="grid grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl border border-black/10 p-8">
              <h2 className="text-lg font-bold text-black font-ebrima pb-3 border-b border-black/10">
                Personal Information
              </h2>
              <div className="space-y-4 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-black/50">Full Name</span>
                  <span className="font-bold text-black">{student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-black/50">Student ID</span>
                  <span className="font-bold text-black">{student.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-black/50">Date of Birth</span>
                  <span className="font-bold text-black">{student.dob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-black/50">Gender</span>
                  <span className="font-bold text-black">{student.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-black/50">Address</span>
                  <span className="font-bold text-black">{student.address}</span>
                </div>
              </div>
            </div>

            {/* Academic & Guardian */}
            <div className="bg-white rounded-2xl border border-black/10 p-8">
              <h2 className="text-lg font-bold text-black font-ebrima pb-3 border-b border-black/10">
                Academic & Guardian
              </h2>
              <div className="space-y-4 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-black/50">Class</span>
                  <span className="font-bold text-black">{student.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-black/50">Programme</span>
                  <span className="font-bold text-black">{student.programme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-black/50">Date Enrolled</span>
                  <span className="font-bold text-black">{student.enrolled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-black/50">Guardian</span>
                  <span className="font-bold text-black">{student.guardian}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-black/50">Guardian Phone</span>
                  <span className="font-bold text-black">{student.guardianPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}