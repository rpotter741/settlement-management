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
import { deleteSubTypeProperty } from '@/app/commands/userSubtype.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';
import checkAdmin from '@/utility/security/checkAdmin.ts';
import { logger } from '@/utility/logging/logger.ts';
import { sysDeleteSubTypeProperty } from '@/app/commands/sysSubtype.ts';

export function deleteSubTypePropertyThunkRoot({
  propertyId,
}: {
  propertyId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const property = getSubTypeStateAtKey<SubTypeProperty>(
      'properties',
      propertyId
    );
    if (!property) {
      logger.snError(
        'If I told you it was already gone, would you believe me? Please report this bug.'
      );
      return;
    }
    if (!checkAdmin(property.system)) return;

    try {
      dispatch(
        deleteProperty({
          propertyId,
          system: property.system,
        })
      );

      if (property.system) {
        await sysDeleteSubTypeProperty({ id: propertyId });
      } else {
        await deleteSubTypeProperty({ id: propertyId });
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
        addSubTypeProperty({ properties: [property], system: property.system })
      );
      logger.snError(
        'The property wanted to say something before being obliterated. Or it bribed the server. Please report.',
        { error }
      );
    }
  };
}
