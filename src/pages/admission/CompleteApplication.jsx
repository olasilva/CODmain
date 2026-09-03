import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import BrandPanel from "../../components/BrandPanel";
import { ArrowLeftIcon } from "../../components/Icons";
import { DocumentIcon } from "../../components/BoxIcons";
import { COUNTRIES } from "../../data/countries";
import { createApplication } from "../../lib/api";

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

const MAX_PHOTO_MB = 5;

export default function CompleteApplication() {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackName, course } = location.state || {};

  const [form, setForm] = useState(initialForm);
  const [agreed, setAgreed] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Revoke the object URL when the photo changes or the component unmounts,
  // so we don't leak memory.
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  // Reached this page directly without going through course selection.
  if (!trackName || !course) return <Navigate to="/admission/course-selection" replace />;

  const requiredFilled =
    form.studentName && form.dob && form.gender &&
    form.guardianName && form.guardianEmail && form.guardianPhone && form.homeAddress;
  const canSubmit = requiredFilled && agreed;

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setPhotoError(`Image must be under ${MAX_PHOTO_MB}MB.`);
      return;
    }

    setPhotoError("");
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
    setPhotoError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const application = await createApplication({ ...form, trackName, course, photoName: photo?.name || null });
      navigate("/payment", { state: { applicationId: application.id, formData: form, trackName, course } });
    } catch (error) {
      setSubmitError(error.message || "We could not save your application. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-[#f6f8fc] overflow-hidden">
      <BrandPanel />

      <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 py-8 md:py-12 pt-24 md:pt-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
        <Link
          to="/admission/course-selection"
          className="focus-ring inline-flex items-center gap-2 text-slate-500 font-semibold text-sm mb-8 hover:text-cod-blue transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Change programme
        </Link>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-8 items-start">
          <div>
            <div className="mb-7 animate-fadeUp">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-cod-pink mb-3">
                <span className="h-2 w-2 rounded-full bg-cod-pink" />
                Step 2 of 3
              </div>
              <h1 className="text-slate-900 text-3xl sm:text-4xl font-bold leading-tight mb-3">Complete your application</h1>
              <p className="text-slate-500 max-w-xl leading-relaxed">Tell us a little more about the student. This information helps us prepare the right learning experience.</p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200/80 px-5 py-4 mb-6 flex items-center gap-4 shadow-sm animate-fadeUp">
              <span className="h-11 w-11 rounded-xl bg-cod-btn flex items-center justify-center shrink-0 text-white">
                <DocumentIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Your selected programme</p>
                <p className="text-cod-blue font-bold truncate">{course} <span className="text-slate-300 mx-1">/</span> {trackName}</p>
              </div>
              <span className="ml-auto hidden sm:inline-flex rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold">Selected</span>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-200/80 px-5 sm:px-8 py-7 sm:py-9 space-y-9 shadow-sm animate-fadeUp">
          {/* Student information */}
          <section>
            <h2 className="text-cod-blue font-bold mb-1">Student Information</h2>
            <div className="h-px bg-slate-200 mb-5" />

            <div className="space-y-5">
              {/* Photo upload */}
              <div className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1.5">Student Photo</span>
                <div className="flex items-center gap-5">
                  <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Student preview" className="h-full w-full object-cover" />
                    ) : (
                      <svg className="h-8 w-8 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <label className="focus-ring inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-cod-blue cursor-pointer hover:border-cod-blue/40 transition-colors">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 16V4M12 4l-4 4M12 4l4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {photo ? "Change photo" : "Upload photo"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>

                      {photo && (
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="focus-ring text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Passport-style photo, JPG or PNG, up to {MAX_PHOTO_MB}MB. Optional, but helps with ID and enrolment records.
                    </p>
                    {photoError && <p className="text-xs text-red-500 mt-1">{photoError}</p>}
                  </div>
                </div>
              </div>

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
                  <select
                    value={form.nationality}
                    onChange={update("nationality")}
                    className="field"
                  >
                    <option value="" disabled>Select nationality</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
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

          {submitError && <p className="text-sm text-red-600" role="alert">{submitError}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className={`focus-ring w-full rounded-full font-semibold py-3.5 shadow-md transition-all duration-200 ${
              canSubmit
                ? "bg-cod-btn text-white hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
                : "bg-cod-btn text-white/80 opacity-50 cursor-not-allowed"
            }`}
          >
            Continue to Payment
          </button>
        </form>
          </div>

          <aside className="hidden lg:block rounded-2xl bg-cod-blue-deep text-white p-6 sticky top-8 animate-fadeUp">
            <p className="text-cod-pink-light text-xs font-bold uppercase tracking-[0.16em] mb-4">Application guide</p>
            <h2 className="text-xl font-bold leading-snug mb-6">Almost ready to join the academy.</h2>
            <div className="space-y-5 text-sm">
              <div className="flex gap-3">
                <span className="h-6 w-6 rounded-full bg-white text-cod-blue flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <p className="text-blue-100 leading-relaxed">Complete the student and guardian details.</p>
              </div>
              <div className="flex gap-3">
                <span className="h-6 w-6 rounded-full bg-cod-pink text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <p className="text-white leading-relaxed font-semibold">Review your information and pay the admission fee.</p>
              </div>
              <div className="flex gap-3">
                <span className="h-6 w-6 rounded-full border border-blue-300 text-blue-200 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <p className="text-blue-200 leading-relaxed">Receive your confirmation by email.</p>
              </div>
            </div>
            <div className="border-t border-white/15 mt-7 pt-5">
              <p className="text-blue-200 text-xs leading-relaxed">Fields marked with <span className="text-cod-pink-light">*</span> are required.</p>
            </div>
          </aside>
        </div>
        </div>
      </main>
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