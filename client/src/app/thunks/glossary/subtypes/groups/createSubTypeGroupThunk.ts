import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { addSubTypeGroup, SubTypeGroup } from '@/app/slice/subTypeSlice.js';
import { cloneDeep } from 'lodash';
import createSubTypeGroupService from '@/services/glossary/subTypes/createSubTypeGroupService.js';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import { sysCreateSubTypeGroup } from '@/app/commands/sysSubtype.ts';
import { logger } from '@/utility/logging/logger.ts';
import verifyUserAdmin from '@/hooks/auth/verifyUserAdmin.ts';

export function createSubTypeGroupThunk({
  group,
}: {
  group: SubTypeGroup;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const user = getState().user;
    const isSystem = verifyUserAdmin();
    try {
      const customGroup = cloneDeep(group);
      customGroup.displayName = customGroup.name;

      let newGroup: SubTypeGroup;
      if (isSystem) {
        newGroup = await sysCreateSubTypeGroup({
          id: customGroup.id,
          name: customGroup.name,
        });
      } else {
        newGroup = await subTypeCommands.createSubTypeGroup({
          name: customGroup.name,
          id: customGroup.id,
          createdBy: user.username ?? user.device,
        });
      }

      if (!newGroup) {
        logger.snError(
          'We seem to have misplaced the new subtype group! Please report this bug.'
        );
        return;
      }

      dispatch(
        addSubTypeGroup({
          groups: [newGroup],
          system: newGroup.system,
        })
      );

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: customGroup.id,
          keypath: `${customGroup}`,
        })
      );
    } catch (error) {
      logger.snError('Server said no. Who are we to argue? Please report.', {
        error,
      });
    }
  };
}
