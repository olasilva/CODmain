// src/pages/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import ProgrammeCard from '../../components/ProgrammeCard';
import FeesCard from '../../components/FeesCard';
import AttendanceCard from '../../components/AttendanceCard';
import { getSession, isLoggedIn, getStudentProfile } from '../../lib/api';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn('student') || !getSession('student')) {
      navigate('/login');
      return;
    }

    const session = getSession('student');
    if (session) setUser(session);

    (async () => {
      try {
        const profile = await getStudentProfile();
        if (profile) setUser((prev) => ({ ...(prev || {}), ...profile }));
      } catch (e) {
        console.warn('Could not load profile:', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A73E8] mx-auto" />
          <p className="mt-4 text-black/50 font-ebrima">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Dashboard" />
      <div className="flex-1 ml-[300px] min-w-0">
        <StudentHeader />

        <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 mb-4 animate-fadeUp">
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima leading-tight">
              Welcome back, {user?.fullName || user?.full_name || 'Student'}!
            </h1>
            <p className="text-sm sm:text-base text-black/60 font-ebrima pt-2">
              Here's an overview of your programme, fees, and attendance.
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Dashboard cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <ProgrammeCard />
            <FeesCard />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <AttendanceCard />

            {/* Explore CTA */}
            <div className="bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] rounded-2xl p-6 flex flex-col justify-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-ebrima mb-2">
                Explore Programmes
              </h2>
              <p className="text-white/85 text-sm font-ebrima mb-4">
                Browse our full catalogue of classes and instruments.
              </p>
              <button
                onClick={() => navigate('/programmes')}
                className="self-start px-6 py-2.5 bg-white rounded-full text-[#1A73E8] font-bold text-sm font-ebrima hover:shadow-lg transition-shadow"
              >
                View Programmes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}