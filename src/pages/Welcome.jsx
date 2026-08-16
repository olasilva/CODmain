import { useNavigate } from "react-router-dom";
import BrandPanel from "../components/BrandPanel";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex bg-cod-bg overflow-hidden">
      <BrandPanel />

      {/* Right action panel */}
      <div className="flex-1 flex items-center justify-center px-6 pt-24 md:pt-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 animate-scaleIn">
          <h2 className="text-center text-slate-700 font-bold tracking-wide text-sm mb-6">
            SELECT ONE TO PROCEED
          </h2>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/admission")}
              className="focus-ring w-full rounded-full bg-cod-btn text-white font-semibold py-3.5 shadow-md
                         transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
            >
              Purchase Admission Form
            </button>

            <button
              onClick={() => navigate("/login")}
              className="focus-ring w-full rounded-full bg-cod-btn text-white font-semibold py-3.5 shadow-md
                         transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
            >
              Login to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
