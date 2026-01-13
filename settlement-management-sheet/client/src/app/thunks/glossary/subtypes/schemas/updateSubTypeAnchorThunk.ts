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
} from '@/app/slice/subTypeSlice.js';
import addGroupToSubTypeService from '@/services/glossary/subTypes/addGroupToSubTypeService.js';
import { GenericObject } from '../../../../../../../shared/types/common.js';
import { cloneDeep } from 'lodash';
import updateSubTypeAnchorService from '@/services/glossary/subTypes/updateSubTypeAnchorService.js';

export function updateSubTypeAnchorThunk({
  subtypeId,
  anchors,
}: {
  subtypeId: string;
  anchors: SemanticAnchors;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const subtype = state.subType.edit[subtypeId];
    if (!subtype) {
      console.error(`SubType with ID ${subtypeId} not found.`);
      return;
    }
    const oldAnchors = cloneDeep(subtype.anchors || {});

    try {
      dispatch(updateSubTypeAnchors({ subtypeId: subtypeId, anchors }));

      await updateSubTypeAnchorService({
        subtypeId,
        anchors,
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
        updateSubTypeAnchors({ subtypeId: subtypeId, anchors: oldAnchors })
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
