import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '../glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '../../../services/glossaryServices.js';
import {
  addGlossaryNode,
  removeGlossary,
  removeGlossaryNode,
  setActiveGlossaryId,
} from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { GlossaryNode } from 'types/glossaryEntry.js';
import { selectNodeById } from '@/app/selectors/glossarySelectors.js';
import { cloneDeep, get } from 'lodash';
import { findAndDeleteTab } from '../sidePanelThunks.js';

export default function deleteEntryThunk({
  glossaryId,
}: {
  glossaryId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const glossary = getState().glossary.glossaries[glossaryId];
      dispatch(findAndDeleteTab(glossaryId));
      await serverAction.deleteGlossary({ glossaryId });
      dispatch(removeGlossary({ glossaryId }));
      dispatch(setActiveGlossaryId({ glossaryId: null }));
      dispatch(
        showSnackbar({
          message: `${glossary.name} successfully deleted.`,
          type: 'success',
          duration: 3000,
          component: undefined,
          props: {},
        })
      );
    } catch (error) {
      console.error('Error removing node:', error);
      dispatch(
        showSnackbar({
          message: 'Error removing glossary. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
