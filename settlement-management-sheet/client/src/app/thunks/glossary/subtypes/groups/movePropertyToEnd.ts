import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { reorderGroupProperties } from '@/app/slice/subTypeSlice.js';
import reorderGroupPropertiesService from '@/services/glossary/subTypes/reorderGroupPropertiesService.js';
import subTypeCommands from '@/app/commands/subtype.ts';
import { cloneDeep } from 'lodash';

export function movePropertyToEnd({
  groupId,
  propertyId,
}: {
  groupId: string;
  propertyId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const group = state.subType.groups.edit[groupId];
    if (!group) {
      console.error(`Group with ID ${groupId} not found.`);
      return;
    }
    const order = group?.properties.length || 0;
    const newOrder = [...group.properties].map((p) => p.propertyId);
    newOrder.splice(newOrder.indexOf(propertyId), 1);
    newOrder.splice(order, 0, propertyId);

    try {
      // Reorder properties in the group locally
      dispatch(
        reorderGroupProperties({
          groupId,
          newOrder,
          newDisplay: cloneDeep(group.display),
        })
      );

      //call the service to persist the new order
      // await reorderGroupPropertiesService({ groupId, newOrder });
      await subTypeCommands.reorderGroupProperties({
        groupId,
        newOrder,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: groupId,
          keypath: groupId,
        })
      );
    } catch (error) {
      console.error('Error reordering subtype properties:', error);
      dispatch(
        showSnackbar({
          message: 'Error reordering subtype properties. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
