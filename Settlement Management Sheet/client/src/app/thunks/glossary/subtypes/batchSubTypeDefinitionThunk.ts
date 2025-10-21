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
import { Genre, GlossaryEntryType } from 'types/index.js';
import { clearDirtyKeypaths } from '@/app/slice/dirtySlice.js';
import { SubModelTypes } from '@/features/Glossary/utils/getPropertyLabel.js';

function decipherSubTypeKeypathUpdate(keypath: string, value: any) {
  const splitKeypath = keypath.split('.');

  if (keypath.includes('left') || keypath.includes('right')) {
    return console.log('thats a compound bitch!');
  }

  const type = splitKeypath[1];
  const subTypeId = splitKeypath[2];
  const groupId = splitKeypath[3];
  const propertyId = splitKeypath[5] || null;
  const propertyKeypath = splitKeypath.slice(6).join('.');
  return {
    type,
    subTypeId,
    groupId,
    propertyId,
    propertyKeypath,
    value,
  };
}

export default function batchSubTypeDefinitionThunk({
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
          if (!keypath.startsWith('subTypes')) {
            console.log('skipping keypath:', keypath);
            return null; // Skip non-subType keypaths
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
            return null;
          } else if (staticValue !== editValue) {
            return decipherSubTypeKeypathUpdate(keypath, editValue);
          } else if (staticValue === editValue) {
            return null;
          }
        })
        .filter(
          (update) => update !== null && update !== undefined
        ) as unknown as Array<{
        type: GlossaryEntryType;
        subTypeId: string;
        groupId: string;
        propertyId: string | null;
        propertyKeypath: string;
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
          dispatch(
            clearDirtyKeypaths({ scope: 'glossary', key: 'subTypes', id })
          );
          console.log(updates, 'updates');
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
