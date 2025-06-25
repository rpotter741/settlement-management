import { ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import serverAction from '../../services/glossaryServices.js';
import {
  initializeGlossary,
  setGlossaryNodes,
  updateGlossaryNode,
  addGlossaryNode,
  removeGlossaryNode,
  toggleNameEdit,
  toggleExpand,
  updateGlossary,
  updateGlossaryEntry,
  addGlossaryEntry,
  setActiveGlossaryId,
} from '../slice/glossarySlice.js';
import { rehydrateGlossaryTree } from '../../features/Glossary/helpers/rehydrateGlossary.js';
import {
  GlossaryEntry,
  GlossaryEntryType,
  GlossaryNode,
} from '../../../../types/index.js';
import { RootState } from '../store.js';
import {
  selectEntryById,
  selectNodeById,
} from '../selectors/glossarySelectors.js';
import { cloneDeep, get } from 'lodash';
import { findAndDeleteTab } from './sidePanelThunks.js';
import { showSnackbar } from '../slice/snackbarSlice.js';

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  any
>;

export const getGlossaries =
  (): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const glossaries = await serverAction.getGlossaries();
      const existingState = getState().glossary.glossaries;
      glossaries.forEach(
        (glossary: { id: string; name: string; description: string }) => {
          if (!existingState[glossary.id]) {
            dispatch(
              initializeGlossary({
                glossaryId: glossary.id,
                name: glossary.name,
                description: glossary.description,
              })
            );
          }
        }
      );
    } catch (error) {
      console.error('Error fetching glossaries:', error);
      dispatch(
        showSnackbar({
          message: 'Error fetching glossaries. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };

export const getGlossaryNodes =
  ({ glossaryId }: { glossaryId: string }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const glossary = getState().glossary.glossaries[glossaryId];
      if (glossary.hydrated) return; // already hydrated, no need to fetch again
      const nodes = await serverAction.getGlossaryNodes({ glossaryId });
      const existingState = glossary.renderState;
      const { nodeMap, roots, renderState } = rehydrateGlossaryTree(
        nodes,
        existingState
      );
      dispatch(
        setGlossaryNodes({
          glossaryId,
          nodes: nodeMap,
          structure: nodes,
          renderState,
        })
      );
    } catch (error) {
      console.error('Error fetching glossary nodes:', error);

      dispatch(
        showSnackbar({
          message: 'Error fetching glossary structure. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };

export const getGlossaryEntryById =
  ({
    nodeId,
    entryType,
    glossaryId,
  }: {
    nodeId: string;
    entryType: GlossaryEntryType;
    glossaryId: string;
  }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const existingNode = selectNodeById(glossaryId, nodeId)(getState());
      const entry = await serverAction.getGlossaryEntryById({
        nodeId,
        entryType,
      });
      dispatch(
        addGlossaryEntry({
          glossaryId,
          entryId: nodeId,
          entryData: entry as GlossaryEntry,
        })
      );
    } catch (error) {
      console.error('Error fetching glossary node:', error);
      dispatch(
        showSnackbar({
          message: 'Error fetching glossary node. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };

export const createGlossary =
  ({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description: JSON;
  }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    try {
      const glossary = await serverAction.createGlossary({
        id,
        name,
        description,
      });
      dispatch(
        initializeGlossary({
          glossaryId: glossary.id,
          name: glossary.name,
          description: glossary.description,
        })
      );
    } catch (error) {
      console.error('Error creating glossary:', error);
      dispatch(
        showSnackbar({
          message: 'Error creating glossary. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };

export const addSection =
  ({ node }: { node: GlossaryNode }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { name, parentId, id, glossaryId, entryType } = node;
    dispatch(addGlossaryNode({ glossaryId, nodeId: id, nodeData: node }));
    try {
      await serverAction.createEntry({
        id,
        name,
        entryType,
        type: 'folder',
        parentId,
        glossaryId,
        entryData: node,
      });

      dispatch(
        toggleNameEdit({
          glossaryId,
          nodeId: id,
        })
      );
      if (parentId) {
        const parentExpand =
          getState().glossary.glossaries[glossaryId].renderState[parentId]
            .expanded;
        if (!parentExpand) {
          dispatch(
            toggleExpand({ glossaryId, nodeId: parentId, expanded: true })
          );
        }
      }
    } catch (error) {
      console.error('Error adding node:', error);
      dispatch(removeGlossaryNode({ glossaryId, nodeId: id }));
      dispatch(
        showSnackbar({
          message: 'Error adding folder. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };

export const addEntry =
  ({ node }: { node: GlossaryNode }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, name, entryType, type, parentId, glossaryId } = node;
    dispatch(addGlossaryNode({ glossaryId, nodeId: id, nodeData: node }));
    try {
      await serverAction.createEntry({
        id,
        name,
        entryType,
        type,
        parentId,
        glossaryId,
        entryData: node,
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

export const renameNodeAndEntry =
  ({
    id,
    glossaryId,
    name,
    entryType,
  }: {
    id: string;
    glossaryId: string;
    name: string;
    entryType: GlossaryEntryType;
  }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const backupNode = cloneDeep(selectNodeById(glossaryId, id)(getState()));
    dispatch(
      updateGlossaryNode({
        glossaryId,
        nodeId: id,
        nodeData: { ...backupNode, name },
      })
    );
    try {
      await serverAction.updateEntry({ id, entryData: { name }, entryType });
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

export const deleteEntry =
  ({
    id,
    entryType,
    glossaryId,
  }: {
    id: string;
    entryType: GlossaryEntryType;
    glossaryId: string;
  }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const backupNode = cloneDeep(selectNodeById(glossaryId, id)(getState()));
    dispatch(removeGlossaryNode({ glossaryId, nodeId: id }));
    try {
      await serverAction.deleteEntry({ id, entryType, glossaryId });
      dispatch(findAndDeleteTab(id));
      dispatch(
        showSnackbar({
          message: `${backupNode.name} successfully deleted.`,
          type: 'success',
          duration: 3000,
          component: undefined,
          props: {
            rollback: backupNode,
            rollbackAction: (rollback: GlossaryNode) => {
              dispatch(
                addGlossaryNode({
                  glossaryId,
                  nodeId: id,
                  nodeData: rollback,
                })
              );
            },
          },
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

export const updateEntry =
  ({
    node,
    glossaryId,
    content,
  }: {
    node: GlossaryNode;
    glossaryId: string;
    content?: Record<string, any>;
  }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, entryType } = node;
    console.log('Updating entry:', content);
    const backupNode = cloneDeep(selectNodeById(glossaryId, id)(getState()));
    const updatedNode = { ...node, name: content?.name || node.name };
    dispatch(
      updateGlossaryNode({ glossaryId, nodeId: id, nodeData: updatedNode })
    );
    const backupEntry = cloneDeep(selectEntryById(glossaryId, id)(getState()));
    dispatch(
      updateGlossaryEntry({
        glossaryId,
        entryId: id,
        content: { ...backupEntry, ...content },
      })
    );
    try {
      await serverAction.updateEntry({
        id,
        entryType,
        entryData: content,
      });
    } catch (error) {
      console.error('Error updating node:', error);
      dispatch(
        updateGlossaryNode({
          glossaryId,
          nodeId: id,
          nodeData: { ...backupNode },
        })
      );
      dispatch(
        showSnackbar({
          message: `${node.name} failed to update. Try again later.`,
          type: 'error',
          duration: 3000,
        })
      );
    }
  };

export const updateGlossaryThunk =
  ({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description: string;
  }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    try {
      dispatch(updateGlossary({ id, name, description }));
      await serverAction.updateGlossary({
        id,
        name,
        description,
      });
    } catch (error) {
      console.error('Error updating glossary:', error);
      dispatch(
        showSnackbar({
          message: 'Error updating glossary. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };

export const addAndActivateGlossary =
  ({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description: string;
  }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    dispatch(
      initializeGlossary({
        glossaryId: id,
        name,
        description,
      })
    );
    dispatch(setActiveGlossaryId({ glossaryId: id }));
  };

const thunks = {
  getGlossaries,
  getGlossaryNodes,
  createGlossary,
  addSection,
  addEntry,
  renameNodeAndEntry,
  deleteEntry,
  updateEntry,
  updateGlossaryThunk,
  addAndActivateGlossary,
  getGlossaryEntryById,
};

export default thunks;
