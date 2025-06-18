import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import thunks from '@/app/thunks/glossaryThunks.js';
import { AppDispatch } from '@/app/store.js';
import {
  selectEntryById,
  selectNodeById,
} from '@/app/selectors/glossarySelectors.js';
import { useSelector } from 'react-redux';
import { GlossaryNode } from 'types/index.js';

const useNodeEditor = (glossaryId: string, entryId: string) => {
  const dispatch: AppDispatch = useDispatch();

  const node: GlossaryNode = useSelector(selectNodeById(glossaryId, entryId));

  const entry: any = useSelector(selectEntryById(glossaryId, entryId));

  const updateGlossaryEntry = useCallback(
    (content: Record<string, any>) => {
      console.log(content, 'content in useNodeEditor');
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
