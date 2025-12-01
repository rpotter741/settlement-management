import { createDefaultProperty } from '@/app/dispatches/glossary/SubTypePropertyTransformations.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  SubTypeProperty,
  SubTypePropertyTypes,
  updateSubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import { RootState } from '@/app/store.js';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import updateSubTypePropertyService from '@/services/glossary/subTypes/updateSubTypePropertyService.js';
import { cloneDeep } from 'lodash';
import { ThunkDispatch } from 'redux-thunk';

export function createDefaultPropertyThunk({
  propertyId,
  propertyType,
  name,
}: {
  propertyId: string;
  propertyType: SubTypePropertyTypes;
  name: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const state = getState();
    const oldProperty = cloneDeep(state.subType.properties.edit[propertyId]);
    try {
      const property = createDefaultProperty(propertyType, name, propertyId);
      if (!property) return;

      dispatch(
        updateSubTypeProperty({
          propertyId,
          property,
        })
      );

      const updates: Partial<SubTypeProperty> = {};
      updates.inputType = property.inputType;
      updates.shape = property.shape;

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
      console.error('Error creating subtype property:', error);
      dispatch(
        showSnackbar({
          message: 'Error creating subtype property. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
      dispatch(
        updateSubTypeProperty({
          propertyId,
          property: oldProperty,
        })
      );
    }
  };
}
