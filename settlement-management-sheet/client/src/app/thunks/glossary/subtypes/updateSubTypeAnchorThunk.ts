import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import {} from '@/app/slice/subTypeSlice.js';

export function updateSubTypeAnchorThunkRoot({
  subTypeId,
  value,
  anchor,
}: {
  subTypeId: string;
  value: any;
  anchor: 'primary' | 'secondary';
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

      // dispatch(
      //   updateSubTypeAnchor({
      //     subTypeId,
      //     value,
      //     anchor,
      //   })
      // );

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subTypeId,
          keypath: `${subTypeId}.anchors.${anchor}`,
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

export default function updateSubTypeAnchorThunk({
  subTypeId,
  value,
  anchor,
}: {
  subTypeId: string;
  value: any;
  anchor: 'primary' | 'secondary';
}) {
  return dispatch(
    updateSubTypeAnchorThunkRoot({
      subTypeId,
      value,
      anchor,
    })
  );
}
