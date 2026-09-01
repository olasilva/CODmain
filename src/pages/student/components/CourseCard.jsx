// src/pages/student/components/CourseCard.jsx
import React from 'react';

export default function CourseCard({ course, index = 0 }) {
  return (
    <div className="bg-white rounded-3xl border border-black/10 p-6 hover:shadow-lg transition-shadow animate-scaleIn" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Course Header */}
      <div className="flex justify-between items-start animate-slideDown">
        <div>
          <p className="text-sm text-black/50 font-sf-compact">
            {course.code}
          </p>
          <h3 className="text-2xl font-bold text-black font-ebrima leading-[36px] pt-1">
            {course.title}
          </h3>
          <p className="text-sm text-black/60 font-ebrima pt-1">
            {course.instructor}
          </p>
        </div>
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base animate-fadeIn"
          style={{ backgroundColor: course.color, animationDelay: `${index * 100 + 100}ms` }}
        >
          {course.assignments}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="pt-4 animate-slideUp" style={{ animationDelay: `${index * 100 + 150}ms` }}>
        <div className="flex justify-between items-center">
          <span className="text-sm text-black/60 font-ebrima">Course Progress</span>
          <span className="text-sm font-bold text-black font-ebrima">{course.progress}%</span>
        </div>
        <div className="w-full h-2 bg-black/10 rounded-full mt-2">
          <div 
            className="h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${course.progress}%`,
              backgroundColor: course.color 
            }}
          />
        </div>
      </div>

      {/* Next Class */}
      <div className="mt-4 p-3 bg-black/5 rounded-[15px] flex justify-between items-center animate-slideUp" style={{ animationDelay: `${index * 100 + 200}ms` }}>
        <span className="text-sm text-black/60 font-ebrima">Next Class:</span>
        <span className="text-sm font-bold text-black font-ebrima">{course.nextClass}</span>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3">
        <button className="flex-1 py-2.5 bg-[#1A73E8] rounded-full text-white font-bold text-sm font-ebrima hover:opacity-90 transition animate-slideUp" style={{ animationDelay: `${index * 100 + 250}ms` }}>
          View Materials
        </button>
        <button className="flex-1 py-2.5 border border-black/20 rounded-full text-black font-bold text-sm font-ebrima hover:bg-gray-50 transition animate-slideUp" style={{ animationDelay: `${index * 100 + 300}ms` }}>
          Course Details
        </button>
      </div>
    </div>
  );
}