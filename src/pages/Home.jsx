import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import { tracks } from "../data/programmes";
import { TrackIcon, ArrowRightIcon } from "../components/Icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-cod-bg">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-cod-hero">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute right-24 top-1/2 h-48 w-48 rounded-full bg-white/10" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-10 py-20 md:py-28 flex flex-col items-center text-center">
          <div className="mb-6 animate-scaleIn">
            <Logo className="h-20 w-20" />
          </div>
          <h1 className="animate-fadeUp text-white text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            Skilfully Educated, Creatively Inspired
          </h1>
          <p
            className="animate-fadeUp text-blue-100 mt-5 max-w-xl text-base md:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Clan of David Art and Music Academy nurtures young talent through
            expert instruction in music and a well-rounded academic curriculum.
          </p>
          <div
            className="animate-fadeUp flex flex-col sm:flex-row gap-4 mt-8"
            style={{ animationDelay: "220ms" }}
          >
            <Link
              to="/admission"
              className="focus-ring rounded-full bg-white text-cod-blue-dark font-semibold px-7 py-3.5 shadow-md
                         transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Purchase Admission Form
            </Link>
            <Link
              to="/programmes"
              className="focus-ring rounded-full border-2 border-white/70 text-white font-semibold px-7 py-3.5
                         transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5"
            >
              Explore Our Programmes
            </Link>
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-cod-pink font-semibold text-sm tracking-wide uppercase">
            Our Programmes
          </span>
          <h2 className="text-slate-800 text-2xl md:text-3xl font-bold mt-2">
            Two Tracks, One Standard of Excellence
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {tracks.map((track, i) => (
            <Link
              key={track.slug}
              to={`/programmes/${track.slug}`}
              style={{ animationDelay: `${i * 100}ms` }}
              className="opacity-0 animate-fadeUp group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8
                         transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-cod-blue/30"
            >
              <div className="h-14 w-14 rounded-2xl bg-cod-hero flex items-center justify-center mb-5
                              transition-transform duration-200 group-hover:scale-105">
                <TrackIcon name={track.icon} className="h-6 w-6 text-amber-300" />
              </div>
              <h3 className="text-slate-800 font-bold text-xl mb-2">{track.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">{track.tagline}</p>
              <span className="inline-flex items-center gap-1.5 text-cod-blue font-semibold text-sm">
                Learn more
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-20 grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Expert Tuition",
              body: "Every course is led by instructors experienced in both performance and pedagogy.",
            },
            {
              title: "Balanced Curriculum",
              body: "Creative and academic tracks are structured to complement, not compete with, each other.",
            },
            {
              title: "A Supportive Community",
              body: "Small class sizes and close mentorship help every student find their voice.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              style={{ animationDelay: `${i * 100}ms` }}
              className="opacity-0 animate-fadeUp"
            >
              <span className="inline-block h-1.5 w-10 rounded-full bg-cod-btn mb-4" />
              <h3 className="text-slate-800 font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-20">
        <div className="rounded-3xl bg-cod-hero px-8 md:px-12 py-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-white/10" />
          <div className="relative text-center md:text-left">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
              Ready to begin the journey?
            </h2>
            <p className="text-blue-100 text-sm md:text-base max-w-md">
              Admission is open. Purchase your form today and secure a place for the next intake.
            </p>
          </div>
          <Link
            to="/admission"
            className="focus-ring relative shrink-0 rounded-full bg-white text-cod-blue-dark font-semibold px-8 py-3.5 shadow-md
                       transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            Purchase Admission Form
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
