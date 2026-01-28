import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { GlossaryEntryType } from '../../../../../../../shared/types/index.js';
import {
  addSubTypeProperty,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import createSubTypePropertyService from '@/services/glossary/subTypes/createSubTypePropertyService.js';
import { cloneDeep } from 'lodash';
import subTypeCommands from '@/app/commands/subtype.ts';
import { GenericObject } from '../../../../../../../shared/types/common.ts';

export function addSubTypePropertyThunkRoot({
  property,
}: {
  property: SubTypeProperty;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    try {
      const customProperty = cloneDeep(property);

      customProperty.contentType = 'custom';
      dispatch(
        addSubTypeProperty({
          properties: [customProperty],
        })
      );

      // await createSubTypePropertyService({ property });
      const newProperty = await subTypeCommands.createSubTypeProperty({
        id: property.id,
        name: property.name,
        contentType: 'CUSTOM',
        createdBy: 'robbiepottsdm',
        inputType: property.inputType,
        shape: property.shape as GenericObject,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: property.id,
          keypath: `${property.id}`,
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
    }
  };
}
