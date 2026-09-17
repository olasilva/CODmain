// src/pages/staff/StaffGrading.jsx
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getStaffStudents,
  getStaffStudentDetails,
  submitStudentScores,
  submitStudentResults,
} from '../../lib/api';
import useFetch from '../../lib/useFetch';

const SUBJECTS = [
  'Mathematics', 'English Language', 'Basic Science', 'Social Studies',
  'C.R.S', 'C.C.A', 'P.H.E', 'French', 'Music', 'Basic Tech',
  'Information Tech', 'Home Economics', 'Civic Education', 'Handwriting',
];

export default function StaffGrading() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [studentId, setStudentId] = useState(searchParams.get('student') || '');
  const [session, setSession] = useState('2024/2025');
  const [term, setTerm] = useState('Third Term');

  const { data: studentsData } = useFetch(getStaffStudents, [], {
    initialData: { students: [] },
  });
  const students = studentsData?.students || [];

  const { data: detail, loading, refetch } = useFetch(
    () => (studentId ? getStaffStudentDetails(studentId) : Promise.resolve(null)),
    [studentId],
    { initialData: null, skip: !studentId }
  );

  const activeCard = detail?.reportCards?.find(
    (r) => r.session === session && r.term === term
  ) || null;

  const [form, setForm] = useState({
    subject: SUBJECTS[0],
    ca1: '',
    ca2: '',
    exam: '',
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSelectStudent = (id) => {
    setStudentId(id);
    setSearchParams({ student: id });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!studentId) return;
    setSaving(true);
    setSavedMsg('');
    try {
      await submitStudentScores(studentId, {
        session, term, subject: form.subject,
        ca1: Number(form.ca1) || 0,
        ca2: Number(form.ca2) || 0,
        exam: Number(form.exam) || 0,
      });
      setForm({ subject: form.subject, ca1: '', ca2: '', exam: '' });
      setSavedMsg(`✅ ${form.subject} saved`);
      refetch();
      setTimeout(() => setSavedMsg(''), 2500);
    } catch (err) {
      setSavedMsg(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitResults = async () => {
    if (!studentId) return;
    if (!window.confirm(`Submit ${session} · ${term} results to admin?`)) return;
    try {
      await submitStudentResults(studentId, { session, term });
      alert('Results submitted to admin!');
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const subjects = activeCard?.subjects || [];
  const total = (Number(form.ca1) || 0) + (Number(form.ca2) || 0) + (Number(form.exam) || 0);

  return (
    <div className="max-w-[1140px] mx-auto">
      <h1 className="text-[32px] font-bold text-black font-ebrima mb-6">
        Enter Results
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-black/10 p-5 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">Student</label>
          <select
            value={studentId}
            onChange={(e) => handleSelectStudent(e.target.value)}
            className="w-full h-11 px-3 border border-black/15 rounded-xl text-sm"
          >
            <option value="">Select student…</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.student_id})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">Session</label>
          <input value={session} onChange={(e) => setSession(e.target.value)}
            className="w-full h-11 px-3 border border-black/15 rounded-xl text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">Term</label>
          <select value={term} onChange={(e) => setTerm(e.target.value)}
            className="w-full h-11 px-3 border border-black/15 rounded-xl text-sm">
            <option>First Term</option>
            <option>Second Term</option>
            <option>Third Term</option>
          </select>
        </div>
      </div>

      {!studentId && (
        <div className="bg-white rounded-2xl border border-black/10 p-12 text-center text-black/50">
          Select a student to begin entering scores.
        </div>
      )}

      {studentId && (
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          {/* Entry form */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-black/10 p-5 space-y-3">
            <h2 className="text-lg font-bold text-black mb-2">Add / Update Score</h2>

            <div>
              <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">Subject</label>
              <select value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                className="w-full h-11 px-3 border border-black/15 rounded-xl text-sm">
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">1st CA</label>
                <input type="number" min="0" max="20" value={form.ca1}
                  onChange={(e) => setForm((f) => ({ ...f, ca1: e.target.value }))}
                  className="w-full h-11 px-3 border border-black/15 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">2nd CA</label>
                <input type="number" min="0" max="20" value={form.ca2}
                  onChange={(e) => setForm((f) => ({ ...f, ca2: e.target.value }))}
                  className="w-full h-11 px-3 border border-black/15 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">Exam</label>
                <input type="number" min="0" max="60" value={form.exam}
                  onChange={(e) => setForm((f) => ({ ...f, exam: e.target.value }))}
                  className="w-full h-11 px-3 border border-black/15 rounded-xl text-sm" />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm">
              <div className="flex justify-between"><span>Total</span><span className="font-bold text-[#1A73E8]">{total} / 100</span></div>
            </div>

            <button type="submit" disabled={saving}
              className="w-full h-11 bg-[#1A73E8] text-white rounded-xl font-bold text-sm disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Score'}
            </button>

            {savedMsg && <div className="text-sm text-center">{savedMsg}</div>}

            {subjects.length > 0 && (
              <button type="button" onClick={handleSubmitResults}
                className="w-full h-11 border-2 border-green-500 text-green-600 rounded-xl font-bold text-sm hover:bg-green-50">
                Submit All to Admin
              </button>
            )}
          </form>

          {/* Current scores */}
          <div className="bg-white rounded-2xl border border-black/10 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-black">{session} · {term}</h2>
              {activeCard?.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeCard.status === 'submitted'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {activeCard.status === 'submitted' ? 'Submitted' : 'Draft'}
                </span>
              )}
            </div>

            {loading && <div className="text-center text-black/40 py-6">Loading…</div>}

            {!loading && subjects.length === 0 && (
              <div className="text-center text-black/40 py-12">
                No scores entered yet for this term.
              </div>
            )}

            {!loading && subjects.length > 0 && (
              <>
                <table className="w-full text-sm">
                  <thead className="border-b border-black/10">
                    <tr className="text-xs font-bold text-black/55 uppercase">
                      <th className="text-left py-2">Subject</th>
                      <th className="text-center py-2">CA1</th>
                      <th className="text-center py-2">CA2</th>
                      <th className="text-center py-2">Exam</th>
                      <th className="text-center py-2">Total</th>
                      <th className="text-center py-2">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                        <td className="py-2 font-bold">{s.subject}</td>
                        <td className="py-2 text-center">{s.ca1}</td>
                        <td className="py-2 text-center">{s.ca2}</td>
                        <td className="py-2 text-center">{s.exam}</td>
                        <td className="py-2 text-center font-bold">{s.total}</td>
                        <td className="py-2 text-center">
                          <span className="px-2 py-0.5 bg-blue-100 text-[#1A73E8] rounded text-xs font-bold">
                            {s.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 p-3 bg-[#F8FAFC] rounded-xl flex items-center justify-between text-sm">
                  <span className="text-black/60">Overall: {activeCard?.overall_total} / {activeCard?.total_obtainable}</span>
                  <span className="font-bold text-[#1A73E8]">
                    {activeCard?.overall_percentage}% · {activeCard?.overall_grade}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}