import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  addSubType,
  addSubTypeGroup,
  addSubTypeProperty,
  SubType,
} from '@/app/slice/subTypeSlice.js';
import fetchSubTypeGroupsService from '@/services/glossary/subTypes/fetchSubTypeGroupsService.js';
import fetchSubTypePropertiesService from '@/services/glossary/subTypes/fetchSubTypePropertiesService.js';
import fetchSubTypesByUserId from '@/services/glossary/subTypes/fetchSubTypesByUserId.js';
import {
  getSubTypeGroups,
  getSubTypeProperties,
  getSubTypes,
} from '@/app/commands/subtype.ts';

export default function fetchAllSubTypeData(): AppThunk {
  return async (dispatch, getState) => {
    const existingSubTypes = getState().subType.edit;
    const existingGroups = getState().subType.groups.edit;
    const existingProperties = getState().subType.properties.edit;
    try {
      if (Object.keys(existingSubTypes).length === 0) {
        const subTypes = await getSubTypes({
          userId: 'robbiepottsdm',
          system: true,
        });

        subTypes.forEach((subType: SubType) => {
          if (!existingSubTypes[subType.id]) {
            dispatch(addSubType({ subType }));
          }
        });
      }

      if (Object.keys(existingGroups).length === 0) {
        const subTypeGroups = await getSubTypeGroups({
          userId: 'robbiepottsdm',
          system: true,
        });

        dispatch(addSubTypeGroup({ groups: subTypeGroups }));
      }

      if (Object.keys(existingProperties).length === 0) {
        const subTypeProperties = await getSubTypeProperties({
          userId: 'robbiepottsdm',
          system: true,
        });

        dispatch(addSubTypeProperty({ properties: subTypeProperties }));
      }
    } catch (error) {
      console.error('Error fetching subTypes:', error);
      dispatch(
        showSnackbar({
          message: 'Error fetching subTypes. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    } finally {
    }
  };
}
