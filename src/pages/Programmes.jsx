import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { tracks } from "../data/programmes";
import { TrackIcon, ArrowRightIcon } from "../components/Icons";
import programmesBackground from "../assets/IMG-20260710-WA0006.jpg";

export default function Programmes() {
  return (
    <div className="min-h-screen bg-cod-bg">
      <Navbar />

      <section className="relative isolate overflow-hidden">
        <img
          src={programmesBackground}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cod-blue-deep/95 via-cod-blue-dark/85 to-cod-pink/65" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:px-10">
          <div className="mx-auto mb-12 max-w-2xl text-center animate-fadeUp">
            <span className="text-sm font-semibold uppercase tracking-wide text-cod-pink">
              Our Programmes
            </span>
            <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              Choose a Track to Explore
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
              Explore learning paths designed to help every student grow in
              skill, confidence, and creativity.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {tracks.map((track, i) => (
              <Link
                key={track.slug}
                to={`/programmes/${track.slug}`}
                style={{ animationDelay: `${i * 100}ms` }}
                className="group relative overflow-hidden rounded-2xl border border-white/25 bg-white/95 p-8 opacity-0 shadow-xl animate-fadeUp
                           transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-2xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cod-hero transition-transform duration-200 group-hover:scale-105">
                  <TrackIcon name={track.icon} className="h-6 w-6 text-amber-300" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-800">{track.name}</h3>
                <p className="mb-5 text-sm leading-relaxed text-slate-500">{track.tagline}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cod-blue">
                  Learn more
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
