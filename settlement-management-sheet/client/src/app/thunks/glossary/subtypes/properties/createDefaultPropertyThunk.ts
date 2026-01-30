import { sysUpdateSubTypeProperty } from '@/app/commands/sysSubtype.ts';
import subTypeCommands from '@/app/commands/userSubtype.ts';
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
import { logger } from '@/utility/logging/logger.ts';
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
      logger.snError(
        'Ope! Property must be playing hide and seek! Please report this bug.'
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
      if (oldProperty.system) {
        await sysUpdateSubTypeProperty({
          id: propertyId,
          inputType: property.inputType,
          shape: property.shape,
        });
      } else {
        await subTypeCommands.updateSubTypeProperty({
          id: propertyId,
          inputType: property.inputType,
          shape: property.shape,
        });
      }

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: propertyId,
          keypath: `${propertyId}`,
        })
      );
    } catch (error) {
      logger.snError(
        "Well, this is awkward. The server has an 'opinion' and said 'no' to our request. Please report.",
        { error }
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
