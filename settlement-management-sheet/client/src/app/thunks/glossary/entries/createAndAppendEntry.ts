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
import { genericSubTypeIds } from '@/features/Glossary/EditGlossary/components/GlossaryPropertyLabels.js';
import updateEntryById from './updateEntryById.js';
import { addTab } from '@/app/slice/tabSlice.js';
import { TabTools } from '@/app/types/TabTypes.js';
import { get } from 'lodash';

export default function createAndAppendEntryThunk({
  node,
  sourceId,
  keypath,
  newTab,
}: {
  node: GlossaryNode;
  sourceId: string;
  keypath: string;
  newTab: boolean;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, name, entryType, parentId, glossaryId, fileType } = node;
    const state = getState();
    const integrationState =
      state.glossary.glossaries.edit.byId[glossaryId]?.integrationState;
    const subTypeId =
      integrationState.system?.[entryType]?.default ||
      genericSubTypeIds[entryType];
    if (!subTypeId) {
      console.error('No default subTypeId found for entryType:', entryType);
      return;
    }
    dispatch(
      addGlossaryNode({
        glossaryId,
        nodeId: id,
        nodeData: { ...node, subTypeId },
      })
    );

    try {
      const newEntry = await serverAction.createNodeAndEntry({
        entryData: { ...node, subTypeId },
      });
      const { entry } = newEntry;
      if (parentId) {
        dispatch(
          toggleExpand({ glossaryId, nodeId: parentId, expanded: true })
        );
      }
      const valueKeypath = `${keypath}.value`;
      const sourceEntry =
        state.glossary.glossaries.edit.byId[glossaryId].entries[sourceId];
      const existingValue = get(sourceEntry, valueKeypath);
      if (Array.isArray(existingValue)) {
        // If the existing value is an array, append the new entry ID
        dispatch(
          updateEntryById({
            glossaryId,
            entryId: sourceId,
            content: {
              [valueKeypath]: [...existingValue, entry.id],
            },
          })
        );
      } else {
        // Otherwise, set the value to the new entry ID
        dispatch(
          updateEntryById({
            glossaryId,
            entryId: sourceId,
            content: {
              [valueKeypath]: entry.id,
            },
          })
        );
      }
      if (newTab) {
        dispatch(
          addTab({
            name: entry.name,
            mode: 'edit',
            tool: entry.entryType as TabTools,
            id: entry.id,
            tabId: entry.id,
            scroll: 0,
            preventSplit: false,
            glossaryId,
            tabType: 'glossary',
          })
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
