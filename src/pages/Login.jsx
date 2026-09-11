// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logo from '../assets/logo.jpg';
import { loginUser, googleLogin } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const roleFromQuery = new URLSearchParams(location.search).get('role');
  const [selectedRole, setSelectedRole] = useState(
    roleFromQuery === 'staff' ? 'staff' : 'student'
  );
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read and validate the Google client ID
  const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  const isClientIdValid =
    googleClientId.length > 30 &&
    googleClientId.endsWith('.apps.googleusercontent.com');

  // Debug output — remove this once OAuth works
  React.useEffect(() => {
    console.log('🔵 [Login] Client ID value:', googleClientId || '(EMPTY)');
    console.log('🔵 [Login] Client ID length:', googleClientId.length);
    console.log('🔵 [Login] Client ID valid:', isClientIdValid);
  }, [googleClientId, isClientIdValid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const session = await loginUser({ ...formData, role: selectedRole });
      localStorage.setItem('token', session.token);
      localStorage.setItem('user', JSON.stringify(session.user));
      navigate(
        session.user.role === 'staff' || session.user.role === 'admin'
          ? '/staff/dashboard'
          : '/student/dashboard'
      );
    } catch (loginError) {
      setError(loginError.message || 'Login failed');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      setIsSubmitting(true);
      const { credential } = credentialResponse;

      const session = await googleLogin({
        token: credential,
        role: selectedRole,
      });

      localStorage.setItem('token', session.token);
      localStorage.setItem('user', JSON.stringify(session.user));

      navigate(
        session.user.role === 'staff' || session.user.role === 'admin'
          ? '/staff/dashboard'
          : '/student/dashboard'
      );
    } catch (err) {
      setError(err.message || 'Google login failed');
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setError(
      'Google login failed. Verify your Client ID in .env and Authorized JavaScript origins in Google Cloud Console.'
    );
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[520px] animate-fadeUp">
          <div className="mb-8 animate-slideInLeft">
            {logo ? (
              <img src={logo} alt="Logo" className="w-[50px] h-[50px] rounded-lg" />
            ) : (
              <div className="w-[50px] h-[50px] rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
            )}
          </div>

          <div className="mb-6 animate-slideDown" style={{ animationDelay: '100ms' }}>
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

          <div className="mb-7">
            <h1 className="text-[30px] font-bold text-black leading-[37.5px]">
              Welcome Back!
            </h1>
            <p className="text-sm text-black/60 mt-0.5">
              Sign into your {selectedRole} account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

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
                className="w-full h-14 px-[17px] bg-white rounded-2xl border border-black/60 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition text-base"
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
                className="w-full h-14 px-[17px] bg-white rounded-2xl border border-black/60 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition text-base"
                required
              />
            </div>
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-[#1A73E8] font-bold hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] shadow-[4px_4px_12px_rgba(0,0,0,0.20)] rounded-full text-white font-bold text-lg hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-black/15" />
            <span className="text-sm text-black/35 whitespace-nowrap">Or</span>
            <div className="flex-1 h-px bg-black/15" />
          </div>

          {isClientIdValid ? (
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                shape="pill"
                text="signin_with"
                width="100%"
              />
            </div>
          ) : (
            <div className="w-full p-3 text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {googleClientId
                ? 'Google Client ID is malformed. Check VITE_GOOGLE_CLIENT_ID in .env'
                : 'Google Sign-In is not configured. Add VITE_GOOGLE_CLIENT_ID to .env and restart the dev server.'}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-black/15">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex-1 h-px bg-black/15" />
              <span className="text-sm text-black/35 whitespace-nowrap">
                Don't have an account?
              </span>
              <div className="flex-1 h-px bg-black/15" />
            </div>
            <Link
              to="/enroll"
              className="flex items-center justify-center text-[#1A73E8] font-bold text-base hover:underline"
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