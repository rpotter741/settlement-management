import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import addGlossarySubType from '@/app/dispatches/glossary/addSubTypeDispatch.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import reorderSubTypeGroupsDispatch from '@/app/dispatches/glossary/reorderSubTypeGroupsDispatch.js';
import { updateSubTypeAnchorDispatch } from '@/app/dispatches/glossary/updateSubTypeAnchorDispatch.js';

export function updateSubTypeAnchorThunkRoot({
  glossaryId,
  type,
  subTypeId,
  value,
  anchor,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  value: any;
  anchor: 'primary' | 'secondary';
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

      updateSubTypeAnchorDispatch({
        glossaryId,
        type,
        subTypeId,
        value,
        anchor,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'glossary',
          id: glossaryId,
          keypath: `subTypes.${type}.${subTypeId}.${anchor}`,
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

export default function updateSubTypeAnchorThunk({
  glossaryId,
  type,
  subTypeId,
  value,
  anchor,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  value: any;
  anchor: 'primary' | 'secondary';
}) {
  return dispatch(
    updateSubTypeAnchorThunkRoot({
      glossaryId,
      type,
      subTypeId,
      value,
      anchor,
    })
  );
}
