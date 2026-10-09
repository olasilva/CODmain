// src/pages/admin/AdminPayments.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../lib/useFetch';
import {
  getAdminPayments,
  getAdminAdmissions,
  approveBankTransfer,
  updateAdminAdmissionStatus,
} from '../../lib/api';

// ── Detect a bank transfer regardless of which field holds the type ──
// The new bank-transfer controller writes `payment_type: 'bank_transfer'`.
// Older Paystack rows may use `method`, `payment_method`, `channel`, etc.
function isBankTransfer(payment) {
  const candidates = [
    payment.payment_type,
    payment.paymentType,
    payment.type,
    payment.method,
    payment.payment_method,
    payment.paymentMethod,
    payment.channel,
    payment.provider,
  ]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase().replace(/[-\s]+/g, '_'));

  if (
    candidates.some((v) =>
      ['bank_transfer', 'bank', 'manual', 'offline', 'transfer'].includes(v)
    )
  ) {
    return true;
  }

  // Fallback: reference starts with BT- or mentions a bank
  const reference = String(payment.reference || '').toLowerCase();
  if (reference.startsWith('bt-') || reference.includes('bank')) {
    return true;
  }

  // Fallback: description mentions a bank transfer
  const description = String(payment.description || '').toLowerCase();
  if (description.includes('bank transfer')) {
    return true;
  }

  return false;
}

