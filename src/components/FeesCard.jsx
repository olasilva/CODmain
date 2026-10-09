// src/components/FeesCard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyFees, getPaymentContext } from '../lib/api';

function formatNumber(n) {
  return Number(n || 0).toLocaleString('en-NG');
}

function countdownLabel(fees) {
  if (!fees || fees.daysRemaining <= 0) return 'Expired';
  if (fees.daysRemaining >= 2) return `${fees.daysRemaining} days`;
  if (fees.daysRemaining === 1) return '1 day';
  if (fees.hoursRemaining >= 1) return `${fees.hoursRemaining} hours`;
  return `${fees.minutesRemaining} min`;
}

function recomputeCountdown(fees) {
  if (!fees) return null;
  const now = Date.now();
  const expiresAt = new Date(fees.expiresAt).getTime();
  const msRemaining = expiresAt - now;

  const daysRemaining = Math.ceil(msRemaining / 86400000);
  const hoursRemaining = Math.ceil(msRemaining / 3600000);
  const minutesRemaining = Math.ceil(msRemaining / 60000);

  const daysUsed = Math.max(0, fees.totalDays - daysRemaining);
  const progress = Math.min(100, Math.max(0, (daysUsed / fees.totalDays) * 100));

  return {
    ...fees,
    daysRemaining: Math.max(0, daysRemaining),
    hoursRemaining: Math.max(0, hoursRemaining),
    minutesRemaining: Math.max(0, minutesRemaining),
    daysUsed,
    progress,
    status:
      daysRemaining <= 0
        ? 'expired'
        : daysRemaining <= 7
        ? 'expiring-soon'
        : 'active',
  };
}

function normalizeFeesResponse(response) {
  const source = response?.fees || response?.data?.fees;
  if (!source) return null;

  const amount = Number(
    source.amountReceived ?? source.amount_received ?? source.amount ?? 0
  );
  const duration = Number(
    source.duration ?? source.durationValue ?? source.duration_value ?? 0
  );
  const durationUnit = String(
    source.durationUnit || source.duration_unit || 'days'
  ).toLowerCase();
  const unitDays = { day: 1, days: 1, month: 30, months: 30, term: 90, terms: 90 };
  let totalDays = Number(
    source.totalDays ??
      source.total_days ??
      source.durationDays ??
      source.duration_days ??
      duration * (unitDays[durationUnit] || 1)
  );
  let paidAt =
    source.paidAt ||
    source.paid_at ||
    source.approvedAt ||
    source.approved_at ||
    source.created_at;
  let expiresAt = source.expiresAt || source.expires_at;

  if (paidAt && expiresAt && totalDays <= 0) {
    totalDays = Math.max(
      1,
      Math.ceil(
        (new Date(expiresAt).getTime() - new Date(paidAt).getTime()) /
          86400000
      )
    );
  }
  if (paidAt && totalDays > 0 && !expiresAt) {
    expiresAt = new Date(
      new Date(paidAt).getTime() + totalDays * 86400000
    ).toISOString();
  }
  if (expiresAt && totalDays > 0 && !paidAt) {
    paidAt = new Date(
      new Date(expiresAt).getTime() - totalDays * 86400000
    ).toISOString();
  }
  if (!amount || !totalDays || !expiresAt || !paidAt) return null;

  return recomputeCountdown({
    ...source,
    amount,
    paidAt,
    expiresAt,
    totalDays,
    planLabel:
      source.planLabel ||
      source.plan_label ||
      source.plan ||
      `${duration || totalDays} ${duration ? durationUnit : 'days'}`,
  });
}

