import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import thunks from '@/app/thunks/glossaryThunks.js';
import { AppDispatch } from '@/app/store.js';
import {
  selectEntryById,
  selectNodeById,
} from '@/app/selectors/glossarySelectors.js';
import { useSelector } from 'react-redux';
import { GlossaryEntry, GlossaryNode } from 'types/index.js';
import createScopedStorage from '@/utility/localStorageActions.js';

const useNodeEditor = (glossaryId: string, entryId: string) => {
  const dispatch: AppDispatch = useDispatch();

  const node: GlossaryNode = useSelector(selectNodeById(glossaryId, entryId));

  const entry: GlossaryEntry = useSelector(
    selectEntryById(glossaryId, entryId)
  );

  const storage = createScopedStorage(`${glossaryId}-${entryId}`);

  const updateGlossaryEntry = useCallback(
    (content: Record<string, any>) => {
      console.log(content, 'content in useNodeEditor');
      dispatch(thunks.updateEntry({ glossaryId, node, content }));
    },
    [dispatch, glossaryId, node]
  );

  const getLocalStorage = useCallback(() => {
    return storage.get();
  }, [glossaryId, entryId]);

  const setLocalStorage = useCallback(
    (data: Record<string, any>) => {
      storage.set(data);
    },
    [glossaryId, entryId]
  );

  const clearLocalStorage = useCallback(() => {
    storage.remove();
  }, [glossaryId, entryId]);

  const localIsNewer = useCallback(() => {
    const localStorageData: GlossaryEntry = storage.get();
    if (!localStorageData) return false;

    const entryUpdatedAt = new Date(entry?.updatedAt || 0);
    const localUpdatedAt = new Date(localStorageData.updatedAt);

    return localUpdatedAt > entryUpdatedAt;
  }, [glossaryId, entryId]);

  useEffect(() => {
    if (!entry && node?.entryType) {
      dispatch(
        thunks.getGlossaryEntryById({
          nodeId: entryId,
          glossaryId,
          entryType: node.entryType,
        })
      );
    }
  }, [dispatch, entryId, glossaryId, node.entryType, entry]);

  return {
    node,
    entry,
    updateGlossaryEntry,
    getLocalStorage,
    setLocalStorage,
    clearLocalStorage,
    localIsNewer,
  };
};

export default useNodeEditor;
