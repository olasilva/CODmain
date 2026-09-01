// src/pages/admin/AdminSettings.jsx
import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

const tabs = ['School Info', 'Academic Year', 'Users & Roles', 'Notifications'];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('School Info');

  const renderContent = () => {
    switch(activeTab) {
      case 'School Info':
        return (
          <div>
            <h2 className="text-2xl font-bold text-black/65 font-ebrima">School Information</h2>
            <div className="space-y-4 mt-6">
              {[
                { label: 'School Name', value: 'Greenfield Primary School' },
                { label: 'Address', value: '15 Education Drive, Lekki, Lagos' },
                { label: 'Principal Name', value: 'Dr. Adewale Johnson' },
                { label: 'Contact Email', value: 'admin@greenfield.edu.ng' },
                { label: 'Phone Number', value: '08012345678' },
                { label: 'School Motto', value: 'Excellence in Education' },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-sm text-black/55 font-ebrima mb-1">{field.label}</label>
                  <input
                    type="text"
                    defaultValue={field.value}
                    className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-[#1A73E8] text-sm"
                  />
                </div>
              ))}
              <button className="px-8 py-3 bg-[#1A73E8] rounded-xl text-white font-bold hover:bg-blue-700 transition">
                Save Changes
              </button>
            </div>
          </div>
        );
      case 'Academic Year':
        return (
          <div>
            <h2 className="text-2xl font-bold text-black/65 font-ebrima">Academic Year Settings</h2>
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm text-black/55 font-ebrima mb-1">Current Academic Year</label>
                <input type="text" defaultValue="2025 / 2026" className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-[#1A73E8] text-sm" />
              </div>
              <div>
                <label className="block text-sm text-black/55 font-ebrima mb-1">Current Term</label>
                <input type="text" defaultValue="Third Term" className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-[#1A73E8] text-sm" />
              </div>
              <div>
                <label className="block text-sm text-black/55 font-ebrima mb-1">Term Start Date</label>
                <input type="text" defaultValue="5 May 2026" className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-[#1A73E8] text-sm" />
              </div>
              <div>
                <label className="block text-sm text-black/55 font-ebrima mb-1">Term End Date</label>
                <input type="text" defaultValue="25 July 2026" className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-[#1A73E8] text-sm" />
              </div>
              <div>
                <label className="block text-sm text-black/55 font-ebrima mb-1">Next Year Resumption</label>
                <input type="text" defaultValue="15 September 2026" className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:border-[#1A73E8] text-sm" />
              </div>
              <button className="px-8 py-3 bg-[#1A73E8] rounded-xl text-white font-bold hover:bg-blue-700 transition">
                Save Changes
              </button>
            </div>
          </div>
        );
      default:
        return <div className="text-center py-12 text-gray-500">Content coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <AdminSidebar activeItem="Settings" />
      <div className="flex-1 ml-[300px]">
        <AdminHeader />
        
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px] mb-6">
            Settings
          </h1>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-2xl border border-black/10 p-1.5 mb-8 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                  activeTab === tab
                    ? 'bg-[#1A73E8] text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-black/10 p-8 max-w-2xl">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}