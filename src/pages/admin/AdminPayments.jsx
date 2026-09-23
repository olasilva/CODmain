// src/pages/admin/AdminPayments.jsx
import React, { useState, useMemo } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import useFetch from '../../lib/useFetch';
import { getAdminPayments } from '../../lib/api';

export default function AdminPayments() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const { data, loading, error } = useFetch(getAdminPayments, [], {
    initialData: { payments: [], summary: {} },
  });

  const payments = data?.payments || [];
  const summary = data?.summary || {};

  // Filter + search applied client-side on the fetched list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (activeFilter !== 'All') {
        const s = (p.status || '').toLowerCase();
        if (s !== activeFilter.toLowerCase()) return false;
      }
      if (q) {
        const name = (p.student?.full_name || '').toLowerCase();
        const email = (p.payer_email || '').toLowerCase();
        const ref = (p.reference || '').toLowerCase();
        if (
          !name.includes(q) &&
          !email.includes(q) &&
          !ref.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [payments, activeFilter, search]);

  const totalExpected =
    Number(summary.totalCollected || 0) + Number(summary.totalPending || 0);

  const statCards = [
    {
      label: 'Total Expected',
      value: `₦${totalExpected.toLocaleString()}`,
      color: 'text-black',
    },
    {
      label: 'Collected',
      value: `₦${Number(summary.totalCollected || 0).toLocaleString()}`,
      color: 'text-[#34A853]',
    },
    {
      label: 'Pending',
      value: `₦${Number(summary.totalPending || 0).toLocaleString()}`,
      color: 'text-[#E6AC00]',
    },
    {
      label: 'Transactions',
      value: summary.countTotal || 0,
      color: 'text-black',
    },
  ];

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'success' || s === 'paid')
      return 'bg-green-100 text-green-600';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-600';
    if (s === 'failed') return 'bg-red-100 text-red-500';
    return 'bg-gray-100 text-gray-600';
  };

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-NG', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '—';

  const fmtAmount = (n) => `₦${Number(n || 0).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <AdminSidebar activeItem="Payments" />
      <div className="flex-1 ml-[300px] min-w-0">
        <AdminHeader />

        <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima leading-tight">
              Payments
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white border border-[#1A73E8] rounded-xl text-[#1A73E8] font-bold text-sm hover:bg-blue-50 transition"
              >
                <i className="bx bx-download text-lg" aria-hidden="true" />
                Export
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <i className="bx bx-error-circle text-lg" aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-black/15 p-4 sm:p-5 transition hover:shadow-md"
              >
                <p className="text-xs sm:text-sm text-black/60 font-ebrima mb-1">
                  {stat.label}
                </p>
                <p
                  className={`text-lg sm:text-2xl font-bold ${
                    stat.color || 'text-black'
                  } font-ebrima break-all`}
                >
                  {loading ? '…' : stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
            <div className="flex-1 bg-white rounded-xl border border-black/15 px-4 py-2.5 flex items-center gap-2.5">
              <i
                className="bx bx-search text-lg text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search by student, email, or reference…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none bg-transparent text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'Completed', 'Pending', 'Failed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                    activeFilter === filter
                      ? 'bg-[#1A73E8] text-white border-2 border-[#1A73E8]'
                      : 'bg-white text-gray-500 border border-black/15 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Table / Cards */}
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            {/* Loading */}
            {loading && (
              <div className="py-16 text-center text-black/50">
                <i
                  className="bx bx-loader-alt animate-spin text-3xl"
                  aria-hidden="true"
                />
                <p className="mt-2 font-ebrima">Loading payments…</p>
              </div>
            )}

            {/* Empty */}
            {!loading && payments.length === 0 && (
              <div className="py-16 px-6 text-center">
                <i
                  className="bx bx-receipt text-5xl text-black/15"
                  aria-hidden="true"
                />
                <p className="mt-3 text-black/60 font-ebrima font-bold">
                  No payments recorded yet
                </p>
                <p className="text-black/40 text-sm mt-1">
                  Payments will appear here as soon as they are made.
                </p>
              </div>
            )}

            {/* No matches after filter */}
            {!loading && payments.length > 0 && filtered.length === 0 && (
              <div className="py-16 px-6 text-center">
                <i
                  className="bx bx-filter text-5xl text-black/15"
                  aria-hidden="true"
                />
                <p className="mt-3 text-black/60 font-ebrima font-bold">
                  No matches
                </p>
                <p className="text-black/40 text-sm mt-1">
                  Try changing the filter or search term.
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
                          Student
                        </th>
                        <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                          Reference
                        </th>
                        <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                          Plan
                        </th>
                        <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                          Amount
                        </th>
                        <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                          Date
                        </th>
                        <th className="text-left py-3.5 px-5 text-xs font-bold text-black/55 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p, index) => (
                        <tr
                          key={p.id}
                          className={
                            index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                          }
                        >
                          <td className="py-3 px-5">
                            <div className="font-bold text-black text-sm">
                              {p.student?.full_name || '—'}
                            </div>
                            <div className="text-xs text-black/40">
                              {p.payer_email || ''}
                            </div>
                          </td>
                          <td className="py-3 px-5 text-black/60 text-xs font-mono">
                            {p.reference || '—'}
                          </td>
                          <td className="py-3 px-5 text-black/60 text-sm capitalize">
                            {p.plan || '—'}
                          </td>
                          <td className="py-3 px-5 font-bold text-black">
                            {fmtAmount(p.amount)}
                          </td>
                          <td className="py-3 px-5 text-black/60 text-xs">
                            {fmtDate(p.payment_date || p.created_at)}
                          </td>
                          <td className="py-3 px-5">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(
                                p.status
                              )}`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-black/5">
                  {filtered.map((p) => (
                    <div key={p.id} className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <p className="font-bold text-black text-sm truncate">
                            {p.student?.full_name || 'Unknown student'}
                          </p>
                          <p className="text-xs text-black/40 truncate">
                            {p.payer_email || ''}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div>
                          <p className="text-black/40">Amount</p>
                          <p className="font-bold text-black">
                            {fmtAmount(p.amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-black/40">Plan</p>
                          <p className="text-black/70 capitalize">
                            {p.plan || '—'}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-black/40">Reference</p>
                          <p className="text-black/70 font-mono truncate">
                            {p.reference || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-black/40">Date</p>
                          <p className="text-black/70">
                            {fmtDate(p.payment_date || p.created_at)}
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