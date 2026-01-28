import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import serverAction from '@/services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  addSubType,
  addSubTypeProperty,
  SubType,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import fetchSubTypePropertiesService from '@/services/glossary/subTypes/fetchSubTypePropertiesService.js';
import { getSubTypeProperties } from '@/app/commands/subtype.ts';

export default function fetchSubTypePropertiesThunk(): AppThunk {
  return async (dispatch, getState) => {
    try {
      const existingProperties = getState().subType.properties.edit;
      if (Object.keys(existingProperties).length !== 0) {
        return;
      }
      // const properties = await fetchSubTypePropertiesService({
      //   system: true,
      // });

      const properties: SubTypeProperty[] = await getSubTypeProperties({
        userId: 'robbiepottsdm',
        system: true,
      });

      const filteredProperties = properties.filter(
        (p: SubTypeProperty) => !existingProperties[p.id]
      );

      dispatch(addSubTypeProperty({ properties: filteredProperties }));
    } catch (error) {
      console.error('Error fetching subTypes:', error);
      dispatch(
        showSnackbar({
          message: 'Error fetching subTypes. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
