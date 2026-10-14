import { useEffect, useRef } from 'react';

// Calls `callback` every `intervalMs` while `active` is true
export const usePolling = (callback: () => unknown, active: boolean, intervalMs = 1500): void => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => void callbackRef.current(), intervalMs);
    return () => clearInterval(timer);
  }, [active, intervalMs]);
};

export default usePolling;
