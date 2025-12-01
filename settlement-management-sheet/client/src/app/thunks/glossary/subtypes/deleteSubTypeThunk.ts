import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { addSubType } from '@/app/slice/subTypeSlice.js';
import deleteSubTypeService from '@/services/glossary/subTypes/deleteSubType.js';

export function deleteSubTypeThunkRoot({
  subTypeId,
}: {
  subTypeId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const subTypeState = state.subType.edit;

    const subType = subTypeState[subTypeId];
    try {
      // dispatch(
      //   deleteSubType({
      //     subTypeId,
      //   })
      // );

      await deleteSubTypeService({
        subTypeId,
      });
    } catch (error) {
      console.error('Error deleting SubType:', error);
      // dispatch(
      //   addSubType({
      //     subType,
      //   })
      // );
      dispatch(
        showSnackbar({
          message: 'Error deleting SubType. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}

export default function deleteSubTypeThunk({
  subTypeId,
}: {
  subTypeId: string;
}) {
  return dispatch(
    deleteSubTypeThunkRoot({
      subTypeId,
    })
  );
}
