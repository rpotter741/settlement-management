import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { reorderGroupProperties } from '@/app/slice/subTypeSlice.js';
import reorderGroupPropertiesService from '@/services/glossary/subTypes/reorderGroupPropertiesService.js';

export function reorderGroupPropertiesThunk({
  groupId,
  newOrder,
}: {
  groupId: string;
  newOrder: string[];
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const group = state.subType.groups.edit[groupId];
    if (!group) {
      console.error(`Group with ID ${groupId} not found.`);
      return;
    }
    try {
      // Reorder properties in the group locally
      console.log(newOrder);
      dispatch(reorderGroupProperties({ groupId, newOrder }));

      //call the service to persist the new order
      await reorderGroupPropertiesService({ groupId, newOrder });

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: groupId,
          keypath: groupId,
        })
      );
    } catch (error) {
      console.error('Error reordering subtype properties:', error);
      dispatch(
        showSnackbar({
          message: 'Error reordering subtype properties. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
