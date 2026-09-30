// src/pages/MixedTrack.jsx
import ProgrammeBreadcrumb from '../components/ProgrammeBreadcrumb'
import ProgrammeCTA from '../components/ProgrammeCTA'

const courses = [
  {
    name: 'Vocals',
    boxicon: 'bx-microphone',
    color: 'text-cod-brand-pink',
    cardBorder: 'border-cod-brand-pink/25',
    headerBg: 'bg-cod-brand-pink/[0.06]',
    iconBg: 'bg-cod-brand-pink/[0.13]',
    labelColor: 'text-cod-brand-pink',
    dotBg: 'bg-cod-brand-pink/[0.09]',
    dot: 'bg-cod-brand-pink',
    iconColor: 'text-cod-brand-pink',
    desc: 'Develop a strong singing voice with breath control, pitch training, performance technique, and music theory. Suitable for all ability levels.',
    learn: [
      'Breath control & posture',
      'Pitch & tone training',
      'Solo & ensemble performance',
      'Music theory basics',
    ],
  },
  {
    name: 'Piano',
    boxicon: 'bx-piano',
    color: 'text-cod-brand-blue',
    cardBorder: 'border-cod-brand-blue/25',
    headerBg: 'bg-cod-brand-blue/[0.06]',
    iconBg: 'bg-cod-brand-blue/[0.13]',
    labelColor: 'text-cod-brand-blue',
    dotBg: 'bg-cod-brand-blue/[0.09]',
    dot: 'bg-cod-brand-blue',
    iconColor: 'text-cod-brand-blue',
    desc: 'Master the piano from beginner scales to advanced pieces. Students gain a deep understanding of rhythm, harmony, and musical expression.',
    learn: [
      'Scales & technique',
      'Music reading & notation',
      'Classical & contemporary pieces',
      'Recital preparation',
    ],
  },
]

export default function MixedTrack() {
  return (
    <div className="bg-slate-50 min-h-screen font-figma">
      <ProgrammeBreadcrumb current="Mixed Track" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
        {/* Hero banner */}
        <div
          className="droplet-right relative overflow-hidden rounded-3xl p-8 md:p-10 flex items-center gap-6"
          style={{
            background: 'linear-gradient(171deg, #0F4082 0%, #34A853 100%)',
          }}
        >
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute right-24 top-16 w-32 h-32 rounded-full bg-cod-brand-green/10" />

          <div className="relative w-20 h-20 rounded-2xl bg-cod-brand-green/30 shadow-lg flex items-center justify-center shrink-0">
            <i
              className="bx bx-book-open text-5xl text-white"
              aria-hidden="true"
            />
          </div>

          <div className="relative">
            <h1 className="font-bold text-3xl md:text-5xl text-white">
              Mixed Track
            </h1>
            <p className="mt-3 text-white/80 text-base md:text-lg max-w-lg">
              The best of both worlds — a perfectly balanced curriculum that
              combines musical excellence with core academic achievement.
            </p>
          </div>
        </div>

        {/* Highlight banner */}
        <div
          className="droplet mt-8 flex items-center gap-6 px-6 md:px-8 py-5 rounded-2xl border"
          style={{
            animationDelay: '180ms',
            background:
              'linear-gradient(90deg, rgba(26,115,232,0.06) 0%, rgba(255,46,150,0.06) 100%)',
            borderColor: 'rgba(26,115,232,0.09)',
          }}
        >
          <div className="w-10 h-10 rounded-[14px] bg-cod-brand-green/15 flex items-center justify-center shrink-0">
            <i
              className="bx bx-sparkles text-2xl text-cod-brand-green"
              aria-hidden="true"
            />
          </div>
          <p className="text-sm md:text-base text-cod-brand-navy leading-relaxed">
            The Mixed Track is perfect for students who want to grow
            academically <span className="font-bold">and</span> musically.
            Our two flagship courses — Vocals and Piano — are taught by
            specialist tutors in a nurturing, performance-driven environment.
          </p>
        </div>

        {/* Courses Offered */}
        <div className="mt-10">
          <h2
            className="droplet-left flex items-center gap-3 font-bold text-xl text-cod-brand-navy mb-6"
            style={{ animationDelay: '300ms' }}
          >
            <span className="w-1.5 h-6 rounded-full bg-cod-brand-green inline-block" />
            Courses Offered
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((c, i) => (
              <div
                key={c.name}
                style={{ animationDelay: `${400 + i * 140}ms` }}
                className={`droplet bg-white border-2 rounded-3xl overflow-hidden ${c.cardBorder} transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div
                  className={`${c.headerBg} flex flex-col items-center text-center p-8 md:p-10`}
                >
                  <div
                    className={`w-20 h-20 rounded-2xl shadow-md flex items-center justify-center mb-5 ${c.iconBg}`}
                  >
                    <i
                      className={`bx ${c.boxicon} text-4xl ${c.iconColor}`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3
                    className={`font-bold text-3xl md:text-4xl mb-4 ${c.color}`}
                  >
                    {c.name}
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed max-w-[320px]">
                    {c.desc}
                  </p>
                </div>

                <div className="p-8 md:p-10">
                  <p
                    className={`text-xs font-bold tracking-[1.4px] uppercase mb-5 ${c.labelColor}`}
                  >
                    What you'll learn
                  </p>
                  <ul className="space-y-3">
                    {c.learn.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${c.dotBg}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${c.dot}`}
                          />
                        </span>
                        <span className="text-slate-700 text-base">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <ProgrammeCTA
            heading="Experience the harmony of academics and music."
            subtext="Join the Mixed Track and let your child shine in every dimension."
          />
        </div>
      </div>
    </div>
  )
}