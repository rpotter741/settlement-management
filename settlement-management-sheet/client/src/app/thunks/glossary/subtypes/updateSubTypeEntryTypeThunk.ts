import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import {} from '@/app/slice/subTypeSlice.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';

export function updateSubTypeEntryTypeThunkRoot({
  subTypeId,
  entryType,
  system,
}: {
  subTypeId: string;
  system: boolean;
  entryType: GlossaryEntryType;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    if (!checkAdmin(system)) return;
    try {
      const subType = getSubTypeStateAtKey('subtypes', subTypeId);
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
      //   updateSubTypeEntryType({
      //     subTypeId,
      //     entryType,
      //   })
      // );

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subTypeId,
          keypath: `${subTypeId}.entryType`,
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

export default function updateSubTypeEntryTypeThunk({
  subTypeId,
  entryType,
  system,
}: {
  subTypeId: string;
  entryType: GlossaryEntryType;
  system: boolean;
}) {
  return dispatch(
    updateSubTypeEntryTypeThunkRoot({
      subTypeId,
      entryType,
      system,
    })
  );
}
