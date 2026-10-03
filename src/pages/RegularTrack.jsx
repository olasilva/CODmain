// src/pages/RegularTrack.jsx
import ProgrammeBreadcrumb from '../components/ProgrammeBreadcrumb'
import ProgrammeCTA from '../components/ProgrammeCTA'

const legend = [
  { label: 'Foundation', dot: 'bg-cod-pink' },
  { label: 'Nursery', dot: 'bg-emerald-500' },
  { label: 'Basic', dot: 'bg-cod-blue' },
]

const levels = [
  {
    title: 'Discovery',
    tag: 'Foundation',
    bar: 'bg-cod-pink',
    tagClass: 'bg-cod-pink/10 text-cod-pink',
    icon: 'bx-bulb',
    desc: 'Creative exploration and learning readiness programme for early learners.',
    subjects: ['Numeracy', 'Literacy', 'Physical and Social Development (P S D)', 'Creative Development', 'Knowledge and Understanding of the World (K U W)', 'Rhymes'],
  },
  {
    title: 'Pre Nursery',
    tag: 'Foundation',
    bar: 'bg-cod-pink',
    tagClass: 'bg-cod-pink/10 text-cod-pink',
    icon: 'bx-child',
    desc: 'Foundational early childhood learning that builds confidence, routine, and curiosity.',
    subjects: ['Numeracy', 'Literacy', 'Basic Science', 'Social Value', 'Health Habit', 'C R S', 'Creative Art', 'Rhymes'],
  },
  {
    title: 'Nursery 1',
    tag: 'Nursery',
    bar: 'bg-emerald-500',
    tagClass: 'bg-emerald-500/10 text-emerald-600',
    icon: 'bx-shapes',
    desc: 'Structured play-based learning introducing letters, numbers, and creativity.',
    subjects: ['Numeracy', 'Literacy', 'Basic Science', 'Social Value', 'Health Habit', 'C R S', 'Creative Art', 'Music', 'Phonics', 'Handwriting', 'Rhymes'],
  },
  {
    title: 'Nursery 2',
    tag: 'Nursery',
    bar: 'bg-emerald-500',
    tagClass: 'bg-emerald-500/10 text-emerald-600',
    icon: 'bx-shapes',
    desc: 'Advanced nursery curriculum preparing children for primary education.',
    subjects: ['Numeracy', 'Literacy', 'Basic Science', 'Social Value', 'Health Habit', 'C R S', 'Creative Art', 'Music', 'Phonics', 'Handwriting', 'Rhymes'],
  },
  {
    title: 'Basic 1',
    tag: 'Basic',
    bar: 'bg-cod-blue',
    tagClass: 'bg-cod-blue/10 text-cod-blue',
    icon: 'bx-book',
    desc: 'Foundational lower basic learning with strong literacy, numeracy, and creativity.',
    subjects: ['Mathematics', 'English Language', 'Basic Science', 'Social Value', 'C R S', 'Creative Art', 'Phonics', 'Music', 'French', 'Basic Technology', 'Information Technology', 'Social Studies', 'Civic Education', 'Handwriting'],
  },
  {
    title: 'Basic 2',
    tag: 'Basic',
    bar: 'bg-cod-blue',
    tagClass: 'bg-cod-blue/10 text-cod-blue',
    icon: 'bx-book',
    desc: 'Building on early core subjects with wider practical and creative exposure.',
    subjects: ['Mathematics', 'English Language', 'Basic Science', 'Social Value', 'C R S', 'Cultural and Creative Art (C C A)', 'Phonics', 'Music', 'French', 'Basic Technology', 'Information Technology', 'Social Studies', 'Civic Education', 'Handwriting'],
  },
  {
    title: 'Basic 3',
    tag: 'Basic',
    bar: 'bg-cod-blue',
    tagClass: 'bg-cod-blue/10 text-cod-blue',
    icon: 'bx-book-open',
    desc: 'Intermediate study across analytical, creative, and foundational skills.',
    subjects: ['Mathematics', 'Quantitative Reasoning', 'English Language', 'Verbal Reasoning', 'Basic Science', 'C R S', 'Cultural and Creative Art (C C A)', 'Physical and Health Education (P H E)', 'Music', 'Agricultural Studies', 'French', 'Basic Technology', 'Information Technology', 'Social Studies', 'Civic Education', 'History'],
  },
  {
    title: 'Basic 4',
    tag: 'Basic',
    bar: 'bg-cod-blue',
    tagClass: 'bg-cod-blue/10 text-cod-blue',
    icon: 'bx-book-open',
    desc: 'Strengthening analytical thinking and broad academic content across key disciplines.',
    subjects: ['Mathematics', 'Quantitative Reasoning', 'English Language', 'Verbal Reasoning', 'Basic Science', 'C R S', 'Cultural and Creative Art (C C A)', 'Physical and Health Education (P H E)', 'Music', 'Agricultural Studies', 'French', 'Basic Technology', 'Information Technology', 'Social Studies', 'Civic Education', 'History'],
  },
  {
    title: 'Basic 5',
    tag: 'Basic',
    bar: 'bg-cod-blue',
    tagClass: 'bg-cod-blue/10 text-cod-blue',
    icon: 'bx-book-reader',
    desc: 'Comprehensive upper basic programme with deeper reasoning and subject mastery.',
    subjects: ['Mathematics', 'Quantitative Reasoning', 'English Language', 'Verbal Reasoning', 'Basic Science', 'C R S', 'Cultural and Creative Art (C C A)', 'Physical and Health Education (P H E)', 'Music', 'Agricultural Studies', 'French', 'Basic Technology', 'Information Technology', 'Social Studies', 'Civic Education', 'History'],
  },
];

