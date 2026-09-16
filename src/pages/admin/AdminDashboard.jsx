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
    { label: 'Total Students', value: stats.totalStudents ?? '—', color: 'text-black' },
    { label: 'Active Staff', value: stats.totalStaff ?? '—', color: 'text-black' },
    {
      label: 'Revenue',
      value: `₦${Number(stats.totalRevenue || 0).toLocaleString()}`,
      color: 'text-[#34A853]',
    },
    { label: 'Pending Approvals', value: stats.pendingAdmissions ?? '—', color: 'text-black' },
  ];

  return (
    <div className="max-w-[1140px] mx-auto">
      <h1 className="text-[32px] font-bold text-black font-ebrima mb-6">
        Dashboard Overview
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {cards.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-black/15 p-5 text-center"
          >
            <p className="text-sm text-black/60 font-ebrima mb-2">{stat.label}</p>
            <p className={`text-[30px] font-bold ${stat.color} font-ebrima`}>
              {loading ? '…' : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-black/15 p-6">
        <h2 className="text-xl font-bold text-black/70 font-ebrima mb-4">
          Recent Admissions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/15">
                <th className="text-left py-3 text-xs font-bold text-black/55 uppercase">Student</th>
                <th className="text-left py-3 text-xs font-bold text-black/55 uppercase">Programme</th>
                <th className="text-left py-3 text-xs font-bold text-black/55 uppercase">Date</th>
                <th className="text-left py-3 text-xs font-bold text-black/55 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-black/50">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-black/50">
                    No admissions yet.
                  </td>
                </tr>
              )}
              {recent.map((r) => (
                <tr key={r.id} className="border-b border-black/5 last:border-0">
                  <td className="py-3 font-ebrima">{r.student_name}</td>
                  <td className="py-3 font-ebrima">
                    {[r.course, r.track_name].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="py-3 font-ebrima text-sm">
                    {new Date(r.created_at).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
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
      </div>
    </div>
  );
}