import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';

import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  updateEntrySubModel,
  updateGlossary,
  updateGlossaryEntry,
} from '@/app/slice/glossarySlice.js';
import { GenericObject } from '../../../../../../shared/types/common.js';
import { get } from 'lodash';
import { SubModelType } from 'types/index.js';
import { addDirtyKeypath } from '@/app/slice/tabSlice.js';

export default function updateEntrySubModelById({
  glossaryId,
  tabId,
  entryId,
  subModel,
  keypath,
  data,
}: {
  glossaryId: string;
  tabId: string;
  entryId: string;
  subModel: SubModelType;
  keypath: string;
  data: any;
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
      dispatch(
        updateEntrySubModel({
          glossaryId,
          entryId,
          subModel,
          keypath,
          data,
        })
      );
      dispatch(
        addDirtyKeypath({
          tabId,
          keypath: `entries.${entryId}.${subModel}.${keypath}`,
        })
      );
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
