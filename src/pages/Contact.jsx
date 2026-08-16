import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Replace with the academy's real contact details.
const details = [
  { label: "Address", value: "Abuja, FCT, Nigeria" },
  { label: "Email", value: "info@clanofdavidacademy.com" },
  { label: "Phone", value: "+234 000 000 0000" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Wire this up to your form backend / email service / Google Sheets, etc.
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-cod-bg">
      <Navbar />

      <section className="bg-cod-hero bg-gradient-to-r from-cod-blue-dark via-cod-blue to-cod-pink">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-20 text-center">
          <h1 className="animate-fadeUp text-white text-3xl md:text-5xl font-bold">Contact Us</h1>
          <p className="animate-fadeUp text-blue-100 mt-4 max-w-xl mx-auto text-base md:text-lg" style={{ animationDelay: "100ms" }}>
            Questions about admissions, programmes, or a visit? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-6 animate-fadeUp">
          {details.map((d) => (
            <div key={d.label} className="rounded-2xl bg-white border border-slate-200 px-6 py-5">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{d.label}</p>
              <p className="text-slate-800 font-semibold">{d.value}</p>
            </div>
          ))}
        </div>

        <div className="md:col-span-3 animate-fadeUp" style={{ animationDelay: "100ms" }}>
          {submitted ? (
            <div className="rounded-2xl bg-white border border-slate-200 px-8 py-12 text-center">
              <h2 className="text-slate-800 font-bold text-xl mb-2">Message sent</h2>
              <p className="text-slate-500 text-sm">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-200 px-8 py-8 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="focus-ring w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="focus-ring w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="focus-ring w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="focus-ring w-full rounded-full bg-cod-btn text-white font-semibold py-3.5 shadow-md
                           transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
