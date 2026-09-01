// pages/Dashboard.jsx or components/Dashboard.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Course data
const courses = [
  {
    id: 1,
    code: "MUS101",
    title: "Guitar Fundamentals",
    instructor: "Prof. Adebayo",
    progress: 75,
    nextClass: "Today, 10:00 AM",
    color: "#1A73E8",
    badgeNumber: 3,
  },
  {
    id: 2,
    code: "MAT201",
    title: "Mathematics SS1",
    instructor: "Mr. Okonkwo",
    progress: 60,
    nextClass: "Today, 1:00 PM",
    color: "#34A853",
    badgeNumber: 4,
  },
  {
    id: 3,
    code: "MUS201",
    title: "Music Theory",
    instructor: "Prof. Adebayo",
    progress: 85,
    nextClass: "Today, 3:00 PM",
    color: "#FBBC05",
    badgeNumber: 3,
  },
  {
    id: 4,
    code: "ENG101",
    title: "English Language",
    instructor: "Mrs. Johnson",
    progress: 50,
    nextClass: "Tomorrow, 9:00 AM",
    color: "#FD16E5",
    badgeNumber: 3,
  },
];

// Sidebar navigation items
const navItems = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "My Courses", icon: "courses", active: true },
  { label: "Classes", icon: "classes" },
  { label: "Assignments", icon: "assignments" },
  { label: "Results", icon: "results" },
  { label: "Messages", icon: "messages" },
  { label: "Notifications", icon: "notifications" },
  { label: "Settings", icon: "settings" },
  { label: "Logout", icon: "logout" },
];

function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-[30px] p-6 border border-black/10 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-black/50 text-sm font-normal font-['Ebrima'] leading-5">
            {course.code}
          </div>
          <div className="text-black text-2xl font-bold font-['Ebrima'] leading-9 pt-1">
            {course.title}
          </div>
          <div className="text-black/60 text-sm font-normal font-['Ebrima'] leading-[21px] pt-1">
            {course.instructor}
          </div>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold"
          style={{ background: course.color }}
        >
          {course.badgeNumber}
        </div>
      </div>

      {/* Progress */}
      <div className="pt-4">
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-sm font-normal font-['Ebrima'] leading-5">
            Course Progress
          </span>
          <span className="text-black text-sm font-bold font-['Ebrima'] leading-5">
            {course.progress}%
          </span>
        </div>
        <div className="pt-2">
          <div className="w-full h-2 bg-black/10 rounded-full">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${course.progress}%`,
                background: course.color,
              }}
            />
          </div>
        </div>
      </div>

      {/* Next Class */}
      <div className="pt-4">
        <div className="w-full px-3 py-3 bg-black/5 rounded-[15px] flex justify-between items-center">
          <span className="text-black/60 text-sm font-normal font-['Ebrima'] leading-5">
            Next Class:
          </span>
          <span className="text-black text-sm font-bold font-['Ebrima'] leading-5">
            {course.nextClass}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4">
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 bg-[#1A73E8] rounded-full text-white text-sm font-bold font-['Ebrima'] leading-5">
            View Materials
          </button>
          <button className="flex-1 py-2.5 rounded-full border border-black/20 text-black text-sm font-bold font-['Ebrima'] leading-5">
            Course Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // Split courses into two rows
  const firstRow = courses.slice(0, 2);
  const secondRow = courses.slice(2, 4);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[300px] min-h-screen bg-[#1A73E8] flex-shrink-0 pt-[98px]">
          <div className="px-7 pt-8">
            {navItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 py-2 px-4 rounded-3xl ${
                  item.active ? "bg-white/30" : ""
                }`}
              >
                <span className="text-white text-2xl">{item.icon}</span>
                <span
                  className={`text-white text-2xl font-medium font-['SF_Compact_Rounded'] leading-9 ${
                    item.active ? "" : ""
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 px-[300px] pt-[98px] pb-8">
          <div className="max-w-[1140px] mx-auto">
            {/* Header */}
            <div className="pt-8 px-8">
              <h1 className="text-black text-4xl font-bold font-['Ebrima'] leading-[54px]">
                My Courses
              </h1>
              <p className="text-black/60 text-base font-normal font-['Ebrima'] leading-6 pt-2">
                You are currently enrolled in {courses.length} courses
              </p>
            </div>

            {/* Course Grid */}
            <div className="px-8 pt-8">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-6">
                {firstRow.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-6 pt-6">
                {secondRow.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            {/* Explore More Courses Banner */}
            <div className="px-8 pt-8">
              <div className="bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] rounded-3xl p-8">
                <h2 className="text-white text-3xl font-bold font-['Ebrima'] leading-[42px]">
                  Explore More Courses
                </h2>
                <p className="text-white/80 text-base font-normal font-['Ebrima'] leading-6 pt-2 pb-4">
                  Browse our full catalog and register for new courses
                </p>
                <button className="bg-white text-[#1A73E8] text-base font-bold font-['Ebrima'] leading-6 px-6 py-3 rounded-full">
                  View Course Catalog
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}