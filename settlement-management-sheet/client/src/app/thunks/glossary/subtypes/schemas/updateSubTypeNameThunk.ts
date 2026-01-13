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
  updateSubTypeName,
} from '@/app/slice/subTypeSlice.js';
import addGroupToSubTypeService from '@/services/glossary/subTypes/addGroupToSubTypeService.js';
import { GenericObject } from '../../../../../../../shared/types/common.js';
import { cloneDeep } from 'lodash';
import updateSubTypeAnchorService from '@/services/glossary/subTypes/updateSubTypeAnchorService.js';
import updateSubTypeNameService from '@/services/glossary/subTypes/updateSubTypeNameService.js';

export function updateSubTypeNameThunk({
  subtypeId,
  name,
}: {
  subtypeId: string;
  name: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const subtype = state.subType.edit[subtypeId];
    if (!subtype) {
      console.error(`SubType with ID ${subtypeId} not found.`);
      return;
    }
    const oldName = cloneDeep(subtype.name || '');

    try {
      dispatch(updateSubTypeName({ subtypeId: subtypeId, name }));

      await updateSubTypeNameService({
        subtypeId,
        name,
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
        updateSubTypeName({
          subtypeId: subtypeId,
          name: oldName,
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
