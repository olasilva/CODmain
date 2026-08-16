import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

// Edit copy, stats, and staff below to reflect the real academy details.
const stats = [
  { label: "Years Running", value: "10+" },
  { label: "Students Enrolled", value: "500+" },
  { label: "Instruments Taught", value: "11" },
  { label: "Instructors", value: "20+" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-cod-bg">
      <Navbar />

      <section className="bg-cod-hero bg-gradient-to-r from-cod-blue-dark via-cod-blue to-cod-pink">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-20 text-center">
          <div className="mb-5 flex justify-center animate-scaleIn">
            <Logo className="h-16 w-16" />
          </div>
          <h1 className="animate-fadeUp text-white text-3xl md:text-5xl font-bold">About Us</h1>
          <p className="animate-fadeUp text-blue-100 mt-4 max-w-xl mx-auto text-base md:text-lg" style={{ animationDelay: "100ms" }}>
            {/* Replace with the academy's real founding story / mission statement */}
            Clan of David Art and Music Academy exists to raise skilfully educated,
            creatively inspired young people through disciplined instruction in
            music and the arts.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{ animationDelay: `${i * 80}ms` }}
              className="opacity-0 animate-fadeUp rounded-2xl bg-white border border-slate-200 px-6 py-8 text-center"
            >
              <p className="text-cod-blue text-3xl font-bold mb-1">{s.value}</p>
              <p className="text-slate-500 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fadeUp">
            <span className="text-cod-pink font-semibold text-sm tracking-wide uppercase">Our Mission</span>
            <h2 className="text-slate-800 text-2xl md:text-3xl font-bold mt-2 mb-4">
              Nurturing Talent, Building Character
            </h2>
            <p className="text-slate-500 leading-relaxed">
              {/* Replace with the academy's real mission copy */}
              We believe every child carries a unique creative gift. Our role is
              to give that gift structure, discipline, and a stage — through
              expert tuition, performance opportunities, and a curriculum that
              treats artistic and academic growth as equally important.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden h-64 md:h-80 bg-gradient-to-br from-cod-blue via-cyan-500 to-emerald-400 animate-fadeUp" style={{ animationDelay: "100ms" }}>
            {/* Swap this div for a real photo: <img src={...} className="h-full w-full object-cover" /> */}
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 text-center">
          <h2 className="text-slate-800 text-2xl font-bold mb-4">Want to visit or learn more?</h2>
          <Link
            to="/contact"
            className="focus-ring inline-block rounded-full bg-cod-btn text-white font-semibold px-7 py-3.5 shadow-md
                       transition-all duration-200 hover:shadow-lg hover:brightness-105"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
