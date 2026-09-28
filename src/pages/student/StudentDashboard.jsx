// src/pages/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <div className="flex items-center justify-center py-24">
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
    <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ─── Welcome ─── */}
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

      {/* ─── Programme + Fees ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ProgrammeCard />
        <FeesCard />
      </div>

      {/* ─── Attendance + Learn More ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <AttendanceCard />

        <button
          onClick={() => navigate('/student/learn-more')}
          className="text-left bg-white rounded-2xl border border-black/10 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A73E8] to-[#FF2E96] text-white shadow-md shrink-0">
              <i className="bx bx-book-reader text-2xl" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#FF2E96]">
                Self-learning
              </p>
              <h2 className="text-lg font-bold text-black font-ebrima leading-tight">
                Learn More
              </h2>
            </div>
          </div>

          <p className="text-sm text-black/55 leading-relaxed flex-1 mb-5">
            Free video lessons curated for your track — from trusted teachers
            on YouTube.
          </p>

          <span className="inline-flex items-center gap-2 text-sm font-bold text-[#1A73E8]">
            Start learning
            <i className="bx bx-right-arrow-alt text-lg" aria-hidden="true" />
          </span>
        </button>
      </div>

      {/* ─── Explore Programmes CTA ─── */}
      <div className="bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-ebrima mb-1.5">
            Explore Programmes
          </h2>
          <p className="text-white/85 text-sm font-ebrima">
            Browse our full catalogue of classes and instruments.
          </p>
        </div>
        <button
          onClick={() => navigate('/programmes')}
          className="self-start sm:self-auto shrink-0 px-6 py-2.5 bg-white rounded-full text-[#1A73E8] font-bold text-sm font-ebrima hover:shadow-lg transition-shadow"
        >
          View Programmes
        </button>
      </div>
    </div>
  );
}