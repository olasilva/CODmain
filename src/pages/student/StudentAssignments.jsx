// src/pages/student/StudentAssignments.jsx
import React from 'react';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';

const assignments = [
  {
    id: 1,
    title: 'Guitar Practice Log',
    course: 'Guitar Fundamentals',
    due: 'June 27, 2026 at 11:59 PM',
    points: 20,
    status: 'Pending',
    statusColor: 'bg-red-100 text-red-600',
    priority: 'Priority',
    priorityColor: 'bg-red-100 text-red-600',
    borderColor: 'border-2 border-red-200',
    description: 'Submit your weekly practice log with at least 5 hours of documented practice.',
    buttonText: 'Continue',
    buttonColor: 'bg-blue-600'
  },
  {
    id: 2,
    title: 'Mathematics Assignment - Chapter 5',
    course: 'Mathematics SS1',
    due: 'June 29, 2026 at 11:59 PM',
    points: 30,
    status: 'In Progress',
    statusColor: 'bg-yellow-100 text-yellow-600',
    priority: null,
    priorityColor: null,
    borderColor: 'border-2 border-yellow-300',
    description: 'Complete exercises 1-15 from the textbook on algebraic expressions.',
    buttonText: 'Continue',
    buttonColor: 'bg-blue-600'
  },
  {
    id: 3,
    title: 'Music Theory Quiz',
    course: 'Music Theory',
    due: 'June 25, 2026 at 2:00 PM',
    points: 15,
    status: 'Submitted',
    statusColor: 'bg-blue-100 text-blue-600',
    priority: null,
    priorityColor: null,
    borderColor: 'border-2 border-gray-200',
    description: 'Online quiz covering chord progressions and harmonic analysis.',
    buttonText: 'View Submission',
    buttonColor: 'bg-gray-200 text-black'
  },
  {
    id: 4,
    title: 'English Essay - Literary Analysis',
    course: 'English Language',
    due: 'July 1, 2026 at 11:59 PM',
    points: 40,
    status: 'Not Started',
    statusColor: 'bg-gray-100 text-gray-600',
    priority: null,
    priorityColor: null,
    borderColor: 'border-2 border-yellow-300',
    description: 'Write a 500-word essay analyzing the themes in the assigned novel.',
    buttonText: 'Start Assignment',
    buttonColor: 'bg-blue-600'
  },
  {
    id: 5,
    title: 'Piano Recital Preparation',
    course: 'Guitar Fundamentals',
    due: 'June 26, 2026 at 5:00 PM',
    points: 25,
    status: 'Graded',
    statusColor: 'bg-green-100 text-green-600',
    priority: null,
    priorityColor: null,
    borderColor: 'border-2 border-gray-200',
    description: 'Prepare and record two pieces for evaluation.',
    buttonText: 'View Submission',
    buttonColor: 'bg-gray-200 text-black',
    grade: '23/25',
    gradeComment: 'Excellent performance! Work on tempo consistency in the second piece.'
  }
];

const stats = [
  { label: 'Pending', count: 2, color: 'text-red-500' },
  { label: 'In Progress', count: 1, color: 'text-yellow-500' },
  { label: 'Submitted', count: 1, color: 'text-blue-500' },
  { label: 'Graded', count: 1, color: 'text-green-500' }
];

export default function StudentAssignments() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Assignments" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
                  Assignments
                </h1>
                <p className="text-base text-black/60 font-ebrima pt-2">
                  Track and submit your assignments
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition">
                  Filter
                </button>
                <button className="px-4 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition">
                  Sort by Date
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white border border-black/10 rounded-2xl p-4">
                  <p className={`text-3xl font-bold font-ebrima ${stat.color}`}>{stat.count}</p>
                  <p className="text-sm text-black/60 font-ebrima">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Assignments List */}
            <div className="space-y-4 pt-8">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`p-6 rounded-2xl ${assignment.borderColor} ${
                    assignment.status === 'In Progress' || assignment.status === 'Not Started'
                      ? 'bg-yellow-50/30'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-black font-ebrima">{assignment.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${assignment.statusColor}`}>
                          {assignment.status}
                        </span>
                        {assignment.priority && (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${assignment.priorityColor}`}>
                            {assignment.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-black/60 font-ebrima pt-2">📚 {assignment.course}</p>
                      <p className="text-sm text-black/70 font-ebrima pt-1">{assignment.description}</p>
                      <div className="flex items-center gap-6 pt-3 text-sm text-black/60">
                        <span>📅 Due: {assignment.due}</span>
                        <span>⭐ {assignment.points} points</span>
                        {assignment.status === 'Submitted' && (
                          <span className="text-green-600">✅ Submitted on June 24, 2026</span>
                        )}
                        {assignment.status === 'Graded' && (
                          <span className="text-green-600">✅ Submitted on June 20, 2026</span>
                        )}
                      </div>
                      {assignment.grade && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm font-bold text-green-700">Grade: {assignment.grade}</p>
                          <p className="text-sm text-green-700">💬 {assignment.gradeComment}</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 min-w-[120px]">
                      <button className={`w-full px-6 py-2 ${assignment.buttonColor} text-white rounded-full text-sm font-bold hover:opacity-90 transition`}>
                        {assignment.buttonText}
                      </button>
                      {assignment.status !== 'Submitted' && assignment.status !== 'Graded' && (
                        <button className="w-full mt-2 px-6 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition">
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}