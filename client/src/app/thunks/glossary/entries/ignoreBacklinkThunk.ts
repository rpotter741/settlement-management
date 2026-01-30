import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';

import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  updateGlossary,
  updateGlossaryEntry,
  updateGlossaryNode,
} from '@/app/slice/glossarySlice.js';
import { GenericObject } from '../../../../../../shared/types/common.js';
import { cloneDeep, get, keyBy, set } from 'lodash';
import {
  addBulkDirtyKeypaths,
  addDirtyKeypath,
} from '@/app/slice/dirtySlice.js';
import updateEntryService from '@/services/glossary/entry/updateEntryService.js';
import getEntryById from '@/services/glossary/entry/getEntryById.js';
import ignoreBacklinkService from '@/services/glossary/entry/ignoreBacklinkService.js';

export default function ignoreBacklinkThunk({
  glossaryId,
  entryId,
  linkId,
  targetIgnore,
}: {
  glossaryId: string;
  entryId: string;
  linkId: string;
  targetIgnore: boolean;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const glossary = state.glossary.glossaries.edit.byId[glossaryId];
    if (!glossary) {
      dispatch(
        showSnackbar({
          message: 'Glossary not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    const editEntry = glossary.entries[entryId];
    if (!editEntry) {
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
      const existingLinks = cloneDeep(editEntry.backlinksTo);
      const index = existingLinks.findIndex((link) => link.id === linkId);
      if (index === -1) {
        dispatch(
          showSnackbar({
            message: 'Backlink not found.',
            type: 'error',
            duration: 3000,
          })
        );
        return;
      }
      set(existingLinks[index], 'targetIgnore', targetIgnore);

      dispatch(
        updateGlossaryEntry({
          glossaryId,
          entryId,
          content: {
            backlinksTo: existingLinks,
          },
        })
      );
      await ignoreBacklinkService({
        linkId,
        targetIgnore,
      }).then((res) => {
        // no further action needed for now as long as the update persists locally from the above. We'll see!
        console.log(res);
      });
    } catch (error) {
      console.error('Error updating entry:', error);
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
