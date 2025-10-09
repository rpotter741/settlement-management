import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import {
  addGlossaryNode,
  removeGlossaryNode,
} from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { GlossaryNode } from 'types/glossaryEntry.js';
import { selectEditNodeById } from '@/app/selectors/glossarySelectors.js';
import { cloneDeep } from 'lodash';
import { findAndDeleteTab } from '@/app/thunks/tabThunks.js';

export default function deleteEntryThunk({
  node,
}: {
  node: GlossaryNode;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, entryType, fileType, glossaryId } = node;
    const backupNode = cloneDeep(
      selectEditNodeById(glossaryId, id)(getState())
    );
    try {
      await serverAction.deleteEntry({ id, entryType, fileType, glossaryId });
      dispatch(removeGlossaryNode({ glossaryId, nodeId: id }));
      dispatch(findAndDeleteTab(id));
      dispatch(
        showSnackbar({
          message: `${backupNode.name} successfully deleted.`,
          type: 'success',
          duration: 3000,
          component: undefined,
          props: {},
        })
      );
    } catch (error) {
      console.error('Error removing node:', error);
      dispatch(
        addGlossaryNode({ glossaryId, nodeId: id, nodeData: backupNode })
      );
      dispatch(
        showSnackbar({
          message: 'Error removing entry. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
