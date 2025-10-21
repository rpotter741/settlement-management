import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import { updateSubTypeSubPropertyDispatch } from '@/app/dispatches/glossary/updateSubTypeSubPropertyDispatch.js';
import { dispatch } from '@/app/constants.js';
import { changeSubTypePropertyDispatch } from '@/app/dispatches/glossary/changeSubTypePropertyDispatch.js';

export function changeSubTypePropertyThunkRoot({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  property,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  property: any;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    console.log(property);

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

      changeSubTypePropertyDispatch({
        glossaryId,
        type,
        subTypeId,
        groupId,
        propertyId,
        property,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'glossary',
          id: glossaryId,
          keypath: `subTypes.${type}.${subTypeId}.groupData.${groupId}.propertyData.${propertyId}`,
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

export default function changeSubTypePropertyThunk({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  property,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  property: any;
}) {
  dispatch(
    changeSubTypePropertyThunkRoot({
      glossaryId,
      type,
      subTypeId,
      groupId,
      propertyId,
      property,
    })
  );
}
