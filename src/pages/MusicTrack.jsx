// src/pages/MusicTrack.jsx
import { useState } from 'react'
import ProgrammeBreadcrumb from '../components/ProgrammeBreadcrumb'
import ProgrammeCTA from '../components/ProgrammeCTA'

const INSTRUMENTS = [
  {
    letter: 'P',
    name: 'Piano',
    icon: 'bx-piano',
    gradient: 'from-blue-500 to-blue-700',
    description:
      'Master the keyboard from beginner scales to advanced pieces. Learn theory, technique, and confident performance.',
    learn: [
      'Scales & technique',
      'Music reading & notation',
      'Classical & contemporary pieces',
      'Recital preparation',
    ],
  },
  {
    letter: 'G',
    name: 'Guitars',
    icon: 'bx-guitar',
    gradient: 'from-orange-500 to-orange-700',
    description:
      'Acoustic and electric guitar — chords, riffs, and lead playing taught step by step.',
    learn: [
      'Chords & strumming',
      'Lead & rhythm playing',
      'Songwriting basics',
      'Performance technique',
    ],
  },
  {
    letter: 'U',
    name: 'Ukulele',
    icon: 'bx-music',
    gradient: 'from-amber-500 to-amber-700',
    description:
      'A joyful, portable first instrument — perfect for young beginners.',
    learn: [
      'Basic chords',
      'Strumming patterns',
      'Simple songs',
      'Reading music',
    ],
  },
  {
    letter: 'V',
    name: 'Violin',
    icon: 'bx-music',
    gradient: 'from-rose-500 to-rose-700',
    description:
      'Build bow control, tuning discipline, and the elegant tone of the violin.',
    learn: [
      'Bow technique',
      'Intonation & tuning',
      'Solo & ensemble playing',
      'Sight reading',
    ],
  },
  {
    letter: 'V',
    name: 'Viola',
    icon: 'bx-music',
    gradient: 'from-fuchsia-500 to-fuchsia-700',
    description:
      'The warm, distinctive voice of the string family — rich and expressive.',
    learn: [
      'Bow control',
      'Alto clef reading',
      'Ensemble playing',
      'Tone development',
    ],
  },
  {
    letter: 'C',
    name: 'Cello',
    icon: 'bx-music',
    gradient: 'from-violet-500 to-violet-700',
    description:
      'Deep, expressive, and beautiful — the soul of the orchestra.',
    learn: [
      'Posture & bow hold',
      'Bass clef reading',
      'Solo & orchestral pieces',
      'Vibrato technique',
    ],
  },
  {
    letter: 'F',
    name: 'Flute',
    icon: 'bx-music',
    gradient: 'from-cyan-500 to-cyan-700',
    description:
      'Bright, clear tone from a versatile and elegant wind instrument.',
    learn: [
      'Embouchure',
      'Breath control',
      'Scales & arpeggios',
      'Ensemble playing',
    ],
  },
  {
    letter: 'S',
    name: 'Saxophone',
    icon: 'bx-music',
    gradient: 'from-yellow-500 to-yellow-700',
    description:
      'Jazz, classical, and contemporary — the saxophone does it all.',
    learn: [
      'Embouchure & tone',
      'Fingerings & scales',
      'Jazz improvisation',
      'Performance technique',
    ],
  },
  {
    letter: 'T',
    name: 'Trumpet',
    icon: 'bx-music',
    gradient: 'from-red-500 to-red-700',
    description:
      'Bold brass sound — lead lines, range, and clarity.',
    learn: [
      'Lip buzzing',
      'Range building',
      'Tonguing technique',
      'Ensemble & solo work',
    ],
  },
  {
    letter: 'D',
    name: 'Drums',
    icon: 'bx-circle',
    gradient: 'from-slate-500 to-slate-700',
    description:
      'Drive the rhythm of any band with groove, timing, and precision.',
    learn: [
      'Basic beats',
      'Limb coordination',
      'Rudiments',
      'Playing with others',
    ],
  },
  {
    letter: 'V',
    name: 'Vocals',
    icon: 'bx-microphone',
    gradient: 'from-pink-500 to-pink-700',
    description:
      'Train your voice — pitch, breath, and confident performance in any setting.',
    learn: [
      'Breath control',
      'Pitch & tone',
      'Solo & ensemble',
      'Stage presence',
    ],
  },
]

