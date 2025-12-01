import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import {
  SubTypeProperty,
  updateSubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import updateSubTypePropertyService from '@/services/glossary/subTypes/updateSubTypePropertyService.js';

export function updateSubTypePropertyThunkRoot({
  propertyId,
  property,
  updates,
}: {
  propertyId: string;
  property: SubTypeProperty;
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
        updateSubTypeProperty({
          propertyId,
          property,
        })
      );

      await updateSubTypePropertyService({
        propertyId,
        updates,
      });

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

export default function updateSubTypePropertyThunk({
  propertyId,
  property,
  updates,
}: {
  propertyId: string;
  property: SubTypeProperty;
  updates: Partial<SubTypeProperty>;
}) {
  console.log(property);
  dispatch(
    updateSubTypePropertyThunkRoot({
      propertyId,
      property,
      updates,
    })
  );
}
