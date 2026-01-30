import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import addSubTypeGroupPropertyService from '@/services/glossary/subTypes/addSubTypeGroupPropertyService.js';
import {
  addGroupsToSubType,
  addPropertyToGroup,
  SubType,
  SubTypeGroup,
} from '@/app/slice/subTypeSlice.js';
import addGroupToSubTypeService from '@/services/glossary/subTypes/addGroupToSubTypeService.js';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';

export function addGroupToSubTypeThunk({
  groupId,
  subtypeId,
}: {
  groupId: string;
  subtypeId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const group = getSubTypeStateAtKey<SubTypeGroup>('groups', groupId);
    if (!group) {
      dispatch(
        showSnackbar({
          message: 'Group not found. Did it wander off?',
          type: 'error',
        })
      );
      return;
    }
    const subtype = getSubTypeStateAtKey<SubType>('subtypes', subtypeId);
    if (!subtype) {
      dispatch(
        showSnackbar({
          message:
            'Subtype not found. Did it take a wrong turn? Did... did I lose it?',
          type: 'error',
        })
      );
      return;
    }
    if (!checkAdmin(subtype.system)) return;
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
        addGroupsToSubType({
          subTypeId: subtypeId,
          groups: [groupLink],
          system: subtype.system,
        })
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
