import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '../glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '../../../services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { updateGlossary } from '@/app/slice/glossarySlice.js';

export default function updateGlossaryThunk({
  id,
  updates,
}: {
  id: string;
  updates: Record<string, any>;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      dispatch(updateGlossary({ id, updates }));
      await serverAction.updateGlossary({
        id,
        updates,
      });
    } catch (error) {
      console.error('Error updating glossary:', error);
      dispatch(
        showSnackbar({
          message: 'Error updating glossary. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
