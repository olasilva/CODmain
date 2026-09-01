// src/pages/admin/AdminReports.jsx
import React from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

export default function AdminReports() {
  const stats = [
    { label: 'Total Students', value: 342, change: '+18 this term', color: 'text-[#34A853]' },
    { label: 'Revenue (Term)', value: '₦12.4M', change: '+₦2.2M vs last', color: 'text-[#34A853]' },
    { label: 'Active Staff', value: 28, change: '+2 this year', color: 'text-[#34A853]' },
    { label: 'Total Courses', value: 10, change: 'No change', color: 'text-gray-500' },
  ];

  const classDistribution = [
    { label: 'Primary 1', value: 58, color: '#1A73E8' },
    { label: 'Primary 2', value: 62, color: '#34A853' },
    { label: 'Primary 3', value: 55, color: '#FBBC05' },
    { label: 'Primary 4', value: 60, color: '#EA4335' },
    { label: 'Primary 5', value: 57, color: '#9C27B0' },
    { label: 'Primary 6', value: 50, color: '#FF5722' },
  ];

  const enrollmentData = [
    { month: 'Jan', value: 280 },
    { month: 'Feb', value: 300 },
    { month: 'Mar', value: 320 },
    { month: 'Apr', value: 340 },
    { month: 'May', value: 360 },
    { month: 'Jun', value: 360 },
  ];

  const feeCollection = [
    { month: 'Jan', collected: 12, target: 16 },
    { month: 'Feb', collected: 11, target: 16 },
    { month: 'Mar', collected: 13, target: 16 },
    { month: 'Apr', collected: 14, target: 16 },
    { month: 'May', collected: 15, target: 16 },
    { month: 'Jun', collected: 12, target: 16 },
  ];

  const maxEnrollment = Math.max(...enrollmentData.map(d => d.value));
  const maxFee = Math.max(...feeCollection.map(d => d.target));

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <AdminSidebar activeItem="Reports" />
      <div className="flex-1 ml-[300px]">
        <AdminHeader />
        
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
              Reports & Analytics
            </h1>
            <button className="px-5 py-2.5 bg-white border border-[#1A73E8] rounded-xl text-[#1A73E8] font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export Report
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl border border-black/15 p-5">
                <p className="text-sm text-black/55 font-ebrima">{stat.label}</p>
                <p className="text-2xl font-bold text-black font-ebrima mt-1">{stat.value}</p>
                <p className={`text-xs font-ebrima mt-1 ${stat.color}`}>{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-5 mb-6">
            {/* Enrollment Trend */}
            <div className="bg-white rounded-2xl border border-black/10 p-7">
              <h2 className="text-lg font-bold text-black/65 font-ebrima mb-4">
                Student Enrollment Trend
              </h2>
              <div className="relative h-52">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                  <span>360</span>
                  <span>340</span>
                  <span>320</span>
                  <span>300</span>
                  <span>280</span>
                </div>
                
                {/* Chart area */}
                <div className="ml-10 h-full relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-gray-200">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-full border-t border-gray-100" />
                    ))}
                  </div>
                  
                  {/* Bars */}
                  <div className="relative h-full flex items-end justify-around pt-4">
                    {enrollmentData.map((item, index) => {
                      const height = (item.value / maxEnrollment) * 100;
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-[#1A73E8] rounded-t transition-all duration-500"
                            style={{ height: `${height * 0.8}%` }}
                          />
                          <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Class Distribution */}
            <div className="bg-white rounded-2xl border border-black/10 p-7">
              <h2 className="text-lg font-bold text-black/65 font-ebrima mb-4">
                Class Distribution
              </h2>
              
              {/* Class Distribution Bars */}
              <div className="space-y-2">
                {classDistribution.map((item) => {
                  const maxValue = Math.max(...classDistribution.map(d => d.value));
                  const width = (item.value / maxValue) * 100;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-20">{item.label}</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${width}%`, backgroundColor: item.color }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-600 w-8">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fee Collection Chart */}
          <div className="bg-white rounded-2xl border border-black/10 p-7">
            <h2 className="text-lg font-bold text-black/65 font-ebrima mb-4">
              Fee Collection vs Target (₦ Millions)
            </h2>
            
            <div className="relative h-48">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                <span>16</span>
                <span>12</span>
                <span>8</span>
                <span>4</span>
                <span>0</span>
              </div>
              
              {/* Chart area */}
              <div className="ml-10 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full border-t border-gray-100" />
                  ))}
                </div>
                
                {/* Bars - Target (background) and Collected (foreground) */}
                <div className="relative h-full flex items-end justify-around pt-4">
                  {feeCollection.map((item, index) => {
                    const targetHeight = (item.target / maxFee) * 100;
                    const collectedHeight = (item.collected / maxFee) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div className="flex items-end gap-1">
                          {/* Collected bar */}
                          <div 
                            className="w-6 bg-[#1A73E8] rounded-t transition-all duration-500"
                            style={{ height: `${collectedHeight * 0.8}%` }}
                          />
                          {/* Target bar (background) */}
                          <div 
                            className="w-6 bg-[#E8F0FE] rounded-t transition-all duration-500"
                            style={{ height: `${targetHeight * 0.8}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#1A73E8] rounded" />
                <span className="text-sm text-gray-600">Collected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#E8F0FE] rounded border border-gray-300" />
                <span className="text-sm text-gray-600">Target</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}