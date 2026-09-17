// src/pages/student/StudentCourses.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import {
  getMyProgramme,
  getMyEnrolledClasses,
  getSession,
  isLoggedIn,
} from '../../lib/api';

export default function StudentCourses() {
  const navigate = useNavigate();
  const [programme, setProgramme] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login', { replace: true });
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError('');
      try {
        const [pRes, cRes] = await Promise.all([
          getMyProgramme().catch((e) => {
            console.error('my-programme failed:', e);
            return { programme: null };
          }),
          getMyEnrolledClasses().catch((e) => {
            console.error('my-classes failed:', e);
            return { classes: [] };
          }),
        ]);
        if (cancelled) return;
        console.log('🔵 PROGRAMME:', pRes);
        console.log('🔵 CLASSES:', cRes);
        setProgramme(pRes?.programme || null);
        setClasses(cRes?.classes || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const session = getSession();

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Courses" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="mb-6">
            <h1 className="text-[36px] font-bold text-black font-ebrima">
              My Programme
            </h1>
            <p className="text-sm text-black/60 mt-1">
              Welcome, {session?.fullName || 'Student'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl border border-black/10 p-12 text-center text-black/50">
              Loading your programme…
            </div>
          )}

          {!loading && !programme && (
            <div className="bg-white rounded-2xl border border-black/10 p-12 text-center">
              <p className="text-lg font-bold text-black/70 mb-1">
                No programme registered yet
              </p>
              <p className="text-sm text-black/50 mb-6">
                Your programme will appear here once your admission is processed.
              </p>
              <button
                onClick={() => navigate('/enroll')}
                className="px-6 py-3 bg-[#1A73E8] text-white font-bold rounded-xl text-sm hover:bg-blue-700"
              >
                Complete Admission
              </button>
            </div>
          )}

          {!loading && programme && (
            <>
              <div className="bg-white rounded-3xl border border-black/10 p-8 mb-6">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1A73E8] to-[#FF2E96] text-white flex items-center justify-center text-3xl font-bold shrink-0">
                    🎼
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-black/50 uppercase tracking-wide font-bold">
                      Enrolled Programme
                    </p>
                    <h2 className="text-2xl font-bold text-black mt-1">
                      {programme.course}
                    </h2>
                    <p className="text-lg text-[#1A73E8] font-bold">
                      {programme.trackName}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-black/10">
                      <InfoBlock
                        label="Admission Number"
                        value={programme.admissionNumber || '—'}
                      />
                      <InfoBlock
                        label="Academic Year"
                        value={programme.academicYear || '—'}
                      />
                      <InfoBlock
                        label="Status"
                        value={
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              programme.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : programme.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {programme.status}
                          </span>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-black/10 p-6">
                <h3 className="text-lg font-bold text-black/80 mb-4">
                  Classes in Your Programme
                </h3>

                {classes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-black/60 text-sm">
                      No classes assigned yet.
                    </p>
                    <p className="text-xs text-black/40 mt-1">
                      Your teacher will assign you to a class soon.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {classes.map((c) => (
                      <div
                        key={c.id}
                        className="border border-black/10 rounded-xl p-5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1A73E8] flex items-center justify-center text-lg font-bold">
                            {(c.title || c.subject || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-black truncate">
                              {c.title || c.subject || 'Class'}
                            </div>
                            {c.instructor && (
                              <div className="text-xs text-black/50 mt-0.5">
                                {c.instructor.full_name || 'Teacher'}
                              </div>
                            )}
                          </div>
                        </div>
                        {c.schedule && (
                          <div className="mt-3 pt-3 border-t border-black/5 text-xs text-black/60">
                            🕐 {c.schedule}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-xs text-black/50 uppercase font-bold">{label}</p>
      <p className="text-sm font-bold text-black mt-1">{value}</p>
    </div>
  );
}