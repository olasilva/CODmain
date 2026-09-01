const features = [
  {
    title: 'Expert Tutors',
    desc: 'Qualified and passionate educators dedicated to bringing out the best in every child.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3 2 8l10 5 10-5-10-5Z" strokeLinejoin="round" />
        <path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Live Classes',
    desc: 'Interactive virtual sessions that keep young learners engaged from anywhere.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="12" rx="2" />
        <path d="M9 20h6M12 17v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Flexible Learning',
    desc: "Schedules that adapt to your family's rhythm, learn at the pace that works for you.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function WhyUs() {
  return (
    <section className="bg-cod-lavender py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-cod-gradient rounded-3xl p-8 flex items-center md:col-span-1 shadow-lg">
            <h2 className="font-display font-bold text-white text-2xl leading-snug">
              Why
              <br />
              Clan of David
              <br />
              is the Best!
            </h2>
          </div>

          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-2xl bg-cod-lavender-deep text-cod-blue flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-cod-blue-dark mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
