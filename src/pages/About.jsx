// src/pages/About.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

// Image from assets — benglo.jpg (the founder's photo)
const images = import.meta.glob("../assets/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
});
const bengloImage =
  images["../assets/benglo.jpg"] ||
  images["../assets/benglo.png"] ||
  images["../assets/benglo.jpeg"] ||
  null;

const stats = [
  { label: "Years Running", value: "10+" },
  { label: "Students Enrolled", value: "500+" },
  { label: "Instruments Taught", value: "11" },
  { label: "Instructors", value: "20+" },
];

const values = [
  {
    title: "Discipline",
    body: "Consistent practice and structured lessons build the habits that turn talent into mastery.",
    icon: "bx-target-lock",
  },
  {
    title: "Creativity",
    body: "We give students room to explore, compose, and find their own artistic voice.",
    icon: "bx-palette",
  },
  {
    title: "Community",
    body: "Ensembles, recitals, and group classes teach students to listen and grow together.",
    icon: "bx-group",
  },
  {
    title: "Excellence",
    body: "High standards in both the arts and academics — because both shape the whole person.",
    icon: "bx-medal",
  },
];

const founder = {
  name: "Thomas Benjamin Negedu",
  alias: "Benglory",
  role: "Founder & Director",
  photo: bengloImage,
  bio: [
    "Thomas Benjamin Negedu, most popularly called Benglory, is a dedicated worship leader and a Music Director. He is the founder and Director of Clan of David Art and Music Academy.",
    "By the grace of God upon his life, he is a great source of inspiration to many, especially the younger generation. His ministry over time has imparted many and has continued to raise younger generations to become great worship and praise leaders through the instrumentality of excellent music.",
    "His passion for the worship of God has birthed a Devotional Songbook with musical notes and chords — a work graced with the feelable presence of God through the engagement of each piece during devoted time with Him.",
  ],
  tags: [
    { label: "Worship Leader", icon: "bx-purchase-tag" },
    { label: "Music Director", icon: "bx-music" },
    { label: "Youth Mentor", icon: "bx-heart" },
  ],
};

