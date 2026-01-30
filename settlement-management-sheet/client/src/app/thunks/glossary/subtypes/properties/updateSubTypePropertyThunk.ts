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
import subTypeCommands from '@/app/commands/userSubtype.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import { logger } from '@/utility/logging/logger.ts';
import { sysUpdateSubTypeProperty } from '@/app/commands/sysSubtype.ts';

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
          message: 'KNOCK KNOCK.',
          type: 'info',
        })
      );
      dispatch(
        showSnackbar({
          message: "Who's there?",
          type: 'warning',
        })
      );
      logger.snError('Not your property, apparently. Please report this bug.');
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

      if (oldProperty.system) {
        await sysUpdateSubTypeProperty({
          id: propertyId,
          name: updates?.name,
          inputType: updates?.inputType,
          shape: updates?.shape,
          displayName: updates?.displayName,
          smartSync: updates?.smartSync,
        });
      } else {
        await subTypeCommands.updateSubTypeProperty({
          id: propertyId,
          name: updates?.name,
          inputType: updates?.inputType,
          shape: updates?.shape,
          displayName: updates?.displayName,
          smartSync: updates?.smartSync,
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
      dispatch(
        updateSubTypeProperty({
          propertyId,
          property: oldProperty,
          system: oldProperty.system,
        })
      );
      logger.snError(
        'You have every right to be disappointed in the server. I am too. Please report.',
        { error }
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
