import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import serverAction from '@/services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addSubType, SubType } from '@/app/slice/subTypeSlice.js';

export default function fetchSubTypesByUserIdThunk(): AppThunk {
  return async (dispatch, getState) => {
    try {
      const existingSubTypes = getState().subType.edit;
      if (Object.keys(existingSubTypes).length !== 0) {
        return;
      }
      const subTypes = await serverAction.fetchSubTypesByUserId({
        system: true,
      });

      subTypes.forEach((subType: SubType) => {
        if (!existingSubTypes[subType.id]) {
          dispatch(addSubType({ subType }));
        }
      });
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
