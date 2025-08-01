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
import { genreSectionDefaults } from '@/features/Glossary/utils/getTerm.js';
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
      console.log(glossary.integrationState.terms);
      const currentTerm = get(
        glossary.integrationState?.terms || {},
        key,
        null
      );
      if (currentTerm === value) {
        return;
      }

      if (genreSectionDefaults[genre][key] === value) {
        console.log(
          `Removing term for ${key} as it matches the default value.`
        );
        // If the value matches
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
        console.log(`Updating term for ${key} to ${value}.`);
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
