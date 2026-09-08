import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CourseCard({ course, index }) {
  const navigate = useNavigate();
  
  // Calculate progress if not provided
  const progress = course.progress || course.percentage || 0;
  const progressColor = progress >= 80 ? '#34A853' : progress >= 50 ? '#FBBC05' : '#EA4335';
  
  return (
    <div 
      className="bg-white rounded-2xl border border-black/10 p-6 hover:shadow-lg transition-shadow animate-slideUp"
      style={{ animationDelay: `${(index || 0) * 100}ms` }}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            {course.code || `Course ${(index || 0) + 1}`}
          </span>
          <h3 className="text-xl font-bold text-black font-ebrima mt-2">{course.title}</h3>
        </div>
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: course.color || progressColor }}
        >
          {progress}%
        </div>
      </div>
      
      <p className="text-sm text-black/60 font-ebrima mt-2">
        👨‍🏫 {course.instructor || 'Instructor TBA'}
      </p>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm text-black/60">
          <span>Progress</span>
          <span className="font-bold" style={{ color: progressColor }}>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-black/10 rounded-full mt-1 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-1000"
            style={{
              width: `${progress}%`,
              backgroundColor: progressColor
            }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-black/5">
        <div>
          <p className="text-xs text-black/40">Next Class</p>
          <p className="text-sm font-semibold text-black">
            {course.nextClass || 'TBD'}
          </p>
        </div>
        <div>
          <p className="text-xs text-black/40">Assignments</p>
          <p className="text-sm font-semibold text-black">
            {course.assignments || 0} pending
          </p>
        </div>
      </div>
      
      <div className="flex gap-3 mt-4">
        <button 
          onClick={() => navigate(`/student/courses/${course.id}`)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition"
        >
          Continue Learning
        </button>
        <button 
          onClick={() => navigate('/student/classes')}
          className="px-4 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition"
        >
          Details
        </button>
      </div>
    </div>
  );
}