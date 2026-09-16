// src/pages/admin/AdminStudentResults.jsx
import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getStudentById, getStudentReportCards } from '../../lib/api';
import ResultSheet from './components/ResultSheet';

export default function AdminStudentResults() {
  const { studentId: routeStudentId } = useParams();
  const [searchParams] = useSearchParams();
  const studentId = routeStudentId || '';

  const [student, setStudent] = useState(null);
  const [reportCards, setReportCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('report');

  useEffect(() => {
    if (!studentId) {
      setError('No student selected');
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError('');
      try {
        const [studentRes, cardsRes] = await Promise.all([
          getStudentById(studentId),
          getStudentReportCards(studentId),
        ]);
        if (cancelled) return;

        setStudent(studentRes?.student || null);
        const list = cardsRes?.reportCards || [];
        setReportCards(list);

        const sessionFromUrl = searchParams.get('session');
        const termFromUrl = searchParams.get('term');
        const match =
          list.find((r) => r.session === sessionFromUrl && r.term === termFromUrl) ||
          list[0];
        setSelectedCardId(match?.id || null);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load results');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const activeCard = reportCards.find((r) => r.id === selectedCardId) || null;
  const subjects = activeCard?.subjects || [];

  const avgScore =
    subjects.length > 0
      ? Math.round(
          subjects.reduce((s, r) => s + Number(r.total || 0), 0) / subjects.length
        )
      : null;

  return (
    <div className="max-w-[1140px] mx-auto">
      <Link
        to="/admin/students"
        className="inline-flex items-center gap-2 text-[#1A73E8] font-bold mb-6 text-sm print:hidden"
      >
        ← Back to Students
      </Link>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm print:hidden">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl border border-black/10 p-12 text-center text-black/50">
          Loading results…
        </div>
      )}

      {!loading && student && (
        <>
          {/* Header */}
          <div className="bg-white rounded-2xl border border-black/10 p-6 flex items-center gap-6 mb-6 print:hidden">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-2xl font-bold text-[#1A73E8]">
              {(student.full_name || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-black font-ebrima">
                {student.full_name}
              </h1>
              <div className="flex items-center gap-3 mt-1 text-sm">
                <span className="text-[#1A73E8] font-bold font-mono">
                  {student.student_id}
                </span>
                <span className="text-black/40">•</span>
                <span className="text-black/60">{student.user?.email}</span>
              </div>
            </div>
          </div>

          {reportCards.length === 0 && (
            <div className="bg-white rounded-2xl border border-black/10 p-12 text-center">
              <p className="text-lg font-bold text-black/70 mb-1">
                No report cards yet
              </p>
              <p className="text-sm text-black/50">
                Once a report card is uploaded for this student, it will appear here.
              </p>
            </div>
          )}

          {reportCards.length > 0 && (
            <>
              <div className="bg-white rounded-2xl border border-black/10 p-4 mb-6 flex flex-wrap items-center gap-3 print:hidden">
                <label className="text-sm font-bold text-black/60">Term:</label>
                <select
                  value={selectedCardId || ''}
                  onChange={(e) => setSelectedCardId(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-black/15 rounded-xl text-sm font-bold text-black focus:outline-none focus:border-[#1A73E8]"
                >
                  {reportCards.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.session} · {r.term}
                    </option>
                  ))}
                </select>

                {activeCard && (
                  <div className="flex items-center gap-4 ml-auto text-right">
                    <div>
                      <p className="text-xs text-black/50">Overall %</p>
                      <p className="text-lg font-bold text-[#1A73E8]">
                        {activeCard.overall_percentage != null
                          ? `${activeCard.overall_percentage}%`
                          : avgScore != null
                          ? `${avgScore}%`
                          : '—'}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-black/10" />
                    <div>
                      <p className="text-xs text-black/50">Grade</p>
                      <p className="text-lg font-bold text-black">
                        {activeCard.overall_grade || '—'}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-black/10" />
                    <div>
                      <p className="text-xs text-black/50">Subjects</p>
                      <p className="text-lg font-bold text-black">
                        {subjects.length}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center bg-[#F3F4F6] rounded-xl p-1">
                  <button
                    onClick={() => setView('report')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                      view === 'report'
                        ? 'bg-white text-[#1A73E8] shadow-sm'
                        : 'text-black/50'
                    }`}
                  >
                    Report Card
                  </button>
                  <button
                    onClick={() => setView('table')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                      view === 'table'
                        ? 'bg-white text-[#1A73E8] shadow-sm'
                        : 'text-black/50'
                    }`}
                  >
                    Table
                  </button>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-[#1A73E8] text-white text-sm font-bold rounded-xl hover:bg-blue-700"
                >
                  Print / PDF
                </button>
              </div>

              {view === 'report' && activeCard && (
                <div className="bg-white rounded-2xl border border-black/10 p-6 print:border-0 print:p-0">
                  <ResultSheet data={activeCard} />
                </div>
              )}

              {view === 'table' && activeCard && (
                <div className="bg-white rounded-2xl border border-black/10 overflow-hidden print:hidden">
                  <table className="w-full">
                    <thead className="bg-[#F8F9FA] border-b border-black/10">
                      <tr>
                        <th className="text-left py-3 px-5 text-xs font-bold text-black/55 uppercase">Subject</th>
                        <th className="text-center py-3 px-3 text-xs font-bold text-black/55 uppercase">1st CA</th>
                        <th className="text-center py-3 px-3 text-xs font-bold text-black/55 uppercase">2nd CA</th>
                        <th className="text-center py-3 px-3 text-xs font-bold text-black/55 uppercase">Exam</th>
                        <th className="text-center py-3 px-3 text-xs font-bold text-black/55 uppercase">Total</th>
                        <th className="text-center py-3 px-3 text-xs font-bold text-black/55 uppercase">Grade</th>
                        <th className="text-left py-3 px-5 text-xs font-bold text-black/55 uppercase">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((s, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                          <td className="py-3 px-5 font-bold text-black text-sm">{s.subject}</td>
                          <td className="py-3 px-3 text-center text-black/70 text-sm">{s.ca1 ?? '—'}</td>
                          <td className="py-3 px-3 text-center text-black/70 text-sm">{s.ca2 ?? '—'}</td>
                          <td className="py-3 px-3 text-center text-black/70 text-sm">{s.exam ?? '—'}</td>
                          <td className="py-3 px-3 text-center font-bold text-black text-sm">{s.total ?? '—'}</td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                s.grade === 'A'
                                  ? 'bg-green-100 text-green-600'
                                  : s.grade?.startsWith('B')
                                  ? 'bg-blue-100 text-[#1A73E8]'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {s.grade || '—'}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-black/60 italic text-sm">{s.remark || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          main, main * { visibility: visible; }
          main {
            position: absolute !important;
            left: 0; top: 0;
            width: 100%;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}