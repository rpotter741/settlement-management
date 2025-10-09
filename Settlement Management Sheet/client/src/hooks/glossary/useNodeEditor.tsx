import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import thunks from '@/app/thunks/glossaryThunks.js';
import { AppDispatch } from '@/app/store.js';
import {
  selectEditEntryById,
  selectKeypathOptions,
  selectEditNodeById,
  selectEditGlossaryById,
} from '@/app/selectors/glossarySelectors.js';
import { useSelector } from 'react-redux';
import { GlossaryEntry, GlossaryNode, SubModelType } from 'types/index.js';
import createScopedStorage from '@/utility/localStorageActions.js';
import { InheritanceMap } from '@/utility/hasParentProperty.js';

const useNodeEditor = (glossaryId: string, entryId: string) => {
  const dispatch: AppDispatch = useDispatch();

  const node: GlossaryNode = useSelector(
    selectEditNodeById(glossaryId, entryId)
  );

  const entry: GlossaryEntry = useSelector(
    selectEditEntryById(glossaryId, entryId)
  );

  const glossary = useSelector(selectEditGlossaryById(glossaryId));
  console.log(glossary);

  useEffect(() => {
    if (!entry && node?.entryType) {
      dispatch(
        thunks.getEntryById({
          node,
        })
      );
    }
  }, [dispatch, entryId, glossaryId, node?.entryType, entry]);

  // update entry metadata

  const updateGlossaryEntry = useCallback(
    (content: Record<string, any>) => {
      dispatch(thunks.updateEntryById({ glossaryId, entryId, content }));
    },
    [dispatch, glossaryId, entryId]
  );

  // update entry submodel by id

  const updateSubModel = useCallback(
    ({
      subModel,
      keypath,
      data,
      tabId,
    }: {
      subModel: SubModelType;
      keypath: string;
      data: any;
      tabId: string;
    }) => {
      console.log(tabId, 'tabId in updateSubModel');
      dispatch(
        thunks.updateEntrySubModelById({
          glossaryId,
          entryId,
          subModel,
          keypath,
          data,
          tabId,
        })
      );
    },
    [dispatch, glossaryId, entryId]
  );

  // options for select inputs

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

  // optional dispatches for fetching subModels
  const getSubModel = (subModel: keyof typeof entry) => {
    if (!entry[subModel]) {
      dispatch(
        thunks.getEntrySubModel({
          glossaryId,
          entryId,
          entryType: node.entryType,
          subModel: subModel as string,
        })
      );
    }
  };

  // local storage stuff

  const storage = createScopedStorage(`${glossaryId}-${entryId}`);

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
    const localUpdatedAt = new Date(localStorageData?.updatedAt || 0);

    return localUpdatedAt > entryUpdatedAt;
  }, [glossaryId, entryId]);

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
    getSubModel,
    updateSubModel,
  };
};

export default useNodeEditor;
