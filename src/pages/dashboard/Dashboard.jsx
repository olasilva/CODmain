import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { student, dashboardStats, todaysSchedule, dashboardAssignments } from "../../data/student";
import { CalendarIcon, DocumentIcon, CoursesIcon, ClassesIcon, AssignmentsIcon, StarIcon } from "../../components/BoxIcons";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-1 animate-fadeUp">
          <h1 className="text-slate-900 text-3xl font-bold">Welcome back, {student.name}</h1>
          <span className="rounded-full bg-cod-blue text-white text-sm font-semibold px-4 py-1.5">
            {student.termLabel}
          </span>
        </div>
        <p className="text-slate-500 mb-8 animate-fadeUp">Here's what's happening with your learning today</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {dashboardStats.map((s, i) => (
            <div
              key={s.label}
              style={{ animationDelay: `${i * 60}ms` }}
              className="opacity-0 animate-fadeUp rounded-2xl bg-white border border-slate-200 px-6 py-6"
            >
              {s.icon === "courses" && <CoursesIcon className="w-8 h-8 mb-3" />}
              {s.icon === "classes" && <ClassesIcon className="w-8 h-8 mb-3" />}
              {s.icon === "assignments" && <AssignmentsIcon className="w-8 h-8 mb-3" />}
              {s.icon === "gpa" && <StarIcon className="w-8 h-8 mb-3" />}
              <p className="text-slate-900 text-3xl font-bold mb-1">{s.value}</p>
              <p className="text-slate-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 animate-fadeUp">
            <h2 className="flex items-center gap-2 text-slate-800 font-bold text-lg mb-5">
              <CalendarIcon className="w-5 h-5" /> Today's Schedule
            </h2>
            <div className="space-y-4">
              {todaysSchedule.map((item) => (
                <div
                  key={item.subject}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 pl-0 py-3 pr-4 hover:border-slate-200 transition-colors"
                >
                  <span className={`w-1.5 self-stretch rounded-full ${item.accent}`} />
                  <div className="w-16 shrink-0">
                    <p className="text-slate-800 font-bold text-sm leading-tight">{item.time}</p>
                    <p className="text-slate-400 text-xs">{item.meridiem}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-bold">{item.subject}</p>
                    <p className="text-slate-500 text-sm">
                      {item.teacher} &nbsp;•&nbsp; {item.location}
                    </p>
                  </div>
                  <StatusBadge>{item.status}</StatusBadge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-6 animate-fadeUp" style={{ animationDelay: "80ms" }}>
            <h2 className="flex items-center gap-2 text-slate-800 font-bold text-lg mb-5">
              <DocumentIcon className="w-5 h-5" /> Assignments
            </h2>
            <div className="space-y-5">
              {dashboardAssignments.map((a) => (
                <div key={a.title}>
                  <p className="text-slate-800 font-semibold">{a.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-slate-400 text-sm">{a.due}</p>
                    <StatusBadge>{a.status}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/dashboard/assignments"
              className="focus-ring block text-center mt-6 text-cod-blue font-semibold text-sm hover:text-cod-blue-dark transition-colors"
            >
              View all assignments →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
