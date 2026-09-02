// src/pages/student/StudentDashboard.jsx
import React from 'react';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import CourseCard from './components/CourseCard';

const courses = [
  {
    id: 1,
    code: 'MUS101',
    title: 'Guitar Fundamentals',
    instructor: 'Prof. Adebayo',
    progress: 75,
    nextClass: 'Today, 10:00 AM',
    color: '#1A73E8',
    assignments: 3,
    borderColor: 'border-blue-500/30'
  },
  {
    id: 2,
    code: 'MAT201',
    title: 'Mathematics SS1',
    instructor: 'Mr. Okonkwo',
    progress: 60,
    nextClass: 'Today, 1:00 PM',
    color: '#34A853',
    assignments: 4,
    borderColor: 'border-green-500/30'
  },
  {
    id: 3,
    code: 'MUS201',
    title: 'Music Theory',
    instructor: 'Prof. Adebayo',
    progress: 85,
    nextClass: 'Today, 3:00 PM',
    color: '#FBBC05',
    assignments: 3,
    borderColor: 'border-yellow-500/30'
  },
  {
    id: 4,
    code: 'ENG101',
    title: 'English Language',
    instructor: 'Mrs. Johnson',
    progress: 50,
    nextClass: 'Tomorrow, 9:00 AM',
    color: '#FD16E5',
    assignments: 3,
    borderColor: 'border-pink-500/30'
  }
];

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="My Courses" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8 animate-fadeUp">
            <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px] animate-slideDown">
              My Courses
            </h1>
            <p className="text-base text-black/60 font-ebrima pt-2 animate-slideDown" style={{ animationDelay: "100ms" }}>
              You are currently enrolled in {courses.length} courses
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
            <div className="mt-8 animate-slideUp" style={{ animationDelay: "400ms" }}>
              <div className="bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] rounded-3xl p-8">
                <h2 className="text-[28px] font-bold text-white font-ebrima leading-[42px]">
                  Explore More Courses
                </h2>
                <p className="text-white/80 text-base font-ebrima pt-2 pb-4">
                  Browse our full catalog and register for new courses
                </p>
                <button className="px-6 py-3 bg-white rounded-full text-[#1A73E8] font-bold text-base font-ebrima hover:shadow-lg transition-shadow">
                  View Course Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}