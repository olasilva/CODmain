import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { tracks } from "../data/programmes";
import { TrackIcon, ArrowRightIcon } from "../components/Icons";

export default function Programmes() {
  return (
    <div className="min-h-screen bg-cod-bg">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fadeUp">
          <span className="text-cod-pink font-semibold text-sm tracking-wide uppercase">
            Our Programmes
          </span>
          <h1 className="text-slate-800 text-2xl md:text-3xl font-bold mt-2">
            Choose a Track to Explore
          </h1>
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

      <Footer />
    </div>
  );
}
