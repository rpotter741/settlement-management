import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import thunks from '@/app/thunks/glossaryThunks.js';
import { AppDispatch } from '@/app/store.js';
import {
  selectEntryById,
  selectNodeById,
} from '@/app/selectors/glossarySelectors.js';
import { useSelector } from 'react-redux';

const useNodeEditor = (glossaryId: string, entryId: string) => {
  const dispatch: AppDispatch = useDispatch();

  const node = useSelector(selectNodeById(glossaryId, entryId));

  const entry = useSelector(selectEntryById(glossaryId, entryId));

  const updateGlossaryEntry = useCallback(
    (content: Record<string, any>) => {
      dispatch(thunks.updateEntry({ glossaryId, node, content }));
    },
    [dispatch, glossaryId, node]
  );

  return {
    node,
    entry,
    updateGlossaryEntry,
  };
};

export default useNodeEditor;
