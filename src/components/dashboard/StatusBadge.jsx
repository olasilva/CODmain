const styles = {
  Live: "bg-red-100 text-red-600",
  Upcoming: "bg-amber-100 text-amber-700",
  Scheduled: "bg-blue-100 text-cod-blue",
  Pending: "bg-red-100 text-red-600",
  Priority: "bg-red-100 text-red-600",
  "In Progress": "bg-amber-100 text-amber-700",
  Submitted: "bg-blue-100 text-cod-blue",
  Graded: "bg-emerald-100 text-emerald-700",
  "Not Started": "bg-slate-100 text-slate-600",
  Distinction: "bg-blue-50 text-cod-blue",
  Credit: "bg-emerald-50 text-emerald-700",
};

export default function StatusBadge({ children, className = "" }) {
  const style = styles[children] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${style} ${className}`}>
      {children}
    </span>
  );
}
