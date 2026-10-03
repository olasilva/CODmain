// src/pages/application.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { DocumentIcon } from '../components/BoxIcons';
import { COUNTRIES } from '../data/countries';
import { startAdmission, getSession, isLoggedIn } from '../lib/api';

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000/api';

// ─── Programme options ───
const PROGRAMMES = [
  {
    value: 'Regular Track',
    label: 'Regular Track',
    icon: 'bx-book-open',
    desc: 'Academic classes from Discovery to Basic 5',
  },
  {
    value: 'Music Track',
    label: 'Music Track',
    icon: 'bx-music',
    desc: 'Learn to play a musical instrument',
  },
  {
    value: 'Mixed Track',
    label: 'Mixed Track',
    icon: 'bx-shuffle',
    desc: 'Combine academics with music lessons',
  },
];

// ─── Regular Track classes ───
const REGULAR_CLASSES = [
  'Discovery',
  'Pre Nursery',
  'Nursery 1',
  'Nursery 2',
  'Basic 1',
  'Basic 2',
  'Basic 3',
  'Basic 4',
  'Basic 5',
];

// ─── Music Track instruments ───
const INSTRUMENTS = [
  'Piano',
  'Keyboard',
  'Acoustic Guitar',
  'Electric Guitar',
  'Bass Guitar',
  'Violin',
  'Cello',
  'Flute',
  'Saxophone',
  'Trumpet',
  'Drums',
  'Percussion',
  'Vocals / Voice Training',
  'Other',
];

const initialForm = {
  studentName: '',
  dob: '',
  gender: '',
  nationality: '',
  previousSchool: '',
  programme: '',
  regularClass: '',
  instrument: '',
  guardianName: '',
  guardianEmail: '',
  guardianPhone: '',
  homeAddress: '',
  experience: '',
  medicalNotes: '',
  comments: '',
};

