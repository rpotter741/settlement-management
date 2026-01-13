import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { updateGlossaryNode } from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { cloneDeep } from 'lodash';
import { selectEditNodeById } from '@/app/selectors/glossarySelectors.js';
import { GlossaryNode } from 'types/glossaryEntry.js';
import { updateTab } from '@/app/slice/tabSlice.js';

export default function renameNodeAndEntryThunk({
  node,
  tabId,
}: {
  node: GlossaryNode;
  tabId?: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, glossaryId, name } = node;
    const backupNode = cloneDeep(
      selectEditNodeById(glossaryId, id)(getState())
    );
    if (backupNode.name === name) {
      console.warn('No change in name, skipping update.');
      return;
    }
    dispatch(
      updateGlossaryNode({
        glossaryId,
        nodeId: id,
        nodeData: { ...backupNode, name },
      })
    );
    if (tabId) {
      dispatch(
        updateTab({
          tabId,
          keypath: 'name',
          updates: name,
        })
      );
    }
    try {
      await serverAction.renameNodeAndEntry({
        id,
        name,
      });
    } catch (error) {
      console.error('Error renaming node:', error);
      dispatch(
        updateGlossaryNode({
          glossaryId,
          nodeId: id,
          nodeData: { ...backupNode },
        })
      );
      dispatch(
        showSnackbar({
          message: 'Error renaming entry. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
