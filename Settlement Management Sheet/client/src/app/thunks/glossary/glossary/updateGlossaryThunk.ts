import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';

import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { updateGlossary } from '@/app/slice/glossarySlice.js';
import { GenericObject } from '../../../../../../shared/types/common.js';
import { get } from 'lodash';

export default function updateGlossaryThunk({
  id,
  updates,
}: {
  id: string;
  updates: Record<string, any>;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const trueUpdates: GenericObject = {};
      const state = getState();
      const glossary = state.glossary.glossaries.edit.byId[id];
      if (!glossary) {
        dispatch(
          showSnackbar({
            message: 'Glossary not found.',
            type: 'error',
            duration: 3000,
          })
        );
        return;
      }
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (get(glossary, key) !== value) {
            trueUpdates[key] = value;
          } else {
            console.warn(`No change for ${key}, skipping update.`);
          }
        }
      });
      if (Object.keys(trueUpdates).length === 0) {
        dispatch(
          showSnackbar({
            message: 'No updates provided.',
            type: 'warning',
            duration: 3000,
          })
        );
        return;
      }
      console.log('Updating glossary with:', trueUpdates);
      dispatch(updateGlossary({ id, updates: trueUpdates }));
      const newGlossary = await serverAction.updateGlossary({
        id,
        updates: trueUpdates,
      });
      console.log(newGlossary);
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
