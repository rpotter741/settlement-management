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
import subTypeCommands from '@/app/commands/userSubtype.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import { logger } from '@/utility/logging/logger.ts';
import { sysRemoveGroupProperty } from '@/app/commands/sysSubtype.ts';

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
      logger.snError(
        "Take my eyes but not the group! They must not be working anyway, because I can't find that group. Please report this bug."
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
        "Put out an APB on that property! It's on the run (because I can't find it). Please report this bug."
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
        logger.snError(
          "They must be soul mates because that link is invisible. I can't find it. Please report this bug."
        );
        return;
      }

      const newGroupDisplay = cloneDeep(group.display);
      delete newGroupDisplay[propertyId];

      if (group.system) {
        await sysRemoveGroupProperty({
          linkId,
          groupId,
          newGroupDisplay,
        });
      } else {
        await subTypeCommands.removeGroupProperty({
          linkId,
          groupId,
          newGroupDisplay,
        });
      }

      dispatch(
        reorderGroupProperties({
          groupId,
          newOrder,
          newDisplay: newGroupDisplay,
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
        "Success is overrated! At least, that's what the server says. It rejected our request to remove that property. Please report.",
        { error }
      );
    }
  };
}
