import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import addGlossarySubType from '@/app/dispatches/glossary/addSubTypeDispatch.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import { addSubTypeGroup } from '@/app/slice/glossarySlice.js';

export function addSubTypeGroupThunkRoot({
  glossaryId,
  type,
  subTypeId,
  group,
}: {
  glossaryId: string;
  subTypeId: string;
  type: GlossaryEntryType;
  group: any;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const state = getState();
      const glossary = state.glossary.glossaries.edit.byId[glossaryId];
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

      dispatch(addSubTypeGroup({ glossaryId, subTypeId, type, group }));

      dispatch(
        addDirtyKeypath({
          scope: 'glossary',
          id: glossaryId,
          keypath: `subTypes.${type}.${subTypeId}`,
        })
      );
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

export default function addSubTypeGroupThunk({
  glossaryId,
  type,
  subTypeId,
  group,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  group: any;
}) {
  return dispatch(
    addSubTypeGroupThunkRoot({
      glossaryId,
      type,
      subTypeId,
      group,
    })
  );
}
