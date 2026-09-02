// src/pages/Payment.jsx
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import BrandPanel from "../components/BrandPanel";
import { ArrowLeftIcon } from "../components/Icons";
import { BankIcon, PaymentsIcon, PhoneIcon } from "../components/BoxIcons";
import { PRICING } from "../data/pricing";

// Payment methods
const PAYMENT_METHODS = [
  { id: "bank", label: "Bank Transfer", icon: BankIcon },
  { id: "card", label: "Card Payment", icon: PaymentsIcon },
  { id: "ussd", label: "USSD", icon: PhoneIcon },
];

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { course, trackName, formData } = location.state || {};

  // Redirect if no course/track selected
  if (!trackName || !course) return <Navigate to="/admission/course-selection" replace />;

  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Get pricing for the selected course/track
  const pricing = PRICING[course]?.[trackName] || null;
  const monthlyFee = pricing?.monthly || 0;
  const termlyFee = pricing?.termly || 0;
  const dailyFee = pricing?.daily || 0;

  // Determine available payment plans
  const hasMonthly = monthlyFee > 0;
  const hasTermly = termlyFee > 0;
  const hasDaily = dailyFee > 0;

  // Default plan selection
  const [selectedPlan, setSelectedPlan] = useState(() => {
    if (hasTermly) return "termly";
    if (hasMonthly) return "monthly";
    if (hasDaily) return "daily";
    return "monthly";
  });

  // Calculate amount based on selected plan
  const getAmount = () => {
    switch(selectedPlan) {
      case "monthly": return monthlyFee;
      case "termly": return termlyFee;
      case "daily": return dailyFee;
      default: return 0;
    }
  };

  const amountToPay = getAmount();

  const handlePayment = async (e) => {
    e.preventDefault();
    if (amountToPay <= 0) return;

    setPaymentProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentComplete(true);

      // After payment, navigate to success page
      setTimeout(() => {
        navigate("/admission/application-submitted", {
          state: {
            studentFirstName: formData?.studentName?.split(" ")[0] || "Student",
            guardianEmail: formData?.guardianEmail || "",
            programmeLabel: `${course} · ${trackName}`,
            paymentMethod: paymentMethod,
            amountPaid: amountToPay,
            plan: selectedPlan,
            transactionId: `COD-${Date.now().toString().slice(-8)}`,
            paymentDate: new Date().toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          },
        });
      }, 1000);
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen w-full flex bg-cod-bg overflow-hidden">
        <BrandPanel />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-slate-600 mt-2">Redirecting to confirmation...</p>
          </div>
        </div>
      </div>
    );
  }

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
          <p className="text-slate-500">Complete your enrollment by making payment</p>
        </div>

        <form onSubmit={handlePayment} className="rounded-2xl bg-white border border-slate-200 px-6 md:px-8 py-8 space-y-8 animate-fadeUp">
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
                  <span className="font-medium text-slate-800">{pricing.description}</span>
                </div>
              )}
              {formData?.studentName && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Student</span>
                  <span className="font-semibold text-slate-800">{formData.studentName}</span>
                </div>
              )}
            </div>
          </section>

          {/* Fee Structure */}
          <section>
            <h2 className="text-cod-blue font-bold mb-1">Fee Structure</h2>
            <div className="h-px bg-slate-200 mb-5" />

            {/* Payment Plan Options */}
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
                    <div className="text-xs text-slate-500 font-medium">Monthly</div>
                    <div className="text-xl font-bold text-cod-blue">₦{monthlyFee.toLocaleString()}</div>
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
                    <div className="text-xs text-slate-500 font-medium">Termly</div>
                    <div className="text-xl font-bold text-cod-blue">₦{termlyFee.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">3 months</div>
                    {hasMonthly && monthlyFee * 3 > termlyFee && (
                      <div className="text-xs text-green-600 font-semibold mt-1">
                        Save ₦{(monthlyFee * 3 - termlyFee).toLocaleString()}
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
                    <div className="text-xs text-slate-500 font-medium">Daily</div>
                    <div className="text-xl font-bold text-cod-blue">₦{dailyFee.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">per session</div>
                  </button>
                )}
              </div>
            )}

            {/* Only show if no payment plans available (fallback) */}
            {!hasMonthly && !hasTermly && !hasDaily && (
              <div className="text-center py-4">
                <div className="text-xl font-bold text-cod-blue">₦{amountToPay.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Fee</div>
              </div>
            )}

            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-pink-50 p-4 flex justify-between items-center">
              <span className="font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-cod-blue">₦{amountToPay.toLocaleString()}</span>
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="text-cod-blue font-bold mb-1">Payment Method</h2>
            <div className="h-px bg-slate-200 mb-5" />

            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    paymentMethod === method.id
                      ? "border-cod-blue bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <method.icon className="h-6 w-6 mx-auto text-cod-blue" />
                  <div className="text-xs font-medium mt-1">{method.label}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Bank Transfer Details (conditional) */}
          {paymentMethod === "bank" && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <h4 className="font-semibold text-sm mb-2">Bank Transfer Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Bank</span>
                  <span className="font-medium">Zenith Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Account Number</span>
                  <span className="font-medium text-cod-blue font-bold">1219258176</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Account Name</span>
                  <span className="font-medium">Clan of David Art and Music Academy</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-600 font-semibold">Amount to Pay</span>
                  <span className="font-bold text-cod-blue text-lg">₦{amountToPay.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  <span className="font-semibold">Important:</span> Use the student's name as payment reference. 
                  After transfer, click the "Confirm Payment" button below.
                </p>
              </div>
            </div>
          )}

          {/* Card Payment Info (conditional) */}
          {paymentMethod === "card" && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <h4 className="font-semibold text-sm mb-2">Card Payment</h4>
              <p className="text-sm text-slate-600">
                You will be redirected to our secure payment gateway to complete your card payment.
              </p>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                <span>🔒 Secure</span>
                <span>💳 All major cards accepted</span>
              </div>
            </div>
          )}

          {/* USSD Info (conditional) */}
          {paymentMethod === "ussd" && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <h4 className="font-semibold text-sm mb-2">USSD Payment</h4>
              <p className="text-sm text-slate-600">
                Dial <span className="font-bold">*901#</span> or your bank's USSD code and follow the prompts.
              </p>
              <div className="mt-2 text-xs text-slate-500">
                <p>Amount: <span className="font-semibold text-cod-blue">₦{amountToPay.toLocaleString()}</span></p>
                <p>Reference: <span className="font-mono">COD-{Date.now().toString().slice(-8)}</span></p>
              </div>
            </div>
          )}

          {/* Payment Button */}
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
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </span>
            ) : (
              `Pay ₦${amountToPay.toLocaleString()}`
            )}
          </button>

          <p className="text-center text-xs text-slate-400">
            By proceeding, you agree to our terms and conditions. Payment is non-refundable.
          </p>
        </form>
      </div>
    </div>
  );
}