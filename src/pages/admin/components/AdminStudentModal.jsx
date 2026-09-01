// src/pages/admin/components/AdminAddStudentModal.jsx
import React, { useState } from 'react';

export default function AdminAddStudentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    class: '',
    programme: '',
    dob: '',
    gender: '',
    status: 'Active',
    guardianName: '',
    guardianPhone: '',
    enrolledDate: '',
    address: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New student data:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[580px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black font-ebrima">Add New Student</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-black/60 font-ebrima mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Chidi Okonkwo"
                className="w-full px-4 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#1A73E8] text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-black/60 font-ebrima mb-1">Class *</label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleChange}
                placeholder="e.g. Primary 3"
                className="w-full px-4 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#1A73E8] text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-black/60 font-ebrima mb-1">Programme *</label>
              <input
                type="text"
                name="programme"
                value={formData.programme}
                onChange={handleChange}
                placeholder="e.g. Regular / Music / Mixed"
                className="w-full px-4 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#1A73E8] text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-black/60 font-ebrima mb-1">Date of Birth</label>
              <input
                type="text"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="e.g. 14 Mar 2017"
                className="w-full px-4 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#1A73E8] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-black/60 font-ebrima mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#1A73E8] text-sm bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-black/60 font-ebrima mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#1A73E8] text-sm bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-black/60 font-ebrima mb-1">Guardian Name *</label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                placeholder="e.g. Mr. Okonkwo"
                className="w-full px-4 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#1A73E8] text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-black/60 font-ebrima mb-1">Guardian Phone</label>
              <input
                type="text"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                placeholder="e.g. 08012345678"
                className="w-full px-4 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#1A73E8] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-black/60 font-ebrima mb-1">Date Enrolled *</label>
              <input
                type="text"
                name="enrolledDate"
                value={formData.enrolledDate}
                onChange={handleChange}
                placeholder="e.g. 10 Jan 2025"
                className="w-full px-4 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#1A73E8] text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-black/60 font-ebrima mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 12 Aba Rd, Port Harcourt"
                className="w-full px-4 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#1A73E8] text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-black/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-black/15 rounded-lg text-gray-500 font-ebrima hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#1A73E8] rounded-lg text-white font-bold font-ebrima hover:bg-blue-700 transition"
            >
              Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}