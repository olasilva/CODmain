// src/components/WhyUs.jsx
const features = [
  {
    title: 'Expert Tutors',
    desc: 'Qualified and passionate educators dedicated to bringing out the best in every child.',
    accent: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-50 text-blue-600',
    icon: 'bx-user-check',
  },
  {
    title: 'Live Classes',
    desc: 'Interactive virtual sessions that keep young learners engaged from anywhere.',
    accent: 'from-pink-500 to-rose-600',
    iconBg: 'bg-pink-50 text-pink-600',
    icon: 'bx-broadcast',
  },
  {
    title: 'Flexible Learning',
    desc: "Schedules that adapt to your family's rhythm — learn at the pace that works for you.",
    accent: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-50 text-emerald-600',
    icon: 'bx-time-five',
  },
]

export default function WhyUs() {
  return (
    <section className="bg-cod-lavender py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* ─── Headline card — floating + gradient shimmer ─── */}
          <div className="relative md:col-span-1">
            {/* Glow behind the card */}
            <div className="absolute inset-0 rounded-3xl bg-cod-gradient blur-2xl opacity-40 animate-pulse-slow" />

            <div className="droplet relative bg-cod-gradient rounded-3xl p-8 flex items-center shadow-lg overflow-hidden animate-float-slow">
              {/* Diagonal shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />

              {/* Rotating ring accent */}
              <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full border-2 border-white/20 animate-spin-slow" />

              <h2 className="relative font-display font-bold text-white text-2xl leading-snug">
                Why
                <br />
                Clan of David
                <br />
                is the Best!
              </h2>
            </div>
          </div>

          {/* ─── Feature cards — tilt + float + glow ─── */}
          {features.map((f, i) => (
            <div
              key={f.title}
              style={{ animationDelay: `${200 + i * 140}ms` }}
              className="droplet group relative"
            >
              {/* Glow behind the card — appears on hover */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`}
              />

              <div
                className="relative bg-white rounded-3xl p-8 shadow-sm group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-1"
              >
                {/* Icon with subtle rotation on hover */}
                <div
                  className={`w-14 h-14 rounded-2xl ${f.iconBg} flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <i className={`bx ${f.icon} text-3xl`} aria-hidden="true" />
                </div>

                <h3 className="font-display font-semibold text-lg text-cod-blue-dark mb-2">
                  {f.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {f.desc}
                </p>

                {/* Bottom accent line — grows on hover */}
                <div
                  className={`mt-5 h-1 w-10 rounded-full bg-gradient-to-r ${f.accent} transition-all duration-500 group-hover:w-20`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}