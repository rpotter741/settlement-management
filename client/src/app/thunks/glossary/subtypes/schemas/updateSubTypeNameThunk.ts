import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { SubType, updateSubTypeName } from '@/app/slice/subTypeSlice.js';
import { cloneDeep } from 'lodash';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import { logger } from '@/utility/logging/logger.ts';
import { sysUpdateSubType } from '@/app/commands/sysSubtype.ts';

export function updateSubTypeNameThunk({
  subtypeId,
  name,
}: {
  subtypeId: string;
  name: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const subtype = getSubTypeStateAtKey<SubType>('subtypes', subtypeId);
    if (!subtype) {
      logger.snError(
        "It's not working and this is like... my 60th error message today. Subtype gone, alright? Please report."
      );
      return;
    }
    if (!checkAdmin(subtype.system)) return;
    const oldName = cloneDeep(subtype.name || '');

    try {
      dispatch(
        updateSubTypeName({
          subtypeId: subtypeId,
          name,
          system: subtype.system,
        })
      );

      if (subtype.system) {
        await sysUpdateSubType({
          id: subtypeId,
          name,
        });
      } else {
        await subTypeCommands.updateSubType({
          id: subtypeId,
          name,
        });
      }

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subtypeId,
          keypath: subtypeId,
        })
      );
    } catch (error) {
      dispatch(
        updateSubTypeName({
          subtypeId: subtypeId,
          name: oldName,
          system: subtype.system,
        })
      );
      logger.snError("What's in a name? Can't update it, anyway.", { error });
    }
  };
}
