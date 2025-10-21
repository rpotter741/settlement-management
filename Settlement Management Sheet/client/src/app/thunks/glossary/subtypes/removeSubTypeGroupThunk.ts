import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import addGlossarySubType from '@/app/dispatches/glossary/addSubTypeDispatch.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import removeSubTypeGroupDispatch from '@/app/dispatches/glossary/removeSubTypeGroupDispatch.js';

export function removeSubTypeGroupThunkRoot({
  glossaryId,
  type,
  subTypeId,
  groupId,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
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

      removeSubTypeGroupDispatch(glossaryId, type, subTypeId, groupId);

      dispatch(
        addDirtyKeypath({
          scope: 'glossary',
          id: glossaryId,
          keypath: `subTypes.${type}.${subTypeId}`,
        })
      );
    } catch (error) {
      console.error('Error updating glossary:', error);
      dispatch(
        showSnackbar({
          message: 'Error updating glossary. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}

export default function removeSubTypeGroupThunk({
  glossaryId,
  type,
  subTypeId,
  groupId,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
}) {
  return dispatch(
    removeSubTypeGroupThunkRoot({
      glossaryId,
      type,
      subTypeId,
      groupId,
    })
  );
}
