import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import {
  reparentNodes,
  updateGlossaryNode,
} from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { cloneDeep } from 'lodash';
import { selectEditNodeById } from '@/app/selectors/glossarySelectors.js';
import { GlossaryNode } from 'types/glossaryEntry.js';
import { updateTab } from '@/app/slice/tabSlice.js';
import updateNodeParentId from '@/services/glossary/nodes/updateNodeParentId.js';

export default function reparentNodesThunk({
  glossaryId,
  nodes,
  newParentId,
}: {
  glossaryId: string;
  nodes: GlossaryNode[];
  newParentId: string | null;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    if (nodes.length === 0) return;
    if (nodes.length === 1) {
      if (nodes[0].parentId === newParentId) return;
    }
    const backupNodes = nodes.map((node) =>
      cloneDeep(selectEditNodeById(glossaryId, node.id)(getState()))
    );

    try {
      dispatch(
        reparentNodes({
          glossaryId,
          movedNodes: nodes,
          newParentId,
        })
      );

      const nodeIds = nodes.map((node) => node.id);

      await updateNodeParentId({
        ids: nodeIds,
        parentId: newParentId,
      });
    } catch (error) {
      console.error('Error assigning new parent node:', error);
      dispatch(
        showSnackbar({
          message: 'Failed to reparent nodes. Please try again.',
          type: 'error',
        })
      );
      // Rollback to backup nodes
      backupNodes.forEach((node) => {
        dispatch(
          updateGlossaryNode({
            glossaryId,
            nodeId: node.id,
            nodeData: node,
          })
        );
      });
    }
  };
}
