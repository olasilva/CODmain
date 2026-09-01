// src/pages/student/StudentResults.jsx
import React, { useState } from 'react';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/StudentHeader';

const subjects = [
  {
    id: 1,
    name: 'Mathematics',
    code: 'MTH501',
    score: 87,
    grade: 'A',
    color: '#1A73E8',
    status: 'Distinction',
    percent: 87,
    ca1: 18,
    ca2: 17,
    exam: 52,
    remark: 'Excellent performance. Keep it up!'
  },
  {
    id: 2,
    name: 'English Language',
    code: 'ENG501',
    score: 83,
    grade: 'A',
    color: '#34A853',
    status: 'Distinction',
    percent: 83,
    ca1: 16,
    ca2: 17,
    exam: 50,
    remark: 'Excellent performance. Keep it up!'
  },
  {
    id: 3,
    name: 'Basic Science & Technology',
    code: 'BST501',
    score: 93,
    grade: 'A',
    color: '#FBBC05',
    status: 'Distinction',
    percent: 93,
    ca1: 19,
    ca2: 18,
    exam: 56,
    remark: 'Excellent performance. Keep it up!'
  },
  {
    id: 4,
    name: 'Social Studies',
    code: 'SST501',
    score: 81,
    grade: 'A',
    color: '#EA4335',
    status: 'Distinction',
    percent: 81,
    ca1: 17,
    ca2: 16,
    exam: 48,
    remark: 'Excellent performance. Keep it up!'
  },
  {
    id: 5,
    name: 'Civic Education',
    code: 'CVE501',
    score: 91,
    grade: 'A',
    color: '#9C27B0',
    status: 'Distinction',
    percent: 91,
    ca1: 18,
    ca2: 19,
    exam: 54,
    remark: 'Excellent performance. Keep it up!'
  },
  {
    id: 6,
    name: 'Christian Religious Studies',
    code: 'CRS501',
    score: 96,
    grade: 'A',
    color: '#00897B',
    status: 'Distinction',
    percent: 96,
    ca1: 20,
    ca2: 19,
    exam: 57,
    remark: 'Excellent performance. Keep it up!'
  },
  {
    id: 7,
    name: 'Yoruba Language',
    code: 'YOR501',
    score: 73,
    grade: 'B',
    color: '#E65100',
    status: 'Credit',
    percent: 73,
    ca1: 15,
    ca2: 14,
    exam: 44,
    remark: 'Good performance. Room to improve.'
  },
  {
    id: 8,
    name: 'Computer Studies',
    code: 'CMP501',
    score: 92,
    grade: 'A',
    color: '#0288D1',
    status: 'Distinction',
    percent: 92,
    ca1: 19,
    ca2: 18,
    exam: 55,
    remark: 'Excellent performance. Keep it up!'
  },
  {
    id: 9,
    name: 'Physical & Health Education',
    code: 'PHE501',
    score: 86,
    grade: 'A',
    color: '#558B2F',
    status: 'Distinction',
    percent: 86,
    ca1: 17,
    ca2: 18,
    exam: 51,
    remark: 'Excellent performance. Keep it up!'
  },
  {
    id: 10,
    name: 'Creative & Cultural Arts',
    code: 'CCA501',
    score: 90,
    grade: 'A',
    color: '#C62828',
    status: 'Distinction',
    percent: 90,
    ca1: 18,
    ca2: 19,
    exam: 53,
    remark: 'Excellent performance. Keep it up!'
  }
];

const gradeDistribution = [
  { label: 'Distinction (A)', count: 9, color: '#1A73E8', percent: 90 },
  { label: 'Credit (B)', count: 1, color: '#34A853', percent: 10 },
  { label: 'Pass (C)', count: 0, color: '#FBBC05', percent: 0 },
  { label: 'Below Pass', count: 0, color: '#EA4335', percent: 0 }
];

