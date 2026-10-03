// src/pages/student/StudentLearnMore.jsx
import { useEffect, useMemo, useState } from 'react';
import { getMyProgramme } from '../../lib/api';

// ═══════════════════════════════════════════════════════════════
// MUSIC TRACK — instrumental + theory content
// ═══════════════════════════════════════════════════════════════

const MUSIC_THEORY = [
  {
    id: 'music-theory-fundamentals',
    title: 'Music Theory Fundamentals',
    description:
      'Notes, scales, intervals, and how music is built — the language behind every song.',
    icon: 'bx-book-open',
    iconBg: 'bg-purple-100 text-purple-700',
    level: 'Beginner',
    url: 'https://www.youtube.com/results?search_query=music+theory+for+beginners',
  },
  {
    id: 'reading-sheet-music',
    title: 'Reading Sheet Music',
    description:
      'Read treble and bass clefs, notes, and rhythm notation.',
    icon: 'bx-note',
    iconBg: 'bg-violet-100 text-violet-700',
    level: 'Beginner',
    url: 'https://www.youtube.com/results?search_query=how+to+read+sheet+music+for+beginners',
  },
  {
    id: 'ear-training',
    title: 'Ear Training',
    description:
      'Train your ear to identify intervals, chords, and melodies by sound.',
    icon: 'bx-headphone',
    iconBg: 'bg-emerald-100 text-emerald-700',
    level: 'All levels',
    url: 'https://www.youtube.com/results?search_query=ear+training+for+musicians',
  },
  {
    id: 'rhythm-timing',
    title: 'Rhythm & Timing',
    description:
      'Understand beats, tempo, and how to stay locked into the groove.',
    icon: 'bx-pulse',
    iconBg: 'bg-yellow-100 text-yellow-700',
    level: 'All levels',
    url: 'https://www.youtube.com/results?search_query=rhythm+basics+for+musicians',
  },
  {
    id: 'sight-reading',
    title: 'Sight Reading',
    description:
      'Play a piece you have never seen before — a skill every serious musician builds.',
    icon: 'bx-show',
    iconBg: 'bg-sky-100 text-sky-700',
    level: 'Intermediate',
    url: 'https://www.youtube.com/results?search_query=sight+reading+for+musicians',
  },
  {
    id: 'major-minor-scales',
    title: 'Scales & Modes',
    description:
      'Major, minor, and modal scales — the raw material for melodies and improvisation.',
    icon: 'bx-line-chart',
    iconBg: 'bg-rose-100 text-rose-700',
    level: 'Beginner',
    url: 'https://www.youtube.com/results?search_query=major+and+minor+scales+for+beginners',
  },
];

// ═══════════════════════════════════════════════════════════════
// INSTRUMENT — maps a specific instrument name → its own card
// ═══════════════════════════════════════════════════════════════

