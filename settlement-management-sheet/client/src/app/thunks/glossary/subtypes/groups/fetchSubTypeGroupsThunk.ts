import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import serverAction from '@/services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  addSubType,
  addSubTypeGroup,
  addSubTypeProperty,
  SubType,
  SubTypeGroup,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import fetchSubTypeGroupsService from '@/services/glossary/subTypes/fetchSubTypeGroupsService.js';

export default function fetchSubTypeGroupsThunk(): AppThunk {
  return async (dispatch, getState) => {
    try {
      const existingGroups = getState().subType.groups.edit;
      if (Object.keys(existingGroups).length !== 0) {
        return;
      }
      const groups = await fetchSubTypeGroupsService({
        system: true,
      });

      const filteredGroups = groups.filter(
        (g: SubTypeGroup) => !existingGroups[g.id]
      );

      console.log(groups);

      dispatch(addSubTypeGroup({ groups: filteredGroups }));
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
