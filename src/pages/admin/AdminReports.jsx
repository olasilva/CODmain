// src/pages/admin/AdminReports.jsx
import React, { useMemo } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import useFetch from '../../lib/useFetch';
import { getAdminReports } from '../../lib/api';

export default function AdminReports() {
  const { data, loading, error } = useFetch(getAdminReports, [], {
    initialData: null,
  });

  const stats = data?.stats || {};
  const enrollmentTrend = data?.enrollmentTrend || [];
  const feeCollection = data?.feeCollection || [];
  const classDistribution = data?.classDistribution || [];

  // Derived axis maxes
  const { maxEnrollment, enrollAxisLabels } = useMemo(() => {
    const values = enrollmentTrend.map((d) => Number(d.value || 0));
    const max = values.length ? Math.max(...values, 1) : 0;
    const step = max / 4 || 1;
    const labels = [4, 3, 2, 1, 0].map((i) => Math.round(i * step));
    return { maxEnrollment: max, enrollAxisLabels: labels };
  }, [enrollmentTrend]);

  const { maxFee, feeAxisLabels } = useMemo(() => {
    const values = feeCollection.flatMap((d) => [
      Number(d.collected || 0),
      Number(d.target || 0),
    ]);
    const max = values.length ? Math.max(...values, 1) : 0;
    const step = max / 4 || 1;
    const labels = [4, 3, 2, 1, 0].map((i) => Number((i * step).toFixed(1)));
    return { maxFee: max, feeAxisLabels: labels };
  }, [feeCollection]);

  // Stats cards built from backend
  const statCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents ?? 0,
      color: 'text-black',
      icon: 'bx-group',
    },
    {
      label: 'Total Revenue',
      value: `₦${Number(stats.totalRevenue || 0).toLocaleString()}`,
      color: 'text-[#34A853]',
      icon: 'bx-wallet',
    },
    {
      label: 'Total Admissions',
      value: stats.totalAdmissions ?? 0,
      color: 'text-black',
      icon: 'bx-file',
    },
    {
      label: 'Pending Admissions',
      value: stats.pendingAdmissions ?? 0,
      color: 'text-[#E6AC00]',
      icon: 'bx-time-five',
    },
  ];

  const noDataAtAll =
    !loading &&
    !error &&
    statCards.every((c) => Number(c.value) === 0 || c.value === '₦0') &&
    enrollmentTrend.length === 0 &&
    classDistribution.length === 0;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <AdminSidebar activeItem="Reports" />
      <div className="flex-1 ml-[300px] min-w-0">
        <AdminHeader />

        <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima leading-tight">
              Reports &amp; Analytics
            </h1>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#1A73E8] rounded-xl text-[#1A73E8] font-bold text-sm hover:bg-blue-50 transition"
            >
              <i className="bx bx-download text-lg" aria-hidden="true" />
              Export Report
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <i className="bx bx-error-circle text-lg" aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-16 text-center text-black/50">
              <i
                className="bx bx-loader-alt animate-spin text-3xl"
                aria-hidden="true"
              />
              <p className="mt-2 font-ebrima">Loading reports…</p>
            </div>
          )}

          {/* Empty state */}
          {noDataAtAll && (
            <div className="bg-white rounded-2xl border border-black/10 p-12 text-center">
              <i
                className="bx bx-bar-chart-alt-2 text-5xl text-black/20"
                aria-hidden="true"
              />
              <p className="mt-3 text-black/60 font-ebrima font-bold">
                No report data yet
              </p>
              <p className="text-black/40 text-sm mt-1">
                Reports will populate once students enrol and payments are
                recorded.
              </p>
            </div>
          )}

          {!loading && !noDataAtAll && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {statCards.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-black/15 p-4 sm:p-5 transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs sm:text-sm text-black/55 font-ebrima">
                        {stat.label}
                      </p>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F9FF] text-[#1A73E8]">
                        <i
                          className={`bx ${stat.icon} text-lg`}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <p
                      className={`text-xl sm:text-2xl font-bold ${stat.color} font-ebrima break-all`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-6">
                {/* Enrollment Trend */}
                <div className="bg-white rounded-2xl border border-black/10 p-4 sm:p-6 lg:p-7">
                  <h2 className="text-base sm:text-lg font-bold text-black/65 font-ebrima mb-4">
                    Student Enrollment Trend
                  </h2>

                  {enrollmentTrend.length === 0 ? (
                    <EmptyChart message="No enrollment data yet" />
                  ) : (
                    <div className="relative h-48 sm:h-52">
                      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] sm:text-xs text-gray-500">
                        {enrollAxisLabels.map((v, i) => (
                          <span key={i}>{v}</span>
                        ))}
                      </div>

                      <div className="ml-8 sm:ml-10 h-full relative">
                        <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-gray-200">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-full border-t border-gray-100"
                            />
                          ))}
                        </div>

                        <div className="relative h-full flex items-end justify-around pt-4">
                          {enrollmentTrend.map((item, index) => {
                            const height =
                              maxEnrollment > 0
                                ? (Number(item.value || 0) / maxEnrollment) * 100
                                : 0;
                            return (
                              <div
                                key={index}
                                className="flex flex-col items-center min-w-0"
                              >
                                <div
                                  className="w-5 sm:w-7 bg-[#1A73E8] rounded-t transition-all duration-500"
                                  style={{ height: `${height * 0.8}%` }}
                                  title={`${item.month}: ${item.value}`}
                                />
                                <span className="text-[10px] sm:text-xs text-gray-500 mt-2">
                                  {item.month}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Class Distribution */}
                <div className="bg-white rounded-2xl border border-black/10 p-4 sm:p-6 lg:p-7">
                  <h2 className="text-base sm:text-lg font-bold text-black/65 font-ebrima mb-4">
                    Class Distribution
                  </h2>

                  {classDistribution.length === 0 ? (
                    <EmptyChart message="No class data yet" />
                  ) : (
                    <div className="space-y-2.5">
                      {classDistribution.map((item) => {
                        const maxValue = Math.max(
                          ...classDistribution.map((d) => Number(d.value || 0)),
                          1
                        );
                        const width =
                          (Number(item.value || 0) / maxValue) * 100;
                        return (
                          <div
                            key={item.label}
                            className="flex items-center gap-2 sm:gap-3"
                          >
                            <span className="text-xs sm:text-sm text-gray-500 w-20 sm:w-24 truncate">
                              {item.label}
                            </span>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${width}%`,
                                  backgroundColor: item.color || '#1A73E8',
                                }}
                              />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-gray-600 w-8 text-right">
                              {item.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Fee Collection Chart */}
              <div className="bg-white rounded-2xl border border-black/10 p-4 sm:p-6 lg:p-7">
                <h2 className="text-base sm:text-lg font-bold text-black/65 font-ebrima mb-4">
                  Fee Collection vs Target (₦ Millions)
                </h2>

                {feeCollection.length === 0 ? (
                  <EmptyChart message="No fee data yet" />
                ) : (
                  <>
                    <div className="relative h-44 sm:h-48">
                      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] sm:text-xs text-gray-500">
                        {feeAxisLabels.map((v, i) => (
                          <span key={i}>{v}</span>
                        ))}
                      </div>

                      <div className="ml-8 sm:ml-10 h-full relative">
                        <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-gray-200">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-full border-t border-gray-100"
                            />
                          ))}
                        </div>

                        <div className="relative h-full flex items-end justify-around pt-4">
                          {feeCollection.map((item, index) => {
                            const targetHeight =
                              maxFee > 0
                                ? (Number(item.target || 0) / maxFee) * 100
                                : 0;
                            const collectedHeight =
                              maxFee > 0
                                ? (Number(item.collected || 0) / maxFee) * 100
                                : 0;
                            return (
                              <div
                                key={index}
                                className="flex flex-col items-center gap-1 min-w-0"
                              >
                                <div className="flex items-end gap-0.5 sm:gap-1">
                                  <div
                                    className="w-4 sm:w-6 bg-[#1A73E8] rounded-t transition-all duration-500"
                                    style={{
                                      height: `${collectedHeight * 0.8}%`,
                                    }}
                                    title={`Collected: ₦${item.collected}M`}
                                  />
                                  <div
                                    className="w-4 sm:w-6 bg-[#E8F0FE] rounded-t transition-all duration-500"
                                    style={{
                                      height: `${targetHeight * 0.8}%`,
                                    }}
                                    title={`Target: ₦${item.target}M`}
                                  />
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-500">
                                  {item.month}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#1A73E8] rounded" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          Collected
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#E8F0FE] rounded border border-gray-300" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          Target
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ message = 'No data' }) {
  return (
    <div className="h-48 flex flex-col items-center justify-center text-black/40">
      <i className="bx bx-line-chart text-4xl text-black/15" aria-hidden="true" />
      <p className="mt-2 text-sm font-ebrima">{message}</p>
    </div>
  );
}