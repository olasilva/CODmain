// src/pages/Contact.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { submitContactMessage } from "../lib/api";

// Replace with the academy's real contact details.
const details = [
  { label: "Address", value: "Abuja, FCT, Nigeria" },
  { label: "Email", value: "info@clanofdavidacademy.com" },
  { label: "Phone", value: "+234 903 956 4563" },
];

const disciplines = ["Music", "Art", "Academic", "Drama"];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setIsSubmitting(true);
    setError("");
    try {
      await submitContactMessage({
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
        subject: data.get("subject"),
        message: data.get("message"),
      });
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError.message || "Message could not be sent.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-cod-bg">
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.5s ease-out both; }
      `}</style>

      <Navbar />

      {/* ─── Hero ─── */}
      <section className="bg-cod-hero bg-gradient-to-r from-cod-blue-dark via-cod-blue to-cod-pink">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-20 md:py-24">
          <p className="text-blue-100/80 text-sm font-medium mb-3">
            Admissions &amp; enquiries
          </p>
          <h1 className="font-serif text-white text-4xl md:text-5xl leading-tight max-w-xl">
            Let's talk about your child's next step.
          </h1>
          <p className="text-blue-100 mt-4 max-w-md text-base leading-relaxed">
            Questions about admissions, programmes, or booking a visit — our
            team replies personally, usually within a day.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {disciplines.map((d) => (
              <span key={d} className="text-blue-50 text-sm border-b border-white/30 pb-0.5">
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Main content ─── */}
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16 md:py-20 grid md:grid-cols-5 gap-12">
        {/* Contact details */}
        <div className="md:col-span-2">
          <h2 className="font-serif text-slate-800 text-xl mb-6">
            Reach us directly
          </h2>
          <dl className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {details.map((d) => (
              <div key={d.label} className="py-4 flex flex-col gap-0.5">
                <dt className="text-slate-500 text-sm">{d.label}</dt>
                <dd className="text-slate-800 font-medium">{d.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-slate-500 text-sm leading-relaxed mt-6">
            Prefer to visit in person? Campus tours run on weekday
            mornings — mention it in your message and we'll set a time.
          </p>
        </div>

        {/* Form / Success */}
        <div className="md:col-span-3">
          {submitted ? (
            <SuccessCard onReset={() => setSubmitted(false)} />
          ) : (
            <form onSubmit={handleSubmit} className="fade-up space-y-5">
              <Field
                id="name"
                name="name"
                label="Full name"
                placeholder="Jane Doe"
                focused={focused}
                setFocused={setFocused}
                required
              />

              <Field
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="jane@example.com"
                focused={focused}
                setFocused={setFocused}
                required
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <Field
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone (optional)"
                  placeholder="+234 ..."
                  focused={focused}
                  setFocused={setFocused}
                />
                <Field
                  id="subject"
                  name="subject"
                  label="Subject"
                  placeholder="Admission enquiry"
                  focused={focused}
                  setFocused={setFocused}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  className={`focus-ring w-full rounded-lg border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 resize-none transition-colors duration-150 ${
                    focused === "message" ? "border-cod-blue" : "border-slate-300"
                  }`}
                  placeholder="How can we help?"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="focus-ring w-full sm:w-auto rounded-md bg-cod-btn text-white font-semibold px-8 py-3 transition-opacity duration-150 hover:opacity-90 active:opacity-80 disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                {isSubmitting ? "Sending" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ──────────────────────────────
   Field component
   ────────────────────────────── */
function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  focused,
  setFocused,
}) {
  const isFocused = focused === id;
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        onFocus={() => setFocused(id)}
        onBlur={() => setFocused(null)}
        className={`focus-ring w-full rounded-lg border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors duration-150 ${
          isFocused ? "border-cod-blue" : "border-slate-300"
        }`}
        placeholder={placeholder}
      />
    </div>
  );
}

/* ──────────────────────────────
   Success state
   ────────────────────────────── */
function SuccessCard({ onReset }) {
  return (
    <div className="fade-up border border-slate-200 rounded-lg px-8 py-12 text-center">
      <div className="mx-auto mb-5 h-12 w-12 rounded-full bg-cod-bg flex items-center justify-center">
        <svg
          className="h-6 w-6 text-cod-blue"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-serif text-slate-800 text-2xl mb-2">Message sent</h2>
      <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
        Thanks for reaching out. A confirmation is on its way to your inbox,
        and our team will get back to you within one to two business days.
      </p>
      <button
        onClick={onReset}
        className="focus-ring mt-6 text-sm font-semibold text-cod-blue hover:underline"
      >
        Send another message
      </button>
    </div>
  );
}