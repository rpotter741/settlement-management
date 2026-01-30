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

export default function updateViaSyncWS({
  glossaryId,
  entryId,
  groups,
}: {
  glossaryId: string;
  entryId: string;
  groups: Record<string, any>;
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
    console.log('Updating entry via Sync WS:', editEntry.name, groups);
    try {
      dispatch(
        updateGlossaryEntry({
          glossaryId,
          entryId,
          content: {
            groups,
          },
        })
      );
      const entryClone = cloneDeep(editEntry);
      await updateEntryService({
        id: entryId,
        subTypeId: entryClone.subTypeId,
        groups,
        primaryAnchorValue: entryClone.primaryAnchorValue,
        secondaryAnchorValue: entryClone.secondaryAnchorValue,
      }).then(async () => {
        const data = await getEntryById({
          nodeId: entryId,
          entryType: entryClone.entryType,
        });
        const { entry, backlinksTo, backlinksFrom } = data;
        dispatch(
          updateGlossaryEntry({
            glossaryId,
            entryId,
            content: {
              backlinksTo,
              backlinksFrom,
            },
          })
        );
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
