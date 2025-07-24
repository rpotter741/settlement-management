import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import thunks from '@/app/thunks/glossaryThunks.js';
import { AppDispatch } from '@/app/store.js';
import {
  selectEntryById,
  selectKeypathOptions,
  selectNodeById,
} from '@/app/selectors/glossarySelectors.js';
import { useSelector } from 'react-redux';
import { GlossaryEntry, GlossaryNode } from 'types/index.js';
import createScopedStorage from '@/utility/localStorageActions.js';
import { InheritanceMap } from '@/utility/hasParentProperty.js';

const useNodeEditor = (glossaryId: string, entryId: string) => {
  const dispatch: AppDispatch = useDispatch();

  const node: GlossaryNode = useSelector(selectNodeById(glossaryId, entryId));

  const entry: GlossaryEntry = useSelector(
    selectEntryById(glossaryId, entryId)
  );

  const buildOptionsByKeypath = useCallback(
    (property: keyof GlossaryEntry, inheritanceMap: InheritanceMap) => {
      return dispatch(
        thunks.getOptionsByProperty({
          glossaryId,
          entryId,
          property,
          inheritanceMap,
        })
      );
    },
    [glossaryId, entryId]
  );

  const getOptionsByKeypath = (keypath: keyof GlossaryEntry) =>
    useSelector(selectKeypathOptions(glossaryId, entryId, keypath));

  const storage = createScopedStorage(`${glossaryId}-${entryId}`);

  const updateGlossaryEntry = useCallback(
    (content: Record<string, any>) => {
      console.log('updating node ', node, ' with content: ', content);
      // dispatch(thunks.updateEntry({ node, content }));
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
        thunks.getEntryById({
          node,
        })
      );
    }
  }, [dispatch, entryId, glossaryId, node.entryType, entry]);

  return {
    node,
    entry,
    buildOptionsByKeypath,
    getOptionsByKeypath,
    updateGlossaryEntry,
    getLocalStorage,
    setLocalStorage,
    clearLocalStorage,
    localIsNewer,
  };
};

export default useNodeEditor;
