import { dispatch } from '@/app/constants.js';
import { selectClipboard } from '@/app/selectors/clipboardSelectors.js';
import {
  ClipboardType,
  setClipboard as set,
  clearClipboard as clear,
} from '@/app/slice/clipboardSlice.js';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

const useClipboard = (clipboardType: ClipboardType[]) => {
  const clipboard = useSelector(selectClipboard);
  const { data, type } = clipboard || {};

  const setClipboard = useCallback(
    ({ data, type }: { data: any; type: ClipboardType }) => {
      dispatch(set({ data, type }));
    },
    [dispatch]
  );

  const clearClipboard = useCallback(() => {
    dispatch(clear());
  }, [dispatch]);

  const isCompatible = useMemo(
    () =>
      clipboardType.reduce(
        (acc, curr: string) => {
          if (type === curr) {
            acc[curr] = true;
          } else {
            acc[curr] = false;
          }
          return acc;
        },
        {} as { [key: string]: boolean }
      ),
    [clipboardType, type]
  );

  return { data, setClipboard, clearClipboard, isCompatible };
};

export default useClipboard;
