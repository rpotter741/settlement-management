import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import updateEntryService from '@/services/glossary/entry/updateEntryService.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { cloneDeep, get } from 'lodash';
import { clearDirtyKeypaths } from '@/app/slice/dirtySlice.js';

export default function batchUpdateEntry({
  glossaryId,
  subTypeId,
  entryId,
}: {
  glossaryId: string;
  subTypeId: string;
  entryId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const editGlossary = state.glossary.glossaries.edit.byId[glossaryId];
    const staticGlossary = state.glossary.glossaries.static.byId[glossaryId];

    if (!staticGlossary || !editGlossary) {
      dispatch(
        showSnackbar({
          message: 'Glossary not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    const editEntry = editGlossary.entries[entryId];
    const staticEntry = staticGlossary.entries[entryId];
    if (!staticEntry || !editEntry) {
      dispatch(
        showSnackbar({
          message: 'Entry not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }

    try {
      const dirtyKeypaths = state.dirty.glossary[entryId]?.dirtyKeypaths || {};
      const updates = Object.keys(dirtyKeypaths)
        .map((keypath) => {
          const staticValue = get(staticEntry, keypath);
          const editValue = get(editEntry, keypath);
          if (editValue === undefined) {
            return {
              keypath,
              value: null,
            };
          } else if (staticValue !== editValue) {
            return {
              keypath,
              value: editValue,
            };
          } else if (staticValue === editValue) {
            return null;
          }
        })
        .filter(
          (update): update is { keypath: string; value: any } => update !== null
        );

      if (updates.length > 0) {
        const structuredUpdates: Record<string, any> = {};
        updates.forEach((change) => {
          const { keypath, value } = change;
          structuredUpdates[keypath] = value;
        });

        await updateEntryService({
          id: entryId,
          subTypeId,
          groups: cloneDeep(editEntry.groups),
          primaryAnchorValue: editEntry.primaryAnchorValue,
          secondaryAnchorValue: editEntry.secondaryAnchorValue,
        });
        dispatch(
          clearDirtyKeypaths({
            scope: 'glossary',
            id: entryId,
          })
        );
      }
    } catch (error) {
      dispatch(
        showSnackbar({
          message: 'Error updating glossary entry. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
