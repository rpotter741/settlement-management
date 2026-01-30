import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import addSubTypeGroupPropertyService from '@/services/glossary/subTypes/addSubTypeGroupPropertyService.js';
import {
  addGroupsToSubType,
  addPropertyToGroup,
  SemanticAnchors,
  SubType,
  updateSubTypeAnchors,
  updateSubTypeContext,
  updateSubTypeName,
} from '@/app/slice/subTypeSlice.js';
import addGroupToSubTypeService from '@/services/glossary/subTypes/addGroupToSubTypeService.js';
import { GenericObject } from '../../../../../../../shared/types/common.js';
import { cloneDeep } from 'lodash';
import updateSubTypeAnchorService from '@/services/glossary/subTypes/updateSubTypeAnchorService.js';
import updateSubTypeNameService from '@/services/glossary/subTypes/updateSubTypeNameService.js';
import updateSubTypeContextService from '@/services/glossary/subTypes/updateSubTypeContextService.js';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import subTypeCommands from '@/app/commands/subtype.ts';

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

      await subTypeCommands.updateSubType({
        id: subtypeId,
        context: context.join(','),
      });

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subtypeId,
          keypath: subtypeId,
        })
      );
    } catch (error) {
      console.error('Error updating subtype context:', error);
      // Revert to old anchors on error
      dispatch(
        updateSubTypeContext({
          subtypeId: subtypeId,
          context: oldContext,
        })
      );
      dispatch(
        showSnackbar({
          message:
            "Context is everything in a story. Too bad we couldn't save it.",
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
