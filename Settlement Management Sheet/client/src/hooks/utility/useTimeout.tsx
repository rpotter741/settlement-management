import { useEffect, useRef } from 'react';

/**
 * useTimeout hook
 *
 * @param callback - Function to run after the timeout
 * @param delay - Timeout duration in ms; if null, timeout won't run
 * @param deps - Optional array of dependencies to reset the timer
 */
function useTimeout(
  callback: () => void,
  delay: number | null,
  deps: any[] = []
) {
  const savedCallback = useRef(callback);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  // Always keep the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Handle timeout + cleanup
  useEffect(() => {
    if (delay === null) return;

    timeoutId.current = setTimeout(() => savedCallback.current(), delay);

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...deps]);
}

export default useTimeout;
