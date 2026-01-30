import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { addSubTypeGroup, SubTypeGroup } from '@/app/slice/subTypeSlice.js';
import { cloneDeep } from 'lodash';
import createSubTypeGroupService from '@/services/glossary/subTypes/createSubTypeGroupService.js';
import subTypeCommands from '@/app/commands/subtype.ts';

export function createSubTypeGroupThunk({
  group,
  system = false,
}: {
  group: SubTypeGroup;
  system?: boolean;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const user = state.user;
    try {
      const customGroup = cloneDeep(group);
      customGroup.displayName = customGroup.name;

      dispatch(
        addSubTypeGroup({
          groups: [{ ...customGroup, properties: [] }],
          system: user.role === 'admin' ? true : false,
        })
      );

      await subTypeCommands.createSubTypeGroup({
        name: customGroup.name,
        id: customGroup.id,
        createdBy: user.username ?? user.device,
        contentType: 'CUSTOM',
      });

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: customGroup.id,
          keypath: `${customGroup}`,
        })
      );
    } catch (error) {
      console.error('Error creating subtype group:', error);
      dispatch(
        showSnackbar({
          message: 'Error creating subtype group. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
