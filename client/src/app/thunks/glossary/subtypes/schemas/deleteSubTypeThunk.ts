import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { addSubType, SubType } from '@/app/slice/subTypeSlice.js';
import deleteSubTypeService from '@/services/glossary/subTypes/deleteSubType.js';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import { logger } from '@/utility/logging/logger.ts';
import { sysDeleteSubType } from '@/app/commands/sysSubtype.ts';

export function deleteSubTypeThunkRoot({
  subTypeId,
}: {
  subTypeId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const subType = getSubTypeStateAtKey<SubType>('subtypes', subTypeId);
    if (!subType) {
      logger.snError(
        "It's like dividing by zero; I can't delete what doesn't exist."
      );
      return;
    }
    if (!checkAdmin(subType.system)) return;

    try {
      if (subType.system) {
        await sysDeleteSubType({ id: subTypeId });
      } else {
        await subTypeCommands.deleteSubType({
          id: subTypeId,
        });
      }
    } catch (error) {
      dispatch(
        addSubType({
          subType,
          system: subType.system,
        })
      );
      logger.snError(
        '"YOU THINK YOU CAN DEFEAT ME?!" - The subtype, probably. Could not delete. Please report.',
        { error }
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
