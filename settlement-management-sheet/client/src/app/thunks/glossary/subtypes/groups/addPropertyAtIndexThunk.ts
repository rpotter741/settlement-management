import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import {
  addPropertyToGroup,
  reorderGroupProperties,
  SubTypeGroup,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import subTypeCommands from '@/app/commands/subtype.ts';
import { ulid as newId } from 'ulid';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';

export function addPropertyAtIndexThunk({
  groupId,
  propertyId,
  dropIndex,
}: {
  groupId: string;
  propertyId: string;
  dropIndex: number;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    const group = getSubTypeStateAtKey<SubTypeGroup>('groups', groupId);
    if (!group) {
      dispatch(
        showSnackbar({
          message: 'No group found to add property to at index.',
          type: 'error',
        })
      );
      return;
    }
    if (!checkAdmin(group.system)) return;

    const property = getSubTypeStateAtKey<SubTypeProperty>(
      'properties',
      propertyId
    );

    if (!property) {
      dispatch(
        showSnackbar({
          message: 'No property found to add to group at index.',
          type: 'error',
        })
      );
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

      dispatch(
        addPropertyToGroup({
          groupId,
          property: createdProperty,
          system: group.system,
        })
      );

      await subTypeCommands.reorderGroupProperties({
        groupId,
        newOrder: order,
      });

      dispatch(
        reorderGroupProperties({
          groupId,
          newOrder: order,
          newDisplay: { ...group.display },
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
      console.error('Error linking subtype property:', error);
      dispatch(
        showSnackbar({
          message: 'Error linking subtype property. Thanks, backend.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
