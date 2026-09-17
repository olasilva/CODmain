// src/pages/admin/AdminStudents.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStudents, deleteAdminStudent } from '../../lib/api';
import useFetch from '../../lib/useFetch';

export default function AdminStudents() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [payFilter, setPayFilter] = useState('all');

  const { data, loading, error, refetch } = useFetch(
    () => getAdminStudents({ page, limit: 20, search }),
    [page, search],
    { initialData: { students: [], pagination: {} } }
  );

  const allStudents = data?.students || [];
  const pagination = data?.pagination || {};

  // Client-side filters
  const students = allStudents.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (payFilter !== 'all' && s.payment_status !== payFilter) return false;
    return true;
  });

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await deleteAdminStudent(id);
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const payBadge = (status) => {
    const map = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
      none: 'bg-gray-100 text-gray-500',
    };
    return map[status] || map.none;
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-black font-ebrima">
            Students
          </h1>
          <p className="text-sm text-black/50 mt-1">
            {pagination.total || 0} total · {students.length} shown
          </p>
        </div>
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 mb-4">
        <div className="bg-white rounded-xl border border-black/15 px-4 py-3 flex items-center gap-3">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, ID or programme…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 outline-none bg-transparent text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-black/15 rounded-xl text-sm font-bold text-black/70"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={payFilter}
          onChange={(e) => setPayFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-black/15 rounded-xl text-sm font-bold text-black/70"
        >
          <option value="all">All payments</option>
          <option value="completed">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="none">No payment</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-black/10">
              <tr>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Student</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">ID</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Programme</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Teacher</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Payment</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Results</th>
                <th className="text-right py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-black/50">
                    Loading students…
                  </td>
                </tr>
              )}
              {!loading && students.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-black/50">
                    No students found.
                  </td>
                </tr>
              )}
              {!loading &&
                students.map((s, i) => {
                  const primaryTeacher = s.instructors?.[0];
                  const hasSubmitted = (s.reportCards?.submitted || 0) > 0;
                  const rcTotal = s.reportCards?.total || 0;

                  return (
                    <tr
                      key={s.id}
                      className={`border-b border-black/5 hover:bg-blue-50/40 cursor-pointer ${
                        i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                      }`}
                      onClick={() => navigate(`/admin/students/${s.id}`)}
                    >
                      {/* Student */}
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold text-sm">
                            {(s.fullName || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-black text-sm">
                              {s.fullName || 'Unnamed'}
                            </div>
                            <div className="text-xs text-black/50">
                              {s.email || '—'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ID */}
                      <td className="py-3 px-5">
                        <span className="font-mono text-xs text-[#1A73E8] font-bold">
                          {s.student_id || '—'}
                        </span>
                      </td>

                      {/* Programme */}
                      <td className="py-3 px-5 text-sm text-black/70">
                        {s.programme || (
                          <span className="text-black/30 italic">not set</span>
                        )}
                      </td>

                      {/* Teacher */}
                      <td className="py-3 px-5">
                        {primaryTeacher ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                              {(primaryTeacher.full_name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-black">
                                {primaryTeacher.full_name}
                              </div>
                              {s.instructors.length > 1 && (
                                <div className="text-[10px] text-black/40">
                                  +{s.instructors.length - 1} more
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-black/30 italic">Not assigned</span>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="py-3 px-5">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold w-fit ${payBadge(
                              s.payment_status
                            )}`}
                          >
                            {s.payment_status}
                          </span>
                          {s.payment_amount > 0 && (
                            <span className="text-xs text-black/60 font-bold">
                              ₦{Number(s.payment_amount).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Results */}
                      <td className="py-3 px-5">
                        {rcTotal === 0 ? (
                          <span className="text-xs text-black/30 italic">None</span>
                        ) : hasSubmitted ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            ✓ {s.reportCards.submitted} submitted
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                            {rcTotal} draft
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {/* Generate / View Report Card */}
                          <button
                            onClick={() => navigate(`/admin/students/${s.id}/results`)}
                            className="p-2 rounded-lg hover:bg-green-50 text-green-600"
                            title="Generate / View Report Card"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                            </svg>
                          </button>

                          {/* View profile */}
                          <button
                            onClick={() => navigate(`/admin/students/${s.id}`)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-[#1A73E8]"
                            title="View profile"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(s.id, s.fullName)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-black/15 rounded-lg text-sm font-bold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-black/60">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 border border-black/15 rounded-lg text-sm font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}