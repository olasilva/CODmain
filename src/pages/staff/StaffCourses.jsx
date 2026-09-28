// src/pages/staff/StaffCourses.jsx
import { useEffect, useMemo, useState } from 'react';
import { getStaffMe, getStaffAssignments } from '../../lib/api';

const MUSIC_KEYWORDS = [
  'music', 'piano', 'keyboard', 'guitar', 'bass', 'violin', 'cello',
  'flute', 'sax', 'trumpet', 'drum', 'percussion', 'vocal', 'voice',
  'band', 'instrument', 'choir',
];
const REGULAR_KEYWORDS = [
  'math', 'english', 'science', 'social', 'civic', 'read', 'writing',
  'phonics', 'history', 'geography', 'physics', 'chemistry', 'biology',
  'computer', 'ict', 'coding',
];

function classifyCourse(cls) {
  const hay = `${cls.title || ''} ${cls.subject || ''}`.toLowerCase();
  if (MUSIC_KEYWORDS.some((k) => hay.includes(k))) return 'music';
  if (REGULAR_KEYWORDS.some((k) => hay.includes(k))) return 'regular';
  return 'unknown';
}

export default function StaffCourses() {
  const [me, setMe] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [meRes, coursesRes] = await Promise.allSettled([
          getStaffMe(),
          getStaffAssignments(),
        ]);
        if (meRes.status === 'fulfilled') setMe(meRes.value?.user || null);
        if (coursesRes.status === 'fulfilled') {
          const list =
            coursesRes.value?.classes ||
            coursesRes.value?.assignments ||
            [];
          setCourses(list.filter((c) => c.id));
        }
      } catch (err) {
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const staffCategory = (me?.staff_category || '').toLowerCase();

  const visible = useMemo(() => {
    if (!staffCategory || staffCategory === 'mixed') return courses;
    if (staffCategory.includes('regular')) {
      return courses.filter((c) => classifyCourse(c) !== 'music');
    }
    if (staffCategory.includes('music')) {
      return courses.filter((c) => classifyCourse(c) !== 'regular');
    }
    return courses;
  }, [courses, staffCategory]);

  const trackLabel = staffCategory
    ? staffCategory.charAt(0).toUpperCase() + staffCategory.slice(1)
    : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A73E8]" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-black font-ebrima">
            My Courses
          </h1>
          <p className="text-sm text-black/50 mt-1 font-ebrima">
            {trackLabel
              ? `Showing ${trackLabel.toLowerCase()} courses`
              : 'Courses you teach'}
          </p>
        </div>

        {trackLabel && (
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#F5F9FF] border border-[#1A73E8]/15 px-3 py-1.5 text-xs font-bold text-[#1A73E8]">
            <i
              className={`bx ${
                staffCategory.includes('regular')
                  ? 'bx-book'
                  : staffCategory.includes('music')
                  ? 'bx-music'
                  : 'bx-shuffle'
              }`}
              aria-hidden="true"
            />
            {trackLabel} track
          </span>
        )}
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/10 p-12 text-center">
          <i
            className="bx bx-book-open text-5xl text-black/15"
            aria-hidden="true"
          />
          <p className="mt-3 text-black/60 font-ebrima font-bold">
            No courses assigned yet
          </p>
          <p className="text-sm text-black/40 mt-1">
            Ask the admin to assign you to classes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((c) => {
            const kind = classifyCourse(c);
            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-black/10 p-5 flex flex-col"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${
                    kind === 'music'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <i
                    className={`bx ${
                      kind === 'music' ? 'bx-music' : 'bx-book'
                    } text-xl`}
                    aria-hidden="true"
                  />
                </span>
                <h3 className="font-bold text-black font-ebrima text-base leading-tight">
                  {c.title || c.subject || 'Course'}
                </h3>
                {c.subject && c.subject !== c.title && (
                  <p className="text-xs text-black/50 mt-1">{c.subject}</p>
                )}
                {c.schedule && (
                  <p className="text-xs text-black/60 mt-2 inline-flex items-center gap-1.5">
                    <i
                      className="bx bx-time text-[#1A73E8]"
                      aria-hidden="true"
                    />
                    {c.schedule}
                  </p>
                )}
                <span
                  className={`mt-4 self-start text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 ${
                    kind === 'music'
                      ? 'bg-purple-50 text-purple-700'
                      : kind === 'regular'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-black/5 text-black/50'
                  }`}
                >
                  {kind === 'unknown' ? 'General' : kind}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}