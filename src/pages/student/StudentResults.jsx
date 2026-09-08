// src/pages/student/StudentResults.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import { getResults } from '../../lib/api';
import { getSession, isLoggedIn } from '../../lib/api';

export default function StudentResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTerm, setActiveTerm] = useState('Term 1');
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    class: '',
    session: '',
    id: ''
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    const session = getSession();
    if (session) {
      setStudentInfo(prev => ({
        ...prev,
        name: session.fullName || '',
      }));
    }
    
    fetchResults();
  }, [navigate]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await getResults();
      setResults(data?.results || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const gradeDistribution = () => {
    const grades = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    results.forEach(r => {
      if (r.grade) {
        const grade = r.grade.toUpperCase();
        if (grade in grades) grades[grade]++;
      }
    });
    return grades;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const average = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length) 
    : 0;
  const grade = average >= 70 ? 'A' : average >= 60 ? 'B' : average >= 50 ? 'C' : average >= 40 ? 'D' : 'F';
  const gradeStatus = average >= 70 ? 'Distinction' : average >= 60 ? 'Credit' : average >= 50 ? 'Pass' : 'Below Pass';

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Results" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8">
            {/* Header */}
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h1 className="text-[28px] font-bold text-black font-ebrima leading-[33.6px]">
                  Academic Results
                </h1>
                <p className="text-sm text-black/55 font-ebrima pt-1">
                  {studentInfo.name} • {studentInfo.class || 'Student'} • Session {studentInfo.session || '2025/2026'}
                </p>
              </div>
              <button className="px-4 py-2 bg-white border border-black/20 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Report
              </button>
            </div>

            {/* Term Tabs */}
            <div className="flex items-center gap-2 pt-5 flex-wrap">
              {['Term 1', 'Term 2', 'Term 3'].map((term) => (
                <button
                  key={term}
                  onClick={() => setActiveTerm(term)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition ${
                    activeTerm === term
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-black/60 border border-black/15 hover:bg-gray-50'
                  }`}
                >
                  {term}
                </button>
              ))}
              <span className="ml-3 text-sm text-black/40 font-ebrima">Academic Session: {studentInfo.session || '2025/2026'}</span>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6">
                <p className="text-4xl font-bold text-white font-ebrima">{average}%</p>
                <p className="text-white/80 text-sm font-ebrima pt-1">Term Average</p>
              </div>
              <div className="bg-white border border-black/10 rounded-2xl p-6">
                <p className="text-4xl font-bold text-black font-ebrima">{grade}</p>
                <p className="text-black/55 text-sm font-ebrima pt-1">Overall Grade</p>
              </div>
              <div className="bg-white border border-black/10 rounded-2xl p-6">
                <p className="text-4xl font-bold text-black font-ebrima">{results.length}</p>
                <p className="text-black/55 text-sm font-ebrima pt-1">Subjects Offered</p>
              </div>
              <div className="bg-white border border-black/10 rounded-2xl p-6">
                <p className="text-4xl font-bold text-black font-ebrima">{gradeStatus}</p>
                <p className="text-black/55 text-sm font-ebrima pt-1">Performance</p>
              </div>
            </div>

            {/* Subject Results */}
            <div className="flex flex-col lg:flex-row gap-5 pt-5">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-black font-ebrima">Subject Results — {activeTerm}</h2>
                  <p className="text-xs text-black/40 font-ebrima">Click to expand score breakdown</p>
                </div>
                <div className="space-y-2.5">
                  {results.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No results available for this term</p>
                    </div>
                  ) : (
                    results.map((subject) => (
                      <div key={subject.id} className="bg-white border border-black/10 rounded-2xl overflow-hidden">
                        {/* Subject Header - Always Visible */}
                        <div 
                          className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
                          onClick={() => toggleExpand(subject.id)}
                        >
                          <div
                            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
                            style={{ 
                              backgroundColor: subject.score >= 70 ? '#1A73E8' : 
                                             subject.score >= 60 ? '#34A853' : 
                                             subject.score >= 50 ? '#FBBC05' : '#EA4335'
                            }}
                          >
                            {subject.grade || 'N/A'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center flex-wrap gap-2">
                              <span className="font-bold text-black font-ebrima">{subject.subject || subject.name}</span>
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-xl font-bold text-black font-ebrima">{subject.score || 0}/100</span>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-bold border border-blue-200">
                                  {subject.status || 'Completed'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-xs text-black/50 font-ebrima">{subject.code || ''}</span>
                              <span className="text-xs text-black/20">•</span>
                              <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden">
                                <div
                                  className="h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${subject.score || 0}%`,
                                    backgroundColor: subject.score >= 70 ? '#1A73E8' : 
                                                   subject.score >= 60 ? '#34A853' : 
                                                   subject.score >= 50 ? '#FBBC05' : '#EA4335'
                                  }}
                                />
                              </div>
                              <span className="text-xs text-black/50 font-ebrima min-w-[32px] text-right">{subject.score || 0}%</span>
                            </div>
                          </div>
                          <button 
                            className={`px-3 py-1.5 border border-blue-300 rounded-full text-xs font-bold text-blue-600 flex items-center gap-1 hover:bg-blue-50 transition shrink-0 ${
                              expandedSubjects[subject.id] ? 'bg-blue-50' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(subject.id);
                            }}
                          >
                            {expandedSubjects[subject.id] ? 'Hide' : 'Details'}
                            <svg 
                              className={`w-3 h-3 transition-transform duration-300 ${expandedSubjects[subject.id] ? 'rotate-180' : ''}`} 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                        </div>

                        {/* Expanded Breakdown */}
                        <div 
                          className={`overflow-hidden transition-all duration-300 ${
                            expandedSubjects[subject.id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="p-4 bg-gray-50 border-t border-black/10">
                            <p className="text-xs font-bold text-black/50 font-ebrima uppercase tracking-wider mb-3">
                              Score Breakdown
                            </p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-white p-3 rounded-xl border border-black/10">
                                <p className="text-xs text-black/50 font-ebrima">1st C.A.</p>
                                <p className="text-2xl font-bold text-black font-ebrima mt-1">
                                  {subject.ca1 || 0}
                                  <span className="text-sm text-black/35 font-normal">/20</span>
                                </p>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-black/10">
                                <p className="text-xs text-black/50 font-ebrima">2nd C.A.</p>
                                <p className="text-2xl font-bold text-black font-ebrima mt-1">
                                  {subject.ca2 || 0}
                                  <span className="text-sm text-black/35 font-normal">/20</span>
                                </p>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-black/10">
                                <p className="text-xs text-black/50 font-ebrima">Examination</p>
                                <p className="text-2xl font-bold text-black font-ebrima mt-1">
                                  {subject.exam || 0}
                                  <span className="text-sm text-black/35 font-normal">/60</span>
                                </p>
                              </div>
                              <div className="p-3 rounded-xl border" style={{
                                backgroundColor: `${subject.score >= 70 ? '#1A73E8' : subject.score >= 60 ? '#34A853' : subject.score >= 50 ? '#FBBC05' : '#EA4335'}15`,
                                borderColor: `${subject.score >= 70 ? '#1A73E8' : subject.score >= 60 ? '#34A853' : subject.score >= 50 ? '#FBBC05' : '#EA4335'}30`
                              }}>
                                <p className="text-xs text-black/50 font-ebrima">Total Score</p>
                                <p className="text-2xl font-bold font-ebrima mt-1" style={{ 
                                  color: subject.score >= 70 ? '#1A73E8' : subject.score >= 60 ? '#34A853' : subject.score >= 50 ? '#FBBC05' : '#EA4335'
                                }}>
                                  {subject.score || 0}
                                  <span className="text-sm text-black/35 font-normal">/100</span>
                                </p>
                              </div>
                            </div>

                            {/* Grade Remark */}
                            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200 flex justify-between items-center flex-wrap gap-2">
                              <div>
                                <span className="text-sm text-black/60 font-ebrima">Grade: </span>
                                <span className="text-sm font-bold font-ebrima" style={{ 
                                  color: subject.score >= 70 ? '#1A73E8' : subject.score >= 60 ? '#34A853' : subject.score >= 50 ? '#FBBC05' : '#EA4335'
                                }}>
                                  {subject.grade || 'N/A'} — {subject.status || 'Completed'}
                                </span>
                              </div>
                              <span className="text-xs text-black/40 font-ebrima">{subject.remark || 'Good performance'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-full lg:w-[300px] lg:min-w-[300px] space-y-3">
                {/* Term Performance */}
                <div className="bg-white border border-black/10 rounded-2xl p-5">
                  <h3 className="font-bold text-black font-ebrima">Term Performance</h3>
                  <div className="flex items-end gap-2 pt-3">
                    <span className="text-4xl font-bold text-blue-600 font-ebrima">{average}%</span>
                    <span className="text-sm text-black/50 font-ebrima pb-1">Term Average</span>
                  </div>
                  <div className="w-full h-2 bg-black/10 rounded-full mt-3 overflow-hidden">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${average}%` }} />
                  </div>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-blue-600 font-ebrima">{grade} — {gradeStatus}</span>
                    <span className="text-black/40 font-ebrima">{results.length} subjects</span>
                  </div>
                </div>

                {/* Grade Distribution */}
                <div className="bg-white border border-black/10 rounded-2xl p-5">
                  <h3 className="font-bold text-black font-ebrima">Grade Distribution</h3>
                  <div className="space-y-2 pt-3">
                    {[
                      { label: 'Distinction (A)', count: gradeDistribution().A, color: '#1A73E8' },
                      { label: 'Credit (B)', count: gradeDistribution().B, color: '#34A853' },
                      { label: 'Pass (C)', count: gradeDistribution().C, color: '#FBBC05' },
                      { label: 'Below Pass', count: gradeDistribution().D + gradeDistribution().F, color: '#EA4335' }
                    ].map((item) => {
                      const percent = results.length > 0 ? (item.count / results.length) * 100 : 0;
                      return (
                        <div key={item.label} className="flex items-center gap-2">
                          <span className="text-xs text-black/60 font-ebrima w-[110px]">{item.label}</span>
                          <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                            <div
                              className="h-1.5 rounded-full transition-all duration-500"
                              style={{
                                width: `${percent}%`,
                                backgroundColor: item.color
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold w-4 text-right" style={{ color: item.color }}>
                            {item.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Highlights */}
                {results.length > 0 && (
                  <div className="bg-white border border-black/10 rounded-2xl p-5">
                    <h3 className="font-bold text-black font-ebrima">Highlights</h3>
                    <div className="pt-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs text-green-600 font-ebrima">Best Subject</p>
                        <div className="flex justify-between items-center pt-1">
                          <span className="font-bold text-black font-ebrima">
                            {results.reduce((a, b) => (a.score || 0) > (b.score || 0) ? a : b).subject || 'N/A'}
                          </span>
                          <span className="text-green-600 font-bold font-ebrima">
                            {results.reduce((a, b) => (a.score || 0) > (b.score || 0) ? a : b).score || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-xs text-orange-600 font-ebrima">Needs Attention</p>
                        <div className="flex justify-between items-center pt-1">
                          <span className="font-bold text-black font-ebrima">
                            {results.reduce((a, b) => (a.score || 0) < (b.score || 0) ? a : b).subject || 'N/A'}
                          </span>
                          <span className="text-orange-600 font-bold font-ebrima">
                            {results.reduce((a, b) => (a.score || 0) < (b.score || 0) ? a : b).score || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}