export default function StudentResults() {
  const [activeTerm, setActiveTerm] = useState('Term 1');
  const [expandedSubjects, setExpandedSubjects] = useState({});

  const toggleExpand = (id) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Results" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-[28px] font-bold text-black font-ebrima leading-[33.6px]">
                  Academic Results
                </h1>
                <p className="text-sm text-black/55 font-ebrima pt-1">
                  Adaeze Okonkwo • Primary 5A • Session 2025/2026 • ID: COD/2024/P5/012
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
            <div className="flex items-center gap-2 pt-5">
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
              <span className="ml-3 text-sm text-black/40 font-ebrima">Academic Session: 2025/2026</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 pt-5">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6">
                <p className="text-4xl font-bold text-white font-ebrima">87%</p>
                <p className="text-white/80 text-sm font-ebrima pt-1">Term Average</p>
              </div>
              <div className="bg-white border border-black/10 rounded-2xl p-6">
                <p className="text-4xl font-bold text-black font-ebrima">A</p>
                <p className="text-black/55 text-sm font-ebrima pt-1">Overall Grade</p>
              </div>
              <div className="bg-white border border-black/10 rounded-2xl p-6">
                <p className="text-4xl font-bold text-black font-ebrima">3rd</p>
                <p className="text-black/55 text-sm font-ebrima pt-1">Position of 32</p>
              </div>
              <div className="bg-white border border-black/10 rounded-2xl p-6">
                <p className="text-4xl font-bold text-black font-ebrima">10</p>
                <p className="text-black/55 text-sm font-ebrima pt-1">Subjects Offered</p>
              </div>
            </div>

            {/* Subject Results */}
            <div className="flex gap-5 pt-5">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-black font-ebrima">Subject Results — Term 1</h2>
                  <p className="text-xs text-black/40 font-ebrima">Click to expand score breakdown</p>
                </div>
                <div className="space-y-2.5">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="bg-white border border-black/10 rounded-2xl overflow-hidden">
                      {/* Subject Header - Always Visible */}
                      <div 
                        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
                        onClick={() => toggleExpand(subject.id)}
                      >
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
                          style={{ backgroundColor: subject.color }}
                        >
                          {subject.grade}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <span className="font-bold text-black font-ebrima">{subject.name}</span>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xl font-bold text-black font-ebrima">{subject.score}/100</span>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-bold border border-blue-200">
                                {subject.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs text-black/50 font-ebrima">{subject.code}</span>
                            <span className="text-xs text-black/20">•</span>
                            <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden">
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${subject.percent}%`,
                                  backgroundColor: subject.color
                                }}
                              />
                            </div>
                            <span className="text-xs text-black/50 font-ebrima min-w-[32px] text-right">{subject.percent}%</span>
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
                          
                          <div className="grid grid-cols-4 gap-4">
                            {/* 1st CA */}
                            <div className="bg-white p-3 rounded-xl border border-black/10">
                              <p className="text-xs text-black/50 font-ebrima">1st C.A.</p>
                              <p className="text-2xl font-bold text-black font-ebrima mt-1">
                                {subject.ca1}
                                <span className="text-sm text-black/35 font-normal">/20</span>
                              </p>
                              <div className="w-full h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden">
                                <div 
                                  className="h-1.5 rounded-full"
                                  style={{
                                    width: `${(subject.ca1 / 20) * 100}%`,
                                    backgroundColor: subject.color
                                  }}
                                />
                              </div>
                              <p className="text-[10px] text-black/40 font-ebrima mt-1">Continuous Assessment</p>
                            </div>

                            {/* 2nd CA */}
                            <div className="bg-white p-3 rounded-xl border border-black/10">
                              <p className="text-xs text-black/50 font-ebrima">2nd C.A.</p>
                              <p className="text-2xl font-bold text-black font-ebrima mt-1">
                                {subject.ca2}
                                <span className="text-sm text-black/35 font-normal">/20</span>
                              </p>
                              <div className="w-full h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden">
                                <div 
                                  className="h-1.5 rounded-full"
                                  style={{
                                    width: `${(subject.ca2 / 20) * 100}%`,
                                    backgroundColor: subject.color
                                  }}
                                />
                              </div>
                              <p className="text-[10px] text-black/40 font-ebrima mt-1">Continuous Assessment</p>
                            </div>

                            {/* Exam */}
                            <div className="bg-white p-3 rounded-xl border border-black/10">
                              <p className="text-xs text-black/50 font-ebrima">Examination</p>
                              <p className="text-2xl font-bold text-black font-ebrima mt-1">
                                {subject.exam}
                                <span className="text-sm text-black/35 font-normal">/60</span>
                              </p>
                              <div className="w-full h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden">
                                <div 
                                  className="h-1.5 rounded-full"
                                  style={{
                                    width: `${(subject.exam / 60) * 100}%`,
                                    backgroundColor: subject.color
                                  }}
                                />
                              </div>
                              <p className="text-[10px] text-black/40 font-ebrima mt-1">Terminal Examination</p>
                            </div>

                            {/* Total */}
                            <div 
                              className="p-3 rounded-xl border"
                              style={{
                                backgroundColor: `${subject.color}12`,
                                borderColor: `${subject.color}30`
                              }}
                            >
                              <p className="text-xs text-black/50 font-ebrima">Total Score</p>
                              <p className="text-2xl font-bold font-ebrima mt-1" style={{ color: subject.color }}>
                                {subject.score}
                                <span className="text-sm text-black/35 font-normal">/100</span>
                              </p>
                              <div className="w-full h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden">
                                <div 
                                  className="h-1.5 rounded-full"
                                  style={{
                                    width: `${subject.percent}%`,
                                    backgroundColor: subject.color
                                  }}
                                />
                              </div>
                              <p className="text-[10px] text-black/40 font-ebrima mt-1">{subject.status}</p>
                            </div>
                          </div>

                          {/* Grade Remark */}
                          <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200 flex justify-between items-center">
                            <div>
                              <span className="text-sm text-black/60 font-ebrima">Grade: </span>
                              <span className="text-sm font-bold font-ebrima" style={{ color: subject.color }}>
                                {subject.grade} — {subject.status}
                              </span>
                            </div>
                            <span className="text-xs text-black/40 font-ebrima">{subject.remark}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-[300px] min-w-[300px] space-y-3">
                {/* Term Performance */}
                <div className="bg-white border border-black/10 rounded-2xl p-5">
                  <h3 className="font-bold text-black font-ebrima">Term Performance</h3>
                  <div className="flex items-end gap-2 pt-3">
                    <span className="text-4xl font-bold text-blue-600 font-ebrima">87%</span>
                    <span className="text-sm text-black/50 font-ebrima pb-1">Term Average</span>
                  </div>
                  <div className="w-full h-2 bg-black/10 rounded-full mt-3 overflow-hidden">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '87%' }} />
                  </div>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-blue-600 font-ebrima">A — Distinction</span>
                    <span className="text-black/40 font-ebrima">Position: 3rd of 32</span>
                  </div>
                </div>

                {/* Grade Distribution */}
                <div className="bg-white border border-black/10 rounded-2xl p-5">
                  <h3 className="font-bold text-black font-ebrima">Grade Distribution</h3>
                  <div className="space-y-2 pt-3">
                    {gradeDistribution.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-xs text-black/60 font-ebrima w-[110px]">{item.label}</span>
                        <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${item.percent}%`,
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold w-4 text-right" style={{ color: item.color }}>
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="bg-white border border-black/10 rounded-2xl p-5">
                  <h3 className="font-bold text-black font-ebrima">Highlights</h3>
                  <div className="pt-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-600 font-ebrima">Best Subject</p>
                      <div className="flex justify-between items-center pt-1">
                        <span className="font-bold text-black font-ebrima">Christian Religious Studies</span>
                        <span className="text-green-600 font-bold font-ebrima">96%</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-xs text-orange-600 font-ebrima">Needs Attention</p>
                      <div className="flex justify-between items-center pt-1">
                        <span className="font-bold text-black font-ebrima">Yoruba Language</span>
                        <span className="text-orange-600 font-bold font-ebrima">73%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teacher's Remark */}
                <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl">
                  <h3 className="text-blue-600 font-bold font-ebrima">Class Teacher's Remark</h3>
                  <p className="text-sm text-black/65 font-ebrima pt-2">
                    Adaeze demonstrates excellent academic ability and a strong work ethic. Outstanding performance this term!
                  </p>
                  <p className="text-xs text-black/40 font-ebrima pt-2">— Mrs. Funmilayo Adebayo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}