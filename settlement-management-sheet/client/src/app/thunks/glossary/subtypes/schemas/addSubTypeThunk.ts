import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';
import { dispatch } from '@/app/constants.js';
import { addSubType, SubType } from '@/app/slice/subTypeSlice.js';
import subTypeCommands from '@/app/commands/subtype.ts';
import getSubTypeStateAtKey from '@/utility/dataTransformation/getSubTypeStateAtKey.ts';

export function addSubTypeThunkRoot({
  subType,
}: {
  subType: SubType;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const state = getState();
      const existingSubType = getSubTypeStateAtKey<SubType>(
        'subtypes',
        subType.id
      );
      if (existingSubType) {
        dispatch(
          showSnackbar({
            message:
              "2 ULIDs walk into a bar... The second one says, 'I think we already exist!'",
            type: 'error',
            duration: 3000,
          })
        );
      }

      dispatch(
        addSubType({
          subType: {
            ...subType,
            groups: [],
            system: state.user.role === 'admin' ? true : false,
          },
          system: state.user.role === 'admin' ? true : false,
        })
      );

      if (!existingSubType) {
        await subTypeCommands.createEntrySubType({
          id: subType.id,
          name: subType.name,
          createdBy: 'robbiepottsdm',
          contentType: 'SYSTEM',
          entryType: subType.entryType,
        });
      }
    } catch (error) {
      console.error('Error adding SubType:', error);
      dispatch(
        showSnackbar({
          message:
            'Sometimes the server can be a little... rusty. Aka, something went wrong.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}

export default function addSubTypeThunk({ subType }: { subType: any }) {
  return dispatch(
    addSubTypeThunkRoot({
      subType,
    })
  );
}
