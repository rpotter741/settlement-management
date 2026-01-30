import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import {
  addOptionsForEntry,
  initializeGlossary,
} from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { GlossaryEntry } from 'types/glossaryEntry.js';
import { InheritanceMap } from '@/utility/hasParentProperty.js';

export default function getOptionsByPropertyThunk({
  glossaryId,
  entryId,
  property,
  inheritanceMap,
}: {
  glossaryId: string;
  entryId: string;
  property: keyof GlossaryEntry;
  inheritanceMap: InheritanceMap;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const response = await serverAction.getOptionsByProperty({
        property,
        inheritanceMap,
      });
      const options = response.results;
      dispatch(addOptionsForEntry({ glossaryId, entryId, property, options }));
    } catch (error) {
      console.error('Error fetching options by property:', error);
      dispatch(
        showSnackbar({
          message: 'Error fetching options. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
