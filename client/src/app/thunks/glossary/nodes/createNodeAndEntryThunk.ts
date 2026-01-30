import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import {
  addGlossaryEntry,
  addGlossaryNode,
  removeGlossaryNode,
  toggleExpand,
  toggleNameEdit,
} from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { GlossaryNode } from 'types/glossaryEntry.js';
import { cloneDeep } from 'lodash';
import createNodeAndEntry from '@/services/glossary/nodes/createNodeAndEntry.js';
import { initializeRelay } from '@/app/slice/relaySlice.js';

export default function createNodeAndEntryThunk({
  node,
}: {
  node: GlossaryNode;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, name, entryType, parentId, glossaryId, fileType } = node;

    try {
      const res = await serverAction.createNodeAndEntry({
        entryData: { ...node },
      });
      dispatch(
        addGlossaryNode({
          glossaryId,
          nodeId: res.node.id,
          nodeData: cloneDeep(res.node),
        })
      );
      dispatch(
        addGlossaryEntry({
          glossaryId,
          entryId: res.entry.id,
          entryData: cloneDeep(res.entry),
        })
      );
      dispatch(
        toggleNameEdit({
          glossaryId,
          nodeId: id,
        })
      );
      /*
        This is some brittle ass shit. I need to make a middleware that adds the entry to a list of new. It can track two variables: name and open. If name changes, dispatch the relay shit. If it's opened, dispatch the relay shit. In either case, it doesn't belong... *gestures everywhere* here.
      */
      setTimeout(() => {
        dispatch(
          initializeRelay({
            id: 'smart-link-spawner',
            data: {
              data: {
                entryId: res.entry.id,
                glossaryId: glossaryId,
              },
            },
            status: 'complete',
            sourceId: 'createNodeAndEntryThunk',
          })
        );
      }, 5000);
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
