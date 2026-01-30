import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import {
  addSubTypeGroup,
  reorderGroupProperties,
  SubTypeGroup,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import { cloneDeep } from 'lodash';
import createSubTypeGroupService from '@/services/glossary/subTypes/createSubTypeGroupService.js';
import removePropertyFromGroupService from '@/services/glossary/subTypes/removePropertyFromGroupService.js';
import subTypeCommands from '@/app/commands/subtype.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';

export function removeGroupPropertyThunk({
  groupId,
  propertyId,
}: {
  groupId: string;
  propertyId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    const group = getSubTypeStateAtKey<SubTypeGroup>('groups', groupId);
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
    if (!checkAdmin(group.system)) return;
    const property = getSubTypeStateAtKey<SubTypeProperty>(
      'properties',
      propertyId
    );
    if (!property) {
      dispatch(
        showSnackbar({
          message: 'Property not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    try {
      const linkId = group.properties
        ? group.properties.find((p) => p.propertyId === propertyId)?.id
        : null;
      const newOrder = group.properties
        ? group.properties
            .filter((p) => p.propertyId !== propertyId)
            .map((p) => p.propertyId)
        : [];

      if (!linkId) {
        dispatch(
          showSnackbar({
            message: 'Group-Property Link not found.',
            type: 'error',
            duration: 3000,
          })
        );
        return;
      }

      const newGroupDisplay = cloneDeep(group.display);
      delete newGroupDisplay[propertyId];

      dispatch(
        reorderGroupProperties({
          groupId,
          newOrder,
          newDisplay: newGroupDisplay,
          system: group.system,
        })
      );

      await subTypeCommands.removeGroupProperty({
        linkId,
        groupId,
        newGroupDisplay,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: groupId,
          keypath: groupId,
        })
      );
    } catch (error) {
      console.error('Error removing property from group:', error);
      dispatch(
        showSnackbar({
          message: 'Error removing property from group. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
