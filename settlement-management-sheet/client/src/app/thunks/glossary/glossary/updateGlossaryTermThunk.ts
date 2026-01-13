import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { updateGlossaryTerm } from '@/app/slice/glossarySlice.js';
import getPropertyLabel, {
  genrePropertyLabelDefaults,
  SubModelTypes,
} from '@/features/Glossary/utils/getPropertyLabel.js';
import getTermChangeValue from '@/features/Glossary/utils/getTermChange.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';

export default function updateGlossaryTermThunk({
  id,
  subModel,
  key,
  value,
}: {
  id: string;
  key: string;
  subModel: SubModelTypes;
  value: string | null;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
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

      const defaultValue = getPropertyLabel({
        glossary,
        key,
        subModel,
      }).label;

      const termUpdate = getTermChangeValue({
        glossaryTerms: glossary.integrationState?.[subModel] || {},
        key,
        value,
        defaultValue,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'glossary',
          id,
          keypath: `integrationState.${subModel}.${key}.label`,
        })
      );

      if (!termUpdate) {
        // If the value matches
        dispatch(
          updateGlossaryTerm({
            id,
            key,
            subModel,
            value: null, // Send null to remove the term if it matches the default
          })
        );
      } else {
        dispatch(
          updateGlossaryTerm({
            id,
            subModel,
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
