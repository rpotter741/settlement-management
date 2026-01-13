import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import addSubTypeGroupPropertyService from '@/services/glossary/subTypes/addSubTypeGroupPropertyService.js';
import {
  addGroupsToSubType,
  addPropertyToGroup,
} from '@/app/slice/subTypeSlice.js';
import addGroupToSubTypeService from '@/services/glossary/subTypes/addGroupToSubTypeService.js';

export function addGroupToSubTypeThunk({
  groupId,
  subtypeId,
}: {
  groupId: string;
  subtypeId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const group = state.subType.groups.edit[groupId];
    if (!group) {
      console.error(`Group with ID ${groupId} not found.`);
      return;
    }
    const subtype = state.subType.edit[subtypeId];
    if (!subtype) {
      console.error(`SubType with ID ${subtypeId} not found.`);
      return;
    }
    try {
      const order = subtype.groups ? subtype.groups.length : 0;

      const { groupLink } = await addGroupToSubTypeService({
        groupId,
        subtypeId,
        order,
      });

      if (!groupLink) {
        throw new Error('No created group returned from service.');
      }

      dispatch(
        addGroupsToSubType({ subTypeId: subtypeId, groups: [groupLink] })
      );

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
