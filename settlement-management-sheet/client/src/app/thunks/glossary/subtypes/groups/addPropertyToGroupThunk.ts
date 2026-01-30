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
  SubTypePropertyLink,
} from '@/app/slice/subTypeSlice.js';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import { ulid as newId } from 'ulid';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import { sysCreateGroupProperty } from '@/app/commands/sysSubtype.ts';
import { logger } from '@/utility/logging/logger.ts';

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
      logger.snError(
        "What is this, math? I can't add a something to nothing! (No group found)"
      );
      return;
    }
    if (!checkAdmin(group.system)) return;
    const property = getSubTypeStateAtKey<SubTypeProperty>(
      'properties',
      propertyId
    );
    if (!property) {
      logger.snError('Hard to add nothing to something! (No property found)');
      return;
    }
    try {
      const order = group.properties ? group.properties.length : 0;

      let createdProperty: SubTypePropertyLink;
      if (group.system) {
        createdProperty = await sysCreateGroupProperty({
          id: newId(),
          groupId,
          propertyId,
          order,
        });
      } else {
        createdProperty = await subTypeCommands.createGroupProperty({
          id: newId(),
          groupId,
          propertyId,
          order,
        });
      }

      if (!createdProperty) {
        logger.snError('EVERYONE PANIC! NOTHING RETURNED FROM BACKEND!');
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
      logger.snError(
        "Couldn't add that property to the group. The server is being difficult.",
        { error }
      );
    }
  };
}
