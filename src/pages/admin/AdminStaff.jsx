// src/pages/admin/AdminStaff.jsx
import { useState } from 'react';
import { getAdminStaff, createStaffAccount } from '../../lib/api';
import useFetch from '../../lib/useFetch';

export default function AdminStaff() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [created, setCreated] = useState(null);

  const { data, loading, error, refetch } = useFetch(
    () => getAdminStaff({ search }),
    [search],
    { initialData: { staff: [], total: 0 } }
  );

  const staff = data?.staff || [];

  return (
    <div className="max-w-[1140px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-black font-ebrima">
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
          className="px-5 py-3 bg-[#1A73E8] text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2 text-sm"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Staff
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <strong>How it works:</strong> When you create a staff account, a
        temporary password is generated and emailed to them. They log in at{' '}
        <code className="bg-white px-1.5 py-0.5 rounded">
          /login?role=staff
        </code>{' '}
        and can change the password after first login.
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
        <svg
          className="w-4 h-4 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
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
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-black/10">
              <tr>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                  Staff Member
                </th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                  Role
                </th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                  Status
                </th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                  Last Login
                </th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                  Joined
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
                  <tr
                    key={u.id}
                    className={`border-b border-black/5 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                    }`}
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold text-sm">
                          {(u.full_name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-black text-sm">
                            {u.full_name || 'Unnamed'}
                          </div>
                          <div className="text-xs text-black/50">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-[#1A73E8]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.is_active === false
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {u.is_active === false ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-xs text-black/60">
                      {u.last_login
                        ? new Date(u.last_login).toLocaleString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Never'}
                    </td>
                    <td className="py-3 px-5 text-xs text-black/60">
                      {new Date(u.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
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
    </div>
  );
}

// ─── Create Staff Modal ───
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