// src/components/FeesCard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyFees } from '../lib/api';

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

export default function FeesCard() {
  const [data, setData] = useState(null);
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyFees();
        setData(res);
        setFees(res?.fees || null);
      } catch (e) {
        setError(e.message || 'Could not load fees');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!fees || fees.status === 'expired') return;
    const intervalMs = fees.daysRemaining < 1 ? 30_000 : 60_000;
    const timer = setInterval(() => {
      setFees((f) => recomputeCountdown(f));
    }, intervalMs);
    return () => clearInterval(timer);
  }, [fees?.expiresAt, fees?.status]); // eslint-disable-line

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

  if (!fees) {
    return (
      <div className="bg-white rounded-2xl border border-black/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F9FF] text-[#1A73E8]">
            <i className="bx bx-wallet text-xl" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold text-black font-ebrima">
            School Fees
          </h2>
        </div>
        <p className="text-sm text-black/50 mb-4">
          No payments on record yet.
        </p>
        <Link
          to="/enroll"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white font-bold px-5 py-2.5 text-sm shadow-md hover:opacity-95 transition"
        >
          <i className="bx bx-credit-card text-base" aria-hidden="true" />
          Make a Payment
        </Link>
      </div>
    );
  }

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
    <div className="bg-white rounded-2xl border border-black/10 p-6">
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

      {fees.status === 'expiring-soon' && (
        <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800 flex items-start gap-2">
          <i className="bx bx-error text-base shrink-0 mt-0.5" aria-hidden="true" />
          <span>Your fees expire in {countdownLabel(fees)}. Please renew soon.</span>
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

      {data?.totalPaid > 0 && (
        <div className="mt-4 pt-4 border-t border-black/5 flex justify-between text-xs">
          <span className="text-black/40 font-ebrima">Total paid overall</span>
          <span className="font-bold text-black font-ebrima">
            ₦{formatNumber(data.totalPaid)}
          </span>
        </div>
      )}

      {(fees.status === 'expiring-soon' || fees.status === 'expired') && (
        <Link
          to="/payment"
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white font-bold px-5 py-3 text-sm shadow-md hover:opacity-95 transition"
        >
          <i className="bx bx-refresh text-base" aria-hidden="true" />
          Renew Fees
        </Link>
      )}
    </div>
  );
}