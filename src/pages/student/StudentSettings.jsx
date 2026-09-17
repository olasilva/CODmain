// src/pages/student/StudentSettings.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/Studentheader';
import Avatar from '../../components/Avatar';
import {
  getStudentProfile,
  updateStudentProfile,
  isLoggedIn,
  setSession,
  getSession,
} from '../../lib/api';

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000/api';

export default function StudentSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    nationality: '',
    country_of_residence: '',
    emergency_contact: '',
    emergency_phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // ─── Load profile ───
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login', { replace: true });
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await getStudentProfile();
        if (cancelled) return;
        setUser(res?.user || null);
        setStudent(res?.student || null);
        setForm({
          full_name: res?.user?.full_name || '',
          phone: res?.user?.phone || '',
          date_of_birth: res?.student?.date_of_birth || '',
          nationality: res?.student?.nationality || '',
          country_of_residence: res?.student?.country_of_residence || '',
          emergency_contact: res?.student?.emergency_contact || '',
          emergency_phone: res?.student?.emergency_phone || '',
        });
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  // ─── Avatar upload ───
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5 MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch(`${API_URL}/upload/avatar`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('cod-academy-token'),
        },
        body: fd,
      });

      const data = await res.json();
      console.log('Upload response:', data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.details || 'Upload failed');
      }

      // Update local state
      setUser((u) => ({ ...u, avatar_url: data.avatar_url }));

      // Update localStorage session so header reflects the change
      const session = getSession();
      if (session) {
        setSession({ ...session, avatar_url: data.avatar_url });
      }

      // Force header to re-read
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Avatar upload error:', err);
      setError(err.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
      // Reset input so selecting same file again works
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ─── Save profile ───
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');

    try {
      await updateStudentProfile(form);

      const current = getSession();
      if (current) {
        setSession({
          ...current,
          full_name: form.full_name,
          phone: form.phone,
        });
      }

      const res = await getStudentProfile();
      setUser(res?.user || null);
      setStudent(res?.student || null);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex">
        <StudentSidebar activeItem="Settings" />
        <div className="flex-1 ml-[300px]">
          <StudentHeader />
          <div className="max-w-[900px] mx-auto px-8 py-12 text-center text-black/50">
            Loading profile…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StudentSidebar activeItem="Settings" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[900px] mx-auto px-8 py-6">
          <h1 className="text-[36px] font-bold text-black font-ebrima mb-6">
            Profile Settings
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {saved && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              ✅ Profile saved
            </div>
          )}

          {/* ─── Profile header with upload ─── */}
          <div className="bg-white rounded-2xl border border-black/10 p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  src={user?.avatar_url}
                  name={user?.full_name}
                  size={96}
                />
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-black">
                  {user?.full_name || 'Unnamed'}
                </h2>
                <p className="text-sm text-black/60 mt-1">{user?.email}</p>
                {student?.student_id && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-[#1A73E8] rounded-full text-xs font-bold font-mono">
                    {student.student_id}
                  </span>
                )}
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-5 py-2.5 bg-[#1A73E8] text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading
                    ? 'Uploading…'
                    : user?.avatar_url
                    ? 'Change Photo'
                    : 'Upload Photo'}
                </button>
                <p className="text-xs text-black/40 mt-2 text-center">
                  JPG, PNG, WEBP · max 5 MB
                </p>
              </div>
            </div>
          </div>

          {/* Editable form */}
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl border border-black/10 p-6 space-y-5"
          >
            <h3 className="text-lg font-bold text-black/80">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Full Name">
                <input
                  value={form.full_name}
                  onChange={update('full_name')}
                  className="field"
                />
              </Field>

              <Field label="Phone">
                <input
                  value={form.phone}
                  onChange={update('phone')}
                  className="field"
                />
              </Field>

              <Field label="Date of Birth">
                <input
                  type="date"
                  value={form.date_of_birth || ''}
                  onChange={update('date_of_birth')}
                  className="field"
                />
              </Field>

              <Field label="Nationality">
                <input
                  value={form.nationality}
                  onChange={update('nationality')}
                  className="field"
                />
              </Field>

              <Field label="Country of Residence">
                <input
                  value={form.country_of_residence}
                  onChange={update('country_of_residence')}
                  className="field"
                />
              </Field>

              <Field label="Emergency Contact Name">
                <input
                  value={form.emergency_contact}
                  onChange={update('emergency_contact')}
                  className="field"
                />
              </Field>

              <Field label="Emergency Contact Phone">
                <input
                  value={form.emergency_phone}
                  onChange={update('emergency_phone')}
                  className="field"
                />
              </Field>
            </div>

            <div className="flex justify-end pt-4 border-t border-black/10">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-[#1A73E8] text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Read-only info */}
          <div className="bg-white rounded-2xl border border-black/10 p-6 mt-6">
            <h3 className="text-lg font-bold text-black/80 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoRow label="Email" value={user?.email} />
              <InfoRow label="Role" value={user?.role} />
              <InfoRow label="Student ID" value={student?.student_id} />
              <InfoRow label="Status" value={student?.status} />
              <InfoRow label="Academic Year" value={student?.academic_year} />
              <InfoRow
                label="Member Since"
                value={
                  user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-NG')
                    : '—'
                }
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .field {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border: 1px solid rgba(0,0,0,0.15);
          border-radius: 12px;
          outline: none;
          font-size: 14px;
        }
        .field:focus {
          border-color: #1A73E8;
          box-shadow: 0 0 0 3px rgba(26,115,232,0.1);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-black/5">
      <span className="text-black/50">{label}</span>
      <span className="font-bold text-black">{value || '—'}</span>
    </div>
  );
}