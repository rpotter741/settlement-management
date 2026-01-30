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
import subTypeCommands from '@/app/commands/subtype.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';

export function updateSubTypePropertyThunkRoot({
  propertyId,
  property,
  updates,
}: {
  propertyId: string;
  property: SubTypeProperty;
  updates: Partial<SubTypeProperty>;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    const oldProperty = getSubTypeStateAtKey<SubTypeProperty>(
      'properties',
      propertyId
    );
    if (!oldProperty) {
      dispatch(
        showSnackbar({
          message: 'Nope. No property found with that ID.',
          type: 'error',
        })
      );
      return;
    }
    if (!checkAdmin(oldProperty.system)) return;
    try {
      dispatch(
        updateSubTypeProperty({
          propertyId,
          property,
          system: oldProperty.system,
        })
      );

      await subTypeCommands.updateSubTypeProperty({
        id: propertyId,
        refId: updates?.refId,
        version: updates?.version,
        name: updates?.name,
        inputType: updates?.inputType,
        shape: updates?.shape,
        displayName: updates?.displayName,
        smartSync: updates?.smartSync,
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
  dispatch(
    updateSubTypePropertyThunkRoot({
      propertyId,
      property,
      updates,
    })
  );
}
