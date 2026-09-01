// src/pages/admin/AdminPayments.jsx
import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

const payments = [
  { student: 'Emeka Chike', class: 'Primary 2', feeType: 'School Fees', amount: '₦45,000', dueDate: '31 Jan 2026', paidDate: '—', status: 'Pending' },
  { student: 'Yusuf Ibrahim', class: 'Primary 2', feeType: 'School Fees', amount: '₦40,000', dueDate: '28 Feb 2026', paidDate: '—', status: 'Pending' },
];

const stats = [
  { label: 'Total Expected', value: '₦14.2M' },
  { label: 'Collected', value: '₦12.4M', color: 'text-[#34A853]' },
  { label: 'Pending', value: '₦1.4M', color: 'text-[#E6AC00]' },
  { label: 'Overdue', value: '₦400K', color: 'text-[#EA4335]' },
];

export default function AdminPayments() {
  const [activeFilter, setActiveFilter] = useState('All');

  const getStatusColor = (status) => {
    if (status === 'Paid') return 'bg-green-100 text-green-600';
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-500';
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <AdminSidebar activeItem="Payments" />
      <div className="flex-1 ml-[300px]">
        <AdminHeader />
        
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
              Payments
            </h1>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-white border border-[#1A73E8] rounded-xl text-[#1A73E8] font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>
              <button className="px-5 py-2.5 bg-[#1A73E8] rounded-xl text-white font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Record Payment
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl border border-black/15 p-4">
                <p className="text-sm text-black/60 font-ebrima">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color || 'text-black'} font-ebrima mt-1`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 bg-white rounded-xl border border-black/15 px-4 py-2.5 flex items-center gap-2.5">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search by student name…"
                className="flex-1 outline-none bg-transparent text-sm"
              />
            </div>
            {['All', 'Paid', 'Pending', 'Overdue'].map((filter) => (
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
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Student</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Class</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Fee Type</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Amount</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Due Date</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Paid Date</th>
                    <th className="text-left py-3.5 px-5 text-sm font-bold text-black/55">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                      <td className="py-3 px-5 font-bold text-black">{payment.student}</td>
                      <td className="py-3 px-5 text-black/60">{payment.class}</td>
                      <td className="py-3 px-5 text-black/60">{payment.feeType}</td>
                      <td className="py-3 px-5 font-bold text-black">{payment.amount}</td>
                      <td className="py-3 px-5 text-black/60">{payment.dueDate}</td>
                      <td className="py-3 px-5 text-black/60">{payment.paidDate}</td>
                      <td className="py-3 px-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(payment.status)}`}>
                          {payment.status}
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