import { useEffect, useRef } from 'react';

const useDebouncedEffect = (callback, delay, deps) => {
  const timeoutRef = useRef();

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [callback, delay, ...deps]);
};

export default useDebouncedEffect;
