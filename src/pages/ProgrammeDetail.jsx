import { Link, useParams, Navigate } from "react-router-dom";
import { tracks } from "../data/programmes";
import { TrackIcon, ArrowLeftIcon } from "../components/Icons";

export default function ProgrammeDetail() {
  const { slug } = useParams();
  const track = tracks.find((t) => t.slug === slug);

  if (!track) return <Navigate to="/programmes" replace />;

  return (
    <div className="min-h-screen bg-cod-bg">
      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-slate-200 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm">
          <Link
            to="/programmes"
            className="focus-ring flex items-center gap-1.5 text-cod-blue font-semibold hover:text-cod-blue-dark transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Our Programmes
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-semibold">{track.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-3xl bg-cod-hero px-8 md:px-10 py-10 flex items-center gap-6 animate-fadeUp">
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 h-56 w-56 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute right-16 top-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />

          <div className="relative shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <TrackIcon name={track.icon} className="h-8 w-8 md:h-9 md:w-9 text-amber-300" />
          </div>

          <div className="relative">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">{track.name}</h1>
            <p className="text-blue-100 max-w-xl text-sm md:text-base leading-relaxed">
              {track.tagline}
            </p>
          </div>
        </div>

        {/* Available courses */}
        <div className="mt-10">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="h-5 w-1 rounded-full bg-cod-blue" />
            <h2 className="text-slate-800 font-bold text-lg">Available Courses</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {track.courses.map((course, i) => (
              <div
                key={`${course.name}-${i}`}
                style={{ animationDelay: `${i * 40}ms` }}
                className="opacity-0 animate-fadeUp group rounded-xl border border-slate-200 bg-white px-4 py-6
                           flex flex-col items-center gap-3 transition-all duration-200
                           hover:border-cod-blue/40 hover:shadow-md hover:-translate-y-0.5 cursor-default"
              >
                <span className="h-9 w-9 rounded-full bg-cod-blue text-white text-sm font-bold flex items-center justify-center
                                  transition-transform duration-200 group-hover:scale-110">
                  {course.code}
                </span>
                <span className="text-slate-700 text-sm font-semibold text-center">{course.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div className="mt-10 mb-4 rounded-2xl bg-gradient-to-r from-blue-50 via-blue-50 to-pink-50 border border-slate-100 px-6 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-5 animate-fadeUp">
          <div className="text-center md:text-left">
            <h3 className="text-slate-800 font-bold text-lg">Ready to start your musical journey?</h3>
            <p className="text-slate-500 text-sm mt-1">Enrol today and let your child discover their passion for music.</p>
          </div>
          <Link
            to="/admission"
            className="focus-ring shrink-0 rounded-full bg-cod-btn text-white font-semibold px-7 py-3 shadow-md
                       transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
          >
            Enroll now
          </Link>
        </div>
      </div>
    </div>
  );
}
