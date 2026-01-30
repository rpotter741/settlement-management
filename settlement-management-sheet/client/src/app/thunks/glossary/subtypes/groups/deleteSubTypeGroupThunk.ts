import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import {
  addSubTypeGroup,
  deleteGroup,
  SubTypeGroup,
} from '@/app/slice/subTypeSlice.js';
import { cloneDeep } from 'lodash';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import { sysDeleteSubTypeGroup } from '@/app/commands/sysSubtype.ts';
import { logger } from '@/utility/logging/logger.ts';

export function deleteSubTypeGroupThunk({
  groupId,
}: {
  groupId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    const group = cloneDeep(
      getSubTypeStateAtKey<SubTypeGroup>('groups', groupId)
    );
    if (!group) {
      logger.snError(
        "How can on delete that which does not exist? That's one for the ages... and the logs. Please report."
      );
      return;
    }
    if (!checkAdmin(group.system)) return;
    try {
      dispatch(
        deleteGroup({
          groupId,
          system: group.system,
        })
      );
      if (group.system) {
        await sysDeleteSubTypeGroup({ id: groupId });
      } else {
        await subTypeCommands.deleteSubTypeGroup({ id: groupId });
      }
    } catch (error) {
      dispatch(addSubTypeGroup({ groups: [group], system: group.system }));
      logger.snError('Group said no. Who are we to argue? Please report.', {
        error,
      });
    }
  };
}
