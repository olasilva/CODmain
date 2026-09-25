// src/pages/admission/CourseSelection.jsx
import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ArrowLeftIcon } from '../../components/Icons';
import {
  CAMPUSES,
  PRICING,
  formatCurrency,
  planPriceTag,
} from '../../data/pricing';
import { isLoggedIn, getSession } from '../../lib/api';

export default function CourseSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const [campusId, setCampusId] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [checking, setChecking] = useState(true);

  // State passed from /application
  const applicationState = location.state || {};
  const { formData, trackName, applicationId } = applicationState;

  useEffect(() => {
    if (!isLoggedIn('student') || !getSession('student')) {
      navigate('/admission/create-account', { replace: true });
      return;
    }
    setChecking(false);
  }, [navigate]);

  // If they skipped /application, send them back
  if (!checking && !trackName) {
    return <Navigate to="/application" replace />;
  }

  const plans = campusId ? PRICING[campusId] : null;
  const activePlan = campusId && planId ? plans?.[planId] : null;
  const selectedCampus = CAMPUSES.find((c) => c.id === campusId);
  const canProceed = Boolean(campusId && planId);

  function selectCampus(id) {
    setCampusId(id);
    setPlanId(null);
    // Auto-select if the campus only has one plan
    const campusPlans = PRICING[id] || {};
    const ids = Object.keys(campusPlans);
    if (ids.length === 1) setPlanId(ids[0]);
  }

  function handleProceed() {
    if (!canProceed) return;
    navigate('/payment', {
      state: {
        course: campusId,       // Payment.jsx reads PRICING[course][trackName]
        trackName: planId,
        formData,
        applicationId,
      },
    });
  }

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
        <div className="max-w-4xl mx-auto">
          {/* Progress — Step 3 of 4 */}
          <div className="flex items-center gap-3 mb-8">
            <StepDot done>1</StepDot>
            <StepBar done />
            <StepDot done>2</StepDot>
            <StepBar done />
            <StepDot active>3</StepDot>
            <StepBar />
            <StepDot>4</StepDot>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[30px] sm:text-4xl font-bold text-[#0F4082] font-ebrima leading-tight">
              Choose Your Programme
            </h1>
            <p className="text-sm text-black/60 font-ebrima mt-2">
              Step 3 of 4 · Pick a campus and a schedule plan
            </p>
          </div>

          {/* Application summary from previous step */}
          {trackName && (
            <div className="rounded-2xl bg-white border border-black/10 px-5 py-4 mb-6 flex items-center gap-4 shadow-sm">
              <span className="h-11 w-11 rounded-xl bg-[#F5F9FF] text-[#1A73E8] flex items-center justify-center shrink-0">
                <i className="bx bx-book-open text-xl" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-black/40 text-[11px] font-bold uppercase tracking-wider mb-1">
                  Programme selected
                </p>
                <p className="text-[#1A73E8] font-bold truncate font-ebrima">
                  {trackName}
                  {formData?.regularClass && (
                    <span className="text-black/50 font-normal">
                      {' · '}{formData.regularClass}
                    </span>
                  )}
                  {formData?.instrument && (
                    <span className="text-black/50 font-normal">
                      {' · '}{formData.instrument}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* ─── Step 1: Campus ─── */}
          <SectionHeading step="1" title="Choose a campus" icon="bx-map-pin" />

          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {CAMPUSES.map((c) => {
              const active = c.id === campusId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectCampus(c.id)}
                  className={`text-left rounded-2xl border-2 p-5 transition-all ${
                    active
                      ? 'border-[#1A73E8] bg-white shadow-lg'
                      : 'border-black/10 bg-white hover:border-[#1A73E8]/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${
                        active
                          ? 'bg-[#1A73E8] text-white'
                          : 'bg-[#F5F9FF] text-[#1A73E8]'
                      }`}
                    >
                      <i
                        className="bx bx-building-house text-2xl"
                        aria-hidden="true"
                      />
                    </span>
                    {active && (
                      <span className="h-6 w-6 rounded-full bg-[#1A73E8] text-white flex items-center justify-center">
                        <i className="bx bx-check text-base" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-black font-ebrima mb-1">
                    {c.name}
                  </p>
                  {c.tagline && (
                    <p className="text-xs text-black/50 font-ebrima leading-snug">
                      {c.tagline}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* ─── Step 2: Plan ─── */}
          {plans && (
            <>
              <SectionHeading
                step="2"
                title="Choose a plan"
                icon="bx-calendar-check"
              />

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {Object.entries(plans).map(([id, plan]) => {
                  const isSelected = planId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPlanId(id)}
                      className={`text-left rounded-2xl border-2 p-5 transition-all ${
                        isSelected
                          ? 'border-[#1A73E8] bg-white shadow-lg'
                          : 'border-black/10 bg-white hover:border-[#1A73E8]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="font-bold text-black font-ebrima leading-snug">
                          {id}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                            isSelected
                              ? 'bg-[#1A73E8] text-white'
                              : 'bg-[#F5F9FF] text-[#1A73E8]'
                          }`}
                        >
                          {planPriceTag(plan)}
                        </span>
                      </div>

                      {plan.description && (
                        <p className="text-xs text-black/50 font-ebrima leading-snug mb-3">
                          {plan.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 pt-3 border-t border-black/5">
                        {plan.monthly > 0 && (
                          <Chip label="Monthly" value={formatCurrency(plan.monthly)} />
                        )}
                        {plan.termly > 0 && (
                          <Chip label="Termly" value={formatCurrency(plan.termly)} />
                        )}
                        {plan.daily > 0 && (
                          <Chip label="Daily" value={formatCurrency(plan.daily)} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ─── Summary ─── */}
          {canProceed && activePlan && (
            <div className="rounded-2xl bg-gradient-to-r from-[#F5F9FF] to-[#FFF5FA] border border-[#1A73E8]/15 p-5 mb-6 animate-fadeUp">
              <div className="flex items-center gap-2 mb-3">
                <i
                  className="bx bx-check-circle text-[#1A73E8] text-xl"
                  aria-hidden="true"
                />
                <p className="font-bold text-[#0F4082] font-ebrima">
                  Your selection
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-black/40 text-xs font-ebrima">Campus</p>
                  <p className="font-bold text-black font-ebrima">
                    {selectedCampus?.name || campusId}
                  </p>
                </div>
                <div>
                  <p className="text-black/40 text-xs font-ebrima">Plan</p>
                  <p className="font-bold text-black font-ebrima">{planId}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-black/5">
                <span className="text-black/50 text-sm font-ebrima">
                  Starting from
                </span>
                <span className="text-xl font-bold text-[#0F4082] font-ebrima">
                  {activePlan.monthly
                    ? `${formatCurrency(activePlan.monthly)}/mo`
                    : activePlan.termly
                    ? `${formatCurrency(activePlan.termly)}/term`
                    : `${formatCurrency(activePlan.daily)}/day`}
                </span>
              </div>
            </div>
          )}

          {/* ─── Buttons ─── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/application"
              state={applicationState}
              className="flex-1 h-14 bg-white border border-black/15 hover:bg-black/5 transition-colors text-black/70 font-bold text-base rounded-full flex items-center justify-center font-ebrima gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Link>
            <button
              type="button"
              onClick={handleProceed}
              disabled={!canProceed}
              className={`flex-1 h-14 rounded-full font-bold text-base font-ebrima transition-all duration-200 inline-flex items-center justify-center gap-2 ${
                canProceed
                  ? 'bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white shadow-md hover:opacity-95 active:scale-[0.98]'
                  : 'bg-[#1A73E8]/30 text-white/70 cursor-not-allowed'
              }`}
            >
              Continue to Payment
              <i className="bx bx-right-arrow-alt text-lg" aria-hidden="true" />
            </button>
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
        done
          ? 'bg-[#1A73E8]/30'
          : active
          ? 'bg-[#1A73E8]'
          : 'bg-[#1A73E8]/15'
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

function SectionHeading({ step, title, icon }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
      <span className="h-6 w-6 rounded-full bg-[#FF2E96]/10 text-[#FF2E96] flex items-center justify-center text-xs">
        {step}
      </span>
      <i className={`bx ${icon} text-[#FF2E96] text-sm`} aria-hidden="true" />
      <span className="text-[#FF2E96]">{title}</span>
    </div>
  );
}

function Chip({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F9FF] border border-[#1A73E8]/15 px-3 py-1 text-xs">
      <span className="text-black/50 font-ebrima">{label}:</span>
      <span className="font-bold text-[#0F4082] font-ebrima">{value}</span>
    </span>
  );
}