export default function Application() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [agreed, setAgreed] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  // ─── Passport upload state ───
  const fileInputRef = useRef(null);
  const [passportUrl, setPassportUrl] = useState('');
  const [passportPreview, setPassportPreview] = useState('');
  const [uploadingPassport, setUploadingPassport] = useState(false);
  const [passportError, setPassportError] = useState('');

  // Require auth
  useEffect(() => {
    if (!isLoggedIn('student') || !getSession('student')) {
      navigate('/admission/create-account', { replace: true });
      return;
    }
    setChecking(false);
  }, [navigate]);

  function update(field) {
    return (e) => {
      const value = e.target.value;
      setForm((f) => {
        const next = { ...f, [field]: value };
        if (field === 'programme') {
          next.regularClass = '';
          next.instrument = '';
        }
        return next;
      });
    };
  }

  // ─── Passport upload handler ───
  async function handlePassportChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPassportError('');

    // Validate type
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setPassportError('Please upload a JPG, PNG, or WEBP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size — 5 MB max
    if (file.size > 5 * 1024 * 1024) {
      setPassportError('Photo must be under 5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPassportPreview(localPreview);

    setUploadingPassport(true);
    try {
      const fd = new FormData();
      fd.append('file', file);

      const token = localStorage.getItem('cod-student-token');

      const res = await fetch(`${API_URL}/upload/avatar`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: fd,
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || data.details || `Upload failed (${res.status})`
        );
      }

      const url = data.avatar_url || data.url;
      if (!url) throw new Error('Upload did not return a URL.');

      setPassportUrl(url);
      setPassportPreview(url);
    } catch (err) {
      console.error('Passport upload error:', err);
      setPassportError(err.message || 'Failed to upload photo.');
      setPassportPreview('');
      setPassportUrl('');
    } finally {
      setUploadingPassport(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function removePassport() {
    setPassportUrl('');
    setPassportPreview('');
    setPassportError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const showsClass =
    form.programme === 'Regular Track' || form.programme === 'Mixed Track';
  const showsInstrument =
    form.programme === 'Music Track' || form.programme === 'Mixed Track';

  const requiredFilled =
    form.studentName &&
    form.dob &&
    form.gender &&
    form.programme &&
    form.guardianName &&
    form.guardianEmail &&
    form.guardianPhone &&
    form.homeAddress &&
    passportUrl &&                              // ← passport required
    (!showsClass || form.regularClass) &&
    (!showsInstrument || form.instrument);

  const canSubmit =
    requiredFilled && agreed && !isSubmitting && !uploadingPassport;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const session = getSession('student') || {};

      const applicationData = {
        programmeId: form.programme,
        academicYear: new Date().getFullYear().toString(),
        personalInfo: {
          fullName: form.studentName,
          dateOfBirth: form.dob,
          gender: form.gender,
          nationality: form.nationality,
          previousSchool: form.previousSchool,
          guardianName: form.guardianName,
          guardianEmail: form.guardianEmail,
          guardianPhone: form.guardianPhone,
          homeAddress: form.homeAddress,
          experience: form.experience,
          medicalNotes: form.medicalNotes,
          comments: form.comments,
          passportUrl,                            // ← passport URL submitted
        },
        academicInfo: {
          trackName: form.programme,
          course: form.programme,
          regularClass: showsClass ? form.regularClass : null,
          instrument: showsInstrument ? form.instrument : null,
        },
        userId: session.id || session.user_id || null,
      };

      const application = await startAdmission(applicationData);

      navigate('/admission/course-selection', {
        state: {
          applicationId:
            application?.admission?.id || application?.id || null,
          formData: { ...form, passportUrl },
          trackName: form.programme,
        },
      });
    } catch (error) {
      setSubmitError(
        error.message || 'We could not save your application. Please try again.'
      );
      setIsSubmitting(false);
    }
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
          {/* Progress — 4 steps */}
          <div className="flex items-center gap-3 mb-8">
            <StepDot done>1</StepDot>
            <StepBar done />
            <StepDot active>2</StepDot>
            <StepBar />
            <StepDot>3</StepDot>
            <StepBar />
            <StepDot>4</StepDot>
          </div>

          <div className="mb-6">
            <h1 className="text-[30px] sm:text-4xl font-bold text-[#0F4082] font-ebrima leading-tight">
              Purchase Admission Form
            </h1>
            <p className="text-sm text-black/60 font-ebrima mt-2">
              Step 2 of 4 · Fill in the student's details to purchase your form.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white border border-black/15 p-6 sm:p-8 md:p-10 shadow-lg space-y-8"
          >
            {/* ═══ Student Information ═══ */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-8 w-8 rounded-xl bg-[#F5F9FF] text-[#1A73E8] flex items-center justify-center">
                  <DocumentIcon className="h-4 w-4" />
                </span>
                <h2 className="text-[#1A73E8] font-bold font-ebrima">
                  Student Information
                </h2>
              </div>
              <div className="h-px bg-black/10 mb-5" />

              <div className="space-y-5">
                {/* ═══ Passport Photo Upload ═══ */}
                <div>
                  <span className="block text-sm font-semibold text-black/70 mb-2 font-ebrima">
                    Passport Photograph
                    <span className="text-[#FF2E96]"> *</span>
                  </span>

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Preview box */}
                    <div className="relative w-28 h-28 rounded-2xl border-2 border-dashed border-black/15 overflow-hidden bg-[#F5F9FF] flex items-center justify-center shrink-0">
                      {passportPreview ? (
                        <img
                          src={passportPreview}
                          alt="Passport preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <i
                          className="bx bx-user text-5xl text-black/20"
                          aria-hidden="true"
                        />
                      )}

                      {uploadingPassport && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <i
                            className="bx bx-loader-alt animate-spin text-2xl text-white"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>

                    {/* Buttons + help */}
                    <div className="flex-1 min-w-0">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handlePassportChange}
                        className="hidden"
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingPassport}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A73E8] text-white font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-50"
                        >
                          <i
                            className={`bx ${
                              uploadingPassport ? 'bx-loader-alt animate-spin' : 'bx-upload'
                            }`}
                            aria-hidden="true"
                          />
                          {uploadingPassport
                            ? 'Uploading…'
                            : passportUrl
                            ? 'Change photo'
                            : 'Upload photo'}
                        </button>

                        {passportUrl && !uploadingPassport && (
                          <button
                            type="button"
                            onClick={removePassport}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition"
                          >
                            <i className="bx bx-trash" aria-hidden="true" />
                            Remove
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-black/45 mt-2.5 font-ebrima leading-relaxed">
                        Clear, recent photo of the student's face. JPG, PNG, or
                        WEBP — max 5 MB.
                      </p>

                      {passportError && (
                        <p
                          className="text-xs text-red-600 mt-2 flex items-center gap-1.5"
                          role="alert"
                        >
                          <i
                            className="bx bx-error-circle text-base"
                            aria-hidden="true"
                          />
                          {passportError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student Full Name */}
                <Field label="Student Full Name" required>
                  <input
                    required
                    value={form.studentName}
                    onChange={update('studentName')}
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
                      onChange={update('dob')}
                      className="field"
                    />
                  </Field>
                  <Field label="Gender" required>
                    <select
                      required
                      value={form.gender}
                      onChange={update('gender')}
                      className="field"
                    >
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Nationality">
                    <select
                      value={form.nationality}
                      onChange={update('nationality')}
                      className="field"
                    >
                      <option value="" disabled>
                        Select nationality
                      </option>
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
                      onChange={update('previousSchool')}
                      placeholder="Name of last school attended"
                      className="field"
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* ═══ Programme Selection ═══ */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-8 w-8 rounded-xl bg-[#F5F9FF] text-[#1A73E8] flex items-center justify-center">
                  <i className="bx bx-book-content text-base" aria-hidden="true" />
                </span>
                <h2 className="text-[#1A73E8] font-bold font-ebrima">
                  Choose a Programme
                </h2>
              </div>
              <div className="h-px bg-black/10 mb-5" />

              <div className="grid sm:grid-cols-3 gap-3">
                {PROGRAMMES.map((p) => {
                  const selected = form.programme === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() =>
                        update('programme')({ target: { value: p.value } })
                      }
                      className={`text-left rounded-2xl border-2 p-4 transition-all ${
                        selected
                          ? 'border-[#1A73E8] bg-[#F5F9FF] shadow-md'
                          : 'border-black/10 bg-white hover:border-[#1A73E8]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                            selected
                              ? 'bg-[#1A73E8] text-white'
                              : 'bg-[#F5F9FF] text-[#1A73E8]'
                          }`}
                        >
                          <i className={`bx ${p.icon} text-2xl`} aria-hidden="true" />
                        </span>
                        {selected && (
                          <span className="h-5 w-5 rounded-full bg-[#1A73E8] text-white flex items-center justify-center">
                            <i className="bx bx-check text-sm" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                      <p
                        className={`font-bold text-sm font-ebrima ${
                          selected ? 'text-[#1A73E8]' : 'text-black/80'
                        }`}
                      >
                        {p.label}
                      </p>
                      <p className="text-xs text-black/50 mt-1 font-ebrima leading-snug">
                        {p.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {showsClass && (
                <div className="mt-6 animate-fadeUp">
                  <Field label="Select Class" required>
                    <select
                      required
                      value={form.regularClass}
                      onChange={update('regularClass')}
                      className="field"
                    >
                      <option value="" disabled>
                        Choose a class
                      </option>
                      {REGULAR_CLASSES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <p className="text-xs text-black/40 mt-1.5 font-ebrima flex items-center gap-1">
                    <i className="bx bx-info-circle" aria-hidden="true" />
                    Discovery through Basic 5.
                  </p>
                </div>
              )}

              {showsInstrument && (
                <div className="mt-6 animate-fadeUp">
                  <Field label="Select Instrument" required>
                    <select
                      required
                      value={form.instrument}
                      onChange={update('instrument')}
                      className="field"
                    >
                      <option value="" disabled>
                        Choose an instrument
                      </option>
                      {INSTRUMENTS.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <p className="text-xs text-black/40 mt-1.5 font-ebrima flex items-center gap-1">
                    <i className="bx bx-music" aria-hidden="true" />
                    Every student gets individual lessons in their chosen
                    instrument.
                  </p>
                </div>
              )}
            </section>

            {/* ═══ Parent / Guardian ═══ */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-8 w-8 rounded-xl bg-[#F5F9FF] text-[#1A73E8] flex items-center justify-center">
                  <i className="bx bx-group text-base" aria-hidden="true" />
                </span>
                <h2 className="text-[#1A73E8] font-bold font-ebrima">
                  Parent / Guardian Information
                </h2>
              </div>
              <div className="h-px bg-black/10 mb-5" />

              <div className="space-y-5">
                <Field label="Parent / Guardian Full Name" required>
                  <input
                    required
                    value={form.guardianName}
                    onChange={update('guardianName')}
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
                      onChange={update('guardianEmail')}
                      placeholder="parent@email.com"
                      className="field"
                    />
                  </Field>
                  <Field label="Phone Number" required>
                    <input
                      required
                      type="tel"
                      value={form.guardianPhone}
                      onChange={update('guardianPhone')}
                      placeholder="+234 801 234 5678"
                      className="field"
                    />
                  </Field>
                </div>

                <Field label="Home Address" required>
                  <input
                    required
                    value={form.homeAddress}
                    onChange={update('homeAddress')}
                    placeholder="Full residential address"
                    className="field"
                  />
                </Field>
              </div>
            </section>

            {/* ═══ Additional ═══ */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-8 w-8 rounded-xl bg-[#F5F9FF] text-[#1A73E8] flex items-center justify-center">
                  <i className="bx bx-note text-base" aria-hidden="true" />
                </span>
                <h2 className="text-[#1A73E8] font-bold font-ebrima">
                  Additional Information
                </h2>
              </div>
              <div className="h-px bg-black/10 mb-5" />

              <div className="space-y-5">
                <Field label="Previous Experience (optional)">
                  <textarea
                    rows={3}
                    value={form.experience}
                    onChange={update('experience')}
                    placeholder="Any previous musical or academic experience…"
                    className="field resize-none"
                  />
                </Field>
                <Field label="Medical / Special Needs (optional)">
                  <textarea
                    rows={3}
                    value={form.medicalNotes}
                    onChange={update('medicalNotes')}
                    placeholder="Allergies, conditions, or special needs…"
                    className="field resize-none"
                  />
                </Field>
                <Field label="Additional Comments (optional)">
                  <textarea
                    rows={3}
                    value={form.comments}
                    onChange={update('comments')}
                    placeholder="Anything else we should know?"
                    className="field resize-none"
                  />
                </Field>
              </div>
            </section>

            {/* ═══ Consent ═══ */}
            <label className="flex items-start gap-3 rounded-xl bg-[#F5F9FF] border border-black/10 px-4 py-3.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#1A73E8] shrink-0"
                required
              />
              <span className="text-sm text-black/70 leading-relaxed font-ebrima">
                I confirm that all information provided is accurate and I agree
                to the{' '}
                <Link
                  to="/terms"
                  className="text-[#1A73E8] hover:underline font-medium"
                >
                  Terms and Conditions
                </Link>
                .
              </span>
            </label>

            {submitError && (
              <p className="text-sm text-red-600" role="alert">
                {submitError}
              </p>
            )}

            {/* ═══ Buttons ═══ */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`flex-1 h-14 rounded-full font-bold text-base font-ebrima transition-all duration-200 inline-flex items-center justify-center gap-2 ${
                  canSubmit
                    ? 'bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white shadow-md hover:opacity-95 active:scale-[0.98]'
                    : 'bg-[#1A73E8]/30 text-white/70 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i
                      className="bx bx-loader-alt animate-spin text-lg"
                      aria-hidden="true"
                    />
                    Submitting…
                  </>
                ) : (
                  <>
                    Continue to Campus &amp; Plan
                    <i className="bx bx-right-arrow-alt text-lg" aria-hidden="true" />
                  </>
                )}
              </button>
              <Link
                to="/enroll"
                className="flex-1 h-14 bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 font-bold text-base rounded-full flex items-center justify-center font-ebrima gap-2"
              >
                <i className="bx bx-x text-lg" aria-hidden="true" />
                Cancel
              </Link>
            </div>

            <p className="text-xs text-black/40 text-center font-ebrima">
              * Required fields. You'll choose your campus and pay in the next
              steps.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ─────────── Field helper ─────────── */
function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-black/70 mb-1.5 font-ebrima">
        {label}
        {required && <span className="text-[#FF2E96]"> *</span>}
      </span>
      {children}
    </label>
  );
}

/* ─────────── Progress step helpers ─────────── */
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