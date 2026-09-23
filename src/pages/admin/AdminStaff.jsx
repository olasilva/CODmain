// src/pages/admin/AdminStaff.jsx
import { useState, useEffect } from 'react';
import {
  getAdminStaff,
  createStaffAccount,
  getAdminClasses,
  getStaffClasses,
  assignStaffToClasses,
  getStaffPassword,
  getStaffDetails,
  updateStaffAccount,
  deleteStaffAccount,
  resetStaffPassword,
} from '../../lib/api';
import useFetch from '../../lib/useFetch';
import Avatar from '../../components/Avatar';

export default function AdminStaff() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [assignModal, setAssignModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [created, setCreated] = useState(null);

  const { data, loading, error, refetch } = useFetch(
    () => getAdminStaff({ search }),
    [search],
    { initialData: { staff: [], total: 0 } }
  );

  const staff = data?.staff || [];

  return (
    <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-black font-ebrima">
            Staff
          </h1>
          <p className="text-sm text-black/50 mt-1">
            {data?.total || 0} account{data?.total === 1 ? '' : 's'}
          </p>
        </div>
        <button
          onClick={() => {
            setCreated(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1A73E8] text-white font-bold rounded-xl hover:bg-blue-700 text-sm"
        >
          <i className="bx bx-plus text-lg" aria-hidden="true" />
          Add Staff
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <strong>Tip:</strong> Click any staff row to view their details,
        create or reset their password, and edit or delete their account.
      </div>

      {/* Success card */}
      {created && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-bold text-green-800 mb-1">
                ✅ Staff account created for {created.user.email}
              </p>
              <p className="text-sm text-green-700 mb-3">
                Credentials have been emailed. If SMTP isn't configured, share
                the password manually:
              </p>
              <div className="bg-white border border-green-200 rounded-lg p-3 flex items-center justify-between">
                <code className="text-base font-mono font-bold text-slate-800">
                  {created.temporaryPassword}
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard?.writeText(created.temporaryPassword)
                  }
                  className="text-xs font-bold text-[#1A73E8] hover:underline"
                >
                  Copy
                </button>
              </div>
            </div>
            <button
              onClick={() => setCreated(null)}
              className="text-green-700 hover:text-green-900 text-xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl border border-black/15 px-4 py-3 flex items-center gap-3 mb-4">
        <i className="bx bx-search text-lg text-black/40" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Staff list */}
      <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-[#F8F9FA] border-b border-black/10">
              <tr>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                  Staff Member
                </th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                  Role
                </th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                  Classes
                </th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                  Last Login
                </th>
                <th className="text-right py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-black/50">
                    Loading staff…
                  </td>
                </tr>
              )}
              {!loading && staff.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-black/50">
                    No staff accounts yet. Click "Add Staff" to create one.
                  </td>
                </tr>
              )}
              {!loading &&
                staff.map((u, i) => (
                  <StaffRow
                    key={u.id}
                    user={u}
                    index={i}
                    onOpen={() => setDetailModal(u)}
                    onAssign={() => setAssignModal(u)}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <CreateStaffModal
          onClose={() => setModalOpen(false)}
          onCreated={(result) => {
            setCreated(result);
            setModalOpen(false);
            refetch();
          }}
        />
      )}

      {assignModal && (
        <AssignStaffModal
          staff={assignModal}
          onClose={() => setAssignModal(null)}
          onSaved={() => {
            setAssignModal(null);
            refetch();
          }}
        />
      )}

      {detailModal && (
        <StaffDetailsModal
          staff={detailModal}
          onClose={() => setDetailModal(null)}
          onSaved={() => refetch()}
          onDeleted={() => {
            setDetailModal(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Staff row — click anywhere on the row to open details
// ═══════════════════════════════════════════════════════════════
function StaffRow({ user, index, onOpen, onAssign }) {
  const [classes, setClasses] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getStaffClasses(user.id)
      .then((res) => {
        if (!cancelled) setClasses(res?.classes || []);
      })
      .catch(() => {
        if (!cancelled) setClasses([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  return (
    <tr
      onClick={onOpen}
      className={`border-b border-black/5 cursor-pointer transition hover:bg-blue-50/40 ${
        index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
      }`}
    >
      <td className="py-3 px-5">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar_url} name={user.full_name} size={36} />
          <div>
            <div className="font-bold text-black text-sm">
              {user.full_name || 'Unnamed'}
            </div>
            <div className="text-xs text-black/50">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-5">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            user.role === 'admin'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-[#1A73E8]'
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className="py-3 px-5">
        {classes === null ? (
          <span className="text-xs text-black/40">…</span>
        ) : classes.length === 0 ? (
          <span className="text-xs text-black/40 italic">None assigned</span>
        ) : (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {classes.slice(0, 3).map((c) => (
              <span
                key={c.id}
                className="px-2 py-0.5 bg-blue-50 text-[#1A73E8] rounded text-xs font-bold"
              >
                {c.title || c.subject || 'Class'}
              </span>
            ))}
            {classes.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-black/60 rounded text-xs font-bold">
                +{classes.length - 3} more
              </span>
            )}
          </div>
        )}
      </td>
      <td className="py-3 px-5 text-xs text-black/60">
        {user.last_login
          ? new Date(user.last_login).toLocaleDateString('en-NG', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : 'Never'}
      </td>
      <td className="py-3 px-5">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAssign();
            }}
            className="px-4 py-2 bg-[#1A73E8] text-white text-xs font-bold rounded-lg hover:bg-blue-700"
          >
            Assign Classes
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            title="View details"
            className="p-2 border border-black/15 rounded-lg text-black/60 hover:bg-black/5 transition"
          >
            <i className="bx bx-chevron-right text-lg" aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════
// Staff Details Modal — view + edit + create/reset password + delete
// ═══════════════════════════════════════════════════════════════
function StaffDetailsModal({ staff: initial, onClose, onSaved, onDeleted }) {
  const [staff, setStaff] = useState(initial);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  // Editable fields
  const [form, setForm] = useState({
    fullName: initial.full_name || '',
    phone: initial.phone || '',
    department: initial.department || '',
  });
  const [saving, setSaving] = useState(false);

  // Password state
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generatingPassword, setGeneratingPassword] = useState(false);
  const [generateMsg, setGenerateMsg] = useState('');

  // Delete state
  const [deleteStep, setDeleteStep] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ---------- Load details + password on mount ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [details, pw] = await Promise.allSettled([
          getStaffDetails(staff.id),
          getStaffPassword(staff.id),
        ]);
        if (cancelled) return;

        if (details.status === 'fulfilled' && details.value?.staff) {
          setStaff((s) => ({ ...s, ...details.value.staff }));
          setClasses(details.value.classes || []);
          setForm({
            fullName: details.value.staff.full_name || '',
            phone: details.value.staff.phone || '',
            department: details.value.staff.department || '',
          });
        }

        if (pw.status === 'fulfilled' && pw.value?.temporaryPassword) {
          setPassword(pw.value);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load details');
      } finally {
        if (!cancelled) setLoading(false);
        if (!cancelled) setPasswordLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [staff.id]);

  // ---------- Save name / phone / department ----------
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError('Name cannot be empty');
      return;
    }
    setSaving(true);
    setError('');
    setSavedMsg('');
    try {
      const res = await updateStaffAccount(staff.id, form);
      setSavedMsg('Saved successfully.');
      if (res?.staff) setStaff((s) => ({ ...s, ...res.staff }));
      onSaved?.();
      setTimeout(() => setSavedMsg(''), 2500);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // ---------- Copy password ----------
  const copyPassword = () => {
    if (!password?.temporaryPassword) return;
    navigator.clipboard?.writeText(password.temporaryPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // ---------- Generate / regenerate password ----------
  const handleGeneratePassword = async () => {
    if (
      password &&
      !window.confirm(
        'Generate a new password? The old one will stop working immediately.'
      )
    ) {
      return;
    }
    setGeneratingPassword(true);
    setGenerateMsg('');
    setError('');
    try {
      const res = await resetStaffPassword(staff.id, { sendEmail: true });
      if (res?.password) {
        setPassword(res.password);
        setStaff((s) => ({
          ...s,
          temporary_password: res.password.temporaryPassword,
          temp_password_set_at: res.password.setAt,
        }));
        setShowPassword(true);
        setGenerateMsg(
          res.emailed
            ? 'Password saved and emailed to the staff member.'
            : 'Password saved. Email was not sent.'
        );
        onSaved?.();
        setTimeout(() => setGenerateMsg(''), 5000);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate password');
    } finally {
      setGeneratingPassword(false);
    }
  };

  // ---------- Delete ----------
  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await deleteStaffAccount(staff.id);
      onDeleted?.();
    } catch (err) {
      setError(err.message || 'Failed to delete staff');
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full my-8 md:my-0 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A73E8] to-[#0F4082] p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar src={staff.avatar_url} name={staff.full_name} size={56} />
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-white truncate">
                {staff.full_name || 'Unnamed Staff'}
              </h2>
              <p className="text-sm text-blue-100 truncate">{staff.email}</p>
              <span
                className={`mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  staff.role === 'admin'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/20 text-white'
                }`}
              >
                {staff.role}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white/80 hover:text-white transition"
          >
            <i className="bx bx-x text-3xl" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="py-10 text-center text-black/50 text-sm">
              <i
                className="bx bx-loader-alt animate-spin text-2xl"
                aria-hidden="true"
              />
              <p className="mt-2">Loading details…</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <i className="bx bx-error-circle text-lg" aria-hidden="true" />
              {error}
            </div>
          )}

          {!loading && (
            <>
              {/* -------- Password section -------- */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-black/70 uppercase tracking-wide">
                    Temporary Password
                  </h3>
                  {staff.temp_password_set_at && (
                    <span className="text-xs text-black/40">
                      Issued{' '}
                      {new Date(staff.temp_password_set_at).toLocaleDateString(
                        'en-NG',
                        { day: 'numeric', month: 'short', year: 'numeric' }
                      )}
                    </span>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 flex gap-2 mb-3">
                  <i
                    className="bx bx-shield-quarter text-base shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    Share this password only through a secure channel. The
                    staff member should change it after first login.
                  </span>
                </div>

                <div className="bg-[#F8F9FA] border border-black/10 rounded-xl p-4">
                  {passwordLoading ? (
                    <div className="text-sm text-black/50">
                      <i
                        className="bx bx-loader-alt animate-spin"
                        aria-hidden="true"
                      />{' '}
                      Loading…
                    </div>
                  ) : !password ? (
                    <div className="text-sm text-black/60 italic">
                      No password yet — click{' '}
                      <strong>Create Password</strong> below to generate one.
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <code className="font-mono text-lg font-bold text-black flex-1 min-w-[200px] break-all">
                        {showPassword
                          ? password.temporaryPassword
                          : '••••••••••••'}
                      </code>
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        title={showPassword ? 'Hide' : 'Show'}
                        className="text-black/50 hover:text-black transition"
                      >
                        <i
                          className={`bx ${
                            showPassword ? 'bx-hide' : 'bx-show'
                          } text-xl`}
                          aria-hidden="true"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={copyPassword}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A73E8] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                      >
                        <i
                          className={`bx ${
                            copied ? 'bx-check' : 'bx-copy'
                          } text-sm`}
                          aria-hidden="true"
                        />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    disabled={generatingPassword}
                    className="inline-flex items-center gap-2 px-4 h-10 bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white rounded-xl font-bold text-xs hover:opacity-95 transition disabled:opacity-60"
                  >
                    <i
                      className={`bx ${
                        generatingPassword
                          ? 'bx-loader-alt animate-spin'
                          : 'bx-key'
                      } text-base`}
                      aria-hidden="true"
                    />
                    {generatingPassword
                      ? 'Generating…'
                      : password
                      ? 'Generate New Password'
                      : 'Create Password'}
                  </button>
                  {generateMsg && (
                    <span className="text-xs text-green-700 flex items-center gap-1.5">
                      <i className="bx bx-check-circle" aria-hidden="true" />
                      {generateMsg}
                    </span>
                  )}
                </div>
              </section>

              {/* -------- Editable details -------- */}
              <section>
                <h3 className="text-sm font-bold text-black/70 uppercase tracking-wide mb-3">
                  Staff Details
                </h3>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
                        Full Name *
                      </label>
                      <input
                        required
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                        placeholder="e.g. Jane Doe"
                        className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
                        Email (read-only)
                      </label>
                      <input
                        disabled
                        value={staff.email || ''}
                        className="w-full h-11 px-4 border border-black/10 rounded-xl bg-black/5 text-sm text-black/60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
                        Phone
                      </label>
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="+234 ..."
                        className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
                        Department
                      </label>
                      <input
                        value={form.department}
                        onChange={(e) =>
                          setForm({ ...form, department: e.target.value })
                        }
                        placeholder="e.g. Music Instructor"
                        className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
                      />
                    </div>
                  </div>

                  {savedMsg && (
                    <p className="text-sm text-green-700 flex items-center gap-1.5">
                      <i className="bx bx-check-circle" aria-hidden="true" />
                      {savedMsg}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-5 h-11 bg-[#1A73E8] text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      <i className="bx bx-save text-lg" aria-hidden="true" />
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </section>

              {/* -------- Assigned classes -------- */}
              {classes.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-black/70 uppercase tracking-wide mb-3">
                    Assigned Classes ({classes.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {classes.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-[#1A73E8] rounded-full text-xs font-bold"
                      >
                        <i className="bx bx-book" aria-hidden="true" />
                        {c.title || c.subject || 'Class'}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* -------- Danger zone -------- */}
              <section className="pt-4 border-t border-black/10">
                <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-3">
                  Danger Zone
                </h3>

                {!deleteStep ? (
                  <button
                    type="button"
                    onClick={() => setDeleteStep(true)}
                    className="inline-flex items-center gap-2 px-5 h-11 border border-red-300 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition"
                  >
                    <i className="bx bx-trash text-lg" aria-hidden="true" />
                    Delete Staff Account
                  </button>
                ) : (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-800 mb-3">
                      This will permanently delete{' '}
                      <strong>{staff.email}</strong> and unassign them from all
                      classes. This cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setDeleteStep(false)}
                        disabled={deleting}
                        className="flex-1 h-11 border border-black/15 rounded-xl font-bold text-sm text-black/60 hover:bg-white transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 h-11 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {deleting ? 'Deleting…' : 'Yes, delete'}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Create Staff Modal
// ═══════════════════════════════════════════════════════════════
function CreateStaffModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await createStaffAccount(form);
      onCreated(result);
    } catch (err) {
      setError(err.message || 'Failed to create staff account');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-black">
              Create Staff Account
            </h2>
            <p className="text-sm text-black/50 mt-0.5">
              An email with login credentials will be sent.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-black/40 hover:text-black text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
              Full Name *
            </label>
            <input
              required
              value={form.fullName}
              onChange={update('fullName')}
              placeholder="e.g. Jane Doe"
              className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
              Email *
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="staff@codacademy.ng"
              className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
              Phone
            </label>
            <input
              value={form.phone}
              onChange={update('phone')}
              placeholder="+234 ..."
              className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-black/70 mb-1.5 uppercase">
              Department
            </label>
            <input
              value={form.department}
              onChange={update('department')}
              placeholder="e.g. Music Instructor"
              className="w-full h-11 px-4 border border-black/15 rounded-xl focus:border-[#1A73E8] outline-none text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border border-black/15 rounded-xl font-bold text-sm text-black/60 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-[#1A73E8] text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Create Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Assign Staff Modal
// ═══════════════════════════════════════════════════════════════
function AssignStaffModal({ staff, onClose, onSaved }) {
  const [classes, setClasses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [allRes, mineRes] = await Promise.all([
          getAdminClasses(),
          getStaffClasses(staff.id),
        ]);
        if (cancelled) return;
        setClasses(allRes?.classes || []);
        setSelected((mineRes?.classes || []).map((c) => c.id));
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load classes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [staff.id]);

  const toggle = (classId) => {
    setSelected((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const selectAll = () => setSelected(classes.map((c) => c.id));
  const clearAll = () => setSelected([]);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      await assignStaffToClasses(staff.id, selected);
      onSaved();
    } catch (err) {
      setError(err.message || 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar src={staff.avatar_url} name={staff.full_name} size={48} />
            <div>
              <h2 className="text-xl font-bold text-black">
                Assign Classes to {staff.full_name}
              </h2>
              <p className="text-sm text-black/50 mt-0.5">{staff.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-black/40 hover:text-black text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-black/60">
            Selected <strong className="text-black">{selected.length}</strong>{' '}
            of {classes.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs font-bold text-[#1A73E8] hover:underline"
            >
              Select all
            </button>
            <span className="text-black/20">|</span>
            <button
              onClick={clearAll}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Clear all
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto border border-black/10 rounded-xl mb-4">
          {loading && (
            <div className="p-8 text-center text-black/50 text-sm">
              Loading classes…
            </div>
          )}
          {!loading && classes.length === 0 && (
            <div className="p-8 text-center text-black/50 text-sm">
              No classes exist yet. Create classes first.
            </div>
          )}
          {!loading &&
            classes.map((c, idx) => {
              const isSelected = selected.includes(c.id);
              return (
                <label
                  key={c.id}
                  className={`flex items-center gap-3 p-3 cursor-pointer border-b border-black/5 last:border-0 transition ${
                    isSelected
                      ? 'bg-blue-50'
                      : idx % 2 === 0
                      ? 'bg-white'
                      : 'bg-[#FAFAFA]'
                  } hover:bg-blue-50/50`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(c.id)}
                    className="h-4 w-4 accent-[#1A73E8]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-black text-sm">
                      {c.title || c.subject || 'Unnamed Class'}
                    </div>
                    <div className="text-xs text-black/50">
                      {c.schedule || 'No schedule'}
                      {c.instructor && c.instructor.id !== staff.id && (
                        <>
                          {' · '}
                          <span className="text-orange-600">
                            Currently taught by {c.instructor.full_name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 border border-black/15 rounded-xl font-bold text-sm text-black/60 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || loading}
            className="flex-1 h-11 bg-[#1A73E8] text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Assignments'}
          </button>
        </div>
      </div>
    </div>
  );
}