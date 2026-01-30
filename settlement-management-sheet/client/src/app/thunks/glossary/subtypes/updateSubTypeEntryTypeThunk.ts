import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { SubType } from '@/app/slice/subTypeSlice.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import { sysUpdateSubType } from '@/app/commands/sysSubtype.ts';

export function updateSubTypeEntryTypeThunkRoot({
  subTypeId,
  entryType,
}: {
  subTypeId: string;
  entryType: GlossaryEntryType;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const subType = getSubTypeStateAtKey<SubType>('subtypes', subTypeId);
    if (!subType) {
      dispatch(
        showSnackbar({
          message: 'Are we sure that subtype exists?',
          type: 'error',
        })
      );
      return;
    }
    if (!checkAdmin(subType.system)) return;
    try {
      dispatch(
        showSnackbar({
          message: 'Bro this would be crazy to allow. Just clone!',
          type: 'warning',
        })
      );
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
}: {
  subTypeId: string;
  entryType: GlossaryEntryType;
}) {
  return dispatch(
    updateSubTypeEntryTypeThunkRoot({
      subTypeId,
      entryType,
    })
  );
}
