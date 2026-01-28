import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import addSubTypeGroupPropertyService from '@/services/glossary/subTypes/addSubTypeGroupPropertyService.js';
import {
  addPropertyToGroup,
  reorderGroupProperties,
} from '@/app/slice/subTypeSlice.js';
import subTypeCommands from '@/app/commands/subtype.ts';
import { v4 as newId } from 'uuid';

export function addPropertyAtIndexThunk({
  groupId,
  propertyId,
  dropIndex,
}: {
  groupId: string;
  propertyId: string;
  dropIndex: number;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const group = state.subType.groups.edit[groupId];
    if (!group) {
      console.error(`Group with ID ${groupId} not found.`);
      return;
    }
    const property = state.subType.properties.edit[propertyId];
    if (!property) {
      console.error(`Property with ID ${propertyId} not found.`);
      return;
    }
    try {
      const order = group.properties.map((p) => p.propertyId);
      order.splice(dropIndex, 0, propertyId);

      const createdProperty = await subTypeCommands.createGroupProperty({
        id: newId(),
        groupId,
        propertyId,
        order: group.properties.length,
      });

      if (!createdProperty) {
        throw new Error('No created property returned from service.');
      }

      dispatch(addPropertyToGroup({ groupId, property: createdProperty }));

      await subTypeCommands.reorderGroupProperties({
        groupId,
        newOrder: order,
      });

      dispatch(
        reorderGroupProperties({
          groupId,
          newOrder: order,
          newDisplay: { ...group.display },
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
      console.error('Error linking subtype property:', error);
      dispatch(
        showSnackbar({
          message: 'Error linking subtype property. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
