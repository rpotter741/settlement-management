import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import updateEntryService from '@/services/glossary/entry/updateEntryService.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { cloneDeep, get } from 'lodash';
import { clearDirtyKeypaths } from '@/app/slice/dirtySlice.js';
import changeEntrySubTypeService from '@/services/glossary/entry/changeEntrySubTypeService.js';
import {
  updateGlossaryEntry,
  updateGlossaryNode,
} from '@/app/slice/glossarySlice.js';

export default function changeEntrySubTypeThunk({
  glossaryId,
  newSubTypeId,
  entryId,
}: {
  glossaryId: string;
  newSubTypeId: string;
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
      await changeEntrySubTypeService({
        entryId,
        newSubTypeId,
      }).then((res) => {
        // res will be the new group data for the entry, derived from it's new subType
        const { updates } = res;
        dispatch(
          updateGlossaryEntry({
            glossaryId,
            entryId,
            content: { ...updates },
          })
        );
        dispatch(
          updateGlossaryNode({
            glossaryId,
            nodeId: entryId,
            nodeData: { subTypeId: newSubTypeId },
          })
        );
      });
      // no dirty keypaths to clean since this is atomic at the time of change (via the ChangeEntrySubTypeModal); on failure, we don't even get to the dispatch where things update locally, so no worries. Yeah it's not optimistic, but these are all local operations anyway. Simplicity wins here.
    } catch (error) {
      dispatch(
        showSnackbar({
          message: `Error updating ${editEntry.name}. Try again later.`,
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
