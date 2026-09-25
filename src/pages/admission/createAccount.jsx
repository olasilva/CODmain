// src/pages/admission/CreateAccount.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { registerUser, isLoggedIn, getSession, logoutUser } from '../../lib/api';

export default function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  // If they landed here via redirect and are logged in, offer to continue or start fresh
  useEffect(() => {
    const loggedIn = isLoggedIn('student') && getSession('student');
    setAlreadyLoggedIn(loggedIn);
    setChecking(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      // Force a clean slate before registering a new account
      logoutUser('student');
      await registerUser({ ...formData, role: 'student' });
      navigate('/application');
    } catch (submitError) {
      setError(submitError.message || 'Could not create your account.');
      setIsSubmitting(false);
    }
  };

  const handleStartFresh = () => {
    logoutUser('student');
    setAlreadyLoggedIn(false);
    setFormData({ fullName: '', email: '', phone: '', password: '' });
  };

  const handleContinueExisting = () => {
    navigate('/application');
  };

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

  // ─── Already logged in — let them choose ───
  if (alreadyLoggedIn) {
    const session = getSession('student') || {};
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
        <Navbar />

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-[520px]">
            <div className="bg-white rounded-3xl border border-black/10 p-8 shadow-sm text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F9FF] text-[#1A73E8] mb-4">
                <i className="bx bx-user-circle text-3xl" aria-hidden="true" />
              </span>

              <h1 className="text-2xl font-bold text-black font-ebrima mb-2">
                You're already signed in
              </h1>
              <p className="text-sm text-black/50 font-ebrima mb-6">
                {session.fullName || session.email ? (
                  <>
                    Signed in as{' '}
                    <span className="text-black/80 font-semibold">
                      {session.fullName || session.email}
                    </span>
                    . Continue to your application or start a new one.
                  </>
                ) : (
                  'Continue to your application or start a new one.'
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleStartFresh}
                  className="flex-1 h-12 rounded-full border border-black/15 text-black/70 font-bold text-sm font-ebrima hover:bg-black/5 transition"
                >
                  Start a new application
                </button>
                <button
                  type="button"
                  onClick={handleContinueExisting}
                  className="flex-1 h-12 rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white font-bold text-sm font-ebrima shadow-md hover:opacity-95 transition"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ─── Normal register form ───
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[520px]">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1A73E8] rounded-[14px] flex items-center justify-center">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <div className="w-14 h-0.5 bg-[#1A73E8]/30 rounded-full" />
            <div className="w-10 h-10 bg-[#1A73E8]/25 rounded-[14px] flex items-center justify-center">
              <span className="text-[#1A73E8] font-bold text-lg">2</span>
            </div>
            <div className="w-14 h-0.5 bg-[#1A73E8]/15 rounded-full" />
            <div className="w-10 h-10 bg-[#1A73E8]/15 rounded-[14px] flex items-center justify-center">
              <span className="text-[#1A73E8]/50 font-bold text-lg">3</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[30px] font-bold text-black font-ebrima leading-tight">
              Create your account
            </h1>
            <p className="text-sm text-black/60 font-ebrima mt-1">
              Step 1 of 4 · Basic information
            </p>
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

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
                className="w-full h-14 px-4 bg-white rounded-2xl border border-black/30 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition text-base"
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
                className="w-full h-14 px-4 bg-white rounded-2xl border border-black/30 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition text-base"
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
                placeholder="+234 801 234 5678"
                className="w-full h-14 px-4 bg-white rounded-2xl border border-black/30 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition text-base"
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
                className="w-full h-14 px-4 bg-white rounded-2xl border border-black/30 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none transition text-base"
                required
                minLength={6}
              />
              <p className="text-xs text-black/40 mt-1.5 font-ebrima">
                Use at least 6 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] shadow-[4px_4px_12px_rgba(0,0,0,0.20)] rounded-full text-white font-bold text-lg font-ebrima hover:opacity-95 transition-opacity disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account…' : 'Continue'}
            </button>
          </form>

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
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}