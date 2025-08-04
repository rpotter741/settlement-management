import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  syncGlossaryTerms,
  updateGlossaryTerm,
} from '@/app/slice/glossarySlice.js';
import { get } from 'lodash';
import { Genre } from '@/components/shared/Metadata/GenreSelect.js';
import {
  genrePropertyLabelDefaults,
  SubSectionTypes,
} from '@/features/Glossary/utils/getPropertyLabel.js';
import getTermChangeValue from '@/features/Glossary/utils/getTermChange.js';
import { clearDirtyKeypaths } from '@/app/slice/tabSlice.js';

export default function batchGlossaryTermsThunk({
  id,
  genre,
  tabId,
}: {
  id: string;
  genre: Genre;
  tabId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const state = getState();
      const editGlossary = state.glossary.glossaries.edit.byId[id];
      const staticGlossary = state.glossary.glossaries.static.byId[id];
      const tab = state.tabs.left.data[tabId] || state.tabs.right.data[tabId];
      const updates = Object.keys(tab?.viewState?.dirtyKeypaths || {})
        .map((keypath) => {
          if (!keypath.startsWith('integrationState.terms.')) {
            return null; // Skip non-term keypaths
          }
          const staticValue = get(staticGlossary, keypath);
          const editValue = get(editGlossary, keypath);
          const key = keypath.split('.').pop();
          if (editValue === undefined) {
            return {
              key,
              value: null,
            };
          } else if (staticValue !== editValue) {
            return {
              key,
              value: editValue,
            };
          } else if (staticValue === editValue) {
            return null;
          }
        })
        .filter(
          (update): update is { key: string; value: any } => update !== null
        );

      if (!staticGlossary || !editGlossary) {
        dispatch(
          showSnackbar({
            message: 'Glossary not found.',
            type: 'error',
            duration: 3000,
          })
        );
        return;
      }
      console.log('Batch updates:', updates);
      if (updates.length > 0) {
        await serverAction.batchUpdateTerms({
          id,
          updates,
        });
        dispatch(clearDirtyKeypaths({ tabId, key: 'integrationState' }));
        dispatch(syncGlossaryTerms({ id }));
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
