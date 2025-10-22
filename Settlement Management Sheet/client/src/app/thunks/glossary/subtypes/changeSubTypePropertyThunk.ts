import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { GlossaryEntryType } from '../../../../../../shared/types/index.js';
import { dispatch } from '@/app/constants.js';
import {
  changeSubTypeProperty,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';

export function changeSubTypePropertyThunkRoot({
  subTypeId,
  groupId,
  propertyId,
  property,
}: {
  subTypeId: string;
  groupId: string;
  propertyId: string;
  property: SubTypeProperty;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    console.log(property);

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
        changeSubTypeProperty({
          subTypeId,
          groupId,
          propertyId,
          property,
        })
      );

      dispatch(
        addDirtyKeypath({
          scope: 'subType',
          id: subTypeId,
          keypath: `${subTypeId}.groupData.${groupId}.propertyData.${propertyId}`,
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

export default function changeSubTypePropertyThunk({
  subTypeId,
  groupId,
  propertyId,
  property,
}: {
  subTypeId: string;
  groupId: string;
  propertyId: string;
  property: any;
}) {
  dispatch(
    changeSubTypePropertyThunkRoot({
      subTypeId,
      groupId,
      propertyId,
      property,
    })
  );
}
