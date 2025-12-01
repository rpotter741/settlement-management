import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import {
  addGlossaryNode,
  removeGlossaryNode,
  toggleExpand,
  toggleNameEdit,
} from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { GlossaryNode } from 'types/glossaryEntry.js';

export default function createNodeAndEntryThunk({
  node,
}: {
  node: GlossaryNode;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, name, entryType, parentId, glossaryId, fileType } = node;
    const state = getState();
    dispatch(
      addGlossaryNode({
        glossaryId,
        nodeId: id,
        nodeData: { ...node },
      })
    );

    try {
      await serverAction.createNodeAndEntry({
        entryData: { ...node },
      });
      dispatch(
        toggleNameEdit({
          glossaryId,
          nodeId: id,
        })
      );
      if (parentId) {
        dispatch(
          toggleExpand({ glossaryId, nodeId: parentId, expanded: true })
        );
      }
    } catch (error) {
      console.error('Error adding node:', error);
      dispatch(removeGlossaryNode({ glossaryId, nodeId: id }));
      dispatch(
        showSnackbar({
          message: 'Error adding entry. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