export default function FeesCard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [fees, setFees] = useState(null);
  const [pending, setPending] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preparing, setPreparing] = useState(false);
  const [prepareError, setPrepareError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyFees();
        setData(res);
        setFees(normalizeFeesResponse(res));
        // ── NEW: capture the pending payment, if any ──
        setPending(res?.pending || res?.data?.pending || null);
      } catch (e) {
        setError(e.message || 'Could not load fees');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Live countdown tick
  useEffect(() => {
    if (!fees || fees.status === 'expired') return;
    const intervalMs = fees.daysRemaining < 1 ? 30_000 : 60_000;
    const timer = setInterval(() => {
      setFees((f) => recomputeCountdown(f));
    }, intervalMs);
    return () => clearInterval(timer);
  }, [fees?.expiresAt, fees?.status]); // eslint-disable-line

  // ─── Build payment context, then navigate to /payment ───
  const handlePay = async () => {
    setPreparing(true);
    setPrepareError('');
    try {
      const res = await getPaymentContext();
      const ctx = res?.context;

      if (!ctx) {
        navigate('/enroll');
        return;
      }

      navigate('/payment', { state: ctx });
    } catch (e) {
      console.error('Failed to build payment context:', e);
      setPrepareError('Could not prepare payment. Redirecting…');
      setTimeout(() => navigate('/enroll'), 800);
    } finally {
      setPreparing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-black/10 p-6">
        <div className="flex items-center gap-2 text-black/40 text-sm">
          <i className="bx bx-loader-alt animate-spin text-lg" aria-hidden="true" />
          Loading fees…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-sm">
        <i className="bx bx-error-circle text-lg mr-1" aria-hidden="true" />
        {error}
      </div>
    );
  }

  // ─── Pending payment (bank transfer awaiting approval) ───
  // Shown when there's no completed payment yet, but a bank transfer
  // has been submitted and is waiting for the admin.
  if (!fees && pending) {
    const submittedAt = pending.created_at || pending.submittedAt;
    const submittedLabel = submittedAt
      ? new Date(submittedAt).toLocaleDateString('en-NG', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : 'recently';

    return (
      <div className="bg-white rounded-2xl border border-amber-200 p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <i className="bx bx-time-five text-xl" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-bold text-black font-ebrima">
              School Fees
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1 bg-amber-100 text-amber-800">
            <i className="bx bx-time-five text-sm" aria-hidden="true" />
            Pending
          </span>
        </div>

        {/* Amount */}
        <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-4 py-4 mb-4">
          <p className="text-[10px] uppercase tracking-wider font-bold text-amber-700 mb-1">
            Amount Submitted
          </p>
          <p className="text-2xl font-bold text-[#0F4082] font-ebrima">
            ₦{formatNumber(pending.amount)}
          </p>
          <p className="text-xs text-black/55 font-ebrima mt-1.5 flex items-center gap-1.5">
            <i className="bx bx-calendar text-sm" aria-hidden="true" />
            Submitted on {submittedLabel}
          </p>
          {pending.plan && (
            <p className="text-xs text-black/55 font-ebrima mt-0.5 flex items-center gap-1.5">
              <i className="bx bx-purchase-tag text-sm" aria-hidden="true" />
              {pending.planLabel || pending.plan}
            </p>
          )}
          {pending.reference && (
            <p className="text-[10px] text-black/40 font-mono mt-1.5 truncate">
              Ref: {pending.reference}
            </p>
          )}
        </div>

        {/* Info banner */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-4 flex items-start gap-2">
          <i
            className="bx bx-info-circle text-amber-700 text-base shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-xs text-amber-900 leading-relaxed font-ebrima">
            Your bank transfer has been received. The admin will verify and
            approve it shortly. You'll get access to classes and materials
            once approved.
          </p>
        </div>

        {/* Total pending overall */}
        {data?.totalPending > 0 && (
          <div className="flex justify-between text-xs pt-3 border-t border-black/5 mb-3">
            <span className="text-black/40 font-ebrima">Total pending</span>
            <span className="font-bold text-amber-700 font-ebrima">
              ₦{formatNumber(data.totalPending)}
            </span>
          </div>
        )}

        {/* Secondary action — submit another transfer */}
        <button
          onClick={handlePay}
          disabled={preparing}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[#1A73E8] text-[#1A73E8] font-bold px-5 py-3 text-sm hover:bg-[#F5F9FF] transition disabled:opacity-60"
        >
          {preparing ? (
            <>
              <i
                className="bx bx-loader-alt animate-spin text-base"
                aria-hidden="true"
              />
              Preparing…
            </>
          ) : (
            <>
              <i className="bx bx-upload text-base" aria-hidden="true" />
              Submit Another Transfer
            </>
          )}
        </button>

        {prepareError && (
          <p className="mt-3 text-xs text-red-600">{prepareError}</p>
        )}
      </div>
    );
  }

  // ─── No payment at all ───
  if (!fees) {
    return (
      <div className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F9FF] text-[#1A73E8]">
            <i className="bx bx-wallet text-xl" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold text-black font-ebrima">
            School Fees
          </h2>
        </div>
        <p className="text-sm text-black/50 mb-4 flex-1">
          No payments on record yet. Make your first payment to activate
          classes and materials.
        </p>

        {prepareError && (
          <p className="text-xs text-red-600 mb-3">{prepareError}</p>
        )}

        <button
          onClick={handlePay}
          disabled={preparing}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white font-bold px-5 py-3 text-sm shadow-md hover:opacity-95 transition disabled:opacity-60"
        >
          {preparing ? (
            <>
              <i
                className="bx bx-loader-alt animate-spin text-base"
                aria-hidden="true"
              />
              Preparing…
            </>
          ) : (
            <>
              <i className="bx bx-credit-card text-base" aria-hidden="true" />
              Make a Payment
            </>
          )}
        </button>
      </div>
    );
  }

  // ─── Has completed payment — show status ───
  const styles =
    {
      active: {
        badge: 'bg-green-100 text-green-700',
        bar: 'from-green-400 to-emerald-500',
        text: 'text-green-700',
        icon: 'bx-check-circle',
        label: 'Active',
      },
      'expiring-soon': {
        badge: 'bg-yellow-100 text-yellow-700',
        bar: 'from-yellow-400 to-orange-500',
        text: 'text-yellow-700',
        icon: 'bx-time-five',
        label: 'Expiring Soon',
      },
      expired: {
        badge: 'bg-red-100 text-red-600',
        bar: 'from-red-400 to-rose-500',
        text: 'text-red-600',
        icon: 'bx-x-circle',
        label: 'Expired',
      },
    }[fees.status] || {};

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F9FF] text-[#1A73E8]">
            <i className="bx bx-wallet text-xl" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold text-black font-ebrima">
            School Fees
          </h2>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1 ${styles.badge}`}
        >
          <i className={`bx ${styles.icon} text-sm`} aria-hidden="true" />
          {styles.label}
        </span>
      </div>

      {/* Amount + plan */}
      <div className="rounded-xl bg-gradient-to-r from-[#F5F9FF] to-[#FFF5FA] border border-[#1A73E8]/15 px-4 py-4 mb-5">
        <div className="flex items-end justify-between gap-3 mb-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-black/40 mb-1">
              Amount Paid
            </p>
            <p className="text-2xl font-bold text-[#0F4082] font-ebrima">
              ₦{formatNumber(fees.amount)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#1A73E8]/20 px-3 py-1.5 text-xs font-bold text-[#1A73E8]">
            <i className="bx bx-purchase-tag text-sm" aria-hidden="true" />
            {fees.planLabel}
          </span>
        </div>
        <p className="text-xs text-black/50 font-ebrima">
          Paid on {fmtDate(fees.paidAt)}
        </p>
      </div>

      {/* Countdown */}
      <div className="mb-5">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm text-black/50 font-ebrima">
            {fees.status === 'expired' ? 'Expired' : 'Time Remaining'}
          </span>
          <span className={`text-xl font-bold font-ebrima ${styles.text}`}>
            {countdownLabel(fees)}
          </span>
        </div>
        <div className="h-3 bg-black/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${styles.bar} transition-all duration-700`}
            style={{ width: `${fees.progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-black/40 font-ebrima">
            Started {fmtDate(fees.paidAt)}
          </span>
          <span className="text-[10px] text-black/40 font-ebrima">
            Expires {fmtDate(fees.expiresAt)}
          </span>
        </div>
      </div>

      {/* Days used / remaining */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-black/5">
        <div className="text-center">
          <p className="text-xs text-black/40 font-ebrima mb-0.5">Days Used</p>
          <p className="text-lg font-bold text-black font-ebrima">
            {fees.daysUsed}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-black/40 font-ebrima mb-0.5">
            Days Remaining
          </p>
          <p className={`text-lg font-bold font-ebrima ${styles.text}`}>
            {fees.daysRemaining}
          </p>
        </div>
      </div>

      {/* Warnings */}
      {fees.status === 'expiring-soon' && (
        <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800 flex items-start gap-2">
          <i className="bx bx-error text-base shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            Your fees expire in {countdownLabel(fees)}. Please renew soon.
          </span>
        </div>
      )}

      {fees.status === 'expired' && (
        <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-start gap-2">
          <i
            className="bx bx-error-circle text-base shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span>Your fees have expired. Renew to regain access.</span>
        </div>
      )}

      {/* Pending transfer warning — shows alongside active fees if a new transfer is awaiting approval */}
      {pending && (
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
          <i
            className="bx bx-time-five text-base shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span>
            You also have a pending transfer of ₦
            {formatNumber(pending.amount)} awaiting approval.
          </span>
        </div>
      )}

      {/* Total paid */}
      {data?.totalPaid > 0 && (
        <div className="mt-4 pt-4 border-t border-black/5 flex justify-between text-xs">
          <span className="text-black/40 font-ebrima">Total paid overall</span>
          <span className="font-bold text-black font-ebrima">
            ₦{formatNumber(data.totalPaid)}
          </span>
        </div>
      )}

      {prepareError && (
        <p className="mt-3 text-xs text-red-600">{prepareError}</p>
      )}

      {/* Renew / Pay button */}
      <button
        onClick={handlePay}
        disabled={preparing}
        className={`mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full font-bold px-5 py-3 text-sm shadow-md transition disabled:opacity-60 ${
          fees.status === 'expired'
            ? 'bg-red-600 text-white hover:bg-red-700'
            : fees.status === 'expiring-soon'
            ? 'bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white hover:opacity-95'
            : 'border border-[#1A73E8] text-[#1A73E8] hover:bg-[#F5F9FF]'
        }`}
      >
        {preparing ? (
          <>
            <i
              className="bx bx-loader-alt animate-spin text-base"
              aria-hidden="true"
            />
            Preparing…
          </>
        ) : (
          <>
            <i
              className={`bx ${
                fees.status === 'active' ? 'bx-refresh' : 'bx-credit-card'
              } text-base`}
              aria-hidden="true"
            />
            {fees.status === 'expired'
              ? 'Renew Fees'
              : fees.status === 'expiring-soon'
              ? 'Renew Now'
              : 'Pay / Renew'}
          </>
        )}
      </button>
    </div>
  );
}