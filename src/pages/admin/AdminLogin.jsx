// src/pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import { loginUser, setActiveRole } from '../../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: 'admin',
      });

      const role = result?.user?.role;
      if (role !== 'admin') {
        setError('This account does not have admin access.');
        setLoading(false);
        return;
      }

      setActiveRole('admin');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F9FF] px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo + brand */}
        <div className="flex flex-col items-center mb-8 animate-fadeUp">
          <img
            src={logo}
            alt="Clan of David"
            className="w-20 h-20 rounded-2xl object-cover shadow-lg mb-4"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A73E8] font-ebrima">
            Clan of David
          </h1>
          <p className="text-sm text-black/50 mt-1 font-ebrima">
            Admin Sign In
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-8 shadow-sm animate-fadeUp">
          <h2 className="text-lg font-bold text-black font-ebrima mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-black/50 font-ebrima mb-6">
            Enter your admin credentials to continue.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <i className="bx bx-error-circle text-lg shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-black/70 mb-1.5 uppercase tracking-wide font-ebrima"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40">
                  <i className="bx bx-envelope text-lg" aria-hidden="true" />
                </span>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="admin@codacademy.ng"
                  className="w-full h-12 pl-10 pr-4 border border-black/15 rounded-xl focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-black/70 mb-1.5 uppercase tracking-wide font-ebrima"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40">
                  <i className="bx bx-lock-alt text-lg" aria-hidden="true" />
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={update('password')}
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-12 border border-black/15 rounded-xl focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-none text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition"
                >
                  <i
                    className={`bx ${
                      showPassword ? 'bx-hide' : 'bx-show'
                    } text-lg`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#1A73E8] to-[#0F4082] text-white font-bold rounded-xl hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i
                    className="bx bx-loader-alt animate-spin text-lg"
                    aria-hidden="true"
                  />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <i className="bx bx-right-arrow-alt text-lg" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Secondary links */}
          <div className="mt-6 pt-5 border-t border-black/5 text-center text-xs text-black/50 font-ebrima">
            <Link to="/" className="hover:text-[#1A73E8] transition">
              ← Back to website
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-black/40 mt-6 font-ebrima">
          © {new Date().getFullYear()} Clan of David Art &amp; Music Academy
        </p>
      </div>
    </div>
  );
}