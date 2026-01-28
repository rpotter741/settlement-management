import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { addSubTypeGroup, deleteGroup } from '@/app/slice/subTypeSlice.js';
import deleteSubTypeGroupService from '@/services/glossary/subTypes/deleteSubTypeGroupService.js';
import { cloneDeep } from 'lodash';
import subTypeCommands from '@/app/commands/subtype.ts';

export function deleteSubTypeGroupThunk({
  groupId,
}: {
  groupId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const group = cloneDeep(state.subType.groups.edit[groupId]);
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
    try {
      // await deleteSubTypeGroupService({ groupId });
      await subTypeCommands.deleteSubTypeGroup({ id: groupId });

      dispatch(
        deleteGroup({
          groupId,
        })
      );

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: groupId,
          keypath: `${groupId}`,
        })
      );
    } catch (error) {
      dispatch(addSubTypeGroup({ groups: [group] }));
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
