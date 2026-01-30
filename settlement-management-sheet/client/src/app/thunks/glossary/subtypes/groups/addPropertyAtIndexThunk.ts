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
  SubTypePropertyLink,
} from '@/app/slice/subTypeSlice.js';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import { ulid as newId } from 'ulid';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import { logger } from '@/utility/logging/logger.ts';
import {
  sysCreateGroupProperty,
  sysReorderGroupProperties,
} from '@/app/commands/sysSubtype.ts';

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
      logger.snError(
        'How did this happen? No group found to add property to.',
        {
          groupId,
          propertyId,
          dropIndex,
        }
      );
      return;
    }
    if (!checkAdmin(group.system)) return;

    const property = getSubTypeStateAtKey<SubTypeProperty>(
      'properties',
      propertyId
    );

    if (!property) {
      logger.snError(
        'How did this happen? No property found to add to group.',
        {
          groupId,
          propertyId,
          dropIndex,
        }
      );
      return;
    }
    try {
      const order = group.properties.map((p) => p.propertyId);
      order.splice(dropIndex, 0, propertyId);

      let createdProperty: SubTypePropertyLink;

      if (group.system) {
        createdProperty = await sysCreateGroupProperty({
          id: newId(),
          groupId,
          propertyId,
          order: group.properties.length,
        });
      } else {
        createdProperty = await subTypeCommands.createGroupProperty({
          id: newId(),
          groupId,
          propertyId,
          order: group.properties.length,
        });
      }

      if (!createdProperty) {
        logger.snError(
          'The binary broke or your RAM is dying! Please report this bug. (No link returned)'
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

      if (group.system) {
        await sysReorderGroupProperties({
          groupId,
          newOrder: order,
        });
      } else {
        await subTypeCommands.reorderGroupProperties({
          groupId,
          newOrder: order,
        });
      }

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
      logger.snError(
        'Error linking subtype property. Thanks for nothing, backend.',
        { error }
      );
    }
  };
}
