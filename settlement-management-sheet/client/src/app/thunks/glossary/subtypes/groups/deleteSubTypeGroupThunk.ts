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
import subTypeCommands from '@/app/commands/subtype.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';

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
      dispatch(
        showSnackbar({
          message: 'Group not found.',
          type: 'error',
          duration: 3000,
        })
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

      await subTypeCommands.deleteSubTypeGroup({ id: groupId });
    } catch (error) {
      dispatch(addSubTypeGroup({ groups: [group], system: group.system }));
      dispatch(
        showSnackbar({
          message: 'Error removing group. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
