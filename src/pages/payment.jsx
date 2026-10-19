// src/pages/Payment.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeftIcon } from '../components/Icons';
import { PRICING } from '../data/pricing';
import {
  FEE_SESSION,
  SCHOOL_ACCOUNT,
  getSchoolFeeSchedule,
} from '../data/schoolFees';
import { isLoggedIn, getSession, submitBankTransfer } from '../lib/api';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    course,
    trackName,
    formData,
    applicationId,
    email: contextEmail,
  } = location.state || {};

  const session = getSession('student') || {};

  const [checking, setChecking] = useState(true);
  const [submittingTransfer, setSubmittingTransfer] = useState(false);
  const [transferError, setTransferError] = useState('');

  // ─── Guards: only render if we arrived through the full flow ───
  useEffect(() => {
    const loggedIn = isLoggedIn('student') && getSession('student');
    if (!loggedIn) {
      navigate('/admission/create-account', { replace: true });
      return;
    }
    if (!course || !trackName) {
      navigate('/admission/course-selection', { replace: true });
      return;
    }
    if (!formData || !applicationId) {
      navigate('/application', { replace: true });
      return;
    }
    setChecking(false);
  }, [navigate, course, trackName, formData, applicationId]);

  // ─── Class-based school fee schedule (First Term 2026/2027) ───
  const schedule = getSchoolFeeSchedule(
    formData?.regularClass,
    formData?.class,
    formData?.classApplied,
    formData?.gradeLevel,
    trackName
  );
  const hasSchedule = Boolean(schedule);

  // Legacy campus/plan pricing (used when no class schedule matches)
  const pricing = PRICING[course]?.[trackName] || null;
  const monthlyFee = pricing?.monthly || 0;
  const termlyFee = pricing?.termly || 0;
  const dailyFee = pricing?.daily || 0;

  const hasMonthly = !hasSchedule && monthlyFee > 0;
  const hasTermly = !hasSchedule && termlyFee > 0;
  const hasDaily = !hasSchedule && dailyFee > 0;

  const [selectedPlan, setSelectedPlan] = useState(() => {
    if (hasSchedule) return 'termly';
    if (termlyFee > 0) return 'termly';
    if (monthlyFee > 0) return 'monthly';
    if (dailyFee > 0) return 'daily';
    return 'monthly';
  });

  const getAmount = () => {
    if (hasSchedule) return schedule.total;
    switch (selectedPlan) {
      case 'monthly':
        return monthlyFee;
      case 'termly':
        return termlyFee;
      case 'daily':
        return dailyFee;
      default:
        return 0;
    }
  };

  const amountToPay = getAmount();
  const naira = (n) => `₦${Number(n).toLocaleString('en-NG')}`;

  const contactEmail =
    formData?.guardianEmail ||
    formData?.email ||
    contextEmail ||
    session?.email ||
    session?.user?.email ||
    '';

  const handleTransferSubmitted = async () => {
    if (submittingTransfer || amountToPay <= 0) return;

    setSubmittingTransfer(true);
    setTransferError('');

    try {
      await submitBankTransfer({
        applicationId,
        amount: amountToPay,
        plan: selectedPlan,
        course,
        trackName,
        method: 'bank_transfer',
        studentName: formData?.studentName || session?.fullName || '',
        payerEmail: contactEmail,
        payerName: formData?.guardianName || '',
        payerPhone: formData?.guardianPhone || formData?.phone || '',
      });

      navigate('/login', { state: { email: contactEmail } });
    } catch (error) {
      const msg = (error?.message || '').toLowerCase();

      if (msg.includes('already approved')) {
        setSubmittingTransfer(false);
        navigate('/login?approved=true', {
          replace: true,
          state: { email: contactEmail, from: 'payment' },
        });
        return;
      }

      setTransferError(
        error.message || 'Could not notify the school. Please try again.'
      );
      setSubmittingTransfer(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F9FF]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A73E8] mx-auto" />
          <p className="mt-3 text-sm text-black/50 font-ebrima">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />

      <main className="flex-1 py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress — Step 4 of 4 */}
          <div className="flex items-center gap-3 mb-8">
            <StepDot done>1</StepDot>
            <StepBar done />
            <StepDot done>2</StepDot>
            <StepBar done />
            <StepDot done>3</StepDot>
            <StepBar done />
            <StepDot active>4</StepDot>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[30px] sm:text-4xl font-bold text-[#0F4082] font-ebrima leading-tight">
              Bank Transfer
            </h1>
            <p className="text-sm text-black/60 font-ebrima mt-2">
              Step 4 of 4 · Transfer the amount below to the school account
            </p>
          </div>

          <Link
            to="/admission/course-selection"
            state={{ formData, trackName, applicationId }}
            className="inline-flex items-center gap-2 text-[#1A73E8] font-semibold text-sm mb-6 hover:text-[#0F4082] transition-colors font-ebrima"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Programme
          </Link>

          <div className="space-y-6">
            {/* ─── Programme Summary ─── */}
            <section className="rounded-3xl bg-white border border-black/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-8 w-8 rounded-xl bg-[#F5F9FF] text-[#1A73E8] flex items-center justify-center">
                  <i className="bx bx-book-open text-base" aria-hidden="true" />
                </span>
                <h2 className="text-[#1A73E8] font-bold font-ebrima">
                  Programme Summary
                </h2>
              </div>
              <div className="h-px bg-black/10 mb-5" />

              <div className="space-y-2.5">
                <SummaryRow icon="bx-map-pin" label="Campus" value={course} />
                <SummaryRow icon="bx-calendar-check" label="Plan" value={trackName} />
                {hasSchedule && (
                  <SummaryRow icon="bx-group" label="Class" value={schedule.label} />
                )}
                {pricing?.description && (
                  <SummaryRow icon="bx-time" label="Schedule" value={pricing.description} />
                )}
                {formData?.studentName && (
                  <SummaryRow icon="bx-user" label="Student" value={formData.studentName} />
                )}
                <SummaryRow
                  icon="bx-envelope"
                  label="Contact email"
                  value={contactEmail || '—'}
                />
                {(formData?.guardianPhone || formData?.phone || session?.phone) && (
                  <SummaryRow
                    icon="bx-phone"
                    label="Phone"
                    value={formData?.guardianPhone || formData?.phone || session?.phone}
                  />
                )}
                {!hasSchedule && formData?.regularClass && (
                  <SummaryRow icon="bx-group" label="Class" value={formData.regularClass} />
                )}
                {formData?.instrument && (
                  <SummaryRow icon="bx-music" label="Instrument" value={formData.instrument} />
                )}
              </div>
            </section>

            {/* ─── Fee Structure ─── */}
            <section className="rounded-3xl bg-white border border-black/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-8 w-8 rounded-xl bg-[#F5F9FF] text-[#1A73E8] flex items-center justify-center">
                  <i className="bx bx-wallet text-base" aria-hidden="true" />
                </span>
                <h2 className="text-[#1A73E8] font-bold font-ebrima">
                  {hasSchedule ? 'School Fee Schedule' : 'Choose Payment Plan'}
                </h2>
              </div>
              <div className="h-px bg-black/10 mb-5" />

              {hasSchedule && (
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-wider font-bold text-black/40 font-ebrima mb-3">
                    {schedule.label} · {FEE_SESSION}
                  </p>
                  <div className="rounded-xl border border-black/10 overflow-hidden">
                    <div className="grid grid-cols-[2.5rem_1fr_auto] bg-[#FF2E96] text-white text-xs font-bold font-ebrima uppercase tracking-wide">
                      <span className="px-3 py-2">S/N</span>
                      <span className="px-3 py-2">Item</span>
                      <span className="px-3 py-2 text-right">Amount (₦)</span>
                    </div>
                    {schedule.items.map((item, i) => (
                      <div
                        key={item.key}
                        className={`grid grid-cols-[2.5rem_1fr_auto] text-sm font-ebrima ${
                          i % 2 ? 'bg-[#F5F9FF]' : 'bg-white'
                        }`}
                      >
                        <span className="px-3 py-2 text-black/50">{i + 1}</span>
                        <span className="px-3 py-2 text-black/80">{item.label}</span>
                        <span
                          className={`px-3 py-2 text-right tabular-nums ${
                            item.amount ? 'font-bold text-black' : 'text-black/40'
                          }`}
                        >
                          {item.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(hasMonthly || hasTermly || hasDaily) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {hasMonthly && (
                    <PlanCard
                      label="Monthly"
                      price={monthlyFee}
                      sub="per month"
                      selected={selectedPlan === 'monthly'}
                      onClick={() => setSelectedPlan('monthly')}
                      icon="bx-calendar"
                    />
                  )}
                  {hasTermly && (
                    <PlanCard
                      label="Termly"
                      price={termlyFee}
                      sub="3 months"
                      selected={selectedPlan === 'termly'}
                      onClick={() => setSelectedPlan('termly')}
                      icon="bx-calendar-check"
                      savings={
                        hasMonthly && monthlyFee * 3 > termlyFee
                          ? monthlyFee * 3 - termlyFee
                          : null
                      }
                    />
                  )}
                  {hasDaily && (
                    <PlanCard
                      label="Daily"
                      price={dailyFee}
                      sub="per session"
                      selected={selectedPlan === 'daily'}
                      onClick={() => setSelectedPlan('daily')}
                      icon="bx-time-five"
                    />
                  )}
                </div>
              )}

              {!hasSchedule && !hasMonthly && !hasTermly && !hasDaily && (
                <div className="text-center py-4 mb-5">
                  <div className="text-2xl font-bold text-[#1A73E8] font-ebrima">
                    {naira(amountToPay)}
                  </div>
                  <div className="text-sm text-black/50 font-ebrima mt-1">Fee</div>
                </div>
              )}

              <div className="rounded-2xl bg-gradient-to-r from-[#F5F9FF] to-[#FFF5FA] border border-[#1A73E8]/15 p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-black/40 font-ebrima mb-1">
                    Total Fee
                  </p>
                  <p className="text-sm text-black/50 font-ebrima">
                    {hasSchedule && 'First term, 2026/2027 session'}
                    {!hasSchedule && selectedPlan === 'monthly' && 'Monthly payment'}
                    {!hasSchedule && selectedPlan === 'termly' && 'Termly payment (3 months)'}
                    {!hasSchedule && selectedPlan === 'daily' && 'Per session'}
                  </p>
                </div>
                <span className="text-3xl font-bold text-[#0F4082] font-ebrima">
                  {naira(amountToPay)}
                </span>
              </div>
            </section>

            {/* ─── Payment Options ─── */}
            <section className="rounded-3xl bg-white border border-black/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-8 w-8 rounded-xl bg-[#F5F9FF] text-[#1A73E8] flex items-center justify-center">
                  <i className="bx bx-credit-card text-base" aria-hidden="true" />
                </span>
                <h2 className="text-[#1A73E8] font-bold font-ebrima">
                  School Bank Details
                </h2>
              </div>
              <div className="h-px bg-black/10 mb-5" />

              <p className="text-sm text-black/60 font-ebrima mb-5">
                Make a bank transfer for the exact amount shown above. Include the student&apos;s name as the transfer narration.
              </p>

              <dl className="divide-y divide-black/10 rounded-xl border border-black/10 px-4">
                <BankDetail label="Bank" value={SCHOOL_ACCOUNT.bank} />
                <BankDetail label="Account number" value={SCHOOL_ACCOUNT.number} copyable />
                <BankDetail label="Account name" value={SCHOOL_ACCOUNT.name} />
                <BankDetail label="Amount to pay" value={naira(amountToPay)} />
              </dl>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mt-5 flex items-start gap-3">
                <i className="bx bx-info-circle text-amber-700 text-lg shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-amber-900 font-ebrima leading-relaxed">
                  Your admission remains pending while the transfer is verified. The school admin will approve your admission and send a confirmation to the contact email above. Student access is available after approval.
                </p>
              </div>

              <p className="mt-4 text-xs text-black/45 font-ebrima">
                All payments should be made in time for a smooth school activities.
              </p>
            </section>

            {transferError && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                {transferError}
              </p>
            )}

            <button
              type="button"
              onClick={handleTransferSubmitted}
              disabled={submittingTransfer || amountToPay <= 0}
              className="w-full h-14 rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white font-bold text-base font-ebrima transition inline-flex items-center justify-center gap-2 shadow-md hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <i className={`bx ${submittingTransfer ? 'bx-loader-alt animate-spin' : 'bx-check-circle'} text-lg`} aria-hidden="true" />
              {submittingTransfer ? 'Submitting transfer…' : 'I have made payment'}
            </button>
            <p className="text-center text-xs text-black/45 font-ebrima">
              Sign in to check your admission status. Portal access opens after approval.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ────────────── Small helpers ────────────── */

function StepDot({ children, done, active }) {
  return (
    <div
      className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition ${
        done ? 'bg-[#1A73E8]/30' : active ? 'bg-[#1A73E8]' : 'bg-[#1A73E8]/15'
      }`}
    >
      <span
        className={`font-bold text-lg ${
          active ? 'text-white' : done ? 'text-[#1A73E8]' : 'text-[#1A73E8]/60'
        }`}
      >
        {children}
      </span>
    </div>
  );
}

function StepBar({ done }) {
  return (
    <div
      className={`w-14 h-0.5 rounded-full ${
        done ? 'bg-[#1A73E8]' : 'bg-[#1A73E8]/25'
      }`}
    />
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
      <span className="flex items-center gap-2 text-sm text-black/50 font-ebrima">
        <i className={`bx ${icon} text-base text-[#1A73E8]`} aria-hidden="true" />
        {label}
      </span>
      <span className="text-sm font-bold text-black font-ebrima text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}

function PlanCard({ label, price, sub, selected, onClick, icon, savings }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl border-2 p-4 transition-all ${
        selected
          ? 'border-[#1A73E8] bg-[#F5F9FF] shadow-md'
          : 'border-black/10 bg-white hover:border-[#1A73E8]/40'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-black/50 font-ebrima">
          <i className={`bx ${icon} text-base text-[#1A73E8]`} aria-hidden="true" />
          {label}
        </span>
        {selected && (
          <span className="h-5 w-5 rounded-full bg-[#1A73E8] text-white flex items-center justify-center">
            <i className="bx bx-check text-xs" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-[#0F4082] font-ebrima">
        ₦{price.toLocaleString()}
      </p>
      <p className="text-xs text-black/40 font-ebrima mt-0.5">{sub}</p>
      {savings && (
        <p className="text-xs font-bold text-green-600 font-ebrima mt-2 flex items-center gap-1">
          <i className="bx bx-purchase-tag-alt" aria-hidden="true" />
          Save ₦{savings.toLocaleString()}
        </p>
      )}
    </button>
  );
}

function BankDetail({ label, value, copyable }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
      <dt className="text-sm text-black/55 font-ebrima">{label}</dt>
      <dd className="text-sm font-bold text-black font-ebrima text-right flex items-center gap-2">
        {value}
        {copyable && (
          <button
            type="button"
            onClick={copy}
            className="text-xs font-semibold text-[#1A73E8] hover:text-[#0F4082] transition-colors"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </dd>
    </div>
  );
}