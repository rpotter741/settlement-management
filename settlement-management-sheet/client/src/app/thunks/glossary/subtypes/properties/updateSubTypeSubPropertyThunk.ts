import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import {
  SubTypeProperty,
  updateSubTypeProperty,
  updateSubTypeSubProperty,
} from '@/app/slice/subTypeSlice.js';
import updateSubTypePropertyService from '@/services/glossary/subTypes/updateSubTypePropertyService.js';

export function updateSubTypeSubPropertyThunkRoot({
  propertyId,
  property,
  side,
  updates,
}: {
  propertyId: string;
  property: SubTypeProperty;
  side: 'left' | 'right';
  updates: Partial<SubTypeProperty>;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const oldProperty = state.subType.properties.edit[propertyId];
    if (!oldProperty) {
      dispatch(
        showSnackbar({
          message: 'SubType not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    try {
      dispatch(
        updateSubTypeSubProperty({
          propertyId,
          property,
          side,
        })
      );

      // await updateSubTypePropertyService({
      //   propertyId,
      //   updates,
      // });

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: propertyId,
          keypath: `${propertyId}`,
        })
      );
    } catch (error) {
      console.error('Error updating subtype property:', error);
      dispatch(
        showSnackbar({
          message: 'Error updating subtype property. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}

export default function updateSubTypeSubPropertyThunk({
  propertyId,
  property,
  side,
  updates,
}: {
  propertyId: string;
  property: SubTypeProperty;
  side: 'left' | 'right';
  updates: Partial<SubTypeProperty>;
}) {
  dispatch(
    updateSubTypeSubPropertyThunkRoot({
      propertyId,
      property,
      side,
      updates,
    })
  );
}
