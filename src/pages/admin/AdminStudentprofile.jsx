// src/pages/admin/AdminStudentprofile.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getStudentById,
  getStudentIdCardRequests,
  updateStudentId,
  approveStudentIdCardRequest,
} from '../../lib/api';
import useFetch from '../../lib/useFetch';

const ID_CARD_APP_URL = 'https://clanofdavid-certificate.vercel.app';

export default function AdminStudentProfile() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useFetch(
    () => getStudentById(studentId),
    [studentId],
    { initialData: null }
  );
  const {
    data: idCardData,
    loading: idCardLoading,
    error: idCardLoadError,
    refetch: refetchIdCardRequests,
  } = useFetch(
    () => getStudentIdCardRequests(studentId),
    [studentId],
    { initialData: { requests: [] } }
  );
  const [editingStudentId, setEditingStudentId] = useState(false);
  const [studentIdDraft, setStudentIdDraft] = useState('');
  const [savingStudentId, setSavingStudentId] = useState(false);
  const [approvingRequestId, setApprovingRequestId] = useState(null);
  const [idCardActionError, setIdCardActionError] = useState('');
  const [idCardActionSuccess, setIdCardActionSuccess] = useState('');

  useEffect(() => {
    if (data?.student?.student_id) {
      setStudentIdDraft(data.student.student_id);
    }
  }, [data?.student?.student_id]);

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
  const idCardRequests = Array.isArray(idCardData)
    ? idCardData
    : idCardData?.requests || [];
  const isMusicStudent = [
    student.programme,
    latestAdmission?.track_name,
    latestAdmission?.course,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes('music');
  const studentIdPattern = isMusicStudent
    ? /^COD-2026-\d{3}$/
    : /^COD-2026\/2027-\d{4}$/;
  const expectedIdFormat = isMusicStudent
    ? 'COD-2026-001'
    : 'COD-2026/2027-0001';

  const handleSaveStudentId = async (event) => {
    event.preventDefault();
    const nextId = studentIdDraft.trim().toUpperCase();
    if (!studentIdPattern.test(nextId)) {
      setIdCardActionError(`Use this format: ${expectedIdFormat}`);
      return;
    }

    setSavingStudentId(true);
    setIdCardActionError('');
    setIdCardActionSuccess('');
    try {
      await updateStudentId(student.id, nextId);
      setIdCardActionSuccess('Student ID updated. A notification should be sent to the student.');
      setEditingStudentId(false);
      refetch();
    } catch (updateError) {
      setIdCardActionError(updateError.message || 'Could not update the student ID.');
    } finally {
      setSavingStudentId(false);
    }
  };

  const handleGenerateIdCard = async (request) => {
    setApprovingRequestId(request.id);
    setIdCardActionError('');
    setIdCardActionSuccess('');
    try {
      const result = await approveStudentIdCardRequest(
        student.id,
        request.id,
        isMusicStudent ? 'music' : 'regular'
      );
      const updatedStudent = result?.student || result?.data?.student || {};
      const assignedId =
        updatedStudent.student_id || result?.student_id || result?.studentId || student.student_id;
      if (!assignedId) {
        throw new Error('The server did not return the generated student ID.');
      }
      setIdCardActionSuccess('ID card approved and student ID generated. Redirecting…');
      const query = new URLSearchParams({
        studentId: assignedId,
        studentName: student.full_name || '',
      });
      window.location.assign(`${ID_CARD_APP_URL}/?${query.toString()}`);
    } catch (approveError) {
      setIdCardActionError(approveError.message || 'Could not generate this student ID card.');
      refetchIdCardRequests();
    } finally {
      setApprovingRequestId(null);
    }
  };
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

      {(idCardActionError || idCardActionSuccess) && (
        <div
          className={`mb-5 rounded-xl border p-4 text-sm ${idCardActionError ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}
          role={idCardActionError ? 'alert' : 'status'}
        >
          {idCardActionError || idCardActionSuccess}
        </div>
      )}

      <Section title="Student ID">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-black/45">
              {isMusicStudent ? 'Music student format' : 'Regular student format'}
            </p>
            {!editingStudentId && (
              <p className="mt-1 font-mono text-lg font-bold text-[#1A73E8]">
                {student.student_id || 'Not assigned'}
              </p>
            )}
          </div>
          {!editingStudentId && (
            <button
              type="button"
              onClick={() => {
                setStudentIdDraft(student.student_id || '');
                setEditingStudentId(true);
                setIdCardActionError('');
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#1A73E8] px-4 text-sm font-bold text-[#1A73E8] hover:bg-blue-50"
            >
              <i className="bx bx-edit" aria-hidden="true" />
              Edit student ID
            </button>
          )}
        </div>
        {editingStudentId && (
          <form onSubmit={handleSaveStudentId} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="student-id-number" className="mb-1.5 block text-sm font-semibold text-black/70">
                Student ID <span className="font-normal text-black/45">({expectedIdFormat})</span>
              </label>
              <input
                id="student-id-number"
                value={studentIdDraft}
                onChange={(event) => setStudentIdDraft(event.target.value)}
                className="h-11 w-full rounded-lg border border-black/20 px-3 font-mono text-sm outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
                required
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={savingStudentId}
                className="h-11 rounded-lg bg-[#1A73E8] px-4 text-sm font-bold text-white disabled:opacity-60"
              >
                {savingStudentId ? 'Saving…' : 'Save ID'}
              </button>
              <button
                type="button"
                onClick={() => setEditingStudentId(false)}
                className="h-11 rounded-lg border border-black/15 px-4 text-sm font-bold text-black/65"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Section>

      <Section title="ID Card Requests">
        {idCardLoading ? (
          <p className="py-4 text-sm text-black/50">Loading ID-card requests…</p>
        ) : idCardLoadError ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            ID-card requests could not be loaded. The admin ID-card request API must be enabled.
          </p>
        ) : idCardRequests.length === 0 ? (
          <Empty text="No ID-card requests submitted." />
        ) : (
          <div className="space-y-3">
            {idCardRequests.map((request) => (
              <div key={request.id} className="flex flex-col gap-3 rounded-xl border border-black/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-black">{student.full_name}</p>
                  <p className="mt-1 text-xs text-black/50">
                    Submitted {request.created_at ? new Date(request.created_at).toLocaleDateString('en-NG') : 'recently'}
                  </p>
                  <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${request.status === 'approved' ? 'bg-green-100 text-green-700' : request.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {request.status || 'pending'}
                  </span>
                </div>
                {request.status !== 'approved' && request.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => handleGenerateIdCard(request)}
                    disabled={approvingRequestId === request.id}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    <i className={`bx ${approvingRequestId === request.id ? 'bx-loader-alt animate-spin' : 'bx-id-card'} text-lg`} aria-hidden="true" />
                    {approvingRequestId === request.id ? 'Generating…' : 'Generate ID card'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

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