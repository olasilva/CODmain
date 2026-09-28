// src/pages/student/components/LogoutModal.jsx
import { useNavigate } from 'react-router-dom';
import { logoutUser, getSession } from '../../../lib/api';

function initialsFrom(name) {
  if (!name) return '?';
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || '').join('') || '?';
}

export default function LogoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Pull the real signed-in user
  const session = getSession('student') || {};
  const student = session.student || {};
  const fullName =
    session.full_name || session.fullName || session.name || 'Student';
  const email = session.email || '';
  const role = session.role || 'student';
  const className =
    student.regular_class ||
    student.regularClass ||
    session.regular_class ||
    session.regularClass ||
    '';
  const initials = initialsFrom(fullName);

  const handleLogout = () => {
    // Clear the student token + session
    logoutUser('student');

    // Best-effort: also clear any stale legacy keys
    try {
      localStorage.removeItem('cod-academy-token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {
      /* ignore */
    }

    onClose?.();
    navigate('/login', { replace: true });
  };

  return (
    <div
      className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
    >
      <div
        className="bg-white rounded-3xl shadow-xl w-full max-w-[480px] p-8 sm:p-12 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <i
              className="bx bx-error text-3xl text-red-500"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Title */}
        <h2
          id="logout-title"
          className="text-2xl sm:text-3xl font-bold text-black font-ebrima text-center"
        >
          Log out of your account?
        </h2>
        <p className="text-sm text-black/50 font-ebrima text-center mt-2">
          You'll be signed out of Clan of David.
          <br />
          Your progress and data will be saved.
        </p>

        {/* User info — pulled from session */}
        <div className="w-full p-4 bg-blue-50/50 rounded-2xl border border-blue-200/50 flex items-center gap-4 mt-6">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-black font-ebrima truncate">
              {fullName}
            </p>
            <p className="text-sm text-black/50 font-ebrima truncate">
              {[role.charAt(0).toUpperCase() + role.slice(1), className, 'Clan of David']
                .filter(Boolean)
                .join(' · ')}
            </p>
            {email && (
              <p className="text-xs text-black/40 font-ebrima truncate mt-0.5">
                {email}
              </p>
            )}
          </div>
          <div
            className="w-2 h-2 bg-green-500 rounded-full shrink-0"
            aria-label="Online"
          />
        </div>

        {/* Divider */}
        <div className="w-full border-t border-black/5 my-4" />

        {/* Buttons */}
        <div className="w-full flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 bg-white border border-black/10 rounded-full text-black/70 font-ebrima font-bold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 py-3.5 bg-blue-600 shadow-lg shadow-blue-600/30 rounded-full text-white font-ebrima font-bold hover:bg-blue-700 transition inline-flex items-center justify-center gap-2"
          >
            <i className="bx bx-log-out text-lg" aria-hidden="true" />
            Log Out
          </button>
        </div>

        <p className="text-xs text-black/30 font-ebrima text-center mt-4">
          You can log back in anytime with your credentials
        </p>
      </div>
    </div>
  );
}