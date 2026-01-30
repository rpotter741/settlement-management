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
      dispatch(
        showSnackbar({
          message: 'Tell your subtype to take off its invisibility cloak.',
          type: 'error',
        })
      );
      return;
    }
    if (!checkAdmin(subtype.system)) return;

    try {
      dispatch(
        removeGroupsFromSubtype({
          subTypeId: subtypeId,
          linkIds,
          system: subtype.system,
        })
      );

      // await removeGroupsFromSubTypeService({
      //   linkIds,
      //   subtypeId,
      // });

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subtypeId,
          keypath: subtypeId,
        })
      );
    } catch (error) {
      console.error('Error linking subtype property:', error);
      dispatch(
        showSnackbar({
          message: 'That group was stubborn and refused to be removed.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
