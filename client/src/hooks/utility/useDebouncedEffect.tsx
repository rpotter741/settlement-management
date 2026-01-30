import { useEffect, useRef } from 'react';

const useDebouncedEffect = (callback: () => void, delay: number, deps: any) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [callback, delay, ...deps]);
};

export default useDebouncedEffect;
