// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logo from '../assets/logo.jpg';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const roleFromQuery = new URLSearchParams(location.search).get('role');
  const [selectedRole, setSelectedRole] = useState(
    roleFromQuery === 'staff' ? 'staff' : 'student'
  );
  const [formData, setFormData] = useState({
    email: '',
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
    console.log('Login attempt:', formData, 'Role:', selectedRole);

    if (selectedRole === 'staff') {
      navigate('/staff/dashboard');
      return;
    }

    navigate('/student/dashboard');
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Add Google OAuth logic here
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[520px] animate-fadeUp">
          {/* Logo */}
          <div className="mb-8 animate-slideInLeft">
            <img 
              src={logo} 
              alt="Logo"
              className="w-[50px] h-[50px] rounded-lg"
            />
          </div>

          <div className="mb-6 animate-slideDown" style={{ animationDelay: "100ms" }}>
            <div className="inline-flex w-full rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              {['student', 'staff'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                    selectedRole === role
                      ? 'bg-[#1A73E8] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {role === 'student' ? 'Student' : 'Staff'}
                </button>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h1 className="text-[30px] font-bold text-black font-ebrima leading-[37.5px]">
              Welcome Back!
            </h1>
            <p className="text-sm text-black/60 font-ebrima mt-0.5">
              Sign into your {selectedRole === 'student' ? 'student' : 'staff'} account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full h-14 px-[17px] bg-white rounded-2xl border border-black/60 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition text-base text-black/30"
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
                className="w-full h-14 px-[17px] bg-white rounded-2xl border border-black/60 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition text-base text-black/30"
                required
              />
            </div>

            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm text-[#1A73E8] font-bold font-ebrima hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] shadow-[4px_4px_12px_rgba(0,0,0,0.20)] rounded-full text-white font-bold text-lg font-ebrima hover:opacity-95 transition-opacity"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-black/15" />
            <span className="text-sm text-black/35 font-inter whitespace-nowrap">Or</span>
            <div className="flex-1 h-px bg-black/15" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            className="w-full h-14 relative bg-[#F5F9FF] shadow-[4px_4px_10px_rgba(0,0,0,0.25)] rounded-full border border-black/30 flex items-center justify-center hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2.5">
              {/* Google Icon */}
              <svg className="w-[33px] h-[33px]" viewBox="0 0 33 33" fill="none">
                <path d="M16.5 14.4V18.85H23.67C23.34 20.56 22.21 22.09 20.53 23.12L24.24 26.04C26.51 24.03 27.83 21.03 27.83 17.56C27.83 16.61 27.74 15.75 27.59 14.98L16.5 14.4Z" fill="#4285F4"/>
                <path d="M9.83 18.04L8.91 18.73L5.96 21.04C7.99 24.82 11.65 27.5 16.5 27.5C19.74 27.5 22.44 26.38 24.24 24.04L20.53 21.12C19.57 21.78 18.22 22.23 16.5 22.23C13.37 22.23 10.73 20.13 9.83 18.04Z" fill="#34A853"/>
                <path d="M5.96 21.04L8.91 18.73C8.22 17.1 7.79 15.3 7.79 13.5C7.79 11.7 8.22 9.9 8.91 8.27L5.96 5.96C4.08 9.48 3 13.43 3 17.5C3 21.57 4.08 25.52 5.96 29.04L8.91 26.73L5.96 21.04Z" fill="#FBBC05"/>
                <path d="M16.5 4.77C18.43 4.77 20.17 5.43 21.55 6.68L24.33 3.9C22.45 2.14 19.74 1 16.5 1C11.65 1 7.99 3.68 5.96 7.46L8.91 9.77C9.81 7.68 12.37 5.58 16.5 5.58V4.77Z" fill="#EA4335"/>
              </svg>
              <span className="text-base text-[#1A73E8] font-bold font-ebrima">
                Continue with Google
              </span>
            </div>
          </button>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-black/15">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex-1 h-px bg-black/15" />
              <span className="text-sm text-black/35 font-ebrima whitespace-nowrap">
                Don't have an account?
              </span>
              <div className="flex-1 h-px bg-black/15" />
            </div>
            <Link
              to="/enroll"
              className="flex items-center justify-center text-[#1A73E8] font-bold text-base font-ebrima hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}