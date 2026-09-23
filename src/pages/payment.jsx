// src/pages/Payment.jsx
import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import BrandPanel from "../components/BrandPanel";
import { ArrowLeftIcon } from "../components/Icons";
import { PRICING } from "../data/pricing";
import { initializePayment } from "../lib/api";

export default function Payment() {
  const location = useLocation();
  const { course, trackName, formData, applicationId } = location.state || {};

  // Redirect if no course/track selected
  if (!trackName || !course) {
    return <Navigate to="/admission/course-selection" replace />;
  }

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Get pricing for the selected course/track
  const pricing = PRICING[course]?.[trackName] || null;
  const monthlyFee = pricing?.monthly || 0;
  const termlyFee = pricing?.termly || 0;
  const dailyFee = pricing?.daily || 0;

  const hasMonthly = monthlyFee > 0;
  const hasTermly = termlyFee > 0;
  const hasDaily = dailyFee > 0;

  const [selectedPlan, setSelectedPlan] = useState(() => {
    if (hasTermly) return "termly";
    if (hasMonthly) return "monthly";
    if (hasDaily) return "daily";
    return "monthly";
  });

  const getAmount = () => {
    switch (selectedPlan) {
      case "monthly":
        return monthlyFee;
      case "termly":
        return termlyFee;
      case "daily":
        return dailyFee;
      default:
        return 0;
    }
  };

  const amountToPay = getAmount();

  const handlePayment = async (e) => {
    e.preventDefault();
    if (amountToPay <= 0) return;

    setPaymentProcessing(true);
    setPaymentError("");

    try {
      const result = await initializePayment({
        amount: amountToPay,
        email: formData?.guardianEmail || "",
        course,
        trackName,
        plan: selectedPlan,
        studentName: formData?.studentName || "",
        applicationId: applicationId || null,
        // Tells the backend where to send the browser after Paystack
        // verifies the payment. The backend should forward to this URL
        // once verification succeeds.
        callbackUrl: `${window.location.origin}/login?registered=true`,
      });

      if (!result?.authorization_url) {
        throw new Error("Payment gateway did not return a checkout URL");
      }

      // Redirect the browser to Paystack's hosted checkout.
      // After payment, Paystack → /api/payments/verify?reference=...
      // → backend verifies → redirects the browser to /login?registered=true
      window.location.href = result.authorization_url;
    } catch (error) {
      setPaymentProcessing(false);
      setPaymentError(
        error.message || "Payment could not be completed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-cod-bg overflow-hidden">
      <BrandPanel />

      <div className="flex-1 px-6 lg:px-16 py-10 md:py-14 pt-24 md:pt-14 max-w-3xl mx-auto w-full">
        <Link
          to="/admission/complete-application"
          state={{ trackName, course }}
          className="focus-ring inline-flex items-center gap-1.5 text-cod-blue font-semibold text-sm mb-6 hover:text-cod-blue-dark transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Application
        </Link>

        <div className="text-center mb-6 animate-fadeUp">
          <h1 className="text-slate-800 text-3xl font-bold mb-2">Payment</h1>
          <p className="text-slate-500">
            Complete your enrollment by making payment
          </p>
        </div>

        <form
          onSubmit={handlePayment}
          className="rounded-2xl bg-white border border-slate-200 px-6 md:px-8 py-8 space-y-8 animate-fadeUp"
        >
          {/* Programme Summary */}
          <section>
            <h2 className="text-cod-blue font-bold mb-1">Programme Summary</h2>
            <div className="h-px bg-slate-200 mb-5" />

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Campus</span>
                <span className="font-semibold text-slate-800">{course}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Programme</span>
                <span className="font-semibold text-slate-800">{trackName}</span>
              </div>
              {pricing?.description && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Schedule</span>
                  <span className="font-medium text-slate-800">
                    {pricing.description}
                  </span>
                </div>
              )}
              {formData?.studentName && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Student</span>
                  <span className="font-semibold text-slate-800">
                    {formData.studentName}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Fee Structure */}
          <section>
            <h2 className="text-cod-blue font-bold mb-1">Fee Structure</h2>
            <div className="h-px bg-slate-200 mb-5" />

            {(hasMonthly || hasTermly || hasDaily) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {hasMonthly && (
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("monthly")}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      selectedPlan === "monthly"
                        ? "border-cod-blue bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs text-slate-500 font-medium">
                      Monthly
                    </div>
                    <div className="text-xl font-bold text-cod-blue">
                      ₦{monthlyFee.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">per month</div>
                  </button>
                )}

                {hasTermly && (
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("termly")}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      selectedPlan === "termly"
                        ? "border-cod-blue bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs text-slate-500 font-medium">
                      Termly
                    </div>
                    <div className="text-xl font-bold text-cod-blue">
                      ₦{termlyFee.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">3 months</div>
                    {hasMonthly && monthlyFee * 3 > termlyFee && (
                      <div className="text-xs text-green-600 font-semibold mt-1">
                        Save ₦
                        {(monthlyFee * 3 - termlyFee).toLocaleString()}
                      </div>
                    )}
                  </button>
                )}

                {hasDaily && (
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("daily")}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      selectedPlan === "daily"
                        ? "border-cod-blue bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs text-slate-500 font-medium">
                      Daily
                    </div>
                    <div className="text-xl font-bold text-cod-blue">
                      ₦{dailyFee.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">per session</div>
                  </button>
                )}
              </div>
            )}

            {!hasMonthly && !hasTermly && !hasDaily && (
              <div className="text-center py-4">
                <div className="text-xl font-bold text-cod-blue">
                  ₦{amountToPay.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Fee</div>
              </div>
            )}

            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-pink-50 p-4 flex justify-between items-center">
              <span className="font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-cod-blue">
                ₦{amountToPay.toLocaleString()}
              </span>
            </div>
          </section>

          {/* How You'll Pay */}
          <section>
            <h2 className="text-cod-blue font-bold mb-1">Payment Options</h2>
            <div className="h-px bg-slate-200 mb-5" />

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
              <p className="text-sm text-slate-700">
                You'll be redirected to{" "}
                <span className="font-semibold text-cod-blue">Paystack</span>'s
                secure checkout where you can pay with:
              </p>
              <ul className="text-sm text-slate-600 space-y-1 pl-1">
                <li className="flex items-center gap-2">
                  <i className="bx bx-credit-card text-lg text-cod-blue" aria-hidden="true" />
                  Debit or credit card
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-building-house text-lg text-cod-blue" aria-hidden="true" />
                  Bank transfer
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-mobile text-lg text-cod-blue" aria-hidden="true" />
                  USSD
                </li>
                <li className="flex items-center gap-2">
                  <i className="bx bx-lock-alt text-lg text-cod-blue" aria-hidden="true" />
                  Paystack account
                </li>
              </ul>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-200 flex items-center gap-1.5">
                <i className="bx bx-shield-quarter text-base text-cod-blue" aria-hidden="true" />
                All payments are processed securely by Paystack. Clan of David
                Academy does not store your card details.
              </p>
            </div>
          </section>

          {paymentError && (
            <p className="text-sm text-red-600" role="alert">
              {paymentError}
            </p>
          )}

          <button
            type="submit"
            disabled={amountToPay <= 0 || paymentProcessing}
            className={`focus-ring w-full rounded-full font-semibold py-3.5 shadow-md transition-all duration-200 ${
              amountToPay > 0 && !paymentProcessing
                ? "bg-cod-btn text-white hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
                : "bg-slate-300 text-slate-600 cursor-not-allowed"
            }`}
          >
            {paymentProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Redirecting to Paystack...
              </span>
            ) : (
              `Pay ₦${amountToPay.toLocaleString()}`
            )}
          </button>

          <p className="text-center text-xs text-slate-400">
            By proceeding, you agree to our terms and conditions. Payment is
            non-refundable.
          </p>
        </form>
      </div>
    </div>
  );
}