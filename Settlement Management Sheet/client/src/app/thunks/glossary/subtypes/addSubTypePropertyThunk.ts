import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import { addSubTypeProperty } from '@/app/slice/subTypeSlice.js';

export function addSubTypePropertyThunkRoot({
  subTypeId,
  groupId,
  property,
}: {
  subTypeId: string;
  groupId: string;
  property: any;
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
        addSubTypeProperty({
          subTypeId,
          groupId,
          property,
        })
      );

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subTypeId,
          keypath: `${subTypeId}.groups.${groupId}`,
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

export default function addSubTypePropertyThunk({
  subTypeId,
  groupId,
  property,
}: {
  subTypeId: string;
  groupId: string;
  property: any;
}) {
  return dispatch(
    addSubTypePropertyThunkRoot({
      subTypeId,
      groupId,
      property,
    })
  );
}