const INSTRUMENT_LESSONS = {
  Piano: {
    title: 'Piano',
    description: 'Keyboard layout, hand posture, chords, and your first melodies.',
    icon: 'bx-piano',
    iconBg: 'bg-indigo-100 text-indigo-700',
    url: 'https://www.youtube.com/results?search_query=piano+lessons+for+beginners',
  },
  Keyboard: {
    title: 'Keyboard',
    description: 'Learn the keys, chords, and how to play along with songs.',
    icon: 'bx-music',
    iconBg: 'bg-blue-100 text-blue-700',
    url: 'https://www.youtube.com/results?search_query=keyboard+lessons+for+beginners',
  },
  'Acoustic Guitar': {
    title: 'Acoustic Guitar',
    description: 'Chords, strumming patterns, and your first songs.',
    icon: 'bx-guitar',
    iconBg: 'bg-orange-100 text-orange-700',
    url: 'https://www.youtube.com/results?search_query=acoustic+guitar+lessons+for+beginners',
  },
  'Electric Guitar': {
    title: 'Electric Guitar',
    description: 'Riffs, lead playing, and effects.',
    icon: 'bx-guitar',
    iconBg: 'bg-red-100 text-red-700',
    url: 'https://www.youtube.com/results?search_query=electric+guitar+lessons+for+beginners',
  },
  'Bass Guitar': {
    title: 'Bass Guitar',
    description: 'Groove, timing, and holding down the low end.',
    icon: 'bx-guitar',
    iconBg: 'bg-amber-100 text-amber-700',
    url: 'https://www.youtube.com/results?search_query=bass+guitar+lessons+for+beginners',
  },
  Violin: {
    title: 'Violin',
    description: 'Bow hold, tuning, and clean bowing technique.',
    icon: 'bx-music',
    iconBg: 'bg-rose-100 text-rose-700',
    url: 'https://www.youtube.com/results?search_query=violin+lessons+for+beginners',
  },
  Cello: {
    title: 'Cello',
    description: 'Posture, bow technique, and rich low tones.',
    icon: 'bx-music',
    iconBg: 'bg-fuchsia-100 text-fuchsia-700',
    url: 'https://www.youtube.com/results?search_query=cello+lessons+for+beginners',
  },
  Flute: {
    title: 'Flute',
    description: 'Embouchure, breathing, and producing a clear tone.',
    icon: 'bx-wind',
    iconBg: 'bg-cyan-100 text-cyan-700',
    url: 'https://www.youtube.com/results?search_query=flute+lessons+for+beginners',
  },
  Saxophone: {
    title: 'Saxophone',
    description: 'Embouchure, fingerings, and jazz basics.',
    icon: 'bx-wind',
    iconBg: 'bg-yellow-100 text-yellow-700',
    url: 'https://www.youtube.com/results?search_query=saxophone+lessons+for+beginners',
  },
  Trumpet: {
    title: 'Trumpet',
    description: 'Lip buzzing, breathing, and range building.',
    icon: 'bx-bullseye',
    iconBg: 'bg-amber-100 text-amber-700',
    url: 'https://www.youtube.com/results?search_query=trumpet+lessons+for+beginners',
  },
  Drums: {
    title: 'Drums',
    description: 'Basic beats, keeping time, and limb coordination.',
    icon: 'bx-circle',
    iconBg: 'bg-slate-100 text-slate-700',
    url: 'https://www.youtube.com/results?search_query=drum+lessons+for+beginners',
  },
  Percussion: {
    title: 'Percussion',
    description: 'Rhythm patterns, hand technique, and ensemble playing.',
    icon: 'bx-circle',
    iconBg: 'bg-zinc-100 text-zinc-700',
    url: 'https://www.youtube.com/results?search_query=percussion+lessons+for+beginners',
  },
  'Vocals / Voice Training': {
    title: 'Vocals',
    description: 'Breath control, warm-ups, and finding your unique voice.',
    icon: 'bx-microphone',
    iconBg: 'bg-pink-100 text-pink-700',
    url: 'https://www.youtube.com/results?search_query=singing+lessons+for+beginners',
  },
};

// ═══════════════════════════════════════════════════════════════
// REGULAR TRACK — academic subjects by class level
// ═══════════════════════════════════════════════════════════════

