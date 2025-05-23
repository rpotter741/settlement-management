import { ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import serverAction from '../helpers/glossaryActions';
import {
  initializeGlossary,
  setGlossaryLoading,
  setGlossaryError,
  setGlossaryNodes,
  rehydrateTree,
  updateGlossaryNode,
  updateGlossaryNodes,
  addGlossaryNode,
  removeGlossaryNode,
} from './glossarySlice';
import { GlossaryEntryType, GlossaryNode } from '../../../../../types';
import { RootState } from '../../../app/store';
import { GlossaryState, GlossaryStateEntry } from './types';
import { selectNodeById } from './glossarySelectors';
import { cloneDeep } from 'lodash';
import makeSnackbarMessage from '@/utility/makeSnackbar';

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  any
>;

export const getGlossaries =
  (): AppThunk => async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    try {
      const glossaries = await serverAction.getGlossaries();
      glossaries.forEach(
        (glossary: { id: string; name: string; description: string }) => {
          dispatch(
            initializeGlossary({
              glossaryId: glossary.id,
              name: glossary.name,
              description: glossary.description,
            })
          );
        }
      );
    } catch (error) {
      console.error('Error fetching glossaries:', error);
      return makeSnackbarMessage({
        message: 'Error fetching glossaries. Try again later.',
        type: 'error',
        duration: 3000,
      });
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
      return makeSnackbarMessage({
        message: 'Error fetching glossary. Try again later.',
        type: 'error',
        duration: 3000,
      });
    }
  };

export const getGlossaryNodes =
  ({ glossaryId }: { glossaryId: string }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    try {
      const nodes = await serverAction.getGlossaryNodes({ glossaryId });
      dispatch(
        setGlossaryNodes({
          glossaryId,
          nodes,
          structure: nodes,
        })
      );
    } catch (error) {
      console.error('Error fetching glossary nodes:', error);
      return makeSnackbarMessage({
        message: 'Error fetching glossary structure. Try again later.',
        type: 'error',
        duration: 3000,
      });
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
      return makeSnackbarMessage({
        message: 'Error creating glossary. Try again later.',
        type: 'error',
        duration: 3000,
      });
    }
  };

export const addFolder =
  ({ node }: { node: GlossaryNode }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    const { name, parentId, id, glossaryId } = node;
    dispatch(addGlossaryNode({ glossaryId, nodeId: id, nodeData: node }));
    try {
      await serverAction.createFolder({
        id,
        name,
        parentId,
        glossaryId,
      });
    } catch (error) {
      console.error('Error adding node:', error);
      dispatch(removeGlossaryNode({ glossaryId, nodeId: id }));
      return makeSnackbarMessage({
        message: 'Error adding folder. Try again later.',
        type: 'error',
        duration: 3000,
      });
    }
  };

export const addEntry =
  ({ node }: { node: GlossaryNode }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
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
    } catch (error) {
      console.error('Error adding node:', error);
      dispatch(removeGlossaryNode({ glossaryId, nodeId: id }));
      return makeSnackbarMessage({
        message: 'Error adding entry. Try again later.',
        type: 'error',
        duration: 3000,
      });
    }
  };

export const renameEntry =
  ({
    id,
    glossaryId,
    name,
  }: {
    id: string;
    glossaryId: string;
    name: string;
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
      await serverAction.renameNode({ id, name });
    } catch (error) {
      console.error('Error renaming node:', error);
      dispatch(
        updateGlossaryNode({
          glossaryId,
          nodeId: id,
          nodeData: { ...backupNode },
        })
      );
      return makeSnackbarMessage({
        message: 'Error renaming entry. Try again later.',
        type: 'error',
        duration: 3000,
      });
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
      await serverAction.deleteEntry({ id, entryType });
      return makeSnackbarMessage({
        message: `${backupNode.name} successfully deleted.`,
        type: 'success',
        duration: 10000,
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
    } catch (error) {
      console.error('Error removing node:', error);
      dispatch(
        addGlossaryNode({ glossaryId, nodeId: id, nodeData: backupNode })
      );
      return makeSnackbarMessage({
        message: 'Error removing entry. Try again later.',
        type: 'error',
        duration: 3000,
      });
    }
  };

export const updateEntry =
  ({ node }: { node: GlossaryNode }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, entryType, glossaryId } = node;
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
    }
    return makeSnackbarMessage({
      message: `${node.name} failed to update. Try again later.`,
      type: 'error',
      duration: 3000,
    });
  };
