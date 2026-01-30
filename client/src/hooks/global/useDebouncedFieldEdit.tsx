import { useCallback, useEffect, useState } from 'react';

const useDebouncedFieldEdit = ({
  source,
  updateFn,
  deps,
  delay = 500,
}: {
  source: string;
  updateFn: (value: string) => void;
  deps: any[];
  delay?: number;
}) => {
  const [value, setValue] = useState<string>(source || '');

  useEffect(() => {
    setValue(source || '');
  }, [source]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (source !== value) {
        updateFn(value);
      }
    }, delay);

    return () => clearTimeout(t);
  }, [value, ...deps]);

  // handler to update local value
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return { value, handleChange };
};

export default useDebouncedFieldEdit;