const REGULAR_TRACK_SUBJECTS = {
  Discovery: [
    'Numeracy',
    'Literacy',
    'Physical and Social Development (P S D)',
    'Creative Development',
    'Knowledge and Understanding of the World (K U W)',
    'Rhymes',
  ],
  'Pre Nursery': [
    'Numeracy',
    'Literacy',
    'Basic Science',
    'Social Value',
    'Health Habit',
    'C R S',
    'Creative Art',
    'Rhymes',
  ],
  'Nursery 1': [
    'Numeracy',
    'Literacy',
    'Basic Science',
    'Social Value',
    'Health Habit',
    'C R S',
    'Creative Art',
    'Music',
    'Phonics',
    'Handwriting',
    'Rhymes',
  ],
  'Nursery 2': [
    'Numeracy',
    'Literacy',
    'Basic Science',
    'Social Value',
    'Health Habit',
    'C R S',
    'Creative Art',
    'Music',
    'Phonics',
    'Handwriting',
    'Rhymes',
  ],
  'Basic 1': [
    'Mathematics',
    'English Language',
    'Basic Science',
    'Social Value',
    'C R S',
    'Creative Art',
    'Phonics',
    'Music',
    'French',
    'Basic Technology',
    'Information Technology',
    'Social Studies',
    'Civic Education',
    'Handwriting',
  ],
  'Basic 2': [
    'Mathematics',
    'English Language',
    'Basic Science',
    'Social Value',
    'C R S',
    'Cultural and Creative Art (C C A)',
    'Phonics',
    'Music',
    'French',
    'Basic Technology',
    'Information Technology',
    'Social Studies',
    'Civic Education',
    'Handwriting',
  ],
  'Basic 3': [
    'Mathematics',
    'Quantitative Reasoning',
    'English Language',
    'Verbal Reasoning',
    'Basic Science',
    'C R S',
    'Cultural and Creative Art (C C A)',
    'Physical and Health Education (P H E)',
    'Music',
    'Agricultural Studies',
    'French',
    'Basic Technology',
    'Information Technology',
    'Social Studies',
    'Civic Education',
    'History',
  ],
  'Basic 4': [
    'Mathematics',
    'Quantitative Reasoning',
    'English Language',
    'Verbal Reasoning',
    'Basic Science',
    'C R S',
    'Cultural and Creative Art (C C A)',
    'Physical and Health Education (P H E)',
    'Music',
    'Agricultural Studies',
    'French',
    'Basic Technology',
    'Information Technology',
    'Social Studies',
    'Civic Education',
    'History',
  ],
  'Basic 5': [
    'Mathematics',
    'Quantitative Reasoning',
    'English Language',
    'Verbal Reasoning',
    'Basic Science',
    'C R S',
    'Cultural and Creative Art (C C A)',
    'Physical and Health Education (P H E)',
    'Music',
    'Agricultural Studies',
    'French',
    'Basic Technology',
    'Information Technology',
    'Social Studies',
    'Civic Education',
    'History',
  ],
};

const SUBJECT_ICONS = {
  Number: 'bx-calculator',
  Mathematics: 'bx-calculator',
  'English Language': 'bx-book',
  'Basic Science': 'bx-atom',
  'Social Studies': 'bx-globe',
  'Civic Education': 'bx-group',
  'Reading & Phonics': 'bx-book-reader',
  'Phonics': 'bx-book-reader',
  'Handwriting': 'bx-pen',
  'Creative Art': 'bx-palette',
  'Cultural and Creative Art (C C A)': 'bx-palette',
  'Physical and Health Education (P H E)': 'bx-dumbbell',
  Music: 'bx-music',
  Rhymes: 'bx-music',
  Numeracy: 'bx-calculator',
  Literacy: 'bx-book-open',
  'Physical and Social Development (P S D)': 'bx-user-pin',
  'Creative Development': 'bx-palette',
  'Knowledge and Understanding of the World (K U W)': 'bx-world',
  'Social Value': 'bx-group',
  'Health Habit': 'bx-heart',
  'C R S': 'bx-church',
  'French': 'bx-globe',
  'Basic Technology': 'bx-cog',
  'Information Technology': 'bx-laptop',
  'Agricultural Studies': 'bx-leaf',
  'Quantitative Reasoning': 'bx-calculator',
  'Verbal Reasoning': 'bx-book-open',
  History: 'bx-history',
};

const SUBJECT_BG = {
  default: 'bg-violet-100 text-violet-700',
};

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function detectTrack(programme) {
  const t = (programme?.trackName || programme?.course || '').toLowerCase();
  if (t.includes('music')) return 'music';
  if (t.includes('mixed')) return 'mixed';
  if (t.includes('regular')) return 'regular';
  return null; // not enrolled
}

function buildMusicTopics(programme) {
  const topics = [];

  const instrument = programme?.instrument;
  if (instrument && INSTRUMENT_LESSONS[instrument]) {
    const lesson = INSTRUMENT_LESSONS[instrument];
    topics.push({
      id: `instrument-${instrument}`,
      title: `${lesson.title} — Your Instrument`,
      description: lesson.description,
      icon: lesson.icon,
      iconBg: lesson.iconBg,
      level: 'Beginner',
      url: lesson.url,
      featured: true,
    });
  }

  topics.push(...MUSIC_THEORY);
  return topics;
}

