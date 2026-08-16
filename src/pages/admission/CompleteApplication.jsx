import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import BrandPanel from "../../components/BrandPanel";
import { ArrowLeftIcon } from "../../components/Icons";

const initialForm = {
  studentName: "",
  dob: "",
  gender: "",
  nationality: "",
  previousSchool: "",
  guardianName: "",
  guardianEmail: "",
  guardianPhone: "",
  homeAddress: "",
  medicalNotes: "",
};

export default function CompleteApplication() {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackName, course } = location.state || {};

  const [form, setForm] = useState(initialForm);
  const [agreed, setAgreed] = useState(false);

  // Reached this page directly without going through course selection.
  if (!trackName || !course) return <Navigate to="/admission" replace />;

  const requiredFilled =
    form.studentName && form.dob && form.gender &&
    form.guardianName && form.guardianEmail && form.guardianPhone && form.homeAddress;
  const canSubmit = requiredFilled && agreed;

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: send `form` + { trackName, course } to your backend / Supabase here.
    navigate("/admission/submitted", {
      state: {
        studentFirstName: form.studentName.split(" ")[0] || form.studentName,
        guardianEmail: form.guardianEmail,
        programmeLabel: `${course} · ${trackName}`,
      },
    });
  }

  return (
    <div className="min-h-screen w-full flex bg-cod-bg overflow-hidden">
      <BrandPanel />

      <div className="flex-1 px-6 lg:px-16 py-10 md:py-14 pt-24 md:pt-14 max-w-3xl mx-auto w-full">
        <Link
          to="/admission"
          className="focus-ring inline-flex items-center gap-1.5 text-cod-blue font-semibold text-sm mb-6 hover:text-cod-blue-dark transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Link>

        <div className="text-center mb-6 animate-fadeUp">
          <h1 className="text-slate-800 text-3xl font-bold mb-2">Complete Application</h1>
          <p className="text-slate-500">Please fill in all required fields to complete your enrolment</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-pink-50 border border-slate-100 px-6 py-4 mb-6 flex items-center gap-3 animate-fadeUp">
          <span className="h-9 w-9 rounded-full bg-cod-btn flex items-center justify-center shrink-0 text-white text-sm">◎</span>
          <div>
            <p className="text-slate-500 text-xs font-medium">Selected Programme</p>
            <p className="text-cod-blue font-bold">
              {course} · {trackName}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-200 px-6 md:px-8 py-8 space-y-8 animate-fadeUp">
          {/* Student information */}
          <section>
            <h2 className="text-cod-blue font-bold mb-1">Student Information</h2>
            <div className="h-px bg-slate-200 mb-5" />

            <div className="space-y-5">
              <Field label="Student Full Name" required>
                <input
                  required
                  value={form.studentName}
                  onChange={update("studentName")}
                  placeholder="e.g. David Emmanuel"
                  className="field"
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Date of Birth" required>
                  <input
                    type="date"
                    required
                    value={form.dob}
                    onChange={update("dob")}
                    className="field"
                  />
                </Field>
                <Field label="Gender" required>
                  <select required value={form.gender} onChange={update("gender")} className="field">
                    <option value="" disabled>Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Nationality">
                  <input
                    value={form.nationality}
                    onChange={update("nationality")}
                    placeholder="e.g. Nigerian"
                    className="field"
                  />
                </Field>
                <Field label="Previous School (if any)">
                  <input
                    value={form.previousSchool}
                    onChange={update("previousSchool")}
                    placeholder="Name of last school attended"
                    className="field"
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* Parent / guardian information */}
          <section>
            <h2 className="text-cod-blue font-bold mb-1">Parent / Guardian Information</h2>
            <div className="h-px bg-slate-200 mb-5" />

            <div className="space-y-5">
              <Field label="Parent / Guardian Full Name" required>
                <input
                  required
                  value={form.guardianName}
                  onChange={update("guardianName")}
                  placeholder="e.g. Mr. Emmanuel Okafor"
                  className="field"
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Email Address" required>
                  <input
                    type="email"
                    required
                    value={form.guardianEmail}
                    onChange={update("guardianEmail")}
                    placeholder="e.g. parent@email.com"
                    className="field"
                  />
                </Field>
                <Field label="Phone Number" required>
                  <input
                    required
                    value={form.guardianPhone}
                    onChange={update("guardianPhone")}
                    placeholder="e.g. +234 801 234 5678"
                    className="field"
                  />
                </Field>
              </div>

              <Field label="Home Address" required>
                <input
                  required
                  value={form.homeAddress}
                  onChange={update("homeAddress")}
                  placeholder="Full residential address"
                  className="field"
                />
              </Field>
            </div>
          </section>

          {/* Additional information */}
          <section>
            <h2 className="text-cod-blue font-bold mb-1">Additional Information</h2>
            <div className="h-px bg-slate-200 mb-5" />

            <Field label="Medical / Special Needs (if any)">
              <textarea
                rows={3}
                value={form.medicalNotes}
                onChange={update("medicalNotes")}
                placeholder="Describe any medical conditions, allergies, or special needs..."
                className="field resize-none"
              />
            </Field>
          </section>

          <label className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-cod-blue shrink-0"
            />
            <span className="text-sm text-slate-600 leading-relaxed">
              By submitting this application, I confirm that all information provided is accurate and complete.
              I agree to the terms and conditions of Clan of David Art and Music Academy.
            </span>
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`focus-ring w-full rounded-full font-semibold py-3.5 shadow-md transition-all duration-200 ${
              canSubmit
                ? "bg-cod-btn text-white hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
                : "bg-cod-btn text-white/80 opacity-50 cursor-not-allowed"
            }`}
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-cod-pink"> *</span>}
      </span>
      {children}
    </label>
  );
}
