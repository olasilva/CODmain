import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BrandPanel from "../../components/BrandPanel";
import { ArrowLeftIcon } from "../../components/Icons";
import { CAMPUSES, PRICING, formatCurrency, planPriceTag } from "../../data/pricing";

export default function CourseSelection() {
  const navigate = useNavigate();
  const [campusId, setCampusId] = useState(null);
  const [planId, setPlanId] = useState(null);

  const plans = campusId ? PRICING[campusId] : null;
  const activePlan = campusId && planId ? plans[planId] : null;
  const canProceed = Boolean(campusId && planId);

  function selectCampus(id) {
    setCampusId(id);
    setPlanId(null);
    // A campus with only one plan (e.g. Wuye Center) selects itself.
    const campusPlans = PRICING[id];
    const planIds = Object.keys(campusPlans);
    if (planIds.length === 1) setPlanId(planIds[0]);
  }

  function selectPlan(id) {
    setPlanId(id);
  }

  function handleProceed() {
    if (!canProceed) return;
    navigate("/admission/complete-application", {
      // Payment.jsx reads PRICING[course][trackName], so course = campus,
      // trackName = plan. Keeping this shape means CompleteApplication and
      // Payment need no changes.
      state: { trackName: planId, course: campusId },
    });
  }

  return (
    <div className="min-h-screen w-full flex bg-cod-bg overflow-hidden">
      <BrandPanel />

      <div className="flex-1 px-6 lg:px-16 py-10 md:py-14 pt-24 md:pt-14 max-w-4xl mx-auto w-full">
        <Link
          to="/welcome"
          className="focus-ring inline-flex items-center gap-1.5 text-cod-blue font-semibold text-sm mb-8 hover:text-cod-blue-dark transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Link>

        <div className="text-center mb-8 animate-fadeUp">
          <h1 className="text-slate-800 text-3xl font-bold mb-2">Choose Your Programme</h1>
          <p className="text-slate-500">Select a campus and a class plan to see your fees</p>
        </div>

        {/* Step 1: Campus */}
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-cod-pink">
          <span className="h-2 w-2 rounded-full bg-cod-pink" />
          Step 1 · Choose a campus
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {CAMPUSES.map((c) => {
            const isActive = c.id === campusId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCampus(c.id)}
                className={`focus-ring text-left rounded-2xl border-2 px-6 py-5 transition-all duration-200 ${
                  isActive
                    ? "border-transparent bg-cod-btn text-white shadow-md"
                    : "border-slate-200 bg-white hover:border-cod-blue/40"
                }`}
              >
                <span className={`block font-bold text-lg ${isActive ? "text-white" : "text-cod-blue"}`}>
                  {c.name}
                </span>
                <span className={`block text-sm mt-1 ${isActive ? "text-blue-50" : "text-slate-500"}`}>
                  {c.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step 2: Plan (with price tags) */}
        {plans && (
          <>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-cod-pink animate-fadeIn">
              <span className="h-2 w-2 rounded-full bg-cod-pink" />
              Step 2 · Choose a plan
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8 animate-fadeIn">
              {Object.entries(plans).map(([id, plan]) => {
                const isSelected = planId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectPlan(id)}
                    className={`focus-ring text-left rounded-2xl border-2 px-6 py-5 transition-all duration-200 ${
                      isSelected
                        ? "border-cod-blue bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-bold text-slate-800">{id}</span>
                      {/* Price tag */}
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                          isSelected ? "bg-cod-blue text-white" : "bg-slate-100 text-cod-blue"
                        }`}
                      >
                        {planPriceTag(plan)}
                      </span>
                    </div>
                    <span className="block text-sm text-slate-500 mt-1">{plan.description}</span>

                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
                      {plan.monthly && (
                        <span>
                          Monthly: <span className="font-semibold text-slate-700">{formatCurrency(plan.monthly)}</span>
                        </span>
                      )}
                      {plan.termly && (
                        <span>
                          Termly: <span className="font-semibold text-slate-700">{formatCurrency(plan.termly)}</span>
                        </span>
                      )}
                      {plan.daily && (
                        <span>
                          Daily: <span className="font-semibold text-slate-700">{formatCurrency(plan.daily)}</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="text-center mt-8">
          {canProceed && (
            <p className="text-sm text-slate-600 mb-4 animate-fadeIn">
              Selected: <span className="font-semibold text-cod-blue">{planId}</span> — {campusId}
              {activePlan?.monthly && (
                <> · <span className="font-semibold text-cod-blue">{formatCurrency(activePlan.monthly)}</span>/mo</>
              )}
              {!activePlan?.monthly && activePlan?.daily && (
                <> · <span className="font-semibold text-cod-blue">{formatCurrency(activePlan.daily)}</span>/session</>
              )}
            </p>
          )}
          <button
            type="button"
            disabled={!canProceed}
            onClick={handleProceed}
            className={`focus-ring rounded-full font-semibold px-8 py-3.5 shadow-md transition-all duration-200 ${
              canProceed
                ? "bg-cod-btn text-white hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
                : "bg-cod-btn text-white/80 opacity-50 cursor-not-allowed"
            }`}
          >
            Proceed to Complete Application
          </button>
        </div>
      </div>
    </div>
  );
}