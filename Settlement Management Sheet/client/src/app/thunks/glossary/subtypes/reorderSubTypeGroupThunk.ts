import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import addGlossarySubType from '@/app/dispatches/glossary/addSubTypeDispatch.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import reorderSubTypeGroupsDispatch from '@/app/dispatches/glossary/reorderSubTypeGroupsDispatch.js';

export function reorderSubTypeGroupsThunkRoot({
  glossaryId,
  type,
  subTypeId,
  newOrder,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  newOrder: string[];
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

      reorderSubTypeGroupsDispatch({
        glossaryId,
        type,
        subTypeId,
        newOrder,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'glossary',
          id: glossaryId,
          keypath: `subTypes.${type}.${subTypeId}.groupOrder`,
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

export default function reorderSubTypeGroupsThunk({
  glossaryId,
  type,
  subTypeId,
  newOrder,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  newOrder: string[];
}) {
  return dispatch(
    reorderSubTypeGroupsThunkRoot({
      glossaryId,
      type,
      subTypeId,
      newOrder,
    })
  );
}
