// src/pages/OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { decodeJwt } from '../lib/api';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    const payload = decodeJwt(token);
    const role = payload?.role || 'student';

    // Store under the correct role-scoped key
    localStorage.setItem(`cod-${role}-token`, token);
    localStorage.setItem('cod-active-role', role);

    // Redirect to the right dashboard
    if (role === 'admin') navigate('/admin', { replace: true });
    else if (role === 'staff') navigate('/staff/dashboard', { replace: true });
    else navigate('/student/dashboard', { replace: true });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in…</p>
    </div>
  );
}