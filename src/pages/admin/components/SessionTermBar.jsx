// src/pages/admin/components/SessionTermBar.jsx
import React, { useState } from 'react';
import { getPromotionPreview, promoteCohort } from '../../../lib/api';

export default function SessionTermBar({
  sessions = [],
  sessionId,
  term,
  onChange,
}) {
  const [promoting, setPromoting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const activeSession = sessions.find((s) => s.id === sessionId);
  const terms = activeSession?.terms || [];
  const currentTermRow = terms.find((t) => t.term_number === term);
  const canPromote = Boolean(currentTermRow) && !currentTermRow.is_closed;

  async function handlePromoteClick() {
    setError(null);
    try {
      const p = await getPromotionPreview({ sessionId, term });
      setPreview(p);
    } catch (err) {
      setError(err?.message || 'Failed to load preview');
    }
  }

  async function handleConfirmPromote() {
    setPromoting(true);
    setError(null);
    try {
      await promoteCohort({ sessionId, term });
      setPreview(null);
      onChange({ sessionId, term, refreshKey: Date.now() });
    } catch (err) {
      setError(err?.message || 'Promotion failed');
    } finally {
      setPromoting(false);
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-black/10 p-4 mb-6 flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs font-bold text-black/60 mb-1 font-ebrima">
            Academic Session
          </label>
          <select
            value={sessionId || ''}
            onChange={(e) => {
              const s = sessions.find((x) => x.id === e.target.value);
              const defaultTerm =
                s?.terms?.find((t) => t.is_current)?.term_number ??
                s?.terms?.[0]?.term_number ??
                1;
              onChange({ sessionId: e.target.value, term: defaultTerm });
            }}
            className="w-full px-3 py-2 border border-black/15 rounded-xl text-sm"
          >
            <option value="">— select —</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.is_current ? ' (current)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-bold text-black/60 mb-1 font-ebrima">
            Term
          </label>
          <select
            value={term || ''}
            onChange={(e) =>
              onChange({ sessionId, term: Number(e.target.value) })
            }
            disabled={!sessionId}
            className="w-full px-3 py-2 border border-black/15 rounded-xl text-sm disabled:bg-gray-50"
          >
            <option value="">— select —</option>
            {terms.map((t) => (
              <option key={t.id} value={t.term_number}>
                {`${t.term_number}${
                  ['st', 'nd', 'rd'][t.term_number - 1]
                } Term`}
                {t.is_closed ? ' (closed)' : ''}
                {t.is_current ? ' — current' : ''}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handlePromoteClick}
          disabled={!canPromote}
          className="px-5 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Close Term &amp; Promote All
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-black mb-2 font-ebrima">
              Confirm Promotion
            </h3>
            <p className="text-sm text-black/70 mb-4">
              You are about to promote <strong>{preview.count}</strong>{' '}
              student{preview.count === 1 ? '' : 's'} from{' '}
              <strong>
                Term {term}
                {term === 3 ? ' → next session Term 1' : ` → Term ${term + 1}`}
              </strong>
              . This cannot be undone.
            </p>
            {preview.sample?.length > 0 && (
              <ul className="text-xs text-black/60 mb-4 max-h-32 overflow-y-auto">
                {preview.sample.map((s) => (
                  <li key={s.id}>
                    {s.full_name} — Level {s.level}
                  </li>
                ))}
                {preview.count > preview.sample.length && (
                  <li>… and {preview.count - preview.sample.length} more</li>
                )}
              </ul>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPreview(null)}
                disabled={promoting}
                className="px-4 py-2 rounded-xl border border-black/15 text-sm font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPromote}
                disabled={promoting}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {promoting ? 'Promoting…' : 'Yes, promote'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}