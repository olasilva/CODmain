// src/pages/ProgrammeDetail.jsx
import { Link, useParams, Navigate } from "react-router-dom";
import { tracks } from "../data/programmes";
import { TrackIcon, ArrowLeftIcon } from "../components/Icons";

export default function ProgrammeDetail() {
  const { slug } = useParams();
  const track = tracks.find((t) => t.slug === slug);

  if (!track) return <Navigate to="/programmes" replace />;

  // True for Academy (has subjects), False for Vocational
  const isAcademicLayout = track.courses.some((c) => c.subjects && c.subjects.length > 0);

  // Determine hero gradient based on theme
  const heroGradient = track.theme === "purple" 
    ? "from-purple-900 via-fuchsia-700 to-pink-500" 
    : "from-[#0B3B60] via-[#0F5A75] to-[#2EA26F]";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-slate-200 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm">
          <Link
            to="/programmes"
            className="flex items-center gap-1.5 text-[#1A73E8] font-semibold hover:text-blue-800 transition-colors"
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
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${heroGradient} px-8 md:px-10 py-12 flex items-center gap-6`}>
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute right-16 top-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />

          <div className="relative shrink-0 h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <TrackIcon name={track.icon} className="h-10 w-10 text-white" />
          </div>

          <div className="relative">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-3 capitalize">{track.name.toLowerCase()}</h1>
            <p className="text-white/90 max-w-xl text-sm md:text-base leading-relaxed">
              {track.tagline}
            </p>
          </div>
        </div>

        {/* Info Banner (Only for Vocational to match your screenshot) */}
        {track.name === "Vocational" && (
           <div className="mt-8 rounded-2xl bg-[#F4F9FF] border border-blue-100 px-6 md:px-8 py-6 text-center">
             <p className="text-slate-700 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
               The {track.name} programme is perfect for students who want to grow academically <strong>and</strong> musically. Our two flagship courses — Vocals and Piano — are taught by specialist tutors in a nurturing, performance-driven environment.
             </p>
           </div>
        )}

        {/* Content Section */}
        <div className="mt-12">
          <div className="flex items-center gap-2.5 mb-6">
            <span className="h-6 w-1.5 rounded-full bg-[#1A73E8]" />
            <h2 className="text-slate-900 font-bold text-2xl">
              {isAcademicLayout ? "Programme Levels" : "Courses Offered"}
            </h2>
          </div>

          {isAcademicLayout ? (
            /* ACADEMY LAYOUT (Big Cards with Subjects & Levels) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {track.courses.map((course, i) => (
                <div key={`${course.name}-${i}`} className="bg-white rounded-2xl border-t-4 border-t-pink-500 border-x border-b border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">{course.name}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-bold">
                      {course.level}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-5 leading-relaxed">{course.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {course.subjects?.map((sub, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* VOCATIONAL LAYOUT (Small Icon Cards) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {track.courses.map((course, i) => (
                <div
                  key={`${course.name}-${i}`}
                  className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-20 w-20 rounded-2xl bg-slate-50 shadow-sm flex items-center justify-center mb-4">
                    {course.name === "Vocals" ? (
                      <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                    ) : course.name === "Piano" ? (
                      <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9V4.5M15 9h4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25" /></svg>
                    ) : (
                      <span className="text-3xl font-bold text-slate-700">{course.code}</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{course.name}</h3>
                  {course.description && (
                     <p className="text-slate-500 text-sm leading-relaxed">{course.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA banner */}
        <div className="mt-16 mb-4 rounded-2xl bg-gradient-to-r from-blue-50 via-blue-50 to-pink-50 border border-slate-200 px-6 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="text-center md:text-left">
            <h3 className="text-slate-800 font-bold text-xl">Ready to start your musical journey?</h3>
            <p className="text-slate-500 text-sm mt-1">Enrol today and let your child discover their passion for music.</p>
          </div>
          <Link
            to="/admission"
            className="shrink-0 rounded-full bg-[#1A73E8] text-white font-semibold px-8 py-3.5 shadow-md
                       transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
          >
            Enroll now
          </Link>
        </div>
      </div>
    </div>
  );
}