import DashboardLayout from "../../components/dashboard/DashboardLayout";

/**
 * Stand-in for sidebar destinations that weren't in the provided mockups
 * (Messages, Notifications, Settings) — so navigation works end-to-end.
 * Replace each with a real page as those are designed.
 */
export default function DashboardPlaceholder({ title, body }) {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 text-center animate-fadeUp">
        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-cod-hero flex items-center justify-center">
          <span className="text-white font-bold text-xl">•</span>
        </div>
        <h1 className="text-slate-800 font-bold text-2xl mb-3">{title}</h1>
        <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
      </div>
    </DashboardLayout>
  );
}
