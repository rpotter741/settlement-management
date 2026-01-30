import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addSubTypeGroup, SubTypeGroup } from '@/app/slice/subTypeSlice.js';
import subTypeCommands from '@/app/commands/subtype.ts';

export default function fetchSubTypeGroupsThunk(): AppThunk {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const systemGroups = state.subType.groups.system.edit;
      const userGroups = state.subType.groups.user.edit;
      // don't think we want or need this check
      // if (
      //   Object.keys(systemGroups).length !== 0 &&
      //   Object.keys(userGroups).length !== 0
      // ) {
      //   return;
      // }

      const groups: { system: SubTypeGroup[]; user: SubTypeGroup[] } =
        await subTypeCommands.getSubTypeGroups({
          userId: 'robbiepottsdm',
          system: true,
        });

      const filterSystem = groups.system.filter(
        (g: SubTypeGroup) => !systemGroups[g.id]
      );

      const filterUser = groups.user.filter(
        (g: SubTypeGroup) => !userGroups[g.id]
      );
      dispatch(addSubTypeGroup({ system: true, groups: filterSystem }));
      dispatch(addSubTypeGroup({ system: false, groups: filterUser }));
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
