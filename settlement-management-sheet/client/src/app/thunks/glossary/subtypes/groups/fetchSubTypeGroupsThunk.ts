import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addSubTypeGroup, SubTypeGroup } from '@/app/slice/subTypeSlice.js';
import subTypeCommands from '@/app/commands/subtype.ts';

export default function fetchSubTypeGroupsThunk(): AppThunk {
  return async (dispatch, getState) => {
    try {
      const existingGroups = getState().subType.groups.edit;
      if (Object.keys(existingGroups).length !== 0) {
        return;
      }
      // const groups = await fetchSubTypeGroupsService({
      //   system: true,
      // });
      const groups: SubTypeGroup[] = await subTypeCommands.getSubTypeGroups({
        userId: 'robbiepottsdm',
        system: true,
      });

      const filteredGroups = groups.filter(
        (g: SubTypeGroup) => !existingGroups[g.id]
      );

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
