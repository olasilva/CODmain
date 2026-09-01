// src/pages/enroll.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logo from '../assets/logo.jpg';

export default function Enroll() {
  const navigate = useNavigate();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleAction = (action) => {
    setPendingAction(action);
    setShowRoleModal(true);
  };

  const handleRoleChoice = (role) => {
    if (!pendingAction) return;

    setShowRoleModal(false);

    if (pendingAction === 'purchase') {
      if (role === 'student') {
        navigate('/application');
        return;
      }
      if (role === 'staff') {
        navigate('/staff/signup');
        return;
      }
      return;
    }

    if (role === 'student') {
      navigate('/login?role=student');
      return;
    }

    if (role === 'staff') {
      navigate('/login?role=staff');
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />

      {/* Main Enroll Content Area */}
      <main className="flex-1 flex flex-col md:flex-row w-full font-sans">
        
        {/* Left Sidebar Banner */}
        <div className="w-full md:w-[450px] min-h-[350px] md:min-h-full bg-gradient-to-b from-[#1A73E8] to-[#0F4082] flex flex-col items-center justify-center p-8 text-white text-center shadow-lg">
          <div className="flex flex-col items-center max-w-[312px] gap-7">
            <img 
              src={logo} 
              alt="Clan of David Logo" 
              className="w-[124px] h-[125px] rounded-xl object-cover shadow-md"
            />
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide uppercase leading-snug font-sans">
              Welcome to Clan of David Art and Music Academy
            </h1>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[600px] bg-white rounded-3xl border border-black/30 p-8 md:p-10 shadow-xl flex flex-col items-center gap-6">
            
            <h2 className="text-lg md:text-xl font-bold text-black/70 tracking-wide text-center">
              SELECT ONE TO PROCEED
            </h2>

            <div className="w-full flex flex-col gap-4">
              <button 
                type="button"
                onClick={() => handleAction('purchase')}
                className="w-full h-[56px] bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] hover:opacity-95 transition-opacity duration-200 text-white font-bold text-lg rounded-full shadow-[4px_4px_12px_rgba(0,0,0,0.20)] flex items-center justify-center"
              >
                Purchase Admission Form
              </button>

              <button 
                type="button"
                onClick={() => handleAction('login')}
                className="w-full h-[56px] bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] hover:opacity-95 transition-opacity duration-200 text-white font-bold text-lg rounded-full shadow-[4px_4px_12px_rgba(0,0,0,0.20)] flex items-center justify-center"
              >
                Login to Dashboard
              </button>
            </div>

          </div>
        </div>

      </main>

      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Choose your account type</h3>
            <p className="text-sm text-slate-500 mb-6">
              {pendingAction === 'purchase' ? 'Are you applying as a student or staff member?' : 'Which dashboard do you want to access?'}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChoice('student')}
                className="rounded-2xl border border-slate-200 bg-[#F5F9FF] py-4 text-lg font-bold text-[#1A73E8] hover:bg-[#EAF3FF] transition"
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => handleRoleChoice('staff')}
                className="rounded-2xl border border-slate-200 bg-[#F5F9FF] py-4 text-lg font-bold text-[#1A73E8] hover:bg-[#EAF3FF] transition"
              >
                Staff
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowRoleModal(false)}
              className="mt-5 w-full rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}