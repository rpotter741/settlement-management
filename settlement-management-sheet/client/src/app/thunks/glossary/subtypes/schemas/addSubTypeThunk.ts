import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { addSubType, SubType } from '@/app/slice/subTypeSlice.js';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import verifyUserAdmin from '@/hooks/auth/verifyUserAdmin.ts';
import { sysCreateEntrySubType } from '@/app/commands/sysSubtype.ts';
import { logger } from '@/utility/logging/logger.ts';

export function addSubTypeThunkRoot({
  subType,
}: {
  subType: SubType;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const user = getState().user;
      const isSystem = verifyUserAdmin();

      let newSubtype: SubType;
      if (isSystem) {
        newSubtype = await sysCreateEntrySubType({
          id: subType.id,
          name: subType.name,
          entryType: subType.entryType,
        });
      } else {
        newSubtype = await subTypeCommands.createEntrySubType({
          id: subType.id,
          name: subType.name,
          createdBy: user.id as string,
          entryType: subType.entryType,
        });
      }

      if (!newSubtype) {
        logger.snError(
          'We seem to have misplaced the new subtype! Please report this bug.'
        );
        return;
      }

      dispatch(
        addSubType({
          subType: newSubtype,
          system: newSubtype.system,
        })
      );
    } catch (error) {
      logger.snError(
        'Sometimes the server can be a little... rusty. Aka, something went wrong.',
        { error }
      );
    }
  };
}

export default function addSubTypeThunk({ subType }: { subType: SubType }) {
  return dispatch(
    addSubTypeThunkRoot({
      subType,
    })
  );
}
