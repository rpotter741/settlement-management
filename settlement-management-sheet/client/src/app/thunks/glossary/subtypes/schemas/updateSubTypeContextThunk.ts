import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { SubType, updateSubTypeContext } from '@/app/slice/subTypeSlice.js';
import { cloneDeep } from 'lodash';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import subTypeCommands from '@/app/commands/userSubtype.ts';
import { logger } from '@/utility/logging/logger.ts';

export function updateSubTypeContextThunk({
  subtypeId,
  context,
}: {
  subtypeId: string;
  context: string[];
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const subtype = getSubTypeStateAtKey<SubType>('subtypes', subtypeId);
    if (!subtype) {
      showSnackbar({
        message: "Can't find the subtype you're looking for.",
        type: 'error',
      });
      return;
    }
    if (!checkAdmin(subtype.system)) return;

    const oldContext = cloneDeep(subtype.context || []);

    try {
      dispatch(updateSubTypeContext({ subtypeId: subtypeId, context }));

      if (subtype.system) {
        logger.snError(
          "Um, what are you doing? System subtypes don't have context. BRUH."
        );
      } else {
        await subTypeCommands.updateSubType({
          id: subtypeId,
          context: context.join(','),
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
        updateSubTypeContext({
          subtypeId: subtypeId,
          context: oldContext,
        })
      );
      logger.snError(
        "Context is everything in a story. Too bad we couldn't save it.",
        { error }
      );
    }
  };
}
