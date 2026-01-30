import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import addSubTypeGroupPropertyService from '@/services/glossary/subTypes/addSubTypeGroupPropertyService.js';
import {
  addPropertyToGroup,
  SubTypeGroup,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import subTypeCommands from '@/app/commands/subtype.ts';
import { ulid as newId } from 'ulid';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';

export function addPropertyToGroupThunk({
  groupId,
  propertyId,
}: {
  groupId: string;
  propertyId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const group = getSubTypeStateAtKey<SubTypeGroup>('groups', groupId);
    if (!group) {
      dispatch(
        showSnackbar({
          message: 'No group found to add property to.',
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
          message: 'No property found to add to group.',
          type: 'error',
        })
      );
      return;
    }
    try {
      const order = group.properties ? group.properties.length : 0;

      const createdProperty = await subTypeCommands.createGroupProperty({
        id: newId(),
        groupId,
        propertyId,
        order,
      });

      if (!createdProperty) {
        dispatch(
          showSnackbar({
            message: 'EVERYONE PANIC! NOTHING RETURNED FROM BACKEND!',
            type: 'error',
          })
        );
        return;
      }

      dispatch(
        addPropertyToGroup({
          groupId,
          property: createdProperty,
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
