import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import {
  SubTypeProperty,
  updateSubTypeGroup,
} from '@/app/slice/subTypeSlice.js';
import updateSubTypeGroupService from '@/services/glossary/subTypes/updateSubTypeGroupService.js';

export function updateSubTypeGroupThunk({
  groupId,
  updates,
}: {
  groupId: string;
  updates: any;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const oldGroup = state.subType.groups.edit[groupId];
    if (!oldGroup) {
      dispatch(
        showSnackbar({
          message: 'SubType not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    try {
      dispatch(
        updateSubTypeGroup({
          groupId,
          updates,
        })
      );

      //service for updating group
      await updateSubTypeGroupService({
        groupId,
        updates,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: groupId,
          keypath: `${groupId}`,
        })
      );
    } catch (error) {
      console.error('Error updating group:', error);
      dispatch(
        showSnackbar({
          message: 'Error updating group. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
