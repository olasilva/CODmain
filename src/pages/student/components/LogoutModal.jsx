// src/pages/student/components/LogoutModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    // Add logout logic here (clear tokens, etc.)
    console.log('Logging out...');
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-xl w-[480px] max-w-[90vw] p-12 flex flex-col items-center">
        {/* Warning Icon */}
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-black font-ebrima text-center">
          Log out of your account?
        </h2>
        <p className="text-sm text-black/50 font-ebrima text-center mt-2">
          You'll be signed out of Clan of David.<br />
          Your progress and data will be saved.
        </p>

        {/* User Info */}
        <div className="w-full p-4 bg-blue-50/50 rounded-2xl border border-blue-200/50 flex items-center gap-4 mt-6">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm">
            II
          </div>
          <div className="flex-1">
            <p className="font-bold text-black font-ebrima">Immanuel Igbana</p>
            <p className="text-sm text-black/50 font-ebrima">Student · SS1 · Clan of David</p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        </div>

        {/* Divider */}
        <div className="w-full border-t border-black/5 my-4" />

        {/* Buttons */}
        <div className="w-full flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-white border border-black/10 rounded-full text-black/70 font-ebrima hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-3.5 bg-blue-600 shadow-lg shadow-blue-600/30 rounded-full text-white font-ebrima hover:bg-blue-700 transition"
          >
            Log Out
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-xs text-black/30 font-ebrima text-center mt-4">
          You can log back in anytime with your credentials
        </p>
      </div>
    </div>
  );
}