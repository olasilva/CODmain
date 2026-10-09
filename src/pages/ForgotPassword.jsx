import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { requestPasswordReset } from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await requestPasswordReset(
        email.trim(),
        `${window.location.origin}/reset-password`
      );
      setSent(true);
    } catch (requestError) {
      setError(requestError.message || 'Unable to request a password reset. Please try again.');
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
            <i className="bx bx-lock-open text-2xl" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F4082]">Forgot password?</h1>
          {sent ? (
            <div className="mt-4" role="status" aria-live="polite">
              <p className="text-sm leading-relaxed text-black/65">
                If an account exists for <strong>{email}</strong>, a password reset link has been sent. Check your inbox and follow the link to choose a new password.
              </p>
              <Link to="/login" className="mt-6 inline-flex font-bold text-[#1A73E8] hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm leading-relaxed text-black/60">
                Enter the email address on your account. We&apos;ll send you a link to reset your password.
              </p>
              {error && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="reset-email" className="mb-2 block text-sm font-semibold text-black/75">
                    Email address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-black/20 px-4 outline-none transition focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] font-bold text-white transition hover:opacity-95 disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending link…' : 'Send reset link'}
                </button>
              </form>
              <Link to="/login" className="mt-5 inline-flex text-sm font-bold text-[#1A73E8] hover:underline">
                Back to sign in
              </Link>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}