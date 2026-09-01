import ProgrammeBreadcrumb from '../components/ProgrammeBreadcrumb'
import ProgrammeCTA from '../components/ProgrammeCTA'

const legend = [
  { label: 'Foundation', dot: 'bg-cod-pink' },
  { label: 'Nursery', dot: 'bg-emerald-500' },
  { label: 'Primary', dot: 'bg-cod-blue' },
]

const levels = [
  { title: 'Pre School', tag: 'Foundation', bar: 'bg-cod-pink', tagClass: 'bg-cod-pink/10 text-cod-pink', desc: 'Early childhood education for ages 2–3, building foundational social and cognitive skills.' },
  { title: 'Discovery', tag: 'Foundation', bar: 'bg-cod-pink', tagClass: 'bg-cod-pink/10 text-cod-pink', desc: 'Creative exploration and learning readiness programme for ages 3–4.' },
  { title: 'Nursery 1', tag: 'Nursery', bar: 'bg-emerald-500', tagClass: 'bg-emerald-500/10 text-emerald-600', desc: 'Structured play-based learning introducing letters, numbers, and creativity.' },
  { title: 'Nursery 2', tag: 'Nursery', bar: 'bg-emerald-500', tagClass: 'bg-emerald-500/10 text-emerald-600', desc: 'Advanced nursery curriculum preparing children for primary education.' },
  { title: 'Primary 1', tag: 'Primary', bar: 'bg-cod-blue', tagClass: 'bg-cod-blue/10 text-cod-blue', desc: 'Core literacy, numeracy, science and social studies in year one.' },
  { title: 'Primary 2', tag: 'Primary', bar: 'bg-cod-blue', tagClass: 'bg-cod-blue/10 text-cod-blue', desc: 'Building on primary skills with expanded subject coverage.' },
  { title: 'Primary 3', tag: 'Primary', bar: 'bg-cod-blue', tagClass: 'bg-cod-blue/10 text-cod-blue', desc: 'Intermediate primary with introduction to analytical thinking.' },
  { title: 'Primary 4', tag: 'Primary', bar: 'bg-cod-blue', tagClass: 'bg-cod-blue/10 text-cod-blue', desc: 'Deepening knowledge across all subjects with project-based learning.' },
  { title: 'Primary 5', tag: 'Primary', bar: 'bg-cod-blue', tagClass: 'bg-cod-blue/10 text-cod-blue', desc: 'Comprehensive upper primary programme with critical thinking focus.' },
]

export default function RegularTrack() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <ProgrammeBreadcrumb current="Regular Track" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cod-blue-deep via-purple-700 to-cod-pink p-8 md:p-10 flex items-center gap-6">
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute right-16 top-10 w-32 h-32 rounded-full bg-white/10" />

          <div className="relative w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 5.5C6 4.5 9 4 12 5.5c3-1.5 6-1 8 0v13c-2-1-5-1.5-8 0-3-1.5-6-1-8 0v-13Z" strokeLinejoin="round" />
              <path d="M12 5.5V18.5" />
            </svg>
          </div>

          <div className="relative">
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white">
              Regular Track
            </h1>
            <p className="mt-2 text-white/85 text-sm md:text-base max-w-lg">
              A nurturing academic curriculum from pre-school through
              primary, building confident and curious learners.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 mt-6">
          {legend.map((l) => (
            <div key={l.label} className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <span className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />
              {l.label}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="flex items-center gap-2.5 font-display font-bold text-lg md:text-xl text-cod-blue-dark mb-6">
            <span className="w-1.5 h-6 rounded-full bg-cod-pink inline-block" />
            Programme Levels
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {levels.map((lvl) => (
              <div
                key={lvl.title}
                className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`h-1 ${lvl.bar}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="font-display font-bold text-cod-blue-dark">
                      {lvl.title}
                    </h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${lvl.tagClass}`}>
                      {lvl.tag}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{lvl.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <ProgrammeCTA
            heading="Give your child the best start in life."
            subtext="Enrol in our Regular Track and watch them flourish every step of the way."
          />
        </div>
      </div>
    </div>
  )
}
