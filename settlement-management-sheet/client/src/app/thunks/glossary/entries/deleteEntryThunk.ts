import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import {
  addGlossaryNode,
  batchRollbackGlossaryEntries,
  bulkAddGlossaryNodes,
  bulkRemoveReferencesToNodes,
  removeGlossaryNode,
} from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { GlossaryNode } from 'types/glossaryEntry.js';
import { selectEditNodeById } from '@/app/selectors/glossarySelectors.js';
import { cloneDeep, get } from 'lodash';
import { findAndDeleteTab } from '@/app/thunks/tabThunks.js';
import { dispatch } from '@/app/constants.js';
import updateEntryById from './updateEntryById.js';
import findLinkedReferences from '../../utility/findLinkedReferences.js';
import findReferencesInBackground from '../../utility/findReferencesInBackground.js';

export default function deleteEntryThunk({
  node,
}: {
  node: GlossaryNode;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, glossaryId } = node;
    //make backup for rollback
    const backupNode = cloneDeep(
      selectEditNodeById(glossaryId, id)(getState())
    );
    // collect all children ids for deletion and rollback
    const allChildrenIds =
      node?.children?.map((childNode) => childNode.id) || [];
    const backupNodes = backupNode.children
      ? backupNode.children.map((child) => cloneDeep(child))
      : [];
    // close any open tabs for this entry / its children

    // establish rollback keypath option
    let allKeypaths: {
      id: string;
      data: {
        keypath: string;
        oldValue: any;
        newValue: any;
        compKey?: string;
      }[];
    }[] = [];

    const allEntries =
      getState().glossary.glossaries.edit.byId[glossaryId].entries;
    const allSubTypes = getState().subType.edit;

    const activeTab = getState().tabs.focusedTab;
    if (activeTab && activeTab.id && activeTab.glossaryId !== undefined) {
      const entryId = activeTab.id;
      const activeTabEntry =
        getState().glossary.glossaries.edit.byId[activeTab.glossaryId].entries[
          activeTab.id
        ];

      const activeTabIdAndKeypaths = findLinkedReferences({
        source: allEntries[entryId],
        subType: allSubTypes[activeTabEntry.subTypeId],
        linkedId: [id, ...allChildrenIds],
      });
      const clonedEntry = cloneDeep(activeTabEntry);
      if (activeTabIdAndKeypaths) {
        allKeypaths.push(activeTabIdAndKeypaths);
        for (const data of activeTabIdAndKeypaths.data) {
          // Set the linked references to null or remove from array
          const currentValue = get(clonedEntry, data.keypath);
          if (Array.isArray(currentValue)) {
            const index = currentValue.indexOf(id);
            if (index !== -1) {
              currentValue.splice(index, 1);
              dispatch(
                updateEntryById({
                  glossaryId: activeTab.glossaryId,
                  entryId: activeTab.id,
                  content: {
                    [data.keypath]: currentValue,
                  },
                })
              );
            }
          } else {
            // For non-array values, set to null
            dispatch(
              updateEntryById({
                glossaryId: activeTab.glossaryId,
                entryId: activeTab.id,
                content: {
                  [data.keypath]: null,
                },
              })
            );
          }
        }
      }
    }

    dispatch(removeGlossaryNode({ glossaryId, nodeId: id }));

    //initiate deletion of reference through all of the cached entries on the front end before hitting the server; should happen pretty quickly with the asynchronous promise resolver chain

    const affectedEntriesPromise = findReferencesInBackground(
      allEntries,
      allSubTypes,
      [id, ...allChildrenIds]
    );

    let serverResult;

    try {
      serverResult = await serverAction.deleteEntry({ id, glossaryId });
    } catch (err) {
      console.error('Error removing node:', err);
      serverResult = { success: false, error: err };
    }

    const affectedEntries = await affectedEntriesPromise;
    allKeypaths.forEach((keypathMap) => {
      const { id, data } = keypathMap;
      affectedEntries.set(id, data);
    });

    // Now process affected entries

    if (serverResult?.success === false) {
      console.warn('Server failed to delete entry, rolling back changes.');
      // Return the node!
      dispatch(
        addGlossaryNode({ glossaryId, nodeId: id, nodeData: backupNode })
      );
      // add the data back to the open tab, if there was one
      const rollbackData: Record<string, { keypath: string; value: any }[]> =
        {};
      affectedEntries.entries().forEach(([id, data]: [string, any]) => {
        rollbackData[id] = data;
      });
      dispatch(
        batchRollbackGlossaryEntries({
          glossaryId,
          rollbackData,
        })
      );
      if (backupNodes.length > 0) {
        //dispatch bulk add nodes
        dispatch(
          bulkAddGlossaryNodes({
            glossaryId,
            nodes: backupNodes,
          })
        );
      }
    } else {
      // propagate deletion of ids to all affected entries
      const affectEntriesRecord: Record<
        string,
        { keypath: string; oldValue: any; newValue: any; compKey?: string }[]
      > = {};
      const nodeIds: string[] = [node.id, ...allChildrenIds];

      affectedEntries.entries().forEach(([id, data]: [string, any]) => {
        affectEntriesRecord[id] = data;
      });
      dispatch(
        bulkRemoveReferencesToNodes({
          glossaryId,
          nodeIds,
          affectedEntries: affectEntriesRecord,
        })
      );
    }
  };
}
