// src/pages/admin/components/AdminHeader.jsx
import React from 'react';

export default function AdminHeader() {
  return (
    <div className="h-[98px] bg-[#F3F4F6] border-b border-black/30 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#1A73E8] rounded-xl flex items-center justify-center text-white font-bold text-xl">
          C
        </div>
        <span className="text-3xl font-bold text-black font-ebrima leading-[22px]">
          Admin Panel
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}