import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';

import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  updateGlossary,
  updateGlossaryEntry,
} from '@/app/slice/glossarySlice.js';
import { GenericObject } from '../../../../../../shared/types/common.js';
import { get } from 'lodash';
import {
  addBulkDirtyKeypaths,
  addDirtyKeypath,
} from '@/app/slice/dirtySlice.js';

export default function updateEntryById({
  glossaryId,
  entryId,
  content,
}: {
  glossaryId: string;
  entryId: string;
  content: Record<string, any>;
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
    const semanticContent: Record<string, any> = {};
    Object.entries(content).forEach(([key, value]) => {
      //@ts-ignore
      if (key.includes(editEntry.primaryAnchorId)) {
        semanticContent['primaryAnchorValue'] = value;
      }
      //@ts-ignore
      if (key.includes(editEntry.secondaryAnchorId)) {
        semanticContent['secondaryAnchorValue'] = value;
      }
    });
    console.log('nooooooooop', content, semanticContent);
    try {
      dispatch(
        updateGlossaryEntry({
          glossaryId,
          entryId,
          content: { ...content, ...semanticContent },
        })
      );
      dispatch(
        addBulkDirtyKeypaths({
          scope: 'glossary',
          id: entryId,
          keypaths: Object.keys(content),
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
