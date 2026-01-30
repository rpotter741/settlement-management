import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { addSubType, SubType } from '@/app/slice/subTypeSlice.js';
import deleteSubTypeService from '@/services/glossary/subTypes/deleteSubType.js';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import subTypeCommands from '@/app/commands/subtype.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';

export function deleteSubTypeThunkRoot({
  subTypeId,
}: {
  subTypeId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const subType = getSubTypeStateAtKey<SubType>('subtypes', subTypeId);
    if (!subType) {
      dispatch(
        showSnackbar({
          message:
            "It's like dividing by zero; I can't delete what doesn't exist.",
          type: 'error',
        })
      );
      return;
    }
    if (!checkAdmin(subType.system)) return;

    try {
      await subTypeCommands.deleteSubType({
        id: subTypeId,
      });
    } catch (error) {
      console.error('Error deleting SubType:', error);
      dispatch(
        addSubType({
          subType,
          system: subType.system,
        })
      );
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
