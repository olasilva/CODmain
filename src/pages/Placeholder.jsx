import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Lightweight stand-in for pages not yet built out (Admission form flow,
 * Dashboard login). Swap this out per page as those flows are implemented —
 * it exists so routing/navigation works end-to-end today.
 */
export default function Placeholder({ title, body }) {
  return (
    <div className="min-h-screen bg-cod-bg flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center animate-fadeUp">
          <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-cod-hero flex items-center justify-center">
            <span className="text-white font-bold text-xl">•</span>
          </div>
          <h1 className="text-slate-800 font-bold text-2xl mb-3">{title}</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">{body}</p>
          <Link
            to="/"
            className="focus-ring inline-block rounded-full bg-cod-btn text-white font-semibold px-7 py-3 shadow-md
                       transition-all duration-200 hover:shadow-lg hover:brightness-105"
          >
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
