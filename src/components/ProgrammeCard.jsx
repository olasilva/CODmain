// src/components/ProgrammeCard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProgramme } from '../lib/api';

export default function ProgrammeCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProgramme();
        setData(res?.programme || null);
      } catch (e) {
        setError(e.message || 'Could not load programme');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-black/10 p-6">
        <div className="flex items-center gap-2 text-black/40 text-sm">
          <i className="bx bx-loader-alt animate-spin text-lg" aria-hidden="true" />
          Loading your programme…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-sm">
        <i className="bx bx-error-circle text-lg mr-1" aria-hidden="true" />
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl border border-black/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F9FF] text-[#1A73E8]">
            <i className="bx bx-book-open text-xl" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold text-black font-ebrima">
            My Programme
          </h2>
        </div>
        <p className="text-sm text-black/50 mb-4">
          You haven't enrolled in a programme yet.
        </p>
        <Link
          to="/enroll"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1A73E8] to-[#FF2E96] text-white font-bold px-5 py-2.5 text-sm shadow-md hover:opacity-95 transition"
        >
          <i className="bx bx-plus text-base" aria-hidden="true" />
          Enroll Now
        </Link>
      </div>
    );
  }

  const iconFor = (track) => {
    if (!track) return 'bx-book';
    const t = track.toLowerCase();
    if (t.includes('music')) return 'bx-music';
    if (t.includes('mixed')) return 'bx-shuffle';
    return 'bx-book-open';
  };

  const statusStyles =
    {
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-600',
      pending: 'bg-yellow-100 text-yellow-700',
    }[data.status] || 'bg-yellow-100 text-yellow-700';

  return (
    <div className="bg-white rounded-2xl border border-black/10 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F9FF] text-[#1A73E8]">
            <i className="bx bx-book-open text-xl" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold text-black font-ebrima">
            My Programme
          </h2>
        </div>
        <span
          className={`text-xs font-bold rounded-full px-3 py-1 capitalize ${statusStyles}`}
        >
          {data.status}
        </span>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#F5F9FF] to-[#FFF5FA] border border-[#1A73E8]/15 px-4 py-4 mb-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#1A73E8] shadow-sm">
          <i
            className={`bx ${iconFor(data.trackName)} text-2xl`}
            aria-hidden="true"
          />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider font-bold text-black/40">
            Programme
          </p>
          <p className="text-lg font-bold text-[#0F4082] font-ebrima truncate">
            {data.trackName || data.course || 'Not selected'}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {data.regularClass && (
          <Row icon="bx-group" label="Class" value={data.regularClass} />
        )}
        {data.instrument && (
          <Row icon="bx-music" label="Instrument" value={data.instrument} />
        )}
        {data.academicYear && (
          <Row
            icon="bx-calendar"
            label="Academic Year"
            value={data.academicYear}
          />
        )}
        {data.enrolledAt && (
          <Row
            icon="bx-time"
            label="Applied"
            value={new Date(data.enrolledAt).toLocaleDateString('en-NG', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            muted
          />
        )}
      </div>
    </div>
  );
}

function Row({ icon, label, value, muted = false }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
      <span className="flex items-center gap-2 text-sm text-black/50">
        <i className={`bx ${icon} text-base text-[#1A73E8]`} aria-hidden="true" />
        {label}
      </span>
      <span
        className={`text-sm font-ebrima ${
          muted ? 'text-black/60' : 'text-black font-bold'
        }`}
      >
        {value}
      </span>
    </div>
  );
}