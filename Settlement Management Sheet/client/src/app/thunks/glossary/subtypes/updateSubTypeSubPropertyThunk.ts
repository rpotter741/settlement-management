import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import { updateSubTypeSubPropertyDispatch } from '@/app/dispatches/glossary/updateSubTypeSubPropertyDispatch.js';
import { dispatch } from '@/app/constants.js';

export function updateSubTypeSubPropertyThunkRoot({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  subPropertyId,
  side,
  keypath,
  value,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  subPropertyId: string;
  side: 'left' | 'right';
  keypath: string;
  value: any;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    console.log(keypath);

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

      console.log(keypath);

      updateSubTypeSubPropertyDispatch({
        glossaryId,
        type,
        subTypeId,
        groupId,
        propertyId,
        subPropertyId,
        side,
        keypath,
        value,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'glossary',
          id: glossaryId,
          keypath: `subTypes.${type}.${subTypeId}.groupData.${groupId}.propertyData.${propertyId}.${side}.${keypath}`,
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

export default function updateSubTypeSubPropertyThunk({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  subPropertyId,
  side,
  keypath,
  value,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  subPropertyId: string;
  side: 'left' | 'right';
  keypath: string;
  value: any;
}) {
  dispatch(
    updateSubTypeSubPropertyThunkRoot({
      glossaryId,
      type,
      subTypeId,
      groupId,
      propertyId,
      subPropertyId,
      side,
      keypath,
      value,
    })
  );
}
