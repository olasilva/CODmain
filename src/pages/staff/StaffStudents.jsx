// src/pages/staff/StaffStudents.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStaffStudents } from '../../lib/api';
import useFetch from '../../lib/useFetch';

export default function StaffStudents() {
  const [search, setSearch] = useState('');

  const { data, loading, error } = useFetch(
    () => getStaffStudents({ search }),
    [search],
    { initialData: { students: [] } }
  );

  const students = data?.students || [];

  return (
    <div className="max-w-[1140px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-black font-ebrima">My Students</h1>
        <div className="text-sm text-black/50">{students.length} student{students.length === 1 ? '' : 's'}</div>
      </div>

      <div className="bg-white rounded-xl border border-black/15 px-4 py-3 flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F8F9FA] border-b border-black/10">
            <tr>
              <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Student</th>
              <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">ID</th>
              <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Classes</th>
              <th className="text-right py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="py-10 text-center text-black/50">Loading…</td></tr>}
            {!loading && students.length === 0 && (
              <tr><td colSpan={4} className="py-10 text-center text-black/50">No students assigned to you yet.</td></tr>
            )}
            {!loading && students.map((s, i) => (
              <tr key={s.id} className={`border-b border-black/5 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold text-sm">
                      {(s.fullName || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-black text-sm">{s.fullName}</div>
                      <div className="text-xs text-black/50">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5 font-mono text-xs text-[#1A73E8] font-bold">{s.student_id}</td>
                <td className="py-3 px-5">
                  <div className="flex flex-wrap gap-1">
                    {s.classes.map((c) => (
                      <span key={c.id} className="px-2 py-0.5 bg-blue-50 text-[#1A73E8] rounded text-xs font-bold">
                        {c.title || c.subject}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/staff/students/${s.id}`} className="px-3 py-1.5 text-xs font-bold text-[#1A73E8] hover:bg-blue-50 rounded-lg">View</Link>
                    <Link to={`/staff/grading?student=${s.id}`} className="px-3 py-1.5 text-xs font-bold text-green-600 hover:bg-green-50 rounded-lg">Enter Scores</Link>
                    <Link to={`/staff/messages?student=${s.id}`} className="px-3 py-1.5 text-xs font-bold text-purple-600 hover:bg-purple-50 rounded-lg">Chat</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}