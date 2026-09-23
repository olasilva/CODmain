// src/pages/staff/StaffSessions.jsx
import React, { useEffect, useMemo, useState } from "react";
import StaffSidebar from "./components/StaffSidebar";
import StudentHeader from "../student/components/Studentheader";
import {
  getStaffOnlineSessions,
  createOnlineSession,
  updateOnlineSession,
  deleteOnlineSession,
  getStaffStudents,
} from "../../lib/api";

// ---------- Helpers ----------
function fmt(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function toLocalInput(d) {
  if (!d) return "";
  const dt = new Date(d);
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  classIds: [],
  meetingLink: "",
  meetingId: "",
  passcode: "",
  startTime: "",
  endTime: "",
  notifyStudents: true,
};

export default function StaffSessions() {
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);       // [{ id, name }]
  const [allStudents, setAllStudents] = useState([]); // raw student objects
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ---------- Load ----------
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [sessRes, studentsRes] = await Promise.all([
        getStaffOnlineSessions().catch(() => ({ sessions: [] })),
        getStaffStudents().catch(() => ({})),
      ]);

      setSessions(sessRes?.sessions || []);

      const studentsArr =
        studentsRes?.students ||
        studentsRes?.data ||
        (Array.isArray(studentsRes) ? studentsRes : []);

      setAllStudents(studentsArr);

      // Build a unique class list from students' class fields.
      // Adjust field names below to match the real shape of a student object.
      const map = new Map();
      for (const s of studentsArr) {
        const id =
          s.classId || s.class_id || s.class?._id || s.class?.id || s.class;
        const name =
          s.className || s.class_name || s.class?.name || s.class?.title;
        if (id && !map.has(String(id))) {
          map.set(String(id), { id: String(id), name: name || "Class" });
        }
      }
      setClasses([...map.values()]);
    } catch (e) {
      setError(e.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Form handlers ----------
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditingId(s._id);
    setForm({
      title: s.title || "",
      description: s.description || "",
      classIds: (s.classes || []).map((c) => String(c.id || c._id || c)),
      meetingLink: s.meetingLink || "",
      meetingId: s.meetingId || "",
      passcode: s.passcode || "",
      startTime: toLocalInput(s.startTime),
      endTime: toLocalInput(s.endTime),
      notifyStudents: false,
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const toggleClass = (id) => {
    setForm((f) => ({
      ...f,
      classIds: f.classIds.includes(id)
        ? f.classIds.filter((x) => x !== id)
        : [...f.classIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim()) return setError("Title is required");
    if (!form.classIds.length) return setError("Select at least one class");
    if (!form.meetingLink.trim()) return setError("Meeting link is required");
    if (!form.startTime || !form.endTime)
      return setError("Start and end time are required");
    if (new Date(form.endTime) <= new Date(form.startTime))
      return setError("End time must be after start time");

    setSaving(true);
    try {
      // Build the recipients array from selected classes
      const selectedIds = form.classIds.map(String);
      const recipients = allStudents
        .filter((s) => {
          const cid = String(
            s.classId || s.class_id || s.class?._id || s.class?.id || s.class || ""
          );
          return selectedIds.includes(cid);
        })
        .map((s) => ({
          id: String(s._id || s.id || s.userId || s.user_id || ""),
          name: s.name || s.fullName || s.full_name || "",
          email: s.email || "",
        }))
        .filter((r) => r.email);

      const payload = {
        title: form.title,
        description: form.description,
        classes: classes
          .filter((c) => form.classIds.includes(c.id))
          .map((c) => ({ id: c.id, name: c.name })),
        recipients,
        meetingLink: form.meetingLink,
        meetingId: form.meetingId,
        passcode: form.passcode,
        startTime: form.startTime,
        endTime: form.endTime,
        notifyStudents: form.notifyStudents,
      };

      if (editingId) {
        await updateOnlineSession(editingId, {
          ...payload,
          notifyStudents: undefined, // don't re-notify
        });
        setSuccess("Session updated.");
      } else {
        const res = await createOnlineSession(payload);
        setSuccess(
          `Session created.${
            res?.notified ? ` ${res.notified} student(s) notified by email.` : ""
          }`
        );
      }

      setShowModal(false);
      await load();
    } catch (err) {
      setError(err.message || "Failed to save session");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteOnlineSession(deleteTarget._id);
      setSessions((s) => s.filter((x) => x._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || "Failed to delete session");
      setDeleteTarget(null);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess("Link copied to clipboard.");
    setTimeout(() => setSuccess(""), 2000);
  };

  // ---------- Derived ----------
  const now = new Date();
  const upcoming = useMemo(
    () =>
      sessions
        .filter((s) => new Date(s.startTime) >= now && s.status !== "cancelled")
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
    [sessions] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const past = useMemo(
    () =>
      sessions
        .filter((s) => new Date(s.startTime) < now)
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime)),
    [sessions]
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <StaffSidebar activeItem="Sessions" />
      <div className="flex-1 ml-[300px]">
        <StudentHeader />
        <div className="max-w-[1140px] mx-auto px-8 py-6">
          {/* Header card */}
          <div className="bg-white rounded-3xl p-8 mb-6 flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-[36px] font-bold text-black font-ebrima">
                Sessions
              </h1>
              <p className="text-base text-black/60 font-ebrima pt-2">
                Schedule online classes, share meeting links, and notify your students.
              </p>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white font-bold px-6 py-3 shadow-md hover:opacity-95 transition"
            >
              <i className="bx bx-plus text-xl" aria-hidden="true" />
              New Session
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 flex items-center gap-2">
              <i className="bx bx-error-circle text-lg" aria-hidden="true" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-3 text-sm text-green-700 flex items-center gap-2">
              <i className="bx bx-check-circle text-lg" aria-hidden="true" />
              {success}
            </div>
          )}

          {/* Upcoming */}
          <section className="mb-8">
            <h2 className="text-black font-bold text-xl mb-4 flex items-center gap-2 font-ebrima">
              <i className="bx bx-broadcast text-[#1A73E8] text-2xl" aria-hidden="true" />
              Upcoming
              <span className="text-sm font-normal text-black/40">
                ({upcoming.length})
              </span>
            </h2>

            {loading ? (
              <div className="bg-white rounded-3xl p-10 text-center text-black/50 font-ebrima">
                Loading sessions…
              </div>
            ) : upcoming.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-black/10 p-10 text-center text-black/50">
                <i className="bx bx-calendar-plus text-4xl text-black/20" aria-hidden="true" />
                <p className="mt-3 font-ebrima">
                  No upcoming sessions. Click “New Session” to schedule one.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((s) => (
                  <SessionCard
                    key={s._id}
                    session={s}
                    onEdit={() => openEdit(s)}
                    onDelete={() => setDeleteTarget(s)}
                    onCopy={copy}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Past */}
          {past.length > 0 && (
            <section>
              <h2 className="text-black font-bold text-xl mb-4 flex items-center gap-2 font-ebrima">
                <i className="bx bx-history text-black/40 text-2xl" aria-hidden="true" />
                Past
                <span className="text-sm font-normal text-black/40">
                  ({past.length})
                </span>
              </h2>
              <div className="space-y-4">
                {past.map((s) => (
                  <SessionCard
                    key={s._id}
                    session={s}
                    past
                    onEdit={() => openEdit(s)}
                    onDelete={() => setDeleteTarget(s)}
                    onCopy={copy}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl my-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-black font-ebrima">
                  {editingId ? "Edit Session" : "New Online Session"}
                </h3>
                <p className="text-sm text-black/50 mt-1 font-ebrima">
                  {editingId
                    ? "Changes apply to the session details and link."
                    : "Students in the selected classes get an email + portal notification."}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="text-black/40 hover:text-black transition"
              >
                <i className="bx bx-x text-3xl" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Title" required>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Piano Theory — Week 4"
                  className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/30 focus:border-[#1A73E8]"
                  required
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  placeholder="What will students learn in this session?"
                  className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/30 focus:border-[#1A73E8]"
                />
              </Field>

              <Field
                label={`Classes (${form.classIds.length} selected)`}
                required
                hint="Students in these classes will receive the link."
              >
                {classes.length === 0 ? (
                  <p className="text-sm text-black/50 italic font-ebrima">
                    No classes loaded. Make sure your staff account is
                    assigned to at least one class.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {classes.map((c) => {
                      const active = form.classIds.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleClass(c.id)}
                          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                            active
                              ? "border-[#1A73E8] bg-blue-50 text-[#1A73E8]"
                              : "border-black/10 text-black/60 hover:border-black/30"
                          }`}
                        >
                          {active && (
                            <i className="bx bx-check mr-1" aria-hidden="true" />
                          )}
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </Field>

              <Field label="Meeting Link" required>
                <input
                  type="url"
                  value={form.meetingLink}
                  onChange={(e) =>
                    setForm({ ...form, meetingLink: e.target.value })
                  }
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/30 focus:border-[#1A73E8]"
                  required
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Meeting ID">
                  <input
                    value={form.meetingId}
                    onChange={(e) =>
                      setForm({ ...form, meetingId: e.target.value })
                    }
                    placeholder="123 456 7890"
                    className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/30 focus:border-[#1A73E8]"
                  />
                </Field>
                <Field label="Passcode">
                  <input
                    value={form.passcode}
                    onChange={(e) =>
                      setForm({ ...form, passcode: e.target.value })
                    }
                    placeholder="abcd1234"
                    className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/30 focus:border-[#1A73E8]"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Start Time" required>
                  <input
                    type="datetime-local"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/30 focus:border-[#1A73E8]"
                    required
                  />
                </Field>
                <Field label="End Time" required>
                  <input
                    type="datetime-local"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/30 focus:border-[#1A73E8]"
                    required
                  />
                </Field>
              </div>

              {!editingId && (
                <label className="flex items-start gap-3 rounded-xl bg-[#F5F9FF] border border-black/10 px-4 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.notifyStudents}
                    onChange={(e) =>
                      setForm({ ...form, notifyStudents: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 accent-[#1A73E8]"
                  />
                  <div>
                    <span className="text-sm font-semibold text-black font-ebrima">
                      Notify students
                    </span>
                    <p className="text-xs text-black/50 mt-0.5">
                      Send an email and portal notification to every student in
                      the selected classes.
                    </p>
                  </div>
                </label>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-full border border-black/10 py-3 text-sm font-semibold text-black/70 hover:bg-black/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white py-3 text-sm font-bold shadow-md hover:opacity-95 transition disabled:opacity-60"
                >
                  {saving
                    ? "Saving…"
                    : editingId
                    ? "Save Changes"
                    : "Create & Notify"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-black font-ebrima mb-2">
              Delete this session?
            </h3>
            <p className="text-sm text-black/60 font-ebrima mb-6">
              “{deleteTarget.title}” will be removed. Students will no longer
              see it on their dashboard.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-full border border-black/10 py-2.5 text-sm font-semibold text-black/70 hover:bg-black/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-full bg-red-600 text-white py-2.5 text-sm font-bold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Small components ----------
function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-black/80 mb-1.5 font-ebrima">
        {label} {required && <span className="text-[#FF2E96]">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-black/40 mt-1.5">{hint}</p>}
    </div>
  );
}

function SessionCard({ session, past, onEdit, onDelete, onCopy }) {
  const statusColor =
    {
      scheduled: "bg-blue-50 text-blue-700 border-blue-200",
      live: "bg-green-50 text-green-700 border-green-200",
      completed: "bg-black/5 text-black/60 border-black/10",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    }[session.status] || "bg-black/5 text-black/60 border-black/10";

  const classNames = (session.classes || [])
    .map((c) => c.name || c.title)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="rounded-3xl bg-white p-6 transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-black font-ebrima truncate">
              {session.title}
            </h3>
            <span
              className={`text-xs font-semibold rounded-full border px-2.5 py-0.5 capitalize ${statusColor}`}
            >
              {session.status}
            </span>
          </div>
          {session.description && (
            <p className="text-sm text-black/60 mb-1">{session.description}</p>
          )}
          <p className="text-sm text-black/60 font-ebrima">
            <i className="bx bx-time mr-1" aria-hidden="true" />
            {fmt(session.startTime)} — {fmt(session.endTime)}
          </p>
          {classNames && (
            <p className="text-sm text-black/60 mt-1 font-ebrima">
              <i className="bx bx-group mr-1" aria-hidden="true" />
              {classNames}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={session.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1A73E8] text-white px-4 py-2 text-sm font-semibold hover:brightness-110 transition"
        >
          <i className="bx bx-video" aria-hidden="true" />
          Open Link
        </a>
        <button
          onClick={() => onCopy(session.meetingLink)}
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black/70 hover:bg-black/5 transition"
        >
          <i className="bx bx-copy" aria-hidden="true" />
          Copy
        </button>
        {!past && (
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black/70 hover:bg-black/5 transition"
          >
            <i className="bx bx-edit" aria-hidden="true" />
            Edit
          </button>
        )}
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition ml-auto"
        >
          <i className="bx bx-trash" aria-hidden="true" />
          Delete
        </button>
      </div>

      {(session.meetingId || session.passcode) && (
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-black/50 border-t border-black/5 pt-3 font-ebrima">
          {session.meetingId && (
            <span>
              <strong>ID:</strong> {session.meetingId}
            </span>
          )}
          {session.passcode && (
            <span>
              <strong>Passcode:</strong> {session.passcode}
            </span>
          )}
        </div>
      )}
    </div>
  );
}