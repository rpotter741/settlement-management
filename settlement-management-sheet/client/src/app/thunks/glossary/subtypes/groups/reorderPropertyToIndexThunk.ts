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
import checkAdmin from '@/utility/security/checkAdmin.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';

export function reorderPropertyToIndexThunk({
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
      console.error(`Group with ID ${groupId} not found.`);
      return;
    }
    if (!checkAdmin(group.system)) return;

    const property = getSubTypeStateAtKey<SubTypeProperty>(
      'properties',
      propertyId
    );

    if (!property) {
      console.error(`Property with ID ${propertyId} not found.`);
      return;
    }
    try {
      const order = group.properties.map((p) =>
        p.propertyId === propertyId ? null : p.propertyId
      );
      const filtered = order.filter((pid) => pid !== null) as string[];
      filtered.splice(dropIndex, 0, propertyId);

      await subTypeCommands.reorderGroupProperties({
        groupId,
        newOrder: filtered,
      });

      dispatch(
        reorderGroupProperties({
          groupId,
          newOrder: filtered,
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
          message: 'Error linking subtype property. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
