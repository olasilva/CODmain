// src/pages/staff/StaffAssignments.jsx
import { useEffect, useState } from 'react';
import {
  getStaffAssignments,
  createStaffAssignment,
  getStaffSubmissions,
} from '../../lib/api';

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function StaffAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    class_id: '',
    title: '',
    description: '',
    due_date: '',
    subject: '',
    max_score: 100,
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getStaffAssignments();
      setAssignments(res?.assignments || []);
      setClasses(res?.classes || []);
    } catch (e) {
      setError(e.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.class_id || !form.title.trim()) return;
    setSaving(true);
    setError('');
    try {
      await createStaffAssignment({
        ...form,
        max_score: Number(form.max_score) || 100,
      });
      setForm({
        class_id: '',
        title: '',
        description: '',
        due_date: '',
        subject: '',
        max_score: 100,
      });
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to create assignment');
    } finally {
      setSaving(false);
    }
  };

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A73E8]" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima">
            Assignments
          </h1>
          <p className="text-sm text-black/50 mt-1 font-ebrima">
            Create and review assignments for your classes.
          </p>
        </div>

        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white text-sm font-bold shadow-md hover:opacity-95 transition"
        >
          <i
            className={`bx ${showForm ? 'bx-x' : 'bx-plus'} text-lg`}
            aria-hidden="true"
          />
          {showForm ? 'Cancel' : 'New Assignment'}
        </button>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <i className="bx bx-error-circle text-lg" aria-hidden="true" />
          {error}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl border border-black/10 p-5 sm:p-6 mb-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-black font-ebrima">
            New Assignment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">
                Class
              </label>
              <select
                value={form.class_id}
                onChange={update('class_id')}
                className="w-full h-11 px-3 border border-black/15 rounded-xl text-sm bg-white"
                required
              >
                <option value="">Select class…</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title || c.subject || 'Class'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">
                Subject
              </label>
              <input
                value={form.subject}
                onChange={update('subject')}
                placeholder="e.g. Mathematics"
                className="w-full h-11 px-3 border border-black/15 rounded-xl text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">
                Title
              </label>
              <input
                value={form.title}
                onChange={update('title')}
                placeholder="Assignment title"
                className="w-full h-11 px-3 border border-black/15 rounded-xl text-sm"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={update('description')}
                rows={3}
                placeholder="Instructions for students…"
                className="w-full px-3 py-2.5 border border-black/15 rounded-xl text-sm outline-none focus:border-[#1A73E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">
                Due date
              </label>
              <input
                type="date"
                value={form.due_date}
                onChange={update('due_date')}
                className="w-full h-11 px-3 border border-black/15 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black/60 uppercase mb-1.5">
                Max score
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={form.max_score}
                onChange={update('max_score')}
                className="w-full h-11 px-3 border border-black/15 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-black/5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1A73E8] text-white text-sm font-bold disabled:opacity-50"
            >
              {saving ? (
                <>
                  <i className="bx bx-loader-alt animate-spin" aria-hidden="true" />
                  Creating…
                </>
              ) : (
                <>
                  <i className="bx bx-check" aria-hidden="true" />
                  Create Assignment
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {assignments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/10 p-12 text-center">
          <i
            className="bx bx-notepad text-5xl text-black/15"
            aria-hidden="true"
          />
          <p className="mt-3 text-black/60 font-ebrima font-bold">
            No assignments yet
          </p>
          <p className="text-sm text-black/40 mt-1 max-w-sm mx-auto">
            Create your first assignment to share work with your students.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_140px_120px_140px_120px] gap-4 px-5 py-3 border-b border-black/5 bg-[#FAFBFF] text-[11px] font-bold uppercase tracking-wider text-black/45">
            <span>Title</span>
            <span>Class</span>
            <span>Due</span>
            <span>Submissions</span>
            <span className="text-right">Actions</span>
          </div>

          <ul className="divide-y divide-black/5">
            {assignments.map((a) => {
              const cls = a.class?.title || a.class?.subject || '—';
              const submissionCount = a.submissionCount || 0;
              const pendingCount = a.pendingCount || 0;
              return (
                <li
                  key={a.id}
                  className="px-5 py-4 flex flex-col md:grid md:grid-cols-[1fr_140px_120px_140px_120px] gap-3 md:gap-4 md:items-center"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-black text-sm font-ebrima truncate">
                      {a.title}
                    </p>
                    {a.subject && (
                      <p className="text-xs text-black/50 mt-0.5">
                        {a.subject}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-black/70 truncate">
                    {cls}
                  </span>

                  <span className="text-xs text-black/60">
                    {fmtDate(a.due_date)}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1A73E8]">
                      <i className="bx bx-user" aria-hidden="true" />
                      {submissionCount}
                    </span>
                    {pendingCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 rounded-full px-2 py-0.5">
                        {pendingCount} pending
                      </span>
                    )}
                  </div>

                  <div className="md:text-right">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-[#1A73E8]/30 text-[#1A73E8] hover:bg-[#F5F9FF] transition"
                      onClick={async () => {
                        try {
                          const res = await getStaffSubmissions(a.id);
                          const count = res?.submissions?.length || 0;
                          alert(
                            `${a.title}\n\n${count} submission${count === 1 ? '' : 's'} so far.`
                          );
                        } catch (err) {
                          alert(err.message);
                        }
                      }}
                    >
                      <i className="bx bx-show" aria-hidden="true" />
                      View
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}