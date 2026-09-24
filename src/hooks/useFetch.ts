import { useCallback, useEffect, useState } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((value) => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(null);

    fetcher(controller.signal)
      .then((result) => {
        if (active && !controller.signal.aborted) {
          setData(result);
        }
      })
      .catch((err: unknown) => {
        if (!active || controller.signal.aborted) return;
        setError(err instanceof Error ? err : new Error('Une erreur inconnue est survenue.'));
      })
      .finally(() => {
        if (active && !controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [fetcher, reloadKey]);

  return { data, loading, error, reload };
}
