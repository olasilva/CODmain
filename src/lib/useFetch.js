// src/lib/useFetch.js
import { useEffect, useState } from 'react';

/**
 * Simple data-fetching hook. No refs, no memoization complexity.
 * Re-fetches whenever any value in `deps` changes.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useFetch(
 *     () => getAdminStats(),
 *     []
 *   );
 */
export default function useFetch(fetcher, deps = [], options = {}) {
  const { initialData = null, skip = false } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (skip) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.resolve()
      .then(() => fetcher())
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Request failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick, skip]);

  const refetch = () => setTick((t) => t + 1);

  return { data, loading, error, refetch, setData };
}