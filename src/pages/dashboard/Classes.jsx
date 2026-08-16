import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { upcomingClasses, recentRecordings } from "../../data/student";

export default function Classes() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <h1 className="text-slate-900 text-3xl font-bold mb-1 animate-fadeUp">My Classes</h1>
        <p className="text-slate-500 mb-8 animate-fadeUp">Your upcoming schedule and class recordings</p>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-slate-800 font-bold text-lg mb-4 animate-fadeUp">Upcoming Classes</h2>
            <div className="space-y-4">
              {upcomingClasses.map((c, i) => (
                <div
                  key={`${c.subject}-${c.time}`}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className="opacity-0 animate-fadeUp rounded-2xl bg-white border border-slate-200 p-5 flex items-center gap-4"
                >
                  <span className={`w-1.5 self-stretch rounded-full ${c.accent}`} />
                  <div className="w-20 shrink-0">
                    <p className="text-slate-800 font-bold">{c.time}</p>
                    <p className="text-slate-400 text-xs">{c.day}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-bold mb-0.5">{c.subject}</p>
                    <p className="text-slate-500 text-sm">
                      {c.teacher} &nbsp;•&nbsp; {c.location} &nbsp;•&nbsp; {c.duration}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge>{c.status}</StatusBadge>
                    <button
                      type="button"
                      className={`focus-ring rounded-full text-sm font-semibold px-5 py-2 transition-all duration-200 active:scale-[0.98] ${
                        c.status === "Live"
                          ? "bg-red-500 text-white hover:brightness-105"
                          : "bg-cod-blue text-white hover:brightness-105"
                      }`}
                    >
                      {c.status === "Live" ? "Join Now" : "View Details"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 animate-fadeUp">
              <h2 className="text-slate-800 font-bold text-lg mb-5">Recent Recordings</h2>
              <div className="space-y-4">
                {recentRecordings.map((r) => (
                  <div key={r.title} className="flex items-start gap-3">
                    <span className="h-11 w-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                      ▶
                    </span>
                    <div className="min-w-0">
                      <p className="text-slate-800 font-semibold text-sm leading-snug">{r.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{r.teacher}</p>
                      <p className="text-slate-400 text-xs">
                        {r.date} &nbsp;•&nbsp; {r.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="focus-ring w-full mt-6 rounded-full bg-cod-blue text-white font-semibold text-sm py-3
                           transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
              >
                View All Recordings
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
