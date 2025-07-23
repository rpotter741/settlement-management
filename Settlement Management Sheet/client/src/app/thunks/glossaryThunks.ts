import { ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { v4 as newId } from 'uuid';
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
  addOptionsForEntry,
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
  selectGlossaryNodes,
  selectNodeById,
} from '../selectors/glossarySelectors.js';
import { cloneDeep, get } from 'lodash';
import { findAndDeleteTab } from './sidePanelThunks.js';
import { showSnackbar } from '../slice/snackbarSlice.js';
import {
  getOptionsContextMaps,
  InheritanceMap,
} from '@/utility/hasParentProperty.js';
import { addTab } from '../slice/sidePanelSlice.js';
import { Genre } from '@/components/shared/Metadata/GenreSelect.js';

export type AppThunk<ReturnType = void> = ThunkAction<
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
        (glossary: {
          id: string;
          name: string;
          description: string;
          genre: Genre;
          subGenre: string;
        }) => {
          if (!existingState[glossary.id]) {
            dispatch(
              initializeGlossary({
                glossaryId: glossary.id,
                name: glossary.name,
                description: glossary.description,
                genre: glossary.genre,
                subGenre: glossary.subGenre,
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

export const getNodes =
  ({ glossaryId }: { glossaryId: string }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const glossary = getState().glossary.glossaries[glossaryId];
      if (glossary.hydrated) return; // already hydrated, no need to fetch again
      const nodes = await serverAction.getNodes({ glossaryId });
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

export const getEntryById =
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
      const entry = await serverAction.getEntryById({
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
    genre,
    subGenre,
  }: {
    id: string;
    name: string;
    description: {
      markdown: string;
      string: string;
    };
    genre: string;
    subGenre: string;
  }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    try {
      const glossary = await serverAction.createGlossary({
        id,
        name,
        description,
        genre,
        subGenre,
      });
      dispatch(
        initializeGlossary({
          glossaryId: glossary.id,
          name: glossary.name,
          description: glossary.description,
          genre: glossary.genre,
          subGenre: glossary.subGenre,
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

export const createNodeAndSection =
  ({ node }: { node: GlossaryNode }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, name, entryType, parentId, glossaryId } = node;
    dispatch(addGlossaryNode({ glossaryId, nodeId: id, nodeData: node }));
    try {
      await serverAction.createNodeAndSection({
        id,
        name,
        entryType,
        fileType: 'section',
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
  ({ node }: { node: GlossaryNode }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, glossaryId, fileType, name, entryType } = node;
    const backupNode = cloneDeep(selectNodeById(glossaryId, id)(getState()));
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
    try {
      await serverAction.renameNodeAndEntry({
        id,
        name,
        entryType,
        fileType,
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

export const deleteEntry =
  ({ node }: { node: GlossaryNode }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const { id, entryType, fileType, glossaryId } = node;
    const backupNode = cloneDeep(selectNodeById(glossaryId, id)(getState()));
    dispatch(removeGlossaryNode({ glossaryId, nodeId: id }));
    try {
      await serverAction.deleteEntry({ id, entryType, fileType, glossaryId });
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

// export const updateEntry =
//   ({
//     node,
//     content,
//   }: {
//     node: GlossaryNode;
//     content?: Record<string, any>;
//   }): AppThunk =>
//   async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
//     const { id, entryType, fileType, glossaryId } = node;
//     console.log('Updating entry:', content);
//     const backupNode = cloneDeep(selectNodeById(glossaryId, id)(getState()));
//     const updatedNode = { ...node, name: content?.name || node.name };
//     dispatch(
//       updateGlossaryNode({ glossaryId, nodeId: id, nodeData: updatedNode })
//     );
//     const backupEntry = cloneDeep(selectEntryById(glossaryId, id)(getState()));
//     dispatch(
//       updateGlossaryEntry({
//         glossaryId,
//         entryId: id,
//         content: { ...backupEntry, ...content },
//       })
//     );
//     try {
//       await serverAction.updateEntry({
//         id,
//         entryType,
//         fileType,
//         entryData: content,
//       });
//     } catch (error) {
//       console.error('Error updating node:', error);
//       dispatch(
//         updateGlossaryNode({
//           glossaryId,
//           nodeId: id,
//           nodeData: { ...backupNode },
//         })
//       );
//       dispatch(
//         showSnackbar({
//           message: `${node.name} failed to update. Try again later.`,
//           type: 'error',
//           duration: 3000,
//         })
//       );
//     }
//   };

export const updateGlossaryThunk =
  ({ id, updates }: { id: string; updates: Record<string, any> }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    try {
      dispatch(updateGlossary({ id, updates }));
      await serverAction.updateGlossary({
        id,
        updates,
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
    genre,
    subGenre,
  }: {
    id: string;
    name: string;
    description: string;
    genre: Genre;
    subGenre: string;
  }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    dispatch(
      initializeGlossary({
        glossaryId: id,
        name,
        description,
        genre,
        subGenre,
      })
    );
    dispatch(setActiveGlossaryId({ glossaryId: id }));
  };

export const getOptionsByProperty =
  ({
    glossaryId,
    entryId,
    property,
    inheritanceMap,
  }: {
    glossaryId: string;
    entryId: string;
    property: keyof GlossaryEntry;
    inheritanceMap: InheritanceMap;
  }): AppThunk =>
  async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      // You must provide all required fields for the parameter object
      // Example values are provided below; replace them as needed
      const response = await serverAction.getOptionsByProperty({
        property,
        inheritanceMap,
      });
      const options = response.results;
      dispatch(addOptionsForEntry({ glossaryId, entryId, property, options }));
    } catch (error) {
      console.error('Error fetching options by property:', error);
      dispatch(
        showSnackbar({
          message: 'Error fetching options. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };

export const openEditGlossary =
  (): AppThunk =>
  (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const activeGlossaryId = getState().glossary.activeGlossaryId;
    if (!activeGlossaryId) {
      dispatch(
        showSnackbar({
          message: 'No active glossary selected.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    const glossary = getState().glossary.glossaries[activeGlossaryId];
    if (!glossary) {
      dispatch(
        showSnackbar({
          message: 'Active glossary not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    dispatch(
      addTab({
        name: glossary.name,
        mode: 'edit',
        tool: 'editGlossary',
        tabType: 'glossary',
        id: glossary.id,
        tabId: newId(),
        scroll: 0,
        activate: true,
        disableMenu: true,
        preventSplit: false,
      })
    );
  };

const thunks = {
  getGlossaries,
  getNodes,
  createGlossary,
  createNodeAndSection,
  renameNodeAndEntry,
  deleteEntry,
  updateGlossaryThunk,
  addAndActivateGlossary,
  getEntryById,
  getOptionsByProperty,
};

export default thunks;
