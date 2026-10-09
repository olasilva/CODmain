import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../lib/useFetch';
import { getAdminAdmissions, updateAdminAdmissionStatus } from '../../lib/api';

function getStudentName(admission) {
  return (
    admission.student?.full_name ||
    admission.student_name ||
    admission.personal_info?.fullName ||
    admission.personalInfo?.fullName ||
    admission.full_name ||
    'Applicant'
  );
}

function getAdmissionStatus(admission) {
  return String(admission.status || 'pending').toLowerCase();
}

function getPaymentStatus(admission) {
  return String(
    admission.payment_status ||
      admission.payment?.status ||
      admission.latest_payment?.status ||
      'not recorded'
  ).toLowerCase();
}

function statusStyle(status) {
  if (['approved', 'completed', 'paid', 'verified'].includes(status)) {
    return 'bg-green-100 text-green-700';
  }
  if (['rejected', 'failed'].includes(status)) {
    return 'bg-red-100 text-red-700';
  }
  return 'bg-amber-100 text-amber-800';
}

export default function AdminAdmissions() {
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [workingId, setWorkingId] = useState(null);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const { data, loading, error, refetch, setData } = useFetch(getAdminAdmissions, [], {
    initialData: { admissions: [] },
  });

  const admissions = data?.admissions || data?.applications || [];
  const pendingCount = admissions.filter((item) => getAdmissionStatus(item) === 'pending').length;
  const approvedCount = admissions.filter((item) => getAdmissionStatus(item) === 'approved').length;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return admissions.filter((admission) => {
      const status = getAdmissionStatus(admission);
      if (filter !== 'all' && status !== filter) return false;
      if (!query) return true;
      const haystack = [
        getStudentName(admission),
        admission.student?.email,
        admission.guardian_email,
        admission.personal_info?.guardianEmail,
        admission.personalInfo?.guardianEmail,
        admission.course,
        admission.track_name,
        admission.id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [admissions, filter, search]);

  const updateStatus = async (admission, status) => {
    const studentName = getStudentName(admission);
    const action = status === 'approved' ? 'Approve' : 'Reject';
    const paymentStatus = getPaymentStatus(admission);
    const confirmation = status === 'approved'
      ? `Are you sure you want to approve ${studentName}'s admission? This will move the admission from Pending to Approved. Current fee status: ${paymentStatus}.`
      : `Are you sure you want to reject ${studentName}'s admission?`;
    if (!window.confirm(confirmation)) return;

    setWorkingId(admission.id);
    setActionError('');
    setActionSuccess('');
    try {
      const loginUrl = `${window.location.origin}/login`;
      const result = await updateAdminAdmissionStatus(
        admission.id,
        status,
        status === 'approved' ? loginUrl : undefined
      );
      setData((current) => {
        const key = Array.isArray(current?.admissions) ? 'admissions' : 'applications';
        return {
          ...current,
          [key]: (current?.[key] || []).map((item) =>
            item.id === admission.id ? { ...item, status } : item
          ),
        };
      });

      if (status !== 'approved') {
        setActionSuccess(`${studentName}'s admission was rejected.`);
      } else {
        const emailSent = result?.emailSent ?? result?.email_sent ?? result?.emailed;
        if (emailSent === true) {
          setActionSuccess(
            `Admission approved and confirmation email sent. ${studentName} can now log in at ${loginUrl}.`
          );
        } else if (emailSent === false) {
          setActionError(
            `Admission approved, but the confirmation email could not be sent. Student can log in at ${loginUrl}; please contact them directly.`
          );
        } else {
          setActionSuccess(
            `Admission approved. Email delivery was not confirmed by the server. Student login: ${loginUrl}.`
          );
        }
      }
      refetch();
    } catch (statusError) {
      setActionError(statusError.message || `Could not ${action.toLowerCase()} this admission.`);
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black font-ebrima sm:text-3xl">Admissions</h1>
          <p className="mt-1 text-sm text-black/55">Review applications and record admission decisions.</p>
        </div>
        <Link to="/admin/payments" className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-[#1A73E8] bg-white px-4 text-sm font-bold text-[#1A73E8] hover:bg-blue-50 sm:self-auto">
          <i className="bx bx-wallet" aria-hidden="true" />
          Review payments
        </Link>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Summary label="Applications" value={admissions.length} />
        <Summary label="Pending review" value={pendingCount} color="text-amber-700" />
        <Summary label="Approved" value={approvedCount} color="text-green-700" />
      </div>

      {(error || actionError || actionSuccess) && (
        <div className={`mb-4 rounded-xl border p-4 text-sm ${actionError || error ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`} role={actionError || error ? 'alert' : 'status'}>
          {actionError || error || actionSuccess}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <label className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-black/15 bg-white px-3">
          <i className="bx bx-search text-lg text-black/35" aria-hidden="true" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search applicant, email, programme, or application ID"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-11 rounded-lg border border-black/15 bg-white px-3 text-sm font-semibold text-black/70">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All statuses</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
        {loading ? (
          <div className="py-16 text-center text-sm text-black/50">Loading applications…</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <i className="bx bx-file text-4xl text-black/20" aria-hidden="true" />
            <p className="mt-2 font-semibold text-black/65">No applications to show</p>
            <p className="mt-1 text-sm text-black/40">New and pending applications will appear here.</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[920px]">
                <thead className="border-b border-black/10 bg-[#F8F9FA]">
                  <tr>
                    {['Applicant', 'Programme', 'Fee status', 'Applied', 'Admission', 'Decision'].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left text-[11px] font-bold uppercase text-black/50">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((admission) => {
                    const status = getAdmissionStatus(admission);
                    const paymentStatus = getPaymentStatus(admission);
                    const email = admission.student?.email || admission.guardian_email || admission.personal_info?.guardianEmail || admission.personalInfo?.guardianEmail;
                    return (
                      <tr key={admission.id} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-4">
                          <p className="text-sm font-bold text-black">{getStudentName(admission)}</p>
                          <p className="mt-0.5 text-xs text-black/45">{email || `Application ${admission.id}`}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-black/65">{[admission.course, admission.track_name].filter(Boolean).join(' · ') || '—'}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusStyle(paymentStatus)}`}>{paymentStatus}</span>
                          {(admission.payment?.amount || admission.amount) && <p className="mt-1 text-xs font-bold text-black/65">₦{Number(admission.payment?.amount || admission.amount).toLocaleString()}</p>}
                        </td>
                        <td className="px-4 py-4 text-xs text-black/55">{admission.created_at ? new Date(admission.created_at).toLocaleDateString('en-NG') : '—'}</td>
                        <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusStyle(status)}`}>{status}</span></td>
                        <td className="px-4 py-4">
                          {status !== 'approved' && status !== 'rejected' ? (
                            <div className="flex gap-2">
                              <button type="button" onClick={() => updateStatus(admission, 'approved')} disabled={workingId === admission.id} className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-60">{workingId === admission.id ? 'Saving…' : 'Approve'}</button>
                              {!['completed', 'paid', 'approved', 'verified'].includes(paymentStatus) && (
                                <span className="self-center text-[11px] text-amber-800">Fee status: {paymentStatus}</span>
                              )}
                              <button type="button" onClick={() => updateStatus(admission, 'rejected')} disabled={workingId === admission.id} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-60">Reject</button>
                            </div>
                          ) : <span className="text-xs text-black/40">No action</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-black/5 md:hidden">
              {filtered.map((admission) => {
                const status = getAdmissionStatus(admission);
                const paymentStatus = getPaymentStatus(admission);
                const email = admission.student?.email || admission.guardian_email || admission.personal_info?.guardianEmail || admission.personalInfo?.guardianEmail;
                return (
                  <article key={admission.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-bold text-black">{getStudentName(admission)}</h2>
                        <p className="truncate text-xs text-black/45">{email || `Application ${admission.id}`}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold capitalize ${statusStyle(status)}`}>{status}</span>
                    </div>
                    <p className="mt-3 text-sm text-black/65">{[admission.course, admission.track_name].filter(Boolean).join(' · ') || 'Programme not specified'}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-black/45">Fee: <strong className="capitalize text-black/70">{paymentStatus}</strong></span>
                      <span className="text-black/45">{admission.created_at ? new Date(admission.created_at).toLocaleDateString('en-NG') : '—'}</span>
                    </div>
                    {status !== 'approved' && status !== 'rejected' && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => updateStatus(admission, 'approved')} disabled={workingId === admission.id} className="h-10 rounded-lg bg-green-600 text-sm font-bold text-white disabled:opacity-60">Approve</button>
                        <button type="button" onClick={() => updateStatus(admission, 'rejected')} disabled={workingId === admission.id} className="h-10 rounded-lg border border-red-200 text-sm font-bold text-red-700 disabled:opacity-60">Reject</button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Summary({ label, value, color = 'text-black' }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <p className="text-xs font-semibold text-black/50">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}