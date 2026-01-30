import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import {
  addGroupsToSubType,
  SubType,
  SubTypeGroup,
  SubTypeGroupLink,
} from '@/app/slice/subTypeSlice.js';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import { sysAddGroupToSubType } from '@/app/commands/sysSubtype.ts';
import { ulid as newId } from 'ulid';
import { addGroupToSubType } from '@/app/commands/userSubtype.ts';
import { logger } from '@/utility/logging/logger.ts';

export function addGroupToSubTypeThunk({
  groupId,
  subtypeId,
}: {
  groupId: string;
  subtypeId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    const group = getSubTypeStateAtKey<SubTypeGroup>('groups', groupId);
    if (!group) {
      logger.snError('Group not found. Did it wander off?', {
        groupId,
        subtypeId,
      });
      return;
    }
    const subtype = getSubTypeStateAtKey<SubType>('subtypes', subtypeId);
    if (!subtype) {
      logger.snError(
        'Subtype not found. Did it take a wrong turn? Did... did I lose it?',
        {
          groupId,
          subtypeId,
        }
      );
      return;
    }
    if (!checkAdmin(subtype.system)) return;
    try {
      const order = subtype.groups ? subtype.groups.length : 0;

      let resultLink: SubTypeGroupLink;
      if (subtype.system) {
        resultLink = await sysAddGroupToSubType({
          id: newId(),
          groupId,
          subtypeId,
          order,
        });
      } else {
        resultLink = await addGroupToSubType({
          id: newId(),
          groupId,
          subtypeId,
          order,
        });
      }

      if (!resultLink) {
        logger.snError("We've been ghosted by the server! No link returned!", {
          groupId,
          subtypeId,
        });
      }

      dispatch(
        addGroupsToSubType({
          subTypeId: subtypeId,
          groups: [resultLink],
          system: subtype.system,
        })
      );

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subtypeId,
          keypath: subtypeId,
        })
      );
    } catch (error) {
      logger.snError(
        'Dare I say it? An error hath occurred! (Failed to link group to subtype)',
        { error }
      );
    }
  };
}
