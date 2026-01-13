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

export function updateSubTypeContextThunk({
  subtypeId,
  context,
}: {
  subtypeId: string;
  context: string[];
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const subtype = state.subType.edit[subtypeId];
    if (!subtype) {
      console.error(`SubType with ID ${subtypeId} not found.`);
      return;
    }
    const oldContext = cloneDeep(subtype.context || []);

    try {
      dispatch(updateSubTypeContext({ subtypeId: subtypeId, context }));

      await updateSubTypeContextService({
        subtypeId,
        context,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subtypeId,
          keypath: subtypeId,
        })
      );
    } catch (error) {
      console.error('Error updating subtype anchors:', error);
      // Revert to old anchors on error
      dispatch(
        updateSubTypeContext({
          subtypeId: subtypeId,
          context: oldContext,
        })
      );
      dispatch(
        showSnackbar({
          message: 'Error updating semantic anchors. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
