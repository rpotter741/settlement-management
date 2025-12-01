import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import addSubTypeGroupPropertyService from '@/services/glossary/subTypes/addSubTypeGroupPropertyService.js';
import { addPropertyToGroup } from '@/app/slice/subTypeSlice.js';

export function addPropertyToGroupThunk({
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
    const property = state.subType.properties.edit[propertyId];
    if (!property) {
      console.error(`Property with ID ${propertyId} not found.`);
      return;
    }
    try {
      const order = group.properties ? group.properties.length : 0;

      const { createdProperty } = await addSubTypeGroupPropertyService({
        groupId,
        propertyId,
        order,
      });

      if (!createdProperty) {
        throw new Error('No created property returned from service.');
      }

      console.log('Created Property:', createdProperty);

      dispatch(addPropertyToGroup({ groupId, property: createdProperty }));

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
