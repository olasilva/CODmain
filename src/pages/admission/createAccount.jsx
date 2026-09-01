// src/pages/admission/CreateAccount.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Navigate to next step
    navigate('/admission/course-selection');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[520px]">
          {/* Progress Steps */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1A73E8] rounded-[14px] flex items-center justify-center">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <div className="w-14 h-0.5 bg-[#1A73E8] rounded-full" />
            <div className="w-10 h-10 bg-[#1A73E8]/25 rounded-[14px] flex items-center justify-center">
              <span className="text-[#1A73E8] font-bold text-lg">2</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[30px] font-bold text-black font-ebrima leading-[37.5px]">
              Create Account
            </h1>
            <p className="text-sm text-black/60 font-ebrima mt-1">
              Step 1: Basic information
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-black/80 font-ebrima mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full h-14 px-4 bg-white rounded-2xl border border-black/60 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition text-base text-black/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-black/80 font-ebrima mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full h-14 px-4 bg-white rounded-2xl border border-black/60 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition text-base text-black/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-black/80 font-ebrima mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full h-14 px-4 bg-white rounded-2xl border border-black/60 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition text-base text-black/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-black/80 font-ebrima mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-14 px-4 bg-white rounded-2xl border border-black/60 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition text-base text-black/30"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] shadow-[4px_4px_12px_rgba(0,0,0,0.20)] rounded-full text-white font-bold text-lg font-ebrima hover:opacity-95 transition-opacity"
            >
              Continue
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-black/15">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex-1 h-px bg-black/15" />
              <span className="text-sm text-black/35 font-ebrima whitespace-nowrap">
                Already have an account?
              </span>
              <div className="flex-1 h-px bg-black/15" />
            </div>
            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 text-[#1A73E8] font-bold text-base font-ebrima hover:underline"
            >
              Login
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}