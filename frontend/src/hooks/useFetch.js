import { useCallback, useEffect, useRef, useState } from 'react';

export function useFetch(fetcher, immediate = true) {
  const fetcherRef = useRef(fetcher);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState('');

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const execute = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await fetcherRef.current();
      setData(result);
      return result;
    } catch (fetchError) {
      const message = fetchError.message || "Hmm, that didn't work. Try again?";
      setError(message);
      throw fetchError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {});
    }
  }, [execute, immediate]);

  return { data, setData, loading, error, execute };
}
