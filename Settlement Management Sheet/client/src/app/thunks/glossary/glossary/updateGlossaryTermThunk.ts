import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';

import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  updateGlossary,
  updateGlossaryTerm,
} from '@/app/slice/glossarySlice.js';
import { GenericObject } from '../../../../../../shared/types/common.js';
import { get } from 'lodash';
import { genreDefaults } from '@/features/Glossary/utils/getTerm.js';
import { Genre } from '@/components/shared/Metadata/GenreSelect.js';

export default function updateGlossaryTermThunk({
  id,
  genre,
  key,
  value,
}: {
  id: string;
  genre: Genre;
  key: string;
  value: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const state = getState();
      const glossary = state.glossary.glossaries[id];
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
      if (genreDefaults[genre][key] === value) {
        dispatch(
          updateGlossaryTerm({
            id,
            key,
            value: null, // Send null to remove the term if it matches the default
          })
        );
        await serverAction.updateGlossaryTerm({
          id,
          key,
          value: null, // Send null to remove the term
        });
      } else {
        dispatch(
          updateGlossaryTerm({
            id,
            key,
            value,
          })
        );
        await serverAction.updateGlossaryTerm({
          id,
          key,
          value,
        });
      }
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
