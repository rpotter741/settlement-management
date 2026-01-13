import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { GlossaryEntryType } from '../../../../../../../shared/types/index.js';
import { dispatch } from '@/app/constants.js';
import {
  addSubTypeProperty,
  deleteProperty,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import deleteSubTypePropertyService from '@/services/glossary/subTypes/deleteSubTypePropertyService.js';

export function deleteSubTypePropertyThunkRoot({
  propertyId,
}: {
  propertyId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const property = state.subType.properties.edit[propertyId];
    if (!property) {
      dispatch(
        showSnackbar({
          message: 'Property not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    try {
      dispatch(
        deleteProperty({
          propertyId,
        })
      );

      deleteSubTypePropertyService({ propertyId });

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: propertyId,
          keypath: `${propertyId}`,
        })
      );
    } catch (error) {
      dispatch(addSubTypeProperty({ properties: [property] }));
      dispatch(
        showSnackbar({
          message: 'Error removing property. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
