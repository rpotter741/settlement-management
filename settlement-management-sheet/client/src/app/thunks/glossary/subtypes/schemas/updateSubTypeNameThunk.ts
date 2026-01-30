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
  updateSubTypeName,
} from '@/app/slice/subTypeSlice.js';
import addGroupToSubTypeService from '@/services/glossary/subTypes/addGroupToSubTypeService.js';
import { GenericObject } from '../../../../../../../shared/types/common.js';
import { cloneDeep } from 'lodash';
import updateSubTypeAnchorService from '@/services/glossary/subTypes/updateSubTypeAnchorService.js';
import updateSubTypeNameService from '@/services/glossary/subTypes/updateSubTypeNameService.js';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import subTypeCommands from '@/app/commands/subtype.ts';

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
      dispatch(
        showSnackbar({
          message: "Can't find the subtype. Whoops!",
          type: 'error',
        })
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

      await subTypeCommands.updateSubType({
        id: subtypeId,
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
      console.error('Error updating subtype name:', error);
      // Revert to old anchors on error
      dispatch(
        updateSubTypeName({
          subtypeId: subtypeId,
          name: oldName,
          system: subtype.system,
        })
      );
      dispatch(
        showSnackbar({
          message: "What's in a name? Can't update it, anyway.",
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
