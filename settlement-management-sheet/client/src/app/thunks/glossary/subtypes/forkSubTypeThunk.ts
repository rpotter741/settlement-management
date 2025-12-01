import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { addSubType } from '@/app/slice/subTypeSlice.js';
import forkSubTypeService from '@/services/glossary/subTypes/forkSubTypeService.js';

export function forkSubTypeThunkRoot({
  subType,
  name,
}: {
  subType: any;
  name: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const newSubType = await forkSubTypeService({
        subType,
        name,
      }).then((res) => {
        return res;
      });

      console.log(newSubType);

      dispatch(
        addSubType({
          subType: newSubType,
        })
      );
    } catch (error) {
      console.error('Error forking SubType:', error);
      dispatch(
        showSnackbar({
          message: 'Error forking SubType. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}

export default function forkSubTypeThunk({
  subType,
  name,
}: {
  subType: any;
  name: string;
}) {
  return dispatch(
    forkSubTypeThunkRoot({
      subType,
      name,
    })
  );
}
