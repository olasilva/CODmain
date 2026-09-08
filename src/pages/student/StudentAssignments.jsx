// src/pages/student/StudentAssignments.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import { getAssignments, getStudentProfile } from '../../lib/api';
import { getSession, isLoggedIn } from '../../lib/api';

export default function StudentAssignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState({ submitted: [], pending: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    fetchAssignments();
  }, [navigate]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await getAssignments();
      setAssignments(data || { submitted: [], pending: [] });
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const allAssignments = [...(assignments.pending || []), ...(assignments.submitted || [])];
  const stats = {
    pending: assignments.pending?.filter(a => a.status === 'pending').length || 0,
    submitted: assignments.submitted?.filter(a => a.status === 'submitted').length || 0,
    graded: assignments.submitted?.filter(a => a.status === 'graded').length || 0,
    total: allAssignments.length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

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

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-8">
              <div className="bg-white border border-black/10 rounded-2xl p-4">
                <p className="text-3xl font-bold font-ebrima text-red-500">{stats.pending}</p>
                <p className="text-sm text-black/60 font-ebrima">Pending</p>
              </div>
              <div className="bg-white border border-black/10 rounded-2xl p-4">
                <p className="text-3xl font-bold font-ebrima text-yellow-500">{stats.submitted}</p>
                <p className="text-sm text-black/60 font-ebrima">Submitted</p>
              </div>
              <div className="bg-white border border-black/10 rounded-2xl p-4">
                <p className="text-3xl font-bold font-ebrima text-green-500">{stats.graded}</p>
                <p className="text-sm text-black/60 font-ebrima">Graded</p>
              </div>
              <div className="bg-white border border-black/10 rounded-2xl p-4">
                <p className="text-3xl font-bold font-ebrima text-blue-500">{stats.total}</p>
                <p className="text-sm text-black/60 font-ebrima">Total</p>
              </div>
            </div>

            {/* Assignments List */}
            <div className="space-y-4 pt-8">
              {allAssignments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-xl">No assignments found.</p>
                  <p className="text-sm mt-2">Check back later for new assignments.</p>
                </div>
              ) : (
                allAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`p-6 rounded-2xl border-2 ${
                      assignment.status === 'pending' ? 'border-yellow-300 bg-yellow-50/30' :
                      assignment.status === 'submitted' ? 'border-blue-200 bg-blue-50/30' :
                      assignment.status === 'graded' ? 'border-green-200 bg-green-50/30' :
                      'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-bold text-black font-ebrima">{assignment.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            assignment.status === 'pending' ? 'bg-red-100 text-red-600' :
                            assignment.status === 'submitted' ? 'bg-blue-100 text-blue-600' :
                            assignment.status === 'graded' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {assignment.status || 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-black/60 font-ebrima pt-2">📚 {assignment.course || 'General'}</p>
                        <p className="text-sm text-black/70 font-ebrima pt-1">{assignment.description || 'No description available'}</p>
                        <div className="flex items-center gap-6 pt-3 text-sm text-black/60 flex-wrap">
                          <span>📅 Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}</span>
                          <span>⭐ {assignment.max_score || 0} points</span>
                          {assignment.status === 'submitted' && (
                            <span className="text-green-600">✅ Submitted</span>
                          )}
                          {assignment.status === 'graded' && (
                            <span className="text-green-600">✅ Grade: {assignment.score}/{assignment.max_score}</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 min-w-[120px]">
                        {assignment.status === 'pending' && (
                          <button 
                            onClick={() => navigate(`/student/assignments/${assignment.id}/submit`)}
                            className="w-full px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition"
                          >
                            Submit
                          </button>
                        )}
                        {assignment.status === 'submitted' && (
                          <button className="w-full px-6 py-2 bg-gray-200 text-black rounded-full text-sm font-bold hover:bg-gray-300 transition">
                            View Submission
                          </button>
                        )}
                        {assignment.status === 'graded' && (
                          <button className="w-full px-6 py-2 bg-green-600 text-white rounded-full text-sm font-bold hover:bg-green-700 transition">
                            View Feedback
                          </button>
                        )}
                        <button className="w-full mt-2 px-6 py-2 border border-black/20 rounded-full text-sm font-bold hover:bg-gray-50 transition">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}