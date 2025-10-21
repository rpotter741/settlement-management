import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { GlossaryEntryType } from '../../../../../../shared/types/glossaryEntry.js';
import changeSubTypeGroupNameDispatch from '@/app/dispatches/glossary/changeSubTypeGroupNameDispatch.js';

export function changeSubTypeGroupNameThunkRoot({
  glossaryId,
  type,
  subTypeId,
  groupId,
  name,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  name: string;
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

      changeSubTypeGroupNameDispatch({
        glossaryId,
        type,
        subTypeId,
        groupId,
        name,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'glossary',
          id: glossaryId,
          keypath: `subTypes.${type}.${subTypeId}.groupData.${groupId}.name`,
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

export default function changeSubTypeGroupNameThunk({
  glossaryId,
  type,
  subTypeId,
  groupId,
  name,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  name: string;
}) {
  return dispatch(
    changeSubTypeGroupNameThunkRoot({
      glossaryId,
      type,
      subTypeId,
      groupId,
      name,
    })
  );
}
