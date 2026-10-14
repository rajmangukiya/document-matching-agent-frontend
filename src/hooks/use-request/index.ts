import { type DependencyList, useCallback, useEffect, useRef, useState } from 'react';

interface RequestState<T> {
  data: T | null;
  error: unknown;
  isLoading: boolean;
  setData: (data: T | null) => void;
  reload: () => Promise<void>;
}

// Loads data on mount and whenever deps change; reload() refetches quietly
export const useRequest = <T>(fetcher: () => Promise<T>, deps: DependencyList): RequestState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const reload = useCallback(async () => {
    try {
      setData(await fetcherRef.current());
      setError(null);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetcherRef
      .current()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, error, isLoading, setData, reload };
};

export default useRequest;
