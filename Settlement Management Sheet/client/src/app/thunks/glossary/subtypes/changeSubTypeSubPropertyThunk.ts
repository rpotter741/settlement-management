import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import { dispatch } from '@/app/constants.js';
import { changeSubTypeSubPropertyDispatch } from '@/app/dispatches/glossary/changeSubTypeSubPropertyDispatch.js';
import { changeSubTypeSubProperty } from '@/app/slice/subTypeSlice.js';

export function changeSubTypeSubPropertyThunkRoot({
  subTypeId,
  groupId,
  propertyId,
  subProperty,
  side,
}: {
  subTypeId: string;
  groupId: string;
  propertyId: string;
  subProperty: any;
  side: 'left' | 'right';
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const state = getState();
      const subType = state.subType.edit[subTypeId];
      if (!subType) {
        dispatch(
          showSnackbar({
            message: 'SubType not found.',
            type: 'error',
            duration: 3000,
          })
        );
        return;
      }

      dispatch(
        changeSubTypeSubProperty({
          subTypeId,
          groupId,
          propertyId,
          subProperty,
          side,
        })
      );

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subTypeId,
          keypath: `${subTypeId}.groupData.${groupId}.propertyData.${propertyId}.${side}`,
        })
      );
    } catch (error) {
      console.error('Error updating subType:', error);
      dispatch(
        showSnackbar({
          message: 'Error updating subType. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}

export default function changeSubTypeSubPropertyThunk({
  subTypeId,
  groupId,
  propertyId,
  subProperty,
  side,
}: {
  subTypeId: string;
  groupId: string;
  propertyId: string;
  subProperty: any;
  side: 'left' | 'right';
}) {
  dispatch(
    changeSubTypeSubPropertyThunkRoot({
      subTypeId,
      groupId,
      propertyId,
      subProperty,
      side,
    })
  );
}
