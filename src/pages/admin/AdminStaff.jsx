// src/pages/admin/AdminStaff.jsx
import { useState, useEffect } from 'react';
import {
  getAdminStaff,
  createStaffAccount,
  getAdminClasses,
  getStaffClasses,
  assignStaffToClasses,
} from '../../lib/api';
import useFetch from '../../lib/useFetch';
import Avatar from '../../components/Avatar';

export default function AdminStaff() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [assignModal, setAssignModal] = useState(null); // staff object to assign
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
          <h1 className="text-[32px] font-bold text-black font-ebrima">Staff</h1>
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
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Staff
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <strong>How it works:</strong> Create a staff account, then click{' '}
        <strong>Assign Classes</strong> on their row to link them to one or more
        classes. They'll see students in those classes on their dashboard.
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
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Staff Member</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Role</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Classes</th>
                <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Last Login</th>
                <th className="text-right py-3.5 px-5 text-xs font-bold text-black/55 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-black/50">Loading staff…</td>
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
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Staff row — loads its own classes so the table shows badges
// ═══════════════════════════════════════════════════════════════
function StaffRow({ user, index, onAssign }) {
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
    <tr className={`border-b border-black/5 ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
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
      <td className="py-3 px-5 text-right">
        <button
          onClick={onAssign}
          className="px-4 py-2 bg-[#1A73E8] text-white text-xs font-bold rounded-lg hover:bg-blue-700"
        >
          Assign Classes
        </button>
      </td>
    </tr>
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
            <h2 className="text-xl font-bold text-black">Create Staff Account</h2>
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
// Assign Staff Modal — pick which classes this staff teaches
// ═══════════════════════════════════════════════════════════════
function AssignStaffModal({ staff, onClose, onSaved }) {
  const [classes, setClasses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load all classes + current assignments
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
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar src={staff.avatar_url} name={staff.full_name} size={48} />
            <div>
              <h2 className="text-xl font-bold text-black">
                Assign Classes to {staff.full_name}
              </h2>
              <p className="text-sm text-black/50 mt-0.5">
                {staff.email}
              </p>
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

        {/* Selection controls */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-black/60">
            Selected <strong className="text-black">{selected.length}</strong> of{' '}
            {classes.length}
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

        {/* Class list */}
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
                    isSelected ? 'bg-blue-50' : idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
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

        {/* Footer */}
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