import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '../glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { addTab } from '@/app/slice/sidePanelSlice.js';
import { v4 as newId } from 'uuid';

export default function openEditGlossaryThunk(): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const activeGlossaryId = getState().glossary.activeGlossaryId;
    if (!activeGlossaryId) {
      dispatch(
        showSnackbar({
          message: 'No active glossary selected.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    const glossary = getState().glossary.glossaries[activeGlossaryId];
    if (!glossary) {
      dispatch(
        showSnackbar({
          message: 'Active glossary not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    dispatch(
      addTab({
        name: glossary.name,
        mode: 'edit',
        tool: 'editGlossary',
        tabType: 'glossary',
        id: glossary.id,
        tabId: newId(),
        scroll: 0,
        activate: true,
        disableMenu: true,
        preventSplit: false,
      })
    );
  };
}
