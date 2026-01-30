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
import subTypeCommands from '@/app/commands/userSubtype.ts';
import { ulid as newId } from 'ulid';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import { logger } from '@/utility/logging/logger.ts';
import { sysReorderGroupProperties } from '@/app/commands/sysSubtype.ts';

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
      logger.snError(
        "You try reordering nothing. Yeah! It's hard! (Also, I'm sorry please report)"
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
        "Reordering the void again? The property doesn't exist. Please report this bug."
      );
      return;
    }
    try {
      const order = group.properties.map((p) =>
        p.propertyId === propertyId ? null : p.propertyId
      );
      const filtered = order.filter((pid) => pid !== null) as string[];
      filtered.splice(dropIndex, 0, propertyId);

      if (group.system) {
        await sysReorderGroupProperties({
          groupId,
          newOrder: filtered,
        });
      } else {
        await subTypeCommands.reorderGroupProperties({
          groupId,
          newOrder: filtered,
        });
      }

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
      logger.snError(
        'Sometimes bad things happen to good people. The server rejected our request to reorder that property. Please report.',
        { error }
      );
    }
  };
}
