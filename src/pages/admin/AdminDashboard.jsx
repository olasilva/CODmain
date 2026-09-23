// src/pages/admin/AdminDashboard.jsx
import { getAdminStats } from '../../lib/api';
import useFetch from '../../lib/useFetch';

export default function AdminDashboard() {
  const { data, loading, error } = useFetch(getAdminStats, [], {
    initialData: null,
  });

  const stats = data?.stats || {};
  const recent = data?.recentAdmissions || [];

  const cards = [
    { label: 'Total Students', value: stats.totalStudents ?? '—', color: 'text-black', icon: 'bx-group' },
    { label: 'Active Staff', value: stats.totalStaff ?? '—', color: 'text-black', icon: 'bx-id-card' },
    {
      label: 'Revenue',
      value: `₦${Number(stats.totalRevenue || 0).toLocaleString()}`,
      color: 'text-[#34A853]',
      icon: 'bx-wallet',
    },
    { label: 'Pending Approvals', value: stats.pendingAdmissions ?? '—', color: 'text-black', icon: 'bx-time-five' },
  ];

  return (
    <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-black font-ebrima">
          Dashboard Overview
        </h1>
        <p className="text-xs sm:text-sm text-black/50 font-ebrima">
          {new Date().toLocaleDateString('en-NG', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
          <i className="bx bx-error-circle text-lg" aria-hidden="true" />
          {error}
        </div>
      )}

      {/* Stats grid — 1 col mobile, 2 col small, 4 col large */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {cards.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-black/15 p-4 sm:p-5 flex flex-col justify-between min-h-[110px] transition hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-black/60 font-ebrima">
                {stat.label}
              </p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F9FF] text-[#1A73E8]">
                <i className={`bx ${stat.icon} text-lg`} aria-hidden="true" />
              </div>
            </div>
            <p className={`text-xl sm:text-2xl lg:text-[30px] font-bold ${stat.color} font-ebrima leading-tight break-all`}>
              {loading ? '…' : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Admissions */}
      <div className="bg-white rounded-2xl border border-black/15 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-black/70 font-ebrima">
            Recent Admissions
          </h2>
          <span className="text-xs text-black/40 font-ebrima">
            {recent.length} {recent.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-black/15">
                <th className="text-left py-3 px-2 text-xs font-bold text-black/55 uppercase font-ebrima">
                  Student
                </th>
                <th className="text-left py-3 px-2 text-xs font-bold text-black/55 uppercase font-ebrima">
                  Programme
                </th>
                <th className="text-left py-3 px-2 text-xs font-bold text-black/55 uppercase font-ebrima">
                  Date
                </th>
                <th className="text-left py-3 px-2 text-xs font-bold text-black/55 uppercase font-ebrima">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-black/50">
                    <span className="inline-flex items-center gap-2">
                      <i className="bx bx-loader-alt animate-spin text-xl" aria-hidden="true" />
                      Loading…
                    </span>
                  </td>
                </tr>
              )}
              {!loading && recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-black/50">
                    <i className="bx bx-inbox text-4xl text-black/20 block mb-2" aria-hidden="true" />
                    No admissions yet.
                  </td>
                </tr>
              )}
              {recent.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition"
                >
                  <td className="py-3 px-2 font-ebrima text-sm">{r.student_name}</td>
                  <td className="py-3 px-2 font-ebrima text-sm">
                    {[r.course, r.track_name].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="py-3 px-2 font-ebrima text-xs text-black/60">
                    {new Date(r.created_at).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        r.status === 'approved'
                          ? 'bg-green-100 text-green-600'
                          : r.status === 'rejected'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards (instead of a cramped table) */}
        <div className="md:hidden space-y-3">
          {loading && (
            <div className="py-6 text-center text-black/50 text-sm">
              <i className="bx bx-loader-alt animate-spin text-xl" aria-hidden="true" />
              <p className="mt-1">Loading…</p>
            </div>
          )}
          {!loading && recent.length === 0 && (
            <div className="py-8 text-center text-black/50 text-sm">
              <i className="bx bx-inbox text-4xl text-black/20 block mb-2" aria-hidden="true" />
              No admissions yet.
            </div>
          )}
          {recent.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-black/10 p-3.5 bg-[#FAFAFA]"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-ebrima font-semibold text-sm text-black truncate">
                  {r.student_name}
                </p>
                <span
                  className={`shrink-0 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    r.status === 'approved'
                      ? 'bg-green-100 text-green-600'
                      : r.status === 'rejected'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-black/60 font-ebrima mb-1">
                <i className="bx bx-book-open mr-1" aria-hidden="true" />
                {[r.course, r.track_name].filter(Boolean).join(' · ') || '—'}
              </p>
              <p className="text-xs text-black/40 font-ebrima">
                <i className="bx bx-calendar mr-1" aria-hidden="true" />
                {new Date(r.created_at).toLocaleDateString('en-NG', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}