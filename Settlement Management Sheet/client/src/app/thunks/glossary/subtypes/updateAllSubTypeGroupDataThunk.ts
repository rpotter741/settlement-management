import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import {
  SubTypeGroup,
  updateAllSubTypeGroupData,
} from '@/app/slice/subTypeSlice.js';

export function updateAllSubTypeGroupDataThunkRoot({
  subTypeId,
  groupData,
}: {
  subTypeId: string;
  groupData: Record<string, SubTypeGroup>;
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
        updateAllSubTypeGroupData({
          subTypeId,
          groupData,
        })
      );

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subTypeId,
          keypath: `${subTypeId}.groupData`,
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

export default function updateAllSubTypeGroupDataThunk({
  subTypeId,
  groupData,
}: {
  subTypeId: string;
  groupData: Record<string, SubTypeGroup>;
}) {
  return dispatch(
    updateAllSubTypeGroupDataThunkRoot({
      subTypeId,
      groupData,
    })
  );
}
