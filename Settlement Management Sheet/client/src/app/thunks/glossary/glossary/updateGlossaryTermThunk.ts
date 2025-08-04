import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { updateGlossaryTerm } from '@/app/slice/glossarySlice.js';
import { Genre } from '@/components/shared/Metadata/GenreSelect.js';
import {
  genrePropertyLabelDefaults,
  SubSectionTypes,
} from '@/features/Glossary/utils/getPropertyLabel.js';
import getTermChangeValue from '@/features/Glossary/utils/getTermChange.js';
import { addDirtyKeypath } from '@/app/slice/tabSlice.js';

export default function updateGlossaryTermThunk({
  id,
  genre,
  section,
  key,
  value,
  tabId,
}: {
  id: string;
  genre: Genre;
  key: string;
  section: SubSectionTypes;
  value: string | null;
  tabId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const state = getState();
      const glossary = state.glossary.glossaries.edit.byId[id];
      const tab = state.tabs.left.data[tabId] || state.tabs.right.data[tabId];
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

      const termUpdate = getTermChangeValue({
        glossaryTerms: glossary.integrationState?.terms || {},
        key,
        value,
        defaultValue: genrePropertyLabelDefaults[genre][section][key],
      });

      dispatch(
        addDirtyKeypath({
          tabId: tab.tabId,
          keypath: `integrationState.terms.${key}`,
        })
      );

      if (!termUpdate) {
        // If the value matches
        dispatch(
          updateGlossaryTerm({
            id,
            key,
            value: null, // Send null to remove the term if it matches the default
          })
        );
      } else {
        dispatch(
          updateGlossaryTerm({
            id,
            key: termUpdate.key,
            value: termUpdate.value,
          })
        );
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
