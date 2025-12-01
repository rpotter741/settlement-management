import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import {
  addSubTypeGroup,
  reorderGroupProperties,
  SubTypeGroup,
} from '@/app/slice/subTypeSlice.js';
import { cloneDeep } from 'lodash';
import createSubTypeGroupService from '@/services/glossary/subTypes/createSubTypeGroupService.js';
import removePropertyFromGroupService from '@/services/glossary/subTypes/removePropertyFromGroupService.js';

export function removeGroupPropertyThunk({
  groupId,
  propertyId,
}: {
  groupId: string;
  propertyId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const group = state.subType.groups.edit[groupId];
    if (!group) {
      console.error(`Group with ID ${groupId} not found.`);
      return;
    }
    const property = state.subType.properties.edit[propertyId];
    if (!property) {
      console.error(`Property with ID ${propertyId} not found.`);
      return;
    }
    try {
      const linkId = group.properties
        ? group.properties.find((p) => p.propertyId === propertyId)?.id
        : null;
      const newOrder = group.properties
        ? group.properties
            .filter((p) => p.propertyId !== propertyId)
            .map((p) => p.propertyId)
        : [];

      if (!linkId) {
        console.error(
          `Link for property ID ${propertyId} not found in group ID ${groupId}.`
        );
        return;
      }

      const newGroupDisplay = cloneDeep(group.display);
      delete newGroupDisplay[linkId];

      console.log(newGroupDisplay);

      dispatch(reorderGroupProperties({ groupId, newOrder }));

      await removePropertyFromGroupService({
        linkId,
        newGroupDisplay,
        groupId,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: groupId,
          keypath: groupId,
        })
      );
    } catch (error) {
      console.error('Error removing property from group:', error);
      dispatch(
        showSnackbar({
          message: 'Error removing property from group. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
