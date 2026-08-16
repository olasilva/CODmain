import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { assignmentStats, assignments } from "../../data/student";

const primaryAction = {
  Pending: "Continue",
  "In Progress": "Continue",
  "Not Started": "Start Assignment",
};

export default function Assignments() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-1 animate-fadeUp">
          <div>
            <h1 className="text-slate-900 text-3xl font-bold mb-1">Assignments</h1>
            <p className="text-slate-500">Track and submit your assignments</p>
          </div>
          <div className="flex gap-3">
            <button type="button" className="focus-ring rounded-full border border-slate-200 text-slate-700 font-semibold text-sm px-5 py-2.5 hover:border-slate-300 transition-colors">
              Filter
            </button>
            <button type="button" className="focus-ring rounded-full border border-slate-200 text-slate-700 font-semibold text-sm px-5 py-2.5 hover:border-slate-300 transition-colors">
              Sort by Date
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 my-8">
          {assignmentStats.map((s, i) => (
            <div
              key={s.label}
              style={{ animationDelay: `${i * 60}ms` }}
              className="opacity-0 animate-fadeUp rounded-2xl bg-white border border-slate-200 px-6 py-6"
            >
              <p className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          {assignments.map((a, i) => {
            const isGraded = a.status === "Graded";
            const isSubmittedOnly = a.status === "Submitted";
            const borderColor =
              a.status === "Pending" ? "border-red-200" :
              a.status === "In Progress" || a.status === "Not Started" ? "border-amber-200" :
              "border-slate-200";
            const bgColor =
              a.status === "Pending" ? "bg-red-50/40" :
              a.status === "In Progress" || a.status === "Not Started" ? "bg-amber-50/40" :
              "bg-white";

            return (
              <div
                key={a.title}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`opacity-0 animate-fadeUp rounded-2xl border ${borderColor} ${bgColor} p-6`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-slate-900 font-bold text-lg">{a.title}</h3>
                      <StatusBadge>{a.status}</StatusBadge>
                      {a.priority && <StatusBadge>Priority</StatusBadge>}
                    </div>
                    <p className="text-slate-500 text-sm mb-1">📗 {a.course}</p>
                    <p className="text-slate-600 text-sm mb-3">{a.description}</p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500">
                      <span>📅 Due: {a.due}</span>
                      <span>⭐ {a.points} points</span>
                      {a.submittedOn && <span className="text-emerald-600">✓ Submitted on {a.submittedOn}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {isSubmittedOnly || isGraded ? (
                      <button
                        type="button"
                        className="focus-ring rounded-full border border-slate-200 text-slate-700 font-semibold text-sm px-5 py-2.5 hover:border-slate-300 transition-colors"
                      >
                        View Submission
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="focus-ring rounded-full bg-cod-blue text-white font-semibold text-sm px-5 py-2.5
                                     transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
                        >
                          {primaryAction[a.status] || "Continue"}
                        </button>
                        <button
                          type="button"
                          className="focus-ring rounded-full border border-slate-200 text-slate-700 font-semibold text-sm px-5 py-2.5 hover:border-slate-300 transition-colors"
                        >
                          View Details
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isGraded && (
                  <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                    <p className="text-emerald-700 font-bold text-sm mb-1">Grade: {a.grade}</p>
                    <p className="text-emerald-700 text-sm">💬 {a.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