export default function RegularTrack() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <ProgrammeBreadcrumb current="Regular Track" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
        {/* Hero banner */}
        <div className="droplet-right relative overflow-hidden rounded-3xl bg-gradient-to-br from-cod-blue-deep via-purple-700 to-cod-pink p-8 md:p-10 flex items-center gap-6">
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute right-16 top-10 w-32 h-32 rounded-full bg-white/10" />

          <div className="relative w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <i
              className="bx bx-book-open text-4xl text-white"
              aria-hidden="true"
            />
          </div>

          <div className="relative">
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white">
              Regular Track
            </h1>
            <p className="mt-2 text-white/85 text-sm md:text-base max-w-lg">
              A nurturing academic curriculum from Discovery through Basic 5,
              building confident and curious learners.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mt-6">
          {legend.map((l, i) => (
            <div
              key={l.label}
              style={{ animationDelay: `${150 + i * 80}ms` }}
              className="droplet-left flex items-center gap-2 text-sm font-medium text-slate-600"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />
              {l.label}
            </div>
          ))}
        </div>

        {/* Programme Levels */}
        <div className="mt-8">
          <h2
            className="droplet-left flex items-center gap-2.5 font-display font-bold text-lg md:text-xl text-cod-blue-dark mb-6"
            style={{ animationDelay: '400ms' }}
          >
            <span className="w-1.5 h-6 rounded-full bg-cod-pink inline-block" />
            Programme Levels
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {levels.map((lvl, i) => (
              <div
                key={lvl.title}
                style={{ animationDelay: `${500 + i * 70}ms` }}
                className="droplet bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-1 ${lvl.bar}`} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${lvl.tagClass}`}
                    >
                      <i
                        className={`bx ${lvl.icon} text-xl`}
                        aria-hidden="true"
                      />
                    </span>
                    <h3 className="font-display font-bold text-cod-blue-dark flex-1">
                      {lvl.title}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${lvl.tagClass}`}
                    >
                      {lvl.tag}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {lvl.desc}
                  </p>

                  {lvl.subjects?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {lvl.subjects.map((subject) => (
                        <span
                          key={`${lvl.title}-${subject}`}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-600"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
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