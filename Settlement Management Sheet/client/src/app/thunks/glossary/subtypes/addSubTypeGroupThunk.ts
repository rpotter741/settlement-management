import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { addSubTypeGroup, SubTypeGroup } from '@/app/slice/subTypeSlice.js';

export function addSubTypeGroupThunkRoot({
  subTypeId,
  group,
}: {
  subTypeId: string;
  group: SubTypeGroup;
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

      dispatch(addSubTypeGroup({ subTypeId, group }));

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subTypeId,
          keypath: subTypeId,
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

export default function addSubTypeGroupThunk({
  subTypeId,
  group,
}: {
  subTypeId: string;
  group: SubTypeGroup;
}) {
  return dispatch(
    addSubTypeGroupThunkRoot({
      subTypeId,
      group,
    })
  );
}