export default function MusicTrack() {
  const [selected, setSelected] = useState(INSTRUMENTS[0])

  const isActive = (c) =>
    selected?.name === c.name && selected?.letter === c.letter

  return (
    <div className="bg-slate-50 min-h-screen">
      <ProgrammeBreadcrumb current="Music Track" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
        {/* Hero banner */}
        <div className="droplet-right relative overflow-hidden rounded-3xl bg-gradient-to-br from-cod-blue-dark via-cod-blue to-cod-blue p-8 md:p-10 flex items-center gap-6">
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute right-16 top-10 w-32 h-32 rounded-full bg-white/10" />

          <div className="relative w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <i
              className="bx bx-music text-4xl text-yellow-400"
              aria-hidden="true"
            />
          </div>

          <div className="relative">
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white">
              Music Track
            </h1>
            <p className="mt-2 text-white/85 text-sm md:text-base max-w-lg">
              Discover the joy of music through expert tuition in a wide range
              of instruments and vocal performance.
            </p>
          </div>
        </div>

        {/* Available Courses */}
        <div className="mt-10">
          <h2
            className="droplet-left flex items-center gap-2.5 font-display font-bold text-lg md:text-xl text-cod-blue-dark mb-6"
            style={{ animationDelay: '150ms' }}
          >
            <span className="w-1.5 h-6 rounded-full bg-cod-blue inline-block" />
            Available Courses
            <span className="text-xs font-normal text-black/40 ml-1">
              — tap an instrument to see details
            </span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {INSTRUMENTS.map((c, i) => {
              const active = isActive(c)
              return (
                <button
                  key={`${c.name}-${i}`}
                  type="button"
                  onClick={() => setSelected(c)}
                  style={{ animationDelay: `${i * 60}ms` }}
                  aria-pressed={active}
                  className={`droplet group bg-white border-2 rounded-2xl py-6 flex flex-col items-center gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                    active
                      ? 'border-cod-blue shadow-md -translate-y-1'
                      : 'border-cod-blue/15 hover:border-cod-blue/40'
                  }`}
                >
                  <span
                    className={`w-9 h-9 rounded-full font-display font-bold text-sm flex items-center justify-center transition-colors duration-200 ${
                      active
                        ? 'bg-cod-blue text-white'
                        : 'bg-cod-blue/10 text-cod-blue group-hover:bg-cod-blue group-hover:text-white'
                    }`}
                  >
                    {c.letter}
                  </span>
                  <span className="font-display font-semibold text-cod-blue-dark text-sm">
                    {c.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Detail card — swaps when instrument changes */}
        {selected && (
          <div
            key={`${selected.name}-${selected.letter}`}
            className="droplet mt-10 rounded-3xl overflow-hidden border border-cod-blue/10 shadow-sm bg-white"
          >
            {/* Header */}
            <div
              className={`bg-gradient-to-br ${selected.gradient} p-8 md:p-10 text-white flex flex-col sm:flex-row items-center sm:items-start gap-6`}
            >
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-lg">
                <i
                  className={`bx ${selected.icon} text-5xl`}
                  aria-hidden="true"
                />
              </div>

              <div className="text-center sm:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-3">
                  Instrument · Course
                </span>
                <h3 className="font-display font-extrabold text-3xl md:text-4xl mb-2">
                  {selected.name}
                </h3>
                <p className="text-white/85 text-sm md:text-base max-w-lg">
                  {selected.description}
                </p>
              </div>
            </div>

            {/* What you'll learn */}
            <div className="p-8 md:p-10">
              <p className="text-xs font-bold tracking-[1.4px] uppercase text-cod-blue mb-5">
                What you'll learn
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {selected.learn.map((item, i) => (
                  <li
                    key={item}
                    style={{ animationDelay: `${i * 80}ms` }}
                    className="droplet-left flex items-center gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-cod-blue/10 flex items-center justify-center shrink-0">
                      <i
                        className="bx bx-check text-cod-blue"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-slate-700 text-sm md:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* CTA */}
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