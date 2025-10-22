import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import { updateSubTypeDispatch } from '@/app/dispatches/glossary/updateSubTypePropertyDispatch.js';
import { dispatch } from '@/app/constants.js';
import { updateSubTypeProperty } from '@/app/slice/subTypeSlice.js';

export function updateSubTypePropertyThunkRoot({
  subTypeId,
  groupId,
  propertyId,
  keypath,
  value,
}: {
  subTypeId: string;
  groupId: string;
  propertyId: string;
  keypath: string;
  value: any;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const state = getState();
      const subType = state.subType.edit[subTypeId];
      if (!subType) {
        dispatch(
          showSnackbar({
            message: 'SubType not found.',
            type: 'error',
            duration: 3000,
          })
        );
        return;
      }
      dispatch(
        updateSubTypeProperty({
          subTypeId,
          groupId,
          propertyId,
          keypath,
          value,
        })
      );

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subTypeId,
          keypath: `${subTypeId}.groupData.${groupId}.propertyData.${propertyId}.${keypath}`,
        })
      );
    } catch (error) {
      console.error('Error updating subType:', error);
      dispatch(
        showSnackbar({
          message: 'Error updating subType. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}

export default function updateSubTypePropertyThunk({
  subTypeId,
  groupId,
  propertyId,
  keypath,
  value,
}: {
  subTypeId: string;
  groupId: string;
  propertyId: string;
  keypath: string;
  value: any;
}) {
  dispatch(
    updateSubTypePropertyThunkRoot({
      subTypeId,
      groupId,
      propertyId,
      keypath,
      value,
    })
  );
}
