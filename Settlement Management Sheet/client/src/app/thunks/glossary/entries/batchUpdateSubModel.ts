import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  syncEntrySubModel,
  syncGlossaryIntegrationState,
  updateGlossaryTerm,
} from '@/app/slice/glossarySlice.js';
import { get, keyBy } from 'lodash';
import getTermChangeValue from '@/features/Glossary/utils/getTermChange.js';
import { clearDirtyKeypaths } from '@/app/slice/tabSlice.js';
import { SubModelType } from '../../../../../../shared/types/index.js';

export default function batchUpdateSubModelThunk({
  glossaryId,
  subModel,
  entryId,
  tabId,
}: {
  glossaryId: string;
  subModel: SubModelType;
  entryId: string;
  tabId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const state = getState();
      const editGlossary = state.glossary.glossaries.edit.byId[glossaryId];
      const staticGlossary = state.glossary.glossaries.static.byId[glossaryId];
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
      const tab = state.tabs.left.data[tabId] || state.tabs.right.data[tabId];
      const updates = Object.keys(tab?.viewState?.dirtyKeypaths || {})
        .map((keypath) => {
          if (!keypath.startsWith(`entries.${entryId}.${subModel}.`)) {
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

      if (updates.length > 0) {
        const structuredUpdates: Record<string, any> = {};
        updates.forEach((change) => {
          const { key, value } = change;
          structuredUpdates[key] = value;
        });
        await serverAction.updateEntrySubModel({
          id: entryId,
          subModel,
          updates: structuredUpdates,
        });
        dispatch(
          clearDirtyKeypaths({ tabId, key: `entries.${entryId}.${subModel}` })
        );
        dispatch(syncEntrySubModel({ glossaryId, entryId, subModel }));
      }
    } catch (error) {
      dispatch(
        showSnackbar({
          message: 'Error updating glossary entry. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
