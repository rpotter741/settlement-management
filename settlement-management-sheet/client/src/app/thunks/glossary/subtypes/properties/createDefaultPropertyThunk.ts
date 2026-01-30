import subTypeCommands from '@/app/commands/subtype.ts';
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
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
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
    const oldProperty = cloneDeep(
      getSubTypeStateAtKey<SubTypeProperty>('properties', propertyId)
    );
    if (!oldProperty) {
      dispatch(
        showSnackbar({
          message: "Ope, no old property found. Can't do it!",
          type: 'error',
        })
      );
      return;
    }
    if (!checkAdmin(oldProperty.system)) return;
    try {
      const property = createDefaultProperty(
        propertyType,
        name,
        propertyId,
        oldProperty.system
      );
      if (!property) return;

      dispatch(
        updateSubTypeProperty({
          propertyId,
          property,
          system: oldProperty.system,
        })
      );

      await subTypeCommands.updateSubTypeProperty({
        id: propertyId,
        inputType: property.inputType,
        shape: property.shape,
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
          system: oldProperty.system,
        })
      );
    }
  };
}
