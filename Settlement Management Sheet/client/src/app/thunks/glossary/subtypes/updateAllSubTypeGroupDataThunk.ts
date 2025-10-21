import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import {
  GenericObject,
  GlossaryEntryType,
} from '../../../../../../shared/types/index.js';
import updateAllSubTypeGroupDataDispatch from '@/app/dispatches/glossary/updateAllSubTypeGroupDataDispatch.js';

export function updateAllSubTypeGroupDataThunkRoot({
  glossaryId,
  type,
  subTypeId,
  groupData,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupData: GenericObject;
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

      updateAllSubTypeGroupDataDispatch({
        glossaryId,
        type,
        subTypeId,
        groupData,
      });

      dispatch(
        addDirtyKeypath({
          scope: 'glossary',
          id: glossaryId,
          keypath: `subTypes.${type}.${subTypeId}.groupData`,
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

export default function updateAllSubTypeGroupDataThunk({
  glossaryId,
  type,
  subTypeId,
  groupData,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupData: GenericObject;
}) {
  return dispatch(
    updateAllSubTypeGroupDataThunkRoot({
      glossaryId,
      type,
      subTypeId,
      groupData,
    })
  );
}
