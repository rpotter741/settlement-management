import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  addSubType,
  addSubTypeGroup,
  addSubTypeProperty,
  SubType,
} from '@/app/slice/subTypeSlice.js';
import {
  getSubTypeGroups,
  getSubTypeProperties,
  getSubTypes,
} from '@/app/commands/userSubtype.ts';

let initial_load = true;

export default function fetchAllSubTypeData(): AppThunk {
  return async (dispatch, getState) => {
    if (!initial_load) return;
    const user = getState().user;
    if (!user.id) return;
    initial_load = false;
    const existingSubTypes = getState().subType.subtypes;
    const existingGroups = getState().subType.groups;
    const existingProperties = getState().subType.properties;
    try {
      /* GET THEM SUBTYPES */
      if (
        Object.keys(existingSubTypes.user.edit).length === 0 ||
        Object.keys(existingSubTypes.system.edit).length === 0
      ) {
        const subTypeMap = await getSubTypes({
          userId: user.id as string,
          system: true,
        });

        subTypeMap.system.forEach((subType: SubType) => {
          if (!existingSubTypes.system.edit[subType.id]) {
            dispatch(addSubType({ subType, system: true }));
          }
        });
        subTypeMap.user.forEach((subType: SubType) => {
          if (!existingSubTypes.user.edit[subType.id]) {
            dispatch(addSubType({ subType, system: false }));
          }
        });
      }

      /* GET THEM GROUPS */

      if (
        Object.keys(existingGroups.system.edit).length === 0 ||
        Object.keys(existingGroups.user.edit).length === 0
      ) {
        const groupMap = await getSubTypeGroups({
          userId: user.id as string,
          system: true,
        });

        dispatch(addSubTypeGroup({ groups: groupMap.system, system: true }));
        dispatch(addSubTypeGroup({ groups: groupMap.user, system: false }));
      }

      /* GET THEM PROPERTIES */

      if (
        Object.keys(existingProperties.system.edit).length === 0 ||
        Object.keys(existingProperties.user.edit).length === 0
      ) {
        const propertyMap = await getSubTypeProperties({
          userId: user.id as string,
          system: true,
        });
        dispatch(
          addSubTypeProperty({ properties: propertyMap.system, system: true })
        );
        dispatch(
          addSubTypeProperty({ properties: propertyMap.user, system: false })
        );
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
      dispatch(
        showSnackbar({
          message: 'Finished fetching subtype data.',
          type: 'info',
          duration: 2000,
        })
      );
    }
  };
}
