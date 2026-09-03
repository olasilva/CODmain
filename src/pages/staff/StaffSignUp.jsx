import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { registerUser } from "../../lib/api";

const initialForm = { 
  fullName: "", 
  email: "", 
  phone: "", 
  password: "",
  department: "",
  qualifications: "",
  experience: ""
};

export default function StaffSignUp() {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FF] to-[#EAF3FF] flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl animate-fadeUp">
          {/* Header */}
          <div className="text-center mb-8 animate-slideDown">
            <h1 className="text-4xl font-bold text-black font-ebrima mb-3">
              Join Our Teaching Team
            </h1>
            <p className="text-lg text-black/60 font-ebrima">
              Create your staff account at Clan of David Art and Music Academy
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-10 animate-fadeIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    step >= num 
                      ? 'bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white shadow-lg' 
                      : step === num - 1 ? 'bg-white border-2 border-[#1A73E8] text-[#1A73E8]' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {num}
                  </div>
                  {num < 3 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                      step > num ? 'bg-gradient-to-r from-[#1A73E8] to-[#FF2E96]' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-sm font-semibold text-black/60">
              <span>Basic Info</span>
              <span>Professional</span>
              <span>Confirm</span>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-scaleIn" style={{ animationDelay: "200ms" }}>
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-black font-ebrima mb-6">Basic Information</h2>
                </div>

                <form onSubmit={handleStep1Submit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="animate-slideUp" style={{ animationDelay: "100ms" }}>
                      <label className="block">
                        <span className="block text-sm text-black/80 font-ebrima mb-2">Full Name *</span>
                        <input
                          required
                          value={form.fullName}
                          onChange={update("fullName")}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border-2 border-black/10 rounded-2xl focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition-all duration-200 text-black"
                        />
                      </label>
                    </div>

                    <div className="animate-slideUp" style={{ animationDelay: "150ms" }}>
                      <label className="block">
                        <span className="block text-sm text-black/80 font-ebrima mb-2">Email Address *</span>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={update("email")}
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 border-2 border-black/10 rounded-2xl focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition-all duration-200 text-black"
                        />
                      </label>
                    </div>

                    <div className="animate-slideUp" style={{ animationDelay: "200ms" }}>
                      <label className="block">
                        <span className="block text-sm text-black/80 font-ebrima mb-2">Phone Number *</span>
                        <input
                          required
                          value={form.phone}
                          onChange={update("phone")}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 border-2 border-black/10 rounded-2xl focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition-all duration-200 text-black"
                        />
                      </label>
                    </div>

                    <div className="animate-slideUp" style={{ animationDelay: "250ms" }}>
                      <label className="block">
                        <span className="block text-sm text-black/80 font-ebrima mb-2">Password *</span>
                        <input
                          type="password"
                          required
                          value={form.password}
                          onChange={update("password")}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 border-2 border-black/10 rounded-2xl focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition-all duration-200 text-black"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] shadow-lg rounded-full text-white font-bold text-lg font-ebrima hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 animate-slideUp"
                    style={{ animationDelay: "300ms" }}
                  >
                    Continue to Professional Info
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-black font-ebrima mb-6">Professional Information</h2>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  setStep(3);
                }} className="space-y-6">
                  <div className="space-y-6">
                    <div className="animate-slideUp" style={{ animationDelay: "100ms" }}>
                      <label className="block">
                        <span className="block text-sm text-black/80 font-ebrima mb-2">Department *</span>
                        <select
                          required
                          value={form.department}
                          onChange={update("department")}
                          className="w-full px-4 py-3 border-2 border-black/10 rounded-2xl focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition-all duration-200 text-black bg-white"
                        >
                          <option value="">Select Department</option>
                          <option value="music">Music</option>
                          <option value="art">Art</option>
                          <option value="general">General Studies</option>
                          <option value="administration">Administration</option>
                        </select>
                      </label>
                    </div>

                    <div className="animate-slideUp" style={{ animationDelay: "150ms" }}>
                      <label className="block">
                        <span className="block text-sm text-black/80 font-ebrima mb-2">Qualifications *</span>
                        <textarea
                          required
                          value={form.qualifications}
                          onChange={update("qualifications")}
                          placeholder="e.g., B.Mus, Diploma in Art Education"
                          rows="3"
                          className="w-full px-4 py-3 border-2 border-black/10 rounded-2xl focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition-all duration-200 text-black resize-none"
                        />
                      </label>
                    </div>

                    <div className="animate-slideUp" style={{ animationDelay: "200ms" }}>
                      <label className="block">
                        <span className="block text-sm text-black/80 font-ebrima mb-2">Years of Experience *</span>
                        <input
                          type="number"
                          required
                          min="0"
                          value={form.experience}
                          onChange={update("experience")}
                          placeholder="e.g., 5"
                          className="w-full px-4 py-3 border-2 border-black/10 rounded-2xl focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition-all duration-200 text-black"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 border-2 border-black/10 rounded-full text-black/60 font-bold font-ebrima hover:bg-gray-50 transition-all duration-200 animate-slideUp"
                      style={{ animationDelay: "250ms" }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] shadow-lg rounded-full text-white font-bold font-ebrima hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 animate-slideUp"
                      style={{ animationDelay: "300ms" }}
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-black font-ebrima mb-6">Confirm & Submit</h2>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  await registerUser({ ...form, role: "staff" });
                  navigate('/login?role=staff');
                }} className="space-y-6">
                  <div className="bg-gradient-to-br from-[#1A73E8]/5 to-[#FF2E96]/5 rounded-2xl border-2 border-[#1A73E8]/20 p-6 space-y-4 animate-scaleIn">
                    <h3 className="font-bold text-black mb-4">Review Your Information</h3>
                    
                    <div className="space-y-3 text-sm">
                      <SummaryRow label="Full Name" value={form.fullName} />
                      <SummaryRow label="Email" value={form.email} />
                      <SummaryRow label="Phone" value={form.phone} />
                      <div className="border-t border-black/10 pt-3">
                        <SummaryRow label="Department" value={form.department} />
                        <SummaryRow label="Qualifications" value={form.qualifications} />
                        <SummaryRow label="Experience" value={`${form.experience} years`} />
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer animate-slideUp" style={{ animationDelay: "100ms" }}>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-0.5 h-5 w-5 accent-[#1A73E8] shrink-0 rounded cursor-pointer"
                    />
                    <span className="text-sm text-black/70 leading-relaxed font-ebrima">
                      I agree to the terms and conditions of Clan of David Art and Music Academy and confirm that all information provided is accurate.
                    </span>
                  </label>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 h-12 border-2 border-black/10 rounded-full text-black/60 font-bold font-ebrima hover:bg-gray-50 transition-all duration-200 animate-slideUp"
                      style={{ animationDelay: "150ms" }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] shadow-lg rounded-full text-white font-bold font-ebrima hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 animate-slideUp"
                      style={{ animationDelay: "200ms" }}
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center mt-8 animate-fadeIn" style={{ animationDelay: "400ms" }}>
            <p className="text-black/60 font-ebrima mb-2">Already have an account?</p>
            <Link to="/login?role=staff" className="inline-flex items-center gap-2 text-[#1A73E8] font-bold font-ebrima hover:text-[#FF2E96] transition-all duration-200 hover:scale-105">
              Sign in to your account
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-black/50">{label}</span>
      <span className="text-black/80 font-semibold">{value || "—"}</span>
    </div>
  );
}
