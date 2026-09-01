import { Link } from 'react-router-dom'

const tracks = [
  {
    title: 'Music Track',
    desc: 'Piano, voice, and music theory for building young musicians with performance opportunities.',
    to: '/programmes/music-track',
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    accent: 'bg-cod-pink/10 text-cod-pink',
  },
  {
    title: 'Regular Track',
    desc: 'Core academics in Maths, English, Science and Social Studies with a nurturing approach.',
    to: '/programmes/regular-track',
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: 'bg-cod-blue/10 text-cod-blue',
  },
  {
    title: 'Mixed Track',
    desc: 'The best of both worlds; a balanced curriculum combining music mastery with academic excellence.',
    to: '/programmes/mixed-track',
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s-7-4.35-9.5-8.5C.8 8.6 2.6 5 6.2 5c2 0 3.3 1 3.8 1.8C10.5 6 11.8 5 13.8 5c3.6 0 5.4 3.6 3.7 7.5C15 16.65 12 21 12 21Z" strokeLinejoin="round" />
      </svg>
    ),
    accent: 'bg-emerald-500/10 text-emerald-500',
  },
]

export default function Programmes() {
  return (
    <section id="programmes" className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-cod-blue-dark text-center mb-12 animate-slideDown">
          Our Programmes
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {tracks.map((t, i) => (
            <div
              key={t.title}
              className="rounded-3xl p-8 bg-cod-lavender/60 hover:bg-cod-lavender transition-colors animate-scaleIn"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${t.accent}`}>
                {t.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-cod-blue-dark mb-2">
                {t.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{t.desc}</p>
              <Link
                to={t.to}
                className="text-sm font-semibold text-cod-blue hover:text-cod-pink transition-colors inline-flex items-center gap-1"
              >
                Learn More
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
