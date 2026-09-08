import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import CourseCard from './components/CourseCard';
import { getStudentCourses, getProgrammes, getEnrollments } from '../../lib/api';
import { getSession, isLoggedIn } from '../../lib/api';

export default function StudentCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [allProgrammes, setAllProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const session = getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    fetchCourses();
    
    // Set up real-time polling (every 30 seconds)
    const interval = setInterval(fetchCourses, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Fetch enrolled courses, all programmes, and enrollments
      const [enrolledCourses, programmes, enrollmentsData] = await Promise.all([
        getStudentCourses().catch(() => []),
        getProgrammes().catch(() => []),
        getEnrollments ? getEnrollments().catch(() => []) : []
      ]);
      
      setCourses(enrolledCourses || []);
      setAllProgrammes(programmes || []);
      setEnrollments(enrollmentsData || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress for a course
  const calculateProgress = (course) => {
    if (course.progress) return course.progress;
    if (course.percentage) return course.percentage;
    // If no progress data, calculate based on completed assignments
    if (course.assignments && course.assignments.length > 0) {
      const completed = course.assignments.filter(a => a.status === 'completed').length;
      return Math.round((completed / course.assignments.length) * 100);
    }
    return 0;
  };

  // Get color based on progress
  const getProgressColor = (progress) => {
    if (progress >= 80) return '#34A853';
    if (progress >= 50) return '#FBBC05';
    return '#EA4335';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="My Courses" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          <div className="bg-white rounded-3xl p-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-[36px] font-bold text-black font-ebrima leading-[54px]">
                  My Courses
                </h1>
                <p className="text-base text-black/60 font-ebrima pt-2">
                  You are currently enrolled in {courses.length} courses
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={fetchCourses}
                  className="px-4 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <span>🔄</span> Refresh
                </button>
                <button 
                  onClick={() => navigate('/programmes')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition"
                >
                  + Browse Courses
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
                <button 
                  onClick={fetchCourses}
                  className="ml-3 text-red-700 font-bold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Course Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <p className="text-2xl font-bold text-blue-600">{courses.length}</p>
                <p className="text-sm text-blue-600/70">Enrolled Courses</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                <p className="text-2xl font-bold text-green-600">
                  {courses.filter(c => calculateProgress(c) >= 80).length}
                </p>
                <p className="text-sm text-green-600/70">Completed</p>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
                <p className="text-2xl font-bold text-yellow-600">
                  {courses.filter(c => calculateProgress(c) >= 50 && calculateProgress(c) < 80).length}
                </p>
                <p className="text-sm text-yellow-600/70">In Progress</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <p className="text-2xl font-bold text-gray-600">
                  {courses.filter(c => calculateProgress(c) < 50).length}
                </p>
                <p className="text-sm text-gray-600/70">Not Started</p>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              {courses.length === 0 ? (
                <div className="col-span-2 text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-xl font-bold text-gray-600">No Courses Enrolled Yet</p>
                  <p className="text-gray-500 mt-2">Browse our course catalog and start learning today!</p>
                  <button 
                    onClick={() => navigate('/programmes')}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition"
                  >
                    Browse Available Courses
                  </button>
                </div>
              ) : (
                courses.map((course, index) => {
                  const progress = calculateProgress(course);
                  const progressColor = getProgressColor(progress);
                  
                  return (
                    <div 
                      key={course.id || index}
                      className="bg-white border border-black/10 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Course Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            {course.code || `Course ${index + 1}`}
                          </span>
                          <h3 className="text-xl font-bold text-black mt-2">{course.title}</h3>
                        </div>
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: course.color || getProgressColor(progress) }}
                        >
                          {progress}%
                        </div>
                      </div>

                      {/* Instructor */}
                      <p className="text-sm text-black/60 mt-2">
                        👨‍🏫 {course.instructor || 'Instructor TBA'}
                      </p>

                      {/* Progress Bar */}
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

                      {/* Course Details */}
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

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        <button 
                          onClick={() => navigate(`/student/courses/${course.id}`)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition"
                        >
                          Continue Learning
                        </button>
                        <button 
                          onClick={() => navigate(`/student/classes`)}
                          className="px-4 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Available Programmes Section */}
            {allProgrammes.length > 0 && (
              <div className="mt-8">
                <div className="bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] rounded-3xl p-8">
                  <h2 className="text-[28px] font-bold text-white font-ebrima leading-[42px]">
                    Explore More Courses
                  </h2>
                  <p className="text-white/80 text-base font-ebrima pt-2 pb-4">
                    Browse our full catalog of {allProgrammes.length} available courses
                  </p>
                  <button 
                    onClick={() => navigate('/programmes')}
                    className="px-6 py-3 bg-white rounded-full text-[#1A73E8] font-bold text-base font-ebrima hover:shadow-lg transition-shadow"
                  >
                    View Course Catalog
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}