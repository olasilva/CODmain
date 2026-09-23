// src/pages/admin/AdminCourses.jsx
import React, { useMemo, useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import useFetch from '../../lib/useFetch';
import { getAdminClasses } from '../../lib/api';

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, loading, error, refetch } = useFetch(getAdminClasses, [], {
    initialData: { classes: [] },
  });

  const classes = data?.classes || [];

  // ---- Derived stats ----
  const stats = useMemo(() => {
    const total = classes.length;
    const active = classes.filter((c) => c.is_active !== false).length;
    const published = classes.filter((c) => c.is_published).length;
    const instructors = new Set(
      classes.map((c) => c.instructor?.id).filter(Boolean)
    ).size;
    return [
      { label: 'Total Courses', value: total, color: 'text-black' },
      { label: 'Active', value: active, color: 'text-[#34A853]' },
      { label: 'Published', value: published, color: 'text-[#1A73E8]' },
      { label: 'Instructors', value: instructors, color: 'text-black' },
    ];
  }, [classes]);

  // ---- Search filter ----
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((c) => {
      const title = (c.title || '').toLowerCase();
      const subject = (c.subject || '').toLowerCase();
      const teacher = (c.instructor?.full_name || '').toLowerCase();
      const id = String(c.id || '').toLowerCase();
      return (
        title.includes(q) ||
        subject.includes(q) ||
        teacher.includes(q) ||
        id.includes(q)
      );
    });
  }, [classes, searchQuery]);

  const fmtId = (id) => {
    if (!id) return '—';
    return `CRS-${String(id).slice(0, 6).toUpperCase()}`;
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <AdminSidebar activeItem="Courses" />
      <div className="flex-1 ml-[300px] min-w-0">
        <AdminHeader />

        <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima leading-tight">
                Courses
              </h1>
              <p className="text-sm text-black/50 mt-1">
                {classes.length} course{classes.length === 1 ? '' : 's'}
              </p>
            </div>
            <button
              onClick={refetch}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-black/15 rounded-xl text-black/70 font-bold text-sm hover:bg-gray-50 transition"
            >
              <i className="bx bx-refresh text-lg" aria-hidden="true" />
              Refresh
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <i className="bx bx-error-circle text-lg" aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-black/15 p-4 sm:p-5 transition hover:shadow-md"
              >
                <p className="text-xs sm:text-sm text-black/60 font-ebrima mb-1">
                  {stat.label}
                </p>
                <p
                  className={`text-xl sm:text-2xl font-bold ${stat.color} font-ebrima break-all`}
                >
                  {loading ? '…' : stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl border border-black/15 px-4 py-2.5 flex items-center gap-2.5 mb-6">
            <i
              className="bx bx-search text-lg text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search by course, subject, or teacher…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none bg-transparent text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="text-black/40 hover:text-black transition"
              >
                <i className="bx bx-x text-lg" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            {/* Loading */}
            {loading && (
              <div className="py-16 text-center text-black/50">
                <i
                  className="bx bx-loader-alt animate-spin text-3xl"
                  aria-hidden="true"
                />
                <p className="mt-2 font-ebrima">Loading courses…</p>
              </div>
            )}

            {/* Empty */}
            {!loading && classes.length === 0 && (
              <div className="py-16 px-6 text-center">
                <i
                  className="bx bx-book-open text-5xl text-black/15"
                  aria-hidden="true"
                />
                <p className="mt-3 text-black/60 font-ebrima font-bold">
                  No courses yet
                </p>
                <p className="text-black/40 text-sm mt-1">
                  Courses will appear here once they are created.
                </p>
              </div>
            )}

            {/* No matches */}
            {!loading && classes.length > 0 && filtered.length === 0 && (
              <div className="py-16 px-6 text-center">
                <i
                  className="bx bx-filter text-5xl text-black/15"
                  aria-hidden="true"
                />
                <p className="mt-3 text-black/60 font-ebrima font-bold">
                  No matches
                </p>
                <p className="text-black/40 text-sm mt-1">
                  Try a different search term.
                </p>
              </div>
            )}

            {/* Desktop table */}
            {!loading && filtered.length > 0 && (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-[#F8F9FA] border-b border-black/10">
                      <tr>
                        <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                          Course ID
                        </th>
                        <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                          Course Name
                        </th>
                        <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                          Instructor
                        </th>
                        <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                          Subject
                        </th>
                        <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                          Schedule
                        </th>
                        <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c, index) => (
                        <tr
                          key={c.id}
                          className={
                            index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                          }
                        >
                          <td className="py-3 px-5 text-[#1A73E8] font-bold text-sm font-mono">
                            {fmtId(c.id)}
                          </td>
                          <td className="py-3 px-5 font-bold text-black text-sm">
                            {c.title || 'Untitled'}
                          </td>
                          <td className="py-3 px-5 text-black/60 text-sm">
                            {c.instructor?.full_name || (
                              <span className="italic text-black/40">
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-5 text-black/60 text-sm">
                            {c.subject || '—'}
                          </td>
                          <td className="py-3 px-5 text-black/60 text-sm">
                            {c.schedule || '—'}
                          </td>
                          <td className="py-3 px-5">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                c.is_active !== false
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-red-100 text-red-500'
                              }`}
                            >
                              {c.is_active !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-black/5">
                  {filtered.map((c) => (
                    <div key={c.id} className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <p className="font-bold text-black text-sm truncate">
                            {c.title || 'Untitled'}
                          </p>
                          <p className="text-xs text-[#1A73E8] font-mono mt-0.5">
                            {fmtId(c.id)}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            c.is_active !== false
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-500'
                          }`}
                        >
                          {c.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div>
                          <p className="text-black/40">Instructor</p>
                          <p className="text-black/70">
                            {c.instructor?.full_name || 'Unassigned'}
                          </p>
                        </div>
                        <div>
                          <p className="text-black/40">Subject</p>
                          <p className="text-black/70">{c.subject || '—'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-black/40">Schedule</p>
                          <p className="text-black/70">
                            {c.schedule || '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}