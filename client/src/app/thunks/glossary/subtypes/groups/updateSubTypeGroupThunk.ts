import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { SubTypeGroup, updateSubTypeGroup } from '@/app/slice/subTypeSlice.js';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import { logger } from '@/utility/logging/logger.ts';
import { sysUpdateSubTypeGroup } from '@/app/commands/sysSubtype.ts';

export function updateSubTypeGroupThunk({
  groupId,
  updates,
}: {
  groupId: string;
  updates: any;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    const oldGroup = getSubTypeStateAtKey<SubTypeGroup>('groups', groupId);
    if (!oldGroup) {
      logger.snError(
        "You ever try catching a fart? That's how I feel about updating a group that doesn't exist. Please report this bug."
      );
      return;
    }
    if (!checkAdmin(oldGroup.system)) return;
    try {
      dispatch(
        updateSubTypeGroup({
          groupId,
          updates,
          system: oldGroup.system,
        })
      );

      if (oldGroup.system) {
        await sysUpdateSubTypeGroup({
          id: groupId,
          name: updates?.name,
          displayName: updates?.displayName,
          display: updates?.display,
          description: updates?.description,
        });
      } else {
        await subTypeCommands.updateSubTypeGroup({
          id: groupId,
          name: updates?.name,
          displayName: updates?.displayName,
          display: updates?.display,
          description: updates?.description,
        });
      }

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: groupId,
          keypath: `${groupId}`,
        })
      );
    } catch (error) {
      logger.snError(
        "You did a good job. Let's not take that away. It's the server who let us down. Please report.",
        { error }
      );
    }
  };
}
