// src/pages/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import CourseCard from './components/CourseCard';
import { getStudentCourses, getStudentProfile } from '../../lib/api';
import { getSession, isLoggedIn } from '../../lib/api';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const session = getSession();
    if (session) {
      setUser(session);
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch student courses
      const coursesData = await getStudentCourses();
      setCourses(coursesData || []);
      
      // Fetch student profile
      const profileData = await getStudentProfile();
      if (profileData) {
        setUser(prev => ({ ...prev, ...profileData }));
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Dashboard" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8 animate-fadeUp">
            <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px] animate-slideDown">
              Welcome Back, {user?.fullName || 'Student'}!
            </h1>
            <p className="text-base text-black/60 font-ebrima pt-2 animate-slideDown" style={{ animationDelay: "100ms" }}>
              You are currently enrolled in {courses.length} courses
            </p>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 pt-8">
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  <p className="text-xl">You're not enrolled in any courses yet.</p>
                  <button 
                    onClick={() => navigate('/programmes')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 animate-slideUp" style={{ animationDelay: "400ms" }}>
              <div className="bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] rounded-3xl p-8">
                <h2 className="text-[28px] font-bold text-white font-ebrima leading-[42px]">
                  Explore More Courses
                </h2>
                <p className="text-white/80 text-base font-ebrima pt-2 pb-4">
                  Browse our full catalog and register for new courses
                </p>
                <button 
                  onClick={() => navigate('/programmes')}
                  className="px-6 py-3 bg-white rounded-full text-[#1A73E8] font-bold text-base font-ebrima hover:shadow-lg transition-shadow"
                >
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