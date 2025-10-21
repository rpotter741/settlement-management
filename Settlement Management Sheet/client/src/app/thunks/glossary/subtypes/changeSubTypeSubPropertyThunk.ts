import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import { dispatch } from '@/app/constants.js';
import { changeSubTypeSubPropertyDispatch } from '@/app/dispatches/glossary/changeSubTypeSubPropertyDispatch.js';

export function changeSubTypeSubPropertyThunkRoot({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  subProperty,
  side,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  subProperty: any;
  side: 'left' | 'right';
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

      changeSubTypeSubPropertyDispatch({
        glossaryId,
        type,
        subTypeId,
        groupId,
        propertyId,
        subProperty,
        side,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'glossary',
          id: glossaryId,
          keypath: `subTypes.${type}.${subTypeId}.groupData.${groupId}.propertyData.${propertyId}.${side}`,
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

export default function changeSubTypeSubPropertyThunk({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  subProperty,
  side,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  subProperty: any;
  side: 'left' | 'right';
}) {
  dispatch(
    changeSubTypeSubPropertyThunkRoot({
      glossaryId,
      type,
      subTypeId,
      groupId,
      propertyId,
      subProperty,
      side,
    })
  );
}
