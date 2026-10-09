import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { resetPassword } from '../lib/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updated, setUpdated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({ token, password });
      setUpdated(true);
    } catch (resetError) {
      setError(resetError.message || 'This reset link may have expired. Request a new one and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <section className="w-full max-w-[480px] rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FD] text-[#1A73E8]">
            <i className="bx bx-key text-2xl" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F4082]">Choose a new password</h1>
          {updated ? (
            <div className="mt-4" role="status" aria-live="polite">
              <p className="text-sm leading-relaxed text-black/65">
                Your password has been updated. You can now sign in with your new password.
              </p>
              <Link to="/login" className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#1A73E8] font-bold text-white hover:bg-[#0F4082]">
                Sign in
              </Link>
            </div>
          ) : !token ? (
            <div className="mt-4">
              <p className="text-sm leading-relaxed text-black/65">
                This reset link is missing its token. Request a new password reset link to continue.
              </p>
              <Link to="/forgot-password" className="mt-6 inline-flex font-bold text-[#1A73E8] hover:underline">
                Request a new link
              </Link>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm leading-relaxed text-black/60">
                Choose a new password for your account.
              </p>
              {error && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="new-password" className="mb-2 block text-sm font-semibold text-black/75">
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 w-full rounded-xl border border-black/20 px-4 outline-none transition focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-black/75">
                    Confirm new password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="h-12 w-full rounded-xl border border-black/20 px-4 outline-none transition focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] font-bold text-white transition hover:opacity-95 disabled:opacity-60"
                >
                  {isSubmitting ? 'Updating password…' : 'Update password'}
                </button>
              </form>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}