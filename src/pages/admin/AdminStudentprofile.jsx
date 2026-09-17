// src/pages/admin/AdminStudentprofile.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStudentById } from '../../lib/api';
import useFetch from '../../lib/useFetch';

export default function AdminStudentProfile() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useFetch(
    () => getStudentById(studentId),
    [studentId],
    { initialData: null }
  );

  const student = data?.student || null;
  const payments = data?.payments || [];
  const admissions = data?.admissions || [];
  const reportCards = data?.reportCards || [];
  const classes = data?.classes || [];

  if (loading) {
    return (
      <div className="max-w-[1140px] mx-auto py-12 text-center text-black/50">
        Loading student profile…
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="max-w-[1140px] mx-auto py-12 text-center">
        <p className="text-red-600 mb-4">{error || 'Student not found'}</p>
        <Link to="/admin/students" className="text-[#1A73E8] font-bold">
          ← Back to Students
        </Link>
      </div>
    );
  }

  const photoUrl =
    student.photo_url || student.user?.avatar_url || null;

  const latestPayment = payments[0];
  const latestAdmission = admissions[0];
  const submittedCount = reportCards.filter(
    (r) => r.status === 'submitted'
  ).length;

  return (
    <div className="max-w-[1140px] mx-auto">
      {/* Back */}
      <Link
        to="/admin/students"
        className="inline-flex items-center gap-2 text-[#1A73E8] font-bold mb-6 text-sm"
      >
        ← Back to Students
      </Link>

      {/* ─── Profile Header ─── */}
      <div className="bg-white rounded-2xl border border-black/10 p-6 flex flex-wrap items-center gap-6 mb-6">
        {/* Photo / Initial */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center text-3xl font-bold text-[#1A73E8] shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={student.full_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            (student.full_name || '?').charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-[200px]">
          <h1 className="text-2xl font-bold text-black font-ebrima">
            {student.full_name || 'Unnamed Student'}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
            <span className="text-[#1A73E8] font-bold font-mono">
              {student.student_id}
            </span>
            <span className="text-black/40">•</span>
            <span className="text-black/60">{student.user?.email}</span>
            {student.academic_year && (
              <>
                <span className="text-black/40">•</span>
                <span className="text-black/60">{student.academic_year}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              navigate(`/admin/students/${student.id}/results`)
            }
            className="px-5 py-3 bg-[#1A73E8] text-white text-sm font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            Generate Report Card
          </button>
        </div>
      </div>

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          label="Payment Status"
          value={latestPayment?.status || 'none'}
          valueColor={
            latestPayment?.status === 'completed'
              ? 'text-green-600'
              : latestPayment?.status === 'pending'
              ? 'text-yellow-600'
              : 'text-red-500'
          }
        />
        <SummaryCard
          label="Total Paid"
          value={`₦${payments
            .filter((p) => p.status === 'completed')
            .reduce((s, p) => s + Number(p.amount || 0), 0)
            .toLocaleString()}`}
          valueColor="text-[#1A73E8]"
        />
        <SummaryCard
          label="Programme"
          value={
            latestAdmission?.course ? `${latestAdmission.course}` : 'Not set'
          }
          valueColor="text-black"
        />
        <SummaryCard
          label="Report Cards"
          value={`${submittedCount} / ${reportCards.length}`}
          valueColor="text-black"
        />
      </div>

      {/* ─── Classes & Teachers ─── */}
      {classes.length > 0 && (
        <Section title="Enrolled Classes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {classes.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-4 border border-black/10 rounded-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1A73E8] flex items-center justify-center text-sm font-bold">
                  {(c.title || c.subject || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-black text-sm truncate">
                    {c.title || c.subject || 'Class'}
                  </div>
                  {c.instructor && (
                    <div className="text-xs text-black/50">
                      Teacher: {c.instructor.full_name || '—'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ─── Admission ─── */}
      <Section title="Programme & Admission">
        {admissions.length === 0 ? (
          <Empty text="No admission records yet." />
        ) : (
          <div className="space-y-3">
            {admissions.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-4 border border-black/10 rounded-xl"
              >
                <div>
                  <div className="font-bold text-black">
                    {a.course} · {a.track_name}
                  </div>
                  <div className="text-xs text-black/50 mt-0.5">
                    {a.academic_year} · Applied{' '}
                    {new Date(a.created_at).toLocaleDateString('en-NG')}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    a.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : a.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ─── Payments ─── */}
      <Section title="Payments">
        {payments.length === 0 ? (
          <Empty text="No payments recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F9FA] border-y border-black/10">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-bold text-black/55">
                    Reference
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-bold text-black/55">
                    Description
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-bold text-black/55">
                    Amount
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-bold text-black/55">
                    Status
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-bold text-black/55">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-black/5">
                    <td className="py-2.5 px-4 font-mono text-xs text-black/70">
                      {p.reference || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-sm text-black/70">
                      {p.description || p.plan || '—'}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-sm">
                      ₦{Number(p.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          p.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : p.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-black/60">
                      {new Date(p.created_at).toLocaleDateString('en-NG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* ─── Report Cards ─── */}
      <Section title="Report Cards">
        {reportCards.length === 0 ? (
          <Empty text="No report cards yet. Click 'Generate Report Card' above to create one." />
        ) : (
          <div className="space-y-2">
            {reportCards.map((rc) => (
              <Link
                key={rc.id}
                to={`/admin/students/${student.id}/results?session=${encodeURIComponent(
                  rc.session
                )}&term=${encodeURIComponent(rc.term)}`}
                className="flex items-center justify-between p-4 border border-black/10 rounded-xl hover:bg-blue-50 transition"
              >
                <div>
                  <div className="font-bold text-black flex items-center gap-2">
                    {rc.session} · {rc.term}
                    {rc.status === 'submitted' ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">
                        ✓ Submitted
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-black/50 mt-0.5">
                    {rc.overall_percentage != null
                      ? `${rc.overall_percentage}% · Grade ${rc.overall_grade || '—'}`
                      : 'No scores yet'}
                  </div>
                </div>
                <span className="text-[#1A73E8] font-bold text-sm">
                  View →
                </span>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

// ─── helpers ───
function SummaryCard({ label, value, valueColor = 'text-black' }) {
  return (
    <div className="bg-white rounded-2xl border border-black/10 p-5">
      <p className="text-xs text-black/55 uppercase tracking-wide font-bold mb-1">
        {label}
      </p>
      <p className={`text-xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-black/10 p-6 mb-6">
      <h2 className="text-lg font-bold text-black/80 font-ebrima mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="text-center py-6 text-black/50 text-sm">{text}</div>
  );
}