import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import addSubTypeGroupPropertyService from '@/services/glossary/subTypes/addSubTypeGroupPropertyService.js';
import {
  addGroupsToSubType,
  addPropertyToGroup,
  removeGroupsFromSubtype,
  SubType,
} from '@/app/slice/subTypeSlice.js';
import addGroupToSubTypeService from '@/services/glossary/subTypes/addGroupToSubTypeService.js';
import removeGroupsFromSubTypeService from '@/services/glossary/subTypes/removeGroupFromSubTypeService.js';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import { logger } from '@/utility/logging/logger.ts';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import { sysRemoveGroupFromSubType } from '@/app/commands/sysSubtype.ts';

export function removeGroupFromSubTypeThunk({
  subtypeId,
  linkIds,
}: {
  subtypeId: string;
  linkIds: string[];
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const subtype = getSubTypeStateAtKey<SubType>('subtypes', subtypeId);
    if (!subtype) {
      logger.snError(
        "Tell your subtype to take off it's invisibility cloak, please."
      );
      return;
    }
    if (!checkAdmin(subtype.system)) return;

    try {
      if (subtype.system) {
        await sysRemoveGroupFromSubType({
          linkIds,
        });
      } else {
        await subTypeCommands.removeGroupFromSubType({
          linkIds,
        });
      }

      dispatch(
        removeGroupsFromSubtype({
          subTypeId: subtypeId,
          linkIds,
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
        'That group (or groups) refused to be removed. Please report.',
        { error }
      );
    }
  };
}
