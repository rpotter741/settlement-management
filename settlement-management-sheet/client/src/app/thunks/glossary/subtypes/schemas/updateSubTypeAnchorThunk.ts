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
} from '@/app/slice/subTypeSlice.js';
import addGroupToSubTypeService from '@/services/glossary/subTypes/addGroupToSubTypeService.js';
import { GenericObject } from '../../../../../../../shared/types/common.js';
import { cloneDeep } from 'lodash';
import updateSubTypeAnchorService from '@/services/glossary/subTypes/updateSubTypeAnchorService.js';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import subTypeCommands from '@/app/commands/subtype.ts';

export function updateSubTypeAnchorThunk({
  subtypeId,
  anchors,
}: {
  subtypeId: string;
  anchors: SemanticAnchors;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const subtype = getSubTypeStateAtKey<SubType>('subtypes', subtypeId);
    if (!subtype) {
      showSnackbar({
        message: "Can't find the subtype you're looking for.",
        type: 'error',
      });
      return;
    }
    if (!checkAdmin(subtype.system)) return;

    const oldAnchors = cloneDeep(subtype.anchors || {});

    try {
      dispatch(
        updateSubTypeAnchors({
          subtypeId: subtypeId,
          anchors,
          system: subtype.system,
        })
      );

      await subTypeCommands.updateSubType({
        id: subtypeId,
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
        updateSubTypeAnchors({
          subtypeId: subtypeId,
          anchors: oldAnchors,
          system: subtype.system,
        })
      );
      dispatch(
        showSnackbar({
          message: 'Anchors keep us grounded but these are lost in the cloud.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