function buildRegularTopics(programme) {
  const level = programme?.regularClass || 'Basic 1';
  const subjects = REGULAR_TRACK_SUBJECTS[level] || REGULAR_TRACK_SUBJECTS['Basic 1'];

  return subjects.map((subject) => ({
    id: `${level}-${subject}`,
    title: subject,
    description: `${subject} for ${level}.`,
    icon: SUBJECT_ICONS[subject] || 'bx-book-open',
    iconBg: SUBJECT_BG.default,
    level,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(
      `${level} ${subject} lessons`
    )}`,
  }));
}

// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════

export default function StudentLearnMore() {
  const [loading, setLoading] = useState(true);
  const [programme, setProgramme] = useState(null);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProgramme();
        setProgramme(res?.programme || null);
      } catch (e) {
        setError(e.message || 'Could not load your programme');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const track = detectTrack(programme);
  const hasMusic = track === 'music' || track === 'mixed';
  const hasRegular = track === 'regular' || track === 'mixed';

  const musicTopics = useMemo(
    () => (hasMusic ? buildMusicTopics(programme) : []),
    [hasMusic, programme]
  );
  const regularTopics = useMemo(
    () => (hasRegular ? buildRegularTopics(programme) : []),
    [hasRegular, programme]
  );

  const allTopics = useMemo(() => {
    if (track === 'music') return musicTopics;
    if (track === 'regular') return regularTopics;
    if (track === 'mixed') return [...musicTopics, ...regularTopics];
    return [];
  }, [track, musicTopics, regularTopics]);

  const CATEGORIES = useMemo(() => {
    const cats = [{ key: 'all', label: 'All' }];
    if (hasMusic) cats.push({ key: 'music', label: 'Music' });
    if (hasRegular) cats.push({ key: 'regular', label: 'Academics' });
    return cats;
  }, [hasMusic, hasRegular]);

  const visibleTopics = useMemo(() => {
    let list = allTopics;
    if (category === 'music') list = musicTopics;
    if (category === 'regular') list = regularTopics;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => {
        const hay = `${t.title} ${t.description} ${t.level || ''}`.toLowerCase();
        return hay.includes(q);
      });
    }
    return list;
  }, [category, search, allTopics, musicTopics, regularTopics]);

  const featured = visibleTopics.find((t) => t.featured) || visibleTopics[0];

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ─── Header ─── */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima leading-tight">
          Learn More
        </h1>
        <p className="text-sm sm:text-base text-black/60 mt-1.5 font-ebrima max-w-2xl">
          {track === 'music'
            ? 'Music lessons and theory hand-picked for your instrument and level.'
            : track === 'regular'
            ? 'Free academic lessons matched to your class.'
            : track === 'mixed'
            ? 'Both music and academic lessons, chosen for your track.'
            : 'Free lessons curated for you.'}
        </p>

        {track && programme && (
          <div className="mt-3 inline-flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F9FF] border border-[#1A73E8]/15 px-3 py-1.5 text-xs font-bold text-[#1A73E8]">
              <i
                className={`bx ${
                  track === 'regular'
                    ? 'bx-book'
                    : track === 'music'
                    ? 'bx-music'
                    : 'bx-shuffle'
                }`}
                aria-hidden="true"
              />
              {programme.trackName || programme.course}
            </span>
            {programme.regularClass && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F9FF] border border-[#1A73E8]/15 px-3 py-1.5 text-xs font-bold text-[#1A73E8]">
                <i className="bx bx-group" aria-hidden="true" />
                {programme.regularClass}
              </span>
            )}
            {programme.instrument && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F9FF] border border-[#1A73E8]/15 px-3 py-1.5 text-xs font-bold text-[#1A73E8]">
                <i className="bx bx-piano" aria-hidden="true" />
                {programme.instrument}
              </span>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <i className="bx bx-error-circle text-lg" aria-hidden="true" />
          {error}
        </div>
      )}

      {/* ─── Loading ─── */}
      {loading && (
        <div className="py-20 text-center text-black/50">
          <i
            className="bx bx-loader-alt animate-spin text-3xl"
            aria-hidden="true"
          />
          <p className="mt-2 font-ebrima">Loading your lessons…</p>
        </div>
      )}

      {/* ─── Not enrolled yet ─── */}
      {!loading && !track && (
        <div className="bg-white rounded-2xl border border-black/10 p-10 text-center">
          <i
            className="bx bx-book-open text-5xl text-black/15"
            aria-hidden="true"
          />
          <p className="mt-3 text-black/60 font-ebrima font-bold">
            You're not enrolled in a programme yet
          </p>
          <p className="text-sm text-black/40 mt-1 max-w-sm mx-auto">
            Complete your admission to unlock personalized learning content for
            your track.
          </p>
        </div>
      )}

      {/* ─── Content ─── */}
      {!loading && track && (
        <>
          {/* Featured card */}
          {featured && (
            <a
              href={featured.url}
              target="_blank"
              rel="noreferrer"
              className="block mb-6 group"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A73E8] to-[#0F4082] p-6 sm:p-8 lg:p-10 text-white shadow-lg transition-transform duration-300 group-hover:scale-[1.01]">
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    <i className="bx bx-star" aria-hidden="true" />
                    Start here
                  </span>
                  <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold font-ebrima leading-tight">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-white/90 text-sm sm:text-base leading-relaxed">
                    {featured.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white text-[#0F4082] font-bold text-sm px-5 py-2.5 shadow-md transition group-hover:gap-3">
                    <i
                      className="bx bxl-youtube text-lg text-red-600"
                      aria-hidden="true"
                    />
                    Watch on YouTube
                    <i
                      className="bx bx-right-arrow-alt text-lg"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 -right-4 h-56 w-56 rounded-full bg-white/5" />
              </div>
            </a>
          )}

          {/* Search + filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <div className="flex-1 bg-white rounded-xl border border-black/15 px-4 py-2.5 flex items-center gap-2.5">
              <i
                className="bx bx-search text-lg text-black/40"
                aria-hidden="true"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search topics, instruments, subjects…"
                className="flex-1 outline-none bg-transparent text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear"
                  className="text-black/40 hover:text-black"
                >
                  <i className="bx bx-x text-lg" aria-hidden="true" />
                </button>
              )}
            </div>

            {CATEGORIES.length > 2 && (
              <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto">
                <div className="flex gap-2 min-w-max md:min-w-0 md:flex-wrap">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setCategory(c.key)}
                      className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                        category === c.key
                          ? 'bg-[#1A73E8] text-white border-2 border-[#1A73E8]'
                          : 'bg-white text-black/60 border border-black/15 hover:bg-black/5'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Grid */}
          {visibleTopics.length === 0 ? (
            <div className="bg-white rounded-2xl border border-black/10 p-12 text-center">
              <i
                className="bx bx-search text-5xl text-black/15"
                aria-hidden="true"
              />
              <p className="mt-3 text-black/60 font-ebrima font-bold">
                No topics match your search
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleTopics.map((topic) => (
                <a
                  key={topic.id}
                  href={topic.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group bg-white rounded-2xl border border-black/10 p-5 flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${topic.iconBg} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <i
                        className={`bx ${topic.icon} text-2xl`}
                        aria-hidden="true"
                      />
                    </span>
                    {topic.level && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/5 text-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shrink-0">
                        {topic.level}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-black text-base sm:text-lg font-ebrima leading-tight mb-2">
                    {topic.title}
                  </h3>

                  <p className="text-sm text-black/55 leading-relaxed flex-1 mb-4">
                    {topic.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-black/5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A73E8] transition group-hover:gap-2.5">
                      <i
                        className="bx bxl-youtube text-base text-red-600"
                        aria-hidden="true"
                      />
                      Watch
                      <i
                        className="bx bx-right-arrow-alt"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Tip */}
          <div className="mt-6 rounded-2xl bg-[#F5F9FF] border border-[#1A73E8]/15 p-4 flex items-start gap-3">
            <i
              className="bx bx-bulb text-[#1A73E8] text-xl shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-bold text-[#0F4082] font-ebrima">
                Tip
              </p>
              <p className="text-xs text-black/60 mt-0.5 leading-relaxed">
                Watch one video, then practise for 10 minutes. Bring your
                questions to your next session with your teacher.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}