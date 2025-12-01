import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { addSubType } from '@/app/slice/subTypeSlice.js';
import createSubType from '@/services/glossary/subTypes/createSubType.js';

export function addSubTypeThunkRoot({ subType }: { subType: any }): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const state = getState();
      const subTypeState = state.subType.edit;

      dispatch(
        addSubType({
          subType: { ...subType, groups: [] },
        })
      );

      if (!subTypeState[subType.id]) {
        await createSubType({
          subType,
        }).then((res) => {
          console.log('Created SubType:', res);
        });
      }
    } catch (error) {
      console.error('Error adding SubType:', error);
      dispatch(
        showSnackbar({
          message: 'Error adding SubType. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}

export default function addSubTypeThunk({ subType }: { subType: any }) {
  return dispatch(
    addSubTypeThunkRoot({
      subType,
    })
  );
}
