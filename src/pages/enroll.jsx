// src/pages/enroll.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logo from '../assets/logo.jpg';

const WELCOME_TEXT = 'Welcome to Clan of David Art and Music Academy';

export default function Enroll() {
  const navigate = useNavigate();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // ─── Typewriter state ───
  const [typed, setTyped] = useState('');
  const [showCaret, setShowCaret] = useState(true);

  // Typing speed (ms per character) — adjust to taste
  const TYPE_SPEED = 55;
  const START_DELAY = 500; // wait for logo to pop in first

  useEffect(() => {
    let i = 0;
    let timer;

    const start = setTimeout(() => {
      timer = setInterval(() => {
        i += 1;
        setTyped(WELCOME_TEXT.slice(0, i));
        if (i >= WELCOME_TEXT.length) {
          clearInterval(timer);
          // Blink the caret for a couple seconds, then hide it
          setTimeout(() => setShowCaret(false), 2000);
        }
      }, TYPE_SPEED);
    }, START_DELAY);

    return () => {
      clearTimeout(start);
      if (timer) clearInterval(timer);
    };
  }, []);

  const handleAction = (action) => {
    if (action === 'purchase') {
      navigate('/admission/create-account');
      return;
    }
    setPendingAction(action);
    setShowRoleModal(true);
  };

  const handleRoleChoice = (role) => {
    if (!pendingAction) return;
    setShowRoleModal(false);
    if (role === 'student') {
      navigate('/login?role=student');
      return;
    }
    if (role === 'staff') {
      navigate('/login?role=staff');
      return;
    }
  };

  const typingDone = typed.length === WELCOME_TEXT.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />

      <main className="flex-1 flex flex-col md:flex-row w-full font-sans">
        {/* ─── Left Sidebar Banner ─── */}
        <div className="relative w-full md:w-[450px] min-h-[350px] md:min-h-full bg-gradient-to-b from-[#1A73E8] to-[#0F4082] flex flex-col items-center justify-center p-8 text-white text-center shadow-lg overflow-hidden">
          {/* Decorative floating blobs */}
          <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-[#FF2E96]/20 blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />

          <div className="relative flex flex-col items-center max-w-[312px] gap-7">
            {/* Logo */}
            <div className="droplet" style={{ animationDelay: '100ms' }}>
              <img
                src={logo}
                alt="Clan of David Logo"
                className="w-[124px] h-[125px] rounded-xl object-cover shadow-md"
              />
            </div>

            {/* Typewriter heading */}
            <h1
              className="text-2xl md:text-3xl font-bold tracking-wide uppercase leading-snug font-sans min-h-[100px] md:min-h-[120px]"
              aria-label={WELCOME_TEXT}
            >
              <span>{typed}</span>
              {/* Caret — blinks while typing, stays briefly, then hides */}
              {showCaret && (
                <span
                  aria-hidden="true"
                  className={`inline-block w-[3px] h-[1.05em] align-middle ml-0.5 bg-white ${
                    typingDone ? 'animate-caret-blink' : ''
                  }`}
                />
              )}
            </h1>

            {/* Tagline — appears after typing finishes */}
            <p
              className={`text-sm text-white/75 leading-relaxed transition-opacity duration-700 ${
                typingDone ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Building Talent. Inspiring Excellence. Nurturing Greatness.
            </p>
          </div>
        </div>

        {/* ─── Right Content Area ─── */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div
            className="droplet-right w-full max-w-[600px] bg-white rounded-3xl border border-black/30 p-8 md:p-10 shadow-xl flex flex-col items-center gap-6"
            style={{ animationDelay: '150ms' }}
          >
            <h2
              className="droplet text-lg md:text-xl font-bold text-black/70 tracking-wide text-center"
              style={{ animationDelay: '300ms' }}
            >
              SELECT ONE TO PROCEED
            </h2>

            <div className="w-full flex flex-col gap-4">
              <button
                type="button"
                onClick={() => handleAction('purchase')}
                style={{ animationDelay: '450ms' }}
                className="droplet-right w-full h-[56px] bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] hover:opacity-95 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 text-white font-bold text-lg rounded-full shadow-[4px_4px_12px_rgba(0,0,0,0.20)] flex items-center justify-center gap-2"
              >
                <i className="bx bx-cart-add text-xl" aria-hidden="true" />
                Purchase Admission Form
              </button>

              <button
                type="button"
                onClick={() => handleAction('login')}
                style={{ animationDelay: '580ms' }}
                className="droplet-right w-full h-[56px] bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] hover:opacity-95 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 text-white font-bold text-lg rounded-full shadow-[4px_4px_12px_rgba(0,0,0,0.20)] flex items-center justify-center gap-2"
              >
                <i className="bx bx-log-in text-xl" aria-hidden="true" />
                Login to Dashboard
              </button>
            </div>

            <p
              className="droplet text-xs text-black/40 text-center max-w-[420px] leading-relaxed"
              style={{ animationDelay: '720ms' }}
            >
              New student? Choose{' '}
              <span className="font-semibold text-[#1A73E8]">
                Purchase Admission Form
              </span>
              . Already have an account? Choose{' '}
              <span className="font-semibold text-[#1A73E8]">
                Login to Dashboard
              </span>
              .
            </p>
          </div>
        </div>
      </main>

      {/* ─── Role Modal ─── */}
      {showRoleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={() => setShowRoleModal(false)}
        >
          <div
            className="droplet w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F9FF] text-[#1A73E8]">
                <i className="bx bx-user-circle text-2xl" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Choose your account type
              </h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Which dashboard do you want to access?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChoice('student')}
                style={{ animationDelay: '150ms' }}
                className="droplet rounded-2xl border border-slate-200 bg-[#F5F9FF] py-5 text-base font-bold text-[#1A73E8] hover:bg-[#EAF3FF] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex flex-col items-center gap-2"
              >
                <i className="bx bx-graduation text-3xl" aria-hidden="true" />
                Student
              </button>

              <button
                type="button"
                onClick={() => handleRoleChoice('staff')}
                style={{ animationDelay: '230ms' }}
                className="droplet rounded-2xl border border-slate-200 bg-[#F5F9FF] py-5 text-base font-bold text-[#1A73E8] hover:bg-[#EAF3FF] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex flex-col items-center gap-2"
              >
                <i className="bx bx-briefcase text-3xl" aria-hidden="true" />
                Staff
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowRoleModal(false)}
              className="mt-5 w-full rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}