import ProgrammeBreadcrumb from '../components/ProgrammeBreadcrumb'
import ProgrammeCTA from '../components/ProgrammeCTA'

const courses = [
  { letter: 'P', name: 'Piano' },
  { letter: 'G', name: 'Guitars' },
  { letter: 'U', name: 'Ukulele' },
  { letter: 'V', name: 'Violin' },
  { letter: 'V', name: 'Viola' },
  { letter: 'C', name: 'Cello' },
  { letter: 'F', name: 'Flute' },
  { letter: 'S', name: 'Saxophone' },
  { letter: 'T', name: 'Trumpet' },
  { letter: 'D', name: 'Drums' },
  { letter: 'V', name: 'Vocals' },
]

export default function MusicTrack() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <ProgrammeBreadcrumb current="Music Track" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cod-blue-dark via-cod-blue to-cod-blue p-8 md:p-10 flex items-center gap-6">
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute right-16 top-10 w-32 h-32 rounded-full bg-white/10" />

          <div className="relative w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-yellow-400" fill="currentColor">
              <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
            </svg>
          </div>

          <div className="relative">
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white">
              Music Track
            </h1>
            <p className="mt-2 text-white/85 text-sm md:text-base max-w-lg">
              Discover the joy of music through expert tuition in a wide
              range of instruments and vocal performance.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="flex items-center gap-2.5 font-display font-bold text-lg md:text-xl text-cod-blue-dark mb-6">
            <span className="w-1.5 h-6 rounded-full bg-cod-blue inline-block" />
            Available Courses
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {courses.map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                className="bg-white border border-cod-blue/15 rounded-2xl py-6 flex flex-col items-center gap-3 hover:border-cod-blue/40 hover:shadow-sm transition-all"
              >
                <span className="w-9 h-9 rounded-full bg-cod-blue text-white font-display font-bold text-sm flex items-center justify-center">
                  {c.letter}
                </span>
                <span className="font-display font-semibold text-cod-blue-dark text-sm">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <ProgrammeCTA
            heading="Ready to start your musical journey?"
            subtext="Enrol today and let your child discover their passion for music."
          />
        </div>
      </div>
    </div>
  )
}
