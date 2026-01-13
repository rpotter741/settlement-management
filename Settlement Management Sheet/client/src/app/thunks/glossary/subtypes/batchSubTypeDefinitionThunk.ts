import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { cloneDeep, get } from 'lodash';
import { GlossaryEntryType } from 'types/index.js';
import { clearDirtyKeypaths } from '@/app/slice/dirtySlice.js';
import updateSubTypeDefinition from '@/services/glossary/subTypes/batchUpdateSubType.js';

function decipherSubTypeKeypathUpdate(
  keypath: string,
  value: any
): {
  subTypeId: string;
  keypath: string;
  value: any;
} {
  const splitKeypath = keypath.split('.');

  const subTypeId = splitKeypath[0];

  return {
    subTypeId,
    keypath,
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
      const editSubType = state.subType.edit[id];
      const staticSubType = state.subType.static[id];
      const dirtyState = state.dirty.subType[id]?.dirtyKeypaths ?? {};
      let updates: Array<{
        subTypeId: string;
        keypath: string;
        value: any;
      }> = [];
      const singleUpdate = Object.keys(dirtyState || {}).find(
        (k) => k.split('.').length === 1
      );
      if (singleUpdate) {
        updates = [decipherSubTypeKeypathUpdate(singleUpdate, editSubType)];
      } else {
        updates = Object.keys(dirtyState || {})
          .map((keypath) => {
            const staticValue = get(staticSubType, keypath);
            const editValue = get(editSubType, keypath);
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
          .filter((update) => update !== null && update !== undefined);
      }

      if (!staticSubType || !editSubType) {
        dispatch(
          showSnackbar({
            message: 'Error updating subType. Try again later.',
            type: 'error',
            duration: 3000,
          })
        );
        return;
      }
      if (updates.length > 0) {
        try {
          await updateSubTypeDefinition({ id, updates });
          dispatch(clearDirtyKeypaths({ scope: 'subType', id }));
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
