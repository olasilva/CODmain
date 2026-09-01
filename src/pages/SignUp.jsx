import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const initialForm = { fullName: "", email: "", phone: "", password: "" };

export default function SignUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const roleFromQuery = new URLSearchParams(location.search).get('role');
  const [selectedRole, setSelectedRole] = useState(
    roleFromQuery === 'staff' ? 'staff' : 'student'
  );
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleStep1Submit(e) {
    e.preventDefault();
    setStep(2);
  }

  return (
    <div className="min-h-screen bg-cod-bg flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md animate-fadeUp">
        <div className="mb-6">
          <div className="inline-flex w-full rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            {['student', 'staff'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  selectedRole === role ? 'bg-cod-btn text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {role === 'student' ? 'Student' : 'Staff'}
              </button>
            ))}
          </div>
        </div>

        <StepIndicator step={step} />

        {step === 1 && (
          <>
            <h1 className="text-slate-900 text-3xl font-bold mb-1">
              {selectedRole === 'staff'
                ? 'Create Staff Account'
                : 'Create Student Account'}
            </h1>
            <p className="text-slate-500 mb-8">Step 1: Basic information</p>

            <form onSubmit={handleStep1Submit} className="space-y-6">
              <label className="block">
                <span className="block text-slate-700 mb-2">Full Name</span>
                <input
                  required
                  value={form.fullName}
                  onChange={update("fullName")}
                  placeholder="John Doe"
                  className="field py-3.5"
                />
              </label>

              <label className="block">
                <span className="block text-slate-700 mb-2">Email Address</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className="field py-3.5"
                />
              </label>

              <label className="block">
                <span className="block text-slate-700 mb-2">Phone Number</span>
                <input
                  required
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="+1 (555) 000-0000"
                  className="field py-3.5"
                />
              </label>

              <label className="block">
                <span className="block text-slate-700 mb-2">Password</span>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={update("password")}
                  placeholder="••••••••"
                  className="field py-3.5"
                />
              </label>

              <button
                type="submit"
                className="focus-ring w-full rounded-full bg-cod-btn text-white font-semibold py-3.5 shadow-md
                           transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
              >
                Continue
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <Step2 form={form} onBack={() => setStep(1)} selectedRole={selectedRole} />
        )}

        <div className="flex items-center gap-4 my-6">
          <span className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-sm">Already have an account?</span>
          <span className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="text-center">
          <Link to={`/login?role=${selectedRole}`} className="focus-ring inline-flex items-center gap-1.5 text-cod-blue font-bold hover:text-cod-blue-dark transition-colors">
            Login
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span
        className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
          step >= 1 ? "bg-cod-blue text-white" : "bg-blue-100 text-cod-blue"
        }`}
      >
        1
      </span>
      <span className="w-10 h-0.5 bg-cod-blue" />
      <span
        className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
          step >= 2 ? "bg-cod-blue text-white" : "bg-blue-100 text-cod-blue"
        }`}
      >
        2
      </span>
    </div>
  );
}

/**
 * Step 2 was not in the provided mockups — this is a placeholder
 * confirmation screen so the two-step flow is complete end-to-end.
 * Replace with whatever step 2 should actually collect (e.g. role
 * selection, terms acceptance, or verification code).
 */
function Step2({ form, onBack, selectedRole }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!agreed) return;
    console.log("signup", form);
    navigate(`/login?role=${selectedRole}`);
  }

  return (
    <>
      <h1 className="text-slate-900 text-3xl font-bold mb-1">Create Account</h1>
      <p className="text-slate-500 mb-8">Step 2: Confirm &amp; agree</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 space-y-2 text-sm">
          <SummaryRow label="Name" value={form.fullName} />
          <SummaryRow label="Email" value={form.email} />
          <SummaryRow label="Phone" value={form.phone} />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-cod-blue shrink-0"
          />
          <span className="text-sm text-slate-600 leading-relaxed">
            I agree to the terms and conditions of Clan of David Art and Music Academy.
          </span>
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="focus-ring flex-1 rounded-full border border-slate-200 text-slate-700 font-semibold py-3.5
                       transition-all duration-200 hover:border-slate-300"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!agreed}
            className={`focus-ring flex-1 rounded-full font-semibold py-3.5 shadow-md transition-all duration-200 ${
              agreed
                ? "bg-cod-btn text-white hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
                : "bg-cod-btn text-white/80 opacity-50 cursor-not-allowed"
            }`}
          >
            Create Account
          </button>
        </div>
      </form>
    </>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-700 font-medium">{value || "—"}</span>
    </div>
  );
}