export default function About() {
  return (
    <div className="min-h-screen bg-cod-bg">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-cod-blue-dark via-cod-blue to-cod-pink">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 md:py-28 text-center relative z-10">
          <div className="mb-6 flex justify-center animate-scaleIn">
            <Logo className="h-16 w-16" />
          </div>
          <h1 className="animate-fadeUp text-white text-3xl md:text-5xl font-bold tracking-tight">
            About Us
          </h1>
          <p
            className="animate-fadeUp text-blue-100 mt-5 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ animationDelay: "100ms" }}
          >
            Clan of David Art and Music Academy exists to raise skilfully
            educated, creatively inspired young people through disciplined
            instruction in music and the arts.
          </p>
        </div>

        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-cod-pink/20 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </section>

      {/* ===== STATS ===== */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 -mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{ animationDelay: `${i * 100}ms` }}
              className="opacity-0 animate-fadeUp rounded-2xl bg-white border border-slate-200 shadow-sm px-6 py-8 text-center transition hover:shadow-md hover:-translate-y-0.5"
            >
              <p className="text-cod-blue text-3xl md:text-4xl font-bold mb-1">
                {s.value}
              </p>
              <p className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wide">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ABOUT THE ACADEMY ===== */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="animate-fadeUp">
            <span className="text-cod-pink font-semibold text-sm tracking-wide uppercase">
              About the Academy
            </span>
            <h2 className="text-slate-800 text-2xl md:text-3xl font-bold mt-2 mb-5 leading-tight">
              Where Talent Meets Excellence
            </h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              At Clan of David, we teach and inspire students of all levels and
              ages to learn and become rich in knowledge — creative in music and
              general art.
            </p>
            <p className="text-slate-500 leading-relaxed mb-4">
              Our academic programme is structured to harness skills development
              while achieving academic excellence. We offer{" "}
              <span className="font-semibold text-slate-700">
                after-school classes
              </span>
              ,{" "}
              <span className="font-semibold text-slate-700">
                Saturday classes
              </span>
              ,{" "}
              <span className="font-semibold text-slate-700">
                weekend classes
              </span>
              , and{" "}
              <span className="font-semibold text-slate-700">
                private / online courses
              </span>{" "}
              to suit every student's schedule.
            </p>
            <p className="text-slate-500 leading-relaxed">
              From first lessons to public recitals, students grow in skill and
              in confidence — surrounded by mentors who care about who they are
              becoming, not just what they can play.
            </p>

            <Link
              to="/enroll"
              className="focus-ring inline-flex items-center gap-2 mt-8 rounded-full bg-cod-btn text-white font-semibold px-7 py-3.5 shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-105"
            >
              Gain Admission
              <i
                className="bx bx-right-arrow-alt text-xl transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Hero image */}
          <div
            className="relative rounded-3xl overflow-hidden h-72 md:h-96 shadow-xl opacity-0 animate-fadeUp bg-gradient-to-br from-cod-blue via-cyan-500 to-emerald-400"
            style={{ animationDelay: "150ms" }}
          >
            {bengloImage && (
              <img
                src={bengloImage}
                alt="Thomas Benjamin Negedu — founder of Clan of David Academy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-cod-blue/30 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-20">
          <div className="text-center mb-12 animate-fadeUp">
            <span className="text-cod-pink font-semibold text-sm tracking-wide uppercase">
              What We Stand For
            </span>
            <h2 className="text-slate-800 text-2xl md:text-3xl font-bold mt-2">
              Our Core Values
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={v.title}
                style={{ animationDelay: `${i * 100}ms` }}
                className="opacity-0 animate-fadeUp rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition hover:bg-white hover:shadow-md hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cod-blue to-cod-pink text-white transition-transform duration-300 group-hover:scale-110">
                  <i className={`bx ${v.icon} text-2xl`} aria-hidden="true" />
                </div>
                <h3 className="text-slate-800 font-bold text-lg mb-2">
                  {v.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOUNDER ===== */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-24">
        <div className="text-center mb-12 animate-fadeUp">
          <span className="text-cod-pink font-semibold text-sm tracking-wide uppercase">
            About the Founder
          </span>
          <h2 className="text-slate-800 text-2xl md:text-3xl font-bold mt-2">
            Meet the Vision Behind the Academy
          </h2>
        </div>

        <div
          className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden opacity-0 animate-fadeUp"
          style={{ animationDelay: "150ms" }}
        >
          <div className="grid md:grid-cols-3 gap-0">
            {/* Founder photo */}
            <div className="md:col-span-1 bg-gradient-to-br from-cod-blue to-cod-pink flex items-center justify-center p-8 md:p-10">
              <div className="flex flex-col items-center text-center">
                {founder.photo ? (
                  <img
                    src={founder.photo}
                    alt={`${founder.name} (${founder.alias})`}
                    className="h-40 w-40 md:h-48 md:w-48 rounded-2xl object-cover border-4 border-white/40 shadow-lg transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white font-bold text-4xl shadow-lg">
                    TB
                  </div>
                )}
                <p className="mt-5 text-white font-semibold text-lg leading-snug">
                  {founder.name}
                </p>
                <p className="text-blue-100 text-sm mt-1 italic">
                  popularly called “{founder.alias}”
                </p>
                <p className="text-white/90 text-sm mt-2 font-medium">
                  {founder.role}
                </p>
              </div>
            </div>

            {/* Founder bio */}
            <div className="md:col-span-2 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-5">
                <i
                  className="bx bxs-quote-alt-left text-cod-pink text-3xl"
                  aria-hidden="true"
                />
                <h3 className="text-slate-800 font-bold text-xl">
                  {founder.name} —{" "}
                  <span className="italic">{founder.alias}</span>
                </h3>
              </div>

              <div className="space-y-4">
                {founder.bio.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-slate-500 leading-relaxed opacity-0 animate-fadeUp"
                    style={{ animationDelay: `${300 + i * 120}ms` }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {founder.tags.map((t, i) => (
                  <span
                    key={t.label}
                    style={{ animationDelay: `${700 + i * 100}ms` }}
                    className="opacity-0 animate-fadeUp inline-flex items-center gap-2 rounded-full bg-[#F5F9FF] border border-slate-200 px-4 py-1.5 text-sm font-medium text-cod-blue transition hover:shadow-sm"
                  >
                    <i className={`bx ${t.icon} text-base`} aria-hidden="true" />
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-gradient-to-r from-cod-blue to-cod-pink">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 text-center">
          <h2
            className="text-white text-2xl md:text-3xl font-bold mb-3 opacity-0 animate-fadeUp"
            style={{ animationDelay: "0ms" }}
          >
            Gain Admission Into Our Academic Sessions
          </h2>
          <p
            className="text-blue-100 mb-8 max-w-xl mx-auto opacity-0 animate-fadeUp"
            style={{ animationDelay: "150ms" }}
          >
            After-school, Saturday, weekend, and private/online classes
            available. Come see a class, meet our founder, or just ask us a
            question.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fadeUp"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              to="/contact"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-white text-cod-blue font-semibold px-7 py-3.5 shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-105"
            >
              <i className="bx bx-envelope text-xl" aria-hidden="true" />
              Get in Touch
            </Link>
            <Link
              to="/enroll"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/70 text-white font-semibold px-7 py-3.5 transition-all duration-200 hover:bg-white/10"
            >
              <i className="bx bx-user-plus text-xl" aria-hidden="true" />
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}