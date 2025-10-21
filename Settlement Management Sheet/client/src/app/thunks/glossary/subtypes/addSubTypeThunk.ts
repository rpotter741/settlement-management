import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import addGlossarySubType from '@/app/dispatches/glossary/addSubTypeDispatch.js';
import createSubType from '@/services/glossary/subTypes/createSubType.js';

export function addSubTypeThunkRoot({
  glossaryId,
  setSubTypeId,
  subType,
}: {
  glossaryId: string;
  setSubTypeId: (id: string) => void;
  subType: any;
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

      addGlossarySubType({
        glossaryId,
        setSubTypeId,
        subType,
      });

      await createSubType({
        glossaryId,
        subType,
      }).then((res) => {
        console.log('Created SubType:', res);
      });
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

export default function addSubTypeThunk({
  glossaryId,
  setSubTypeId,
  subType,
}: {
  glossaryId: string;
  setSubTypeId: (id: string) => void;
  subType: any;
}) {
  return dispatch(
    addSubTypeThunkRoot({
      glossaryId,
      setSubTypeId,
      subType,
    })
  );
}
