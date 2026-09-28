// src/pages/PaymentCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { verifyPayment } from '../lib/api';

export default function PaymentCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState('verifying'); // verifying | success | failed
  const [message, setMessage] = useState('Confirming your payment…');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get('reference') || params.get('trxref');

    if (!reference) {
      setState('failed');
      setMessage('No payment reference found in the URL.');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const result = await verifyPayment(reference);
        if (cancelled) return;

        if (result?.success && result?.payment?.status === 'completed') {
          setState('success');
          setMessage('Payment confirmed! Redirecting to your dashboard…');
          setTimeout(
            () => navigate('/student/dashboard', { replace: true }),
            2500
          );
        } else {
          setState('failed');
          setMessage(
            result?.message ||
              `Payment could not be verified. If you were charged, contact support with reference: ${reference}`
          );
        }
      } catch (err) {
        if (cancelled) return;
        setState('failed');
        setMessage(err.message || 'Verification failed. Please try again.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-black/10 shadow-sm p-8 text-center">
          {state === 'verifying' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A73E8] mx-auto mb-5" />
              <h1 className="text-xl font-bold text-[#0F4082] font-ebrima mb-2">
                Verifying payment…
              </h1>
              <p className="text-sm text-black/60 font-ebrima">{message}</p>
            </>
          )}

          {state === 'success' && (
            <>
              <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <i className="bx bx-check text-3xl text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-[#0F4082] font-ebrima mb-2">
                Payment successful
              </h1>
              <p className="text-sm text-black/60 font-ebrima">{message}</p>
            </>
          )}

          {state === 'failed' && (
            <>
              <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
                <i className="bx bx-x text-3xl text-red-600" />
              </div>
              <h1 className="text-xl font-bold text-[#0F4082] font-ebrima mb-2">
                Payment verification failed
              </h1>
              <p className="text-sm text-black/60 font-ebrima mb-6">{message}</p>
              <button
                onClick={() => navigate('/student/dashboard', { replace: true })}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white font-bold font-ebrima"
              >
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}