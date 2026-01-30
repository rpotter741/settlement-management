import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import {
  reorderGroupProperties,
  SubTypeGroup,
} from '@/app/slice/subTypeSlice.js';
import reorderGroupPropertiesService from '@/services/glossary/subTypes/reorderGroupPropertiesService.js';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import { cloneDeep } from 'lodash';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import { logger } from '@/utility/logging/logger.ts';
import { sysReorderGroupProperties } from '@/app/commands/sysSubtype.ts';

export function movePropertyToEnd({
  groupId,
  propertyId,
}: {
  groupId: string;
  propertyId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const group = getSubTypeStateAtKey<SubTypeGroup>('groups', groupId);
    if (!group) {
      logger.snError("Can't move what does not exist! Please report this bug.");
      return;
    }
    if (!checkAdmin(group.system)) return;
    const order = group?.properties.length || 0;
    const newOrder = [...group.properties].map((p) => p.propertyId);
    newOrder.splice(newOrder.indexOf(propertyId), 1);
    newOrder.splice(order, 0, propertyId);

    try {
      //call the service to persist the new order
      if (group.system) {
        await sysReorderGroupProperties({
          groupId,
          newOrder,
        });
      } else {
        await subTypeCommands.reorderGroupProperties({
          groupId,
          newOrder,
        });
      }

      // Reorder properties in the group locally
      dispatch(
        reorderGroupProperties({
          groupId,
          newOrder,
          newDisplay: cloneDeep(group.display),
          system: group.system,
        })
      );

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: groupId,
          keypath: groupId,
        })
      );
    } catch (error) {
      logger.snError(
        'Immovable object meets... stoppable force? The server rejected our request to move that property. Please report.',
        { error }
      );
    }
  };
}