export default function AdminPayments() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [approvingId, setApprovingId] = useState(null);
  const [approvalPayment, setApprovalPayment] = useState(null);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [durationValue, setDurationValue] = useState('1');
  const [durationUnit, setDurationUnit] = useState('months');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [justUpdated, setJustUpdated] = useState(false);

  const { data, loading, error, refetch } = useFetch(getAdminPayments, [], {
    initialData: { payments: [], summary: {} },
  });

  // ─── Local copy of the payments list ───
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (data?.payments) setPayments(data.payments);
  }, [data]);

  // ─── Summary computed from the live payments list ───
  const summary = useMemo(() => {
    const completed = payments.filter((p) =>
      ['completed', 'success', 'paid', 'approved'].includes(
        String(p.status || '').toLowerCase()
      )
    );
    const pending = payments.filter(
      (p) => String(p.status || '').toLowerCase() === 'pending'
    );

    const totalCollected = completed.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );
    const totalPending = pending.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    return {
      totalCollected,
      totalPending,
      countTotal: payments.length,
    };
  }, [payments]);

  // ─── Filter + search ───
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (activeFilter === 'Transfers' && !isBankTransfer(p)) return false;
      if (activeFilter !== 'All' && activeFilter !== 'Transfers') {
        const s = (p.status || '').toLowerCase();
        if (s !== activeFilter.toLowerCase()) return false;
      }
      if (q) {
        const name = (
          p.student?.full_name ||
          p.student_name ||
          p.payer_name ||
          ''
        ).toLowerCase();
        const email = (p.payer_email || '').toLowerCase();
        const ref = (p.reference || '').toLowerCase();
        if (!name.includes(q) && !email.includes(q) && !ref.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [payments, activeFilter, search]);

  const totalExpected =
    Number(summary.totalCollected || 0) + Number(summary.totalPending || 0);

  const statCards = [
    {
      label: 'Total Expected',
      value: `₦${totalExpected.toLocaleString()}`,
      color: 'text-black',
    },
    {
      label: 'Collected',
      value: `₦${Number(summary.totalCollected || 0).toLocaleString()}`,
      color: 'text-[#34A853]',
    },
    {
      label: 'Pending',
      value: `₦${Number(summary.totalPending || 0).toLocaleString()}`,
      color: 'text-[#E6AC00]',
    },
    {
      label: 'Transactions',
      value: summary.countTotal || 0,
      color: 'text-black',
    },
  ];

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'success' || s === 'paid')
      return 'bg-green-100 text-green-600';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-600';
    if (s === 'failed') return 'bg-red-100 text-red-500';
    return 'bg-gray-100 text-gray-600';
  };

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-NG', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '—';

  const fmtAmount = (n) => `₦${Number(n || 0).toLocaleString()}`;

  const pendingTransfers = payments.filter(
    (payment) =>
      isBankTransfer(payment) &&
      String(payment.status).toLowerCase() === 'pending'
  ).length;

  const beginApproval = (payment) => {
    const plan = String(payment.plan || '').toLowerCase();
    setApprovalPayment(payment);
    setReceivedAmount(String(payment.amount || ''));
    setDurationValue(
      plan.includes('term') ? '1' : plan.includes('day') ? '1' : '1'
    );
    setDurationUnit(
      plan.includes('term') ? 'terms' : plan.includes('day') ? 'days' : 'months'
    );
    setActionError('');
  };

  const handleApprove = async (event) => {
    event.preventDefault();
    const payment = approvalPayment;
    if (!payment) return;

    const amount = Number(receivedAmount);
    const duration = Number(durationValue);
    const unitDays = { days: 1, months: 30, terms: 90 }[durationUnit];
    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isInteger(duration) ||
      duration <= 0
    ) {
      setActionError(
        'Enter a received amount and a valid duration greater than zero.'
      );
      return;
    }

    const studentName =
      payment.student?.full_name ||
      payment.student_name ||
      payment.payer_name ||
      'this student';

    setApprovingId(payment.id);
    setActionError('');
    setActionSuccess('');

    try {
      const paymentResult = await approveBankTransfer(payment.id, {
        amountReceived: amount,
        duration,
        durationUnit,
        durationDays: duration * unitDays,
        loginUrl: `${window.location.origin}/login`,
      });

      // ─── OPTIMISTIC UPDATE ───
      setPayments((prev) =>
        prev.map((p) =>
          p.id === payment.id
            ? {
                ...p,
                status: 'completed',
                amount:
                  Number.isFinite(amount) && amount > 0 ? amount : p.amount,
                duration_days: duration * unitDays,
                payment_date: new Date().toISOString(),
                approved_at: new Date().toISOString(),
              }
            : p
        )
      );

      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2000);

      // ─── Approve the linked admission ───
      let admissionId =
        payment.admission_id ||
        payment.admissionId ||
        payment.application_id ||
        payment.applicationId ||
        payment.admission?.id ||
        payment.application?.id ||
        paymentResult?.admission?.id ||
        paymentResult?.application?.id ||
        paymentResult?.admission_id ||
        paymentResult?.application_id;
      let admissionResult = paymentResult;

      if (!admissionId) {
        const paymentEmail = String(
          payment.student?.email || payment.payer_email || ''
        ).toLowerCase();
        if (paymentEmail) {
          try {
            const admissionsResult = await getAdminAdmissions();
            const admissions =
              admissionsResult?.admissions ||
              admissionsResult?.applications ||
              [];
            const linkedAdmission = admissions.find((admission) => {
              const applicantEmail = String(
                admission.student?.email ||
                  admission.guardian_email ||
                  admission.personal_info?.guardianEmail ||
                  admission.personalInfo?.guardianEmail ||
                  ''
              ).toLowerCase();
              return applicantEmail === paymentEmail;
            });
            admissionId = linkedAdmission?.id;
          } catch {
            // Keep the payment approval result
          }
        }
      }

      const paymentAdmissionStatus = String(
        paymentResult?.admission?.status ||
          paymentResult?.application?.status ||
          paymentResult?.admission_status ||
          ''
      ).toLowerCase();

      if (admissionId && paymentAdmissionStatus !== 'approved') {
        admissionResult = await updateAdminAdmissionStatus(
          admissionId,
          'approved',
          `${window.location.origin}/login`
        );
      }

      const admissionApproved =
        paymentAdmissionStatus === 'approved' || Boolean(admissionId);

      if (!admissionApproved) {
        setActionError(
          `Payment approved for ${studentName}, but no linked admission was returned. Approve the admission from the Admissions page.`
        );
      } else {
        const emailSent =
          admissionResult?.emailSent ??
          admissionResult?.email_sent ??
          admissionResult?.emailed;
        setActionSuccess(
          emailSent === true
            ? `Payment and admission approved for ${studentName}. Confirmation email sent with the login link. Totals updated.`
            : `Payment and admission approved for ${studentName}. Totals updated.`
        );
      }

      setApprovalPayment(null);
      refetch();
    } catch (approveError) {
      setActionError(
        approveError.message ||
          'Payment approval may have succeeded, but the linked admission could not be approved. Check the Admissions page.'
      );
      refetch();
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima leading-tight">
          Payments
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            to="/admin/admissions"
            className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-bold text-[#1A73E8] hover:bg-blue-50"
          >
            <i className="bx bx-file text-lg" aria-hidden="true" />
            Review admissions
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white border border-[#1A73E8] rounded-xl text-[#1A73E8] font-bold text-sm hover:bg-blue-50 transition"
          >
            <i className="bx bx-download text-lg" aria-hidden="true" />
            Export
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-amber-900">
          <strong>{loading ? '…' : pendingTransfers}</strong> bank transfers
          awaiting review
        </p>
        <button
          type="button"
          onClick={() => setActiveFilter('Transfers')}
          className="self-start text-sm font-bold text-amber-900 underline underline-offset-2 sm:self-auto"
        >
          Review transfers
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <i className="bx bx-error-circle text-lg" aria-hidden="true" />
          {error}
        </div>
      )}

      {actionError && (
        <div
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {actionError}
        </div>
      )}
      {actionSuccess && (
        <div
          className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          role="status"
        >
          {actionSuccess}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all duration-500 ${
              justUpdated
                ? 'border-green-300 shadow-md ring-2 ring-green-100'
                : 'border-black/15 hover:shadow-md'
            }`}
          >
            <p className="text-xs sm:text-sm text-black/60 font-ebrima mb-1">
              {stat.label}
            </p>
            <p
              className={`text-lg sm:text-2xl font-bold ${
                stat.color || 'text-black'
              } font-ebrima break-all`}
            >
              {loading ? '…' : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
        <div className="flex-1 bg-white rounded-xl border border-black/15 px-4 py-2.5 flex items-center gap-2.5">
          <i className="bx bx-search text-lg text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by student, email, or reference…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none bg-transparent text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', 'Transfers', 'Completed', 'Pending', 'Failed'].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                  activeFilter === filter
                    ? 'bg-[#1A73E8] text-white border-2 border-[#1A73E8]'
                    : 'bg-white text-gray-500 border border-black/15 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
        {loading && (
          <div className="py-16 text-center text-black/50">
            <i
              className="bx bx-loader-alt animate-spin text-3xl"
              aria-hidden="true"
            />
            <p className="mt-2 font-ebrima">Loading payments…</p>
          </div>
        )}

        {!loading && payments.length === 0 && (
          <div className="py-16 px-6 text-center">
            <i
              className="bx bx-receipt text-5xl text-black/15"
              aria-hidden="true"
            />
            <p className="mt-3 text-black/60 font-ebrima font-bold">
              No payments recorded yet
            </p>
            <p className="text-black/40 text-sm mt-1">
              Payments will appear here as soon as they are made.
            </p>
          </div>
        )}

        {!loading && payments.length > 0 && filtered.length === 0 && (
          <div className="py-16 px-6 text-center">
            <i
              className="bx bx-filter text-5xl text-black/15"
              aria-hidden="true"
            />
            <p className="mt-3 text-black/60 font-ebrima font-bold">
              No matches
            </p>
            <p className="text-black/40 text-sm mt-1">
              Try changing the filter or search term.
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-[#F8F9FA] border-b border-black/10">
                  <tr>
                    <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                      Student
                    </th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                      Reference
                    </th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                      Method
                    </th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                      Plan
                    </th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                      Amount
                    </th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                      Date
                    </th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                      Status
                    </th>
                    <th className="text-right py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, index) => (
                    <tr
                      key={p.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}
                    >
                      <td className="py-3 px-5">
                        <div className="font-bold text-black text-sm">
                          {p.student?.full_name ||
                            p.student_name ||
                            p.payer_name ||
                            '—'}
                        </div>
                        <div className="text-xs text-black/40">
                          {p.payer_email || ''}
                        </div>
                      </td>
                      <td className="py-3 px-5 text-black/60 text-xs font-mono">
                        {p.reference ||
                          (isBankTransfer(p) ? 'Bank transfer' : '—')}
                      </td>
                      <td className="py-3 px-5 text-black/60 text-sm capitalize">
                        {isBankTransfer(p)
                          ? 'Bank transfer'
                          : p.method || p.payment_method || '—'}
                      </td>
                      <td className="py-3 px-5 text-black/60 text-sm capitalize">
                        {p.plan || '—'}
                      </td>
                      <td className="py-3 px-5 font-bold text-black">
                        {fmtAmount(p.amount)}
                      </td>
                      <td className="py-3 px-5 text-black/60 text-xs">
                        {fmtDate(p.payment_date || p.created_at)}
                      </td>
                      <td className="py-3 px-5">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        {isBankTransfer(p) &&
                        String(p.status).toLowerCase() === 'pending' ? (
                          <button
                            type="button"
                            onClick={() => beginApproval(p)}
                            disabled={approvingId === p.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                          >
                            <i
                              className="bx bx-check text-base"
                              aria-hidden="true"
                            />
                            {approvingId === p.id
                              ? 'Approving…'
                              : 'Approve payment'}
                          </button>
                        ) : isBankTransfer(p) ? (
                          <span className="text-xs text-black/45">
                            Reviewed
                          </span>
                        ) : (
                          <span className="text-xs text-black/30">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-black/5">
              {filtered.map((p) => (
                <div key={p.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="font-bold text-black text-sm truncate">
                        {p.student?.full_name ||
                          p.student_name ||
                          p.payer_name ||
                          'Unknown student'}
                      </p>
                      <p className="text-xs text-black/40 truncate">
                        {p.payer_email || ''}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <p className="text-black/40">Amount</p>
                      <p className="font-bold text-black">
                        {fmtAmount(p.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-black/40">Plan</p>
                      <p className="text-black/70 capitalize">
                        {p.plan || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-black/40">Method</p>
                      <p className="text-black/70 capitalize">
                        {isBankTransfer(p)
                          ? 'Bank transfer'
                          : p.method || p.payment_method || '—'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-black/40">Reference</p>
                      <p className="text-black/70 font-mono truncate">
                        {p.reference ||
                          (isBankTransfer(p) ? 'Bank transfer' : '—')}
                      </p>
                    </div>
                    <div>
                      <p className="text-black/40">Date</p>
                      <p className="text-black/70">
                        {fmtDate(p.payment_date || p.created_at)}
                      </p>
                    </div>
                  </div>
                  {isBankTransfer(p) &&
                    String(p.status).toLowerCase() === 'pending' && (
                      <button
                        type="button"
                        onClick={() => beginApproval(p)}
                        disabled={approvingId === p.id}
                        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-green-600 text-sm font-bold text-white disabled:opacity-60"
                      >
                        <i className="bx bx-check text-lg" aria-hidden="true" />
                        {approvingId === p.id
                          ? 'Approving…'
                          : 'Approve payment'}
                      </button>
                    )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {approvalPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
          <form
            onSubmit={handleApprove}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="approve-transfer-title"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <i className="bx bx-wallet text-2xl" aria-hidden="true" />
            </div>
            <h2
              id="approve-transfer-title"
              className="text-xl font-bold text-[#0F4082]"
            >
              Approve bank transfer
            </h2>
            <p className="mt-1 text-sm text-black/55">
              Record the amount received and how long it covers for{' '}
              {approvalPayment.student?.full_name ||
                approvalPayment.student_name ||
                approvalPayment.payer_name ||
                'this student'}
              .
            </p>

            <label className="mt-5 block text-sm font-semibold text-black/75">
              Amount received (NGN)
              <input
                type="number"
                min="1"
                step="1"
                required
                value={receivedAmount}
                onChange={(event) => setReceivedAmount(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-lg border border-black/20 px-3 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
              />
            </label>

            <label className="mt-4 block text-sm font-semibold text-black/75">
              Coverage duration
              <div className="mt-1.5 grid grid-cols-[1fr_1fr] gap-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={durationValue}
                  onChange={(event) => setDurationValue(event.target.value)}
                  className="h-11 min-w-0 rounded-lg border border-black/20 px-3 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
                  aria-label="Coverage duration value"
                />
                <select
                  value={durationUnit}
                  onChange={(event) => setDurationUnit(event.target.value)}
                  className="h-11 rounded-lg border border-black/20 bg-white px-3 outline-none focus:border-[#1A73E8]"
                  aria-label="Coverage duration unit"
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="terms">Terms (90 days each)</option>
                </select>
              </div>
            </label>

            {actionError && (
              <p
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                role="alert"
              >
                {actionError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setApprovalPayment(null)}
                disabled={approvingId === approvalPayment.id}
                className="h-11 flex-1 rounded-full border border-black/15 text-sm font-bold text-black/65 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={approvingId === approvalPayment.id}
                className="h-11 flex-1 rounded-full bg-green-600 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {approvingId === approvalPayment.id
                  ? 'Approving…'
                  : 'Confirm approval'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}