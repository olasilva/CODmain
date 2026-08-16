import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { courses } from "../../data/student";

export default function MyCourses() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <h1 className="text-slate-900 text-3xl font-bold mb-1 animate-fadeUp">My Courses</h1>
        <p className="text-slate-500 mb-8 animate-fadeUp">
          You are currently enrolled in {courses.length} courses
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {courses.map((c, i) => (
            <div
              key={c.code}
              style={{ animationDelay: `${i * 80}ms` }}
              className="opacity-0 animate-fadeUp rounded-2xl bg-white border border-slate-200 p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-slate-400 text-sm font-medium">{c.code}</span>
                <span className={`h-9 w-9 rounded-full ${c.badgeColor} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
                  {c.badge}
                </span>
              </div>
              <h3 className="text-slate-900 text-xl font-bold mb-1">{c.name}</h3>
              <p className="text-slate-500 text-sm mb-5">{c.teacher}</p>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-500">Course Progress</span>
                  <span className="text-slate-800 font-bold">{c.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.color} transition-all duration-700`}
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-3 flex items-center justify-between text-sm mb-5">
                <span className="text-slate-500">Next Class:</span>
                <span className="text-slate-800 font-semibold">{c.nextClass}</span>
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  type="button"
                  className="focus-ring flex-1 rounded-full bg-cod-blue text-white font-semibold text-sm py-3
                             transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
                >
                  View Materials
                </button>
                <button
                  type="button"
                  className="focus-ring flex-1 rounded-full border border-slate-200 text-slate-700 font-semibold text-sm py-3
                             transition-all duration-200 hover:border-slate-300"
                >
                  Course Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-cod-hero px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden animate-fadeUp">
          <div className="absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-white/10" />
          <div className="relative text-center md:text-left">
            <h2 className="text-white text-2xl font-bold mb-1">Explore More Courses</h2>
            <p className="text-blue-100 text-sm">Browse our full catalog and register for new courses</p>
          </div>
          <button
            type="button"
            className="focus-ring relative shrink-0 rounded-full bg-white text-cod-blue-dark font-semibold px-7 py-3.5 shadow-md
                       transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            View Course Catalog
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
