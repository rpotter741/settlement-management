import { ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import serverAction from '../helpers/glossaryActions';
import {
  initializeGlossary,
  setGlossaryLoading,
  setGlossaryError,
  setGlossaryNodes,
  updateGlossaryNode,
  updateGlossaryNodes,
  addGlossaryNode,
  removeGlossaryNode,
  setSnackbar,
  toggleNameEdit,
  toggleExpand,
} from './glossarySlice';
import { rehydrateGlossaryTree } from '../helpers/rehydrateGlossary';
import { GlossaryEntryType, GlossaryNode } from '../../../../../types';
import { RootState } from '../../../app/store';
import { GlossaryState, GlossaryStateEntry } from './types';
import { selectNodeById } from './glossarySelectors';
import { cloneDeep, get } from 'lodash';
import makeSnackbarMessage from '../../../utility/makeSnackbar';

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
      const snackbar = makeSnackbarMessage({
        message: 'Error fetching glossaries. Try again later.',
        type: 'error',
        duration: 3000,
      });
      dispatch(setSnackbar({ snackbar }));
    }
  };

export const getGlossaryById =
  ({ glossaryId }: { glossaryId: string }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const existing = getState().glossary.glossaries[glossaryId];
    if (existing) return; // maybe try to just rehydrate the tree with fresh data?
    try {
      const glossary = await serverAction.getGlossaryById({ glossaryId });
      dispatch(
        initializeGlossary({
          glossaryId: glossary.id,
          name: glossary.name,
          description: glossary.description,
        })
      );
      return makeSnackbarMessage({
        message: 'Glossary loaded successfully',
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error fetching glossary:', error);
      const snackbar = makeSnackbarMessage({
        message: 'Error fetching glossary. Try again later.',
        type: 'error',
        duration: 3000,
      });
      dispatch(setSnackbar({ snackbar }));
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
      const snackbar = makeSnackbarMessage({
        message: 'Error fetching glossary structure. Try again later.',
        type: 'error',
        duration: 3000,
      });
      dispatch(setSnackbar({ snackbar }));
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
    description: string;
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
      const snackbar = makeSnackbarMessage({
        message: 'Error creating glossary. Try again later.',
        type: 'error',
        duration: 3000,
      });
      dispatch(setSnackbar({ snackbar }));
    }
  };

export const addFolder =
  ({ node }: { node: GlossaryNode }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { name, parentId, id, glossaryId, entryType } = node;
    dispatch(addGlossaryNode({ glossaryId, nodeId: id, nodeData: node }));
    try {
      if (entryType === null) {
        await serverAction.createFolder({
          id,
          name,
          entryType,
          parentId,
          glossaryId,
        });
      } else {
        await serverAction.createEntry({
          id,
          name,
          entryType,
          type: 'folder',
          parentId,
          glossaryId,
          entryData: node,
        });
      }
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
          dispatch(toggleExpand({ glossaryId, nodeId: parentId }));
        }
      }
    } catch (error) {
      console.error('Error adding node:', error);
      dispatch(removeGlossaryNode({ glossaryId, nodeId: id }));
      const snackbar = makeSnackbarMessage({
        message: 'Error adding folder. Try again later.',
        type: 'error',
        duration: 3000,
      });
      dispatch(setSnackbar({ snackbar }));
    }
  };

export const removeFolder =
  ({ node }: { node: GlossaryNode }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    const { id, glossaryId } = node;
    dispatch(removeGlossaryNode({ glossaryId, nodeId: id }));
    try {
      await serverAction.deleteNode({ id });
    } catch (error) {
      console.error('Error removing node:', error);
      dispatch(addGlossaryNode({ glossaryId, nodeId: id, nodeData: node }));
      const snackbar = makeSnackbarMessage({
        message: 'Error removing folder. Try again later.',
        type: 'error',
        duration: 3000,
      });
      dispatch(setSnackbar({ snackbar }));
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
      const snackbar = makeSnackbarMessage({
        message: 'Error adding entry. Try again later.',
        type: 'error',
        duration: 3000,
      });
      dispatch(setSnackbar({ snackbar }));
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
      await serverAction.updateEntry({ id, name, entryType });
    } catch (error) {
      console.error('Error renaming node:', error);
      dispatch(
        updateGlossaryNode({
          glossaryId,
          nodeId: id,
          nodeData: { ...backupNode },
        })
      );
      const snackbar = makeSnackbarMessage({
        message: 'Error renaming entry. Try again later.',
        type: 'error',
        duration: 3000,
      });
      dispatch(setSnackbar({ snackbar }));
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
      const snackbar = makeSnackbarMessage({
        message: `${backupNode.name} successfully deleted.`,
        type: 'success',
        duration: 3000,
        rollback: backupNode,
        rollbackAction: (rollback) => {
          dispatch(
            addGlossaryNode({
              glossaryId,
              nodeId: id,
              nodeData: rollback,
            })
          );
        },
      });
      dispatch(setSnackbar({ snackbar }));
    } catch (error) {
      console.error('Error removing node:', error);
      dispatch(
        addGlossaryNode({ glossaryId, nodeId: id, nodeData: backupNode })
      );
      const snackbar = makeSnackbarMessage({
        message: 'Error removing entry. Try again later.',
        type: 'error',
        duration: 3000,
      });
      dispatch(setSnackbar({ snackbar }));
    }
  };

export const updateEntry =
  ({
    node,
    glossaryId,
  }: {
    node: GlossaryNode;
    glossaryId: string;
  }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, entryType } = node;
    console.log('Updating entry:', node, glossaryId);
    const backupNode = cloneDeep(selectNodeById(glossaryId, id)(getState()));
    dispatch(updateGlossaryNode({ glossaryId, nodeId: id, nodeData: node }));
    try {
      await serverAction.updateEntry({ id, entryType, entryData: node });
    } catch (error) {
      console.error('Error updating node:', error);
      dispatch(
        updateGlossaryNode({
          glossaryId,
          nodeId: id,
          nodeData: { ...backupNode },
        })
      );
      const snackbar = makeSnackbarMessage({
        message: `${node.name} failed to update. Try again later.`,
        type: 'error',
        duration: 3000,
      });
      dispatch(setSnackbar({ snackbar }));
    }
  };

const thunks = {
  getGlossaries,
  getGlossaryById,
  getGlossaryNodes,
  createGlossary,
  addFolder,
  removeFolder,
  addEntry,
  renameNodeAndEntry,
  deleteEntry,
  updateEntry,
};

export default thunks;
