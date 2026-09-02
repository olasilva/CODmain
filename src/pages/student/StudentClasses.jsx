// src/pages/student/StudentClasses.jsx
import React from 'react';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';

const classes = [
  {
    id: 1,
    title: 'Guitar Fundamentals',
    time: '10:00 AM',
    day: 'Today',
    instructor: '👨‍🏫 Prof. Adebayo',
    location: '📍 Room 101',
    duration: '⏱️ 1 hour',
    status: 'Live',
    statusColor: 'bg-red-500',
    statusBg: 'bg-red-100',
    statusText: 'text-red-600',
    statusLabel: 'Live',
    buttonText: 'Join Now',
    buttonColor: 'bg-red-500',
    borderColor: 'border-l-4 border-red-500'
  },
  {
    id: 2,
    title: 'Mathematics SS1',
    time: '1:00 PM',
    day: 'Today',
    instructor: '👨‍🏫 Mr. Okonkwo',
    location: '📍 Online',
    duration: '⏱️ 1.5 hours',
    status: 'Upcoming',
    statusColor: 'bg-yellow-500',
    statusBg: 'bg-yellow-100',
    statusText: 'text-yellow-600',
    statusLabel: 'Upcoming',
    buttonText: 'View Details',
    buttonColor: 'bg-blue-500',
    borderColor: 'border-l-4 border-yellow-500'
  },
  {
    id: 3,
    title: 'Music Theory',
    time: '3:00 PM',
    day: 'Today',
    instructor: '👨‍🏫 Prof. Adebayo',
    location: '📍 Room 205',
    duration: '⏱️ 1 hour',
    status: 'Upcoming',
    statusColor: 'bg-yellow-500',
    statusBg: 'bg-yellow-100',
    statusText: 'text-yellow-600',
    statusLabel: 'Upcoming',
    buttonText: 'View Details',
    buttonColor: 'bg-blue-500',
    borderColor: 'border-l-4 border-green-500'
  },
  {
    id: 4,
    title: 'English Language',
    time: '9:00 AM',
    day: 'Tomorrow',
    instructor: '👨‍🏫 Mrs. Johnson',
    location: '📍 Room 103',
    duration: '⏱️ 1 hour',
    status: 'Scheduled',
    statusColor: 'bg-blue-500',
    statusBg: 'bg-blue-100',
    statusText: 'text-blue-600',
    statusLabel: 'Scheduled',
    buttonText: 'View Details',
    buttonColor: 'bg-blue-500',
    borderColor: 'border-l-4 border-blue-500'
  }
];

const recordings = [
  {
    id: 1,
    title: 'Guitar Fundamentals - Week 7',
    instructor: 'Prof. Adebayo',
    date: 'June 23, 2026',
    duration: '58:42'
  },
  {
    id: 2,
    title: 'Mathematics SS1 - Algebra Basics',
    instructor: 'Mr. Okonkwo',
    date: 'June 22, 2026',
    duration: '1:22:15'
  },
  {
    id: 3,
    title: 'Music Theory - Chord Progressions',
    instructor: 'Prof. Adebayo',
    date: 'June 21, 2026',
    duration: '1:05:30'
  }
];

export default function StudentClasses() {
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

            <div className="flex gap-8 pt-8">
              {/* Left Column - Upcoming Classes */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-black font-ebrima mb-4">
                  Upcoming Classes
                </h2>
                <div className="space-y-4">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      className={`bg-white rounded-2xl border border-black/5 p-6 flex items-center gap-4 ${cls.borderColor}`}
                    >
                      <div className="min-w-[80px] text-center">
                        <p className="text-lg font-bold text-black font-ebrima">{cls.time}</p>
                        <p className="text-xs text-black/60 font-ebrima">{cls.day}</p>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-black font-ebrima">{cls.title}</h3>
                        <div className="flex items-center gap-4 pt-1 text-sm text-black/60">
                          <span>{cls.instructor}</span>
                          <span>•</span>
                          <span>{cls.location}</span>
                          <span>•</span>
                          <span>{cls.duration}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${cls.statusBg} ${cls.statusText}`}>
                          {cls.statusLabel}
                        </span>
                        <button className={`mt-2 px-6 py-2 ${cls.buttonColor} text-white rounded-full text-sm font-bold hover:opacity-90 transition block w-full`}>
                          {cls.buttonText}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Recent Recordings */}
              <div className="w-[300px] min-w-[300px]">
                <div className="bg-white rounded-2xl border border-black/5 p-6">
                  <h3 className="text-xl font-bold text-black font-ebrima mb-4">
                    Recent Recordings
                  </h3>
                  <div className="space-y-4">
                    {recordings.map((rec) => (
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
                          <span>{rec.date}</span>
                          <span>{rec.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:opacity-90 transition">
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