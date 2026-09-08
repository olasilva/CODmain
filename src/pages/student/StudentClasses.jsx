// src/pages/student/StudentClasses.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import { getClasses } from '../../lib/api';
import { getSession, isLoggedIn } from '../../lib/api';

export default function StudentClasses() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    fetchClasses();
  }, [navigate]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getClasses();
      setClasses(data || []);
      // Recordings would come from a separate API endpoint
      // For now, using mock data
      setRecordings([
        { id: 1, title: 'Guitar Fundamentals - Week 7', instructor: 'Prof. Adebayo', date: '2026-06-23', duration: '58:42' },
        { id: 2, title: 'Mathematics SS1 - Algebra Basics', instructor: 'Mr. Okonkwo', date: '2026-06-22', duration: '1:22:15' }
      ]);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (cls) => {
    const now = new Date();
    const classTime = new Date(cls.schedule || now);
    const diff = classTime - now;
    
    if (diff < 0 && diff > -3600000) return { label: 'Live', color: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-100' };
    if (diff < 0) return { label: 'Ended', color: 'bg-gray-500', text: 'text-gray-600', bg: 'bg-gray-100' };
    if (diff < 3600000) return { label: 'Starting Soon', color: 'bg-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Scheduled', color: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-100' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Classes" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8">
            <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
              My Classes
            </h1>
            <p className="text-base text-black/60 font-ebrima pt-2">
              Your upcoming schedule and class recordings
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-8 pt-8 flex-wrap lg:flex-nowrap">
              {/* Left Column - Upcoming Classes */}
              <div className="flex-1 min-w-[300px]">
                <h2 className="text-2xl font-bold text-black font-ebrima mb-4">
                  Upcoming Classes
                </h2>
                <div className="space-y-4">
                  {classes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No upcoming classes</p>
                    </div>
                  ) : (
                    classes.map((cls) => {
                      const status = getStatusInfo(cls);
                      return (
                        <div
                          key={cls.id}
                          className={`bg-white rounded-2xl border border-black/5 p-6 flex flex-wrap md:flex-nowrap items-center gap-4 border-l-4 ${status.color}`}
                        >
                          <div className="min-w-[80px] text-center">
                            <p className="text-lg font-bold text-black font-ebrima">
                              {cls.schedule ? new Date(cls.schedule).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                            </p>
                            <p className="text-xs text-black/60 font-ebrima">
                              {cls.schedule ? new Date(cls.schedule).toLocaleDateString() : 'TBD'}
                            </p>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-black font-ebrima">{cls.name || cls.title}</h3>
                            <div className="flex items-center gap-4 pt-1 text-sm text-black/60 flex-wrap">
                              <span>👨‍🏫 {cls.instructor || 'TBA'}</span>
                              <span>•</span>
                              <span>📍 {cls.location || 'Online'}</span>
                              <span>•</span>
                              <span>⏱️ {cls.duration || '1 hour'}</span>
                            </div>
                          </div>
                          <div className="text-right min-w-[120px]">
                            <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
                              {status.label}
                            </span>
                            {status.label === 'Live' && (
                              <button className="mt-2 px-6 py-2 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition block w-full">
                                Join Now
                              </button>
                            )}
                            {status.label !== 'Live' && (
                              <button className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-full text-sm font-bold hover:bg-blue-600 transition block w-full">
                                View Details
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column - Recent Recordings */}
              <div className="w-full md:w-[300px] min-w-[250px]">
                <div className="bg-white rounded-2xl border border-black/5 p-6">
                  <h3 className="text-xl font-bold text-black font-ebrima mb-4">
                    Recent Recordings
                  </h3>
                  <div className="space-y-4">
                    {recordings.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No recordings available
                      </div>
                    ) : (
                      recordings.map((rec) => (
                        <div key={rec.id} className="border border-black/10 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                              <span className="text-xl">▶️</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-black truncate">{rec.title}</p>
                              <p className="text-xs text-black/60">{rec.instructor}</p>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-black/60 mt-2">
                            <span>{rec.date ? new Date(rec.date).toLocaleDateString() : ''}</span>
                            <span>{rec.duration}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition">
                    View All Recordings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}