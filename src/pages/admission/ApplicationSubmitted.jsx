import { Link, Navigate, useLocation } from "react-router-dom";
import BrandPanel from "../../components/BrandPanel";

export default function ApplicationSubmitted() {
  const location = useLocation();
  const { studentFirstName, guardianEmail, programmeLabel } = location.state || {};

  if (!studentFirstName) return <Navigate to="/admission" replace />;

  return (
    <div className="min-h-screen w-full flex bg-cod-bg overflow-hidden">
      <BrandPanel />

      <div className="flex-1 flex items-center justify-center px-6 pt-24 md:pt-6">
        <div className="max-w-md w-full text-center animate-fadeUp">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-cod-btn flex items-center justify-center animate-scaleIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h1 className="text-slate-800 text-2xl font-bold mb-3">Application Submitted!</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Thank you, <span className="font-semibold text-slate-700">{studentFirstName}</span>. Your application
            for {programmeLabel ? <span className="font-semibold text-slate-700">{programmeLabel}</span> : "—"} has
            been received. We will contact you at{" "}
            <span className="font-semibold text-slate-700">{guardianEmail}</span> shortly.
          </p>

          <Link
            to="/"
            className="focus-ring inline-block rounded-full bg-cod-btn text-white font-semibold px-8 py-3 shadow-md
                       transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
