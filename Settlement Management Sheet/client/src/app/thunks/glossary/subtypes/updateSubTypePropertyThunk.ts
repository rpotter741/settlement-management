import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import { updateSubTypeDispatch } from '@/app/dispatches/glossary/updateSubTypePropertyDispatch.js';
import { dispatch } from '@/app/constants.js';

export function updateSubTypePropertyThunkRoot({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  keypath,
  value,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  keypath: string;
  value: any;
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
      updateSubTypeDispatch({
        glossaryId,
        type,
        subTypeId,
        groupId,
        propertyId,
        keypath,
        value,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'glossary',
          id: glossaryId,
          keypath: `subTypes.${type}.${subTypeId}.groupData.${groupId}.propertyData.${propertyId}.${keypath}`,
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

export default function updateSubTypePropertyThunk({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  keypath,
  value,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  keypath: string;
  value: any;
}) {
  dispatch(
    updateSubTypePropertyThunkRoot({
      glossaryId,
      type,
      subTypeId,
      groupId,
      propertyId,
      keypath,
      value,
    })
  );
}
