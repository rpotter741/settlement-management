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
} from '@/app/slice/subTypeSlice.js';
import addGroupToSubTypeService from '@/services/glossary/subTypes/addGroupToSubTypeService.js';
import removeGroupsFromSubTypeService from '@/services/glossary/subTypes/removeGroupFromSubTypeService.js';

export function removeGroupFromSubTypeThunk({
  subtypeId,
  linkIds,
}: {
  subtypeId: string;
  linkIds: string[];
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const subtype = state.subType.edit[subtypeId];
    if (!subtype) {
      console.error(`SubType with ID ${subtypeId} not found.`);
      return;
    }
    try {
      dispatch(removeGroupsFromSubtype({ subTypeId: subtypeId, linkIds }));

      await removeGroupsFromSubTypeService({
        linkIds,
        subtypeId,
      });

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
          message: 'Error linking subtype property. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
