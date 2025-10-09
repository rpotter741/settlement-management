import { useEffect, useRef } from 'react';

/**
 * useInterval hook
 *
 * @param callback - Function to run on interval
 * @param delay - Delay in ms; if null, interval is paused
 */
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Update the ref if callback changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
