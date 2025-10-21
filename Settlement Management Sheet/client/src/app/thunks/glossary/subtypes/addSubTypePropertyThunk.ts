import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import { addSubTypeProperty } from '@/app/slice/glossarySlice.js';

export function addSubTypePropertyThunkRoot({
  glossaryId,
  type,
  subTypeId,
  groupId,
  property,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  property: any;
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

      dispatch(
        addSubTypeProperty({
          glossaryId,
          type,
          subTypeId,
          groupId,
          property,
        })
      );

      dispatch(
        addDirtyKeypath({
          scope: 'glossary',
          id: glossaryId,
          keypath: `subTypes.${type}.${subTypeId}.groups.${groupId}`,
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

export default function addSubTypePropertyThunk({
  glossaryId,
  type,
  subTypeId,
  groupId,
  property,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  property: any;
}) {
  return dispatch(
    addSubTypePropertyThunkRoot({
      glossaryId,
      type,
      subTypeId,
      groupId,
      property,
    })
  );
}
