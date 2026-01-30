import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { SubTypeGroup, updateSubTypeGroup } from '@/app/slice/subTypeSlice.js';
import subTypeCommands from '@/app/commands/subtype.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';

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
      dispatch(
        showSnackbar({
          message: 'Group not found.',
          type: 'error',
          duration: 3000,
        })
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

      if (!oldGroup.system) {
        await subTypeCommands.updateSubTypeGroup({
          id: groupId,
          name: updates?.name,
          displayName: updates?.displayName,
          display: updates?.display,
          description: updates?.description,
        });
      } else {
        // await systemSubTypeCommands.updateSubTypeGroup({
        //   id: groupId,
        //   name: updates?.name,
        //   displayName: updates?.displayName,
        //   display: updates?.display,
        //   description: updates?.description,
        // });
      }

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: groupId,
          keypath: `${groupId}`,
        })
      );
    } catch (error) {
      console.error('Error updating group:', error);
      dispatch(
        showSnackbar({
          message: 'Error updating group. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
