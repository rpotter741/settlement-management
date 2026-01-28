import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  syncGlossaryIntegrationState,
  updateGlossaryTerm,
} from '@/app/slice/glossarySlice.js';
import { get } from 'lodash';
import { Genre } from 'types/index.js';
import { clearDirtyKeypaths } from '@/app/slice/dirtySlice.js';
import { SubModelTypes } from '@/features/Glossary/utils/getPropertyLabel.js';
import { invoke } from '@tauri-apps/api/core';

function decipherGlossTermKeypathUpdate(keypath: string, value: any) {
  const splitKeypath = keypath.split('.');
  const subModel = splitKeypath[1];
  const termKey = splitKeypath[2];
  const updateType = splitKeypath[3];
  const visibilityKey = splitKeypath[4] || null;
  return {
    subModel,
    termKey,
    visibilityKey,
    updateType,
    value,
  };
}

export default function batchGlossaryTermsThunk({
  id,
}: {
  id: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const state = getState();
      const editGlossary = state.glossary.glossaries.edit.byId[id];
      const staticGlossary = state.glossary.glossaries.static.byId[id];
      const dirtyState = state.dirty.glossary[id]?.dirtyKeypaths ?? {};
      const updates = Object.keys(dirtyState || {})
        .map((keypath) => {
          if (!keypath.startsWith('integrationState')) {
            return null; // Skip non-term keypaths
          }
          const staticValue = get(staticGlossary, keypath);
          const editValue = get(editGlossary, keypath);
          console.log(
            staticValue,
            editValue,
            'values in batch update for keypath:',
            keypath
          );
          if (editValue === undefined) {
            return decipherGlossTermKeypathUpdate(keypath, null);
          } else if (staticValue !== editValue) {
            return decipherGlossTermKeypathUpdate(keypath, editValue);
          } else if (staticValue === editValue) {
            return null;
          }
        })
        .filter((update) => update !== null && update !== undefined) as Array<{
        subModel: SubModelTypes;
        termKey: string;
        visibilityKey: string | null;
        value: any;
      }>;

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
      if (updates.length > 0) {
        try {
          // await serverAction.batchUpdateTerms({
          //   id,
          //   updates,
          // });
          await invoke('update_glossary', {
            id,
            input: { integrationState: editGlossary.integrationState },
          });
          dispatch(clearDirtyKeypaths({ scope: 'glossary', id }));
          dispatch(syncGlossaryIntegrationState({ id }));
        } catch (error) {
          console.error('Error updating glossary terms:', error);
          dispatch(
            showSnackbar({
              message: 'Error updating glossary terms. Try again later.',
              type: 'error',
              duration: 3000,
            })
          );
        }
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
