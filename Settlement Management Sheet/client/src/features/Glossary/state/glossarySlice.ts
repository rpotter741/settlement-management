import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remove, set } from 'lodash';
import { GlossaryNode } from '../../../../../types';
import { GlossaryState } from './types';
import { rehydrateGlossaryTree } from '../helpers/rehydrateGlossary';
import sortByIndex from '../helpers/sortByIndex';

const defaultGlossaryState: GlossaryState = {
  glossaries: {},
  activeGlossaryId: null,
  snackbar: null,
};

const glossarySlice = createSlice({
  name: 'glossary',
  initialState: defaultGlossaryState,
  reducers: {
    initializeGlossary: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        name: string;
        description: string;
      }>
    ) => {
      const { glossaryId, name, description } = action.payload;
      state.glossaries[glossaryId] = {
        name,
        description,
        id: glossaryId,
        hydrated: false,
        loading: true,
        error: null,
        nodes: {},
        structure: [],
        renderState: {},
      };
    },
    setGlossaryLoading: (
      state,
      action: PayloadAction<{ glossaryId: string; loading: boolean }>
    ) => {
      const { glossaryId, loading } = action.payload;
      state.glossaries[glossaryId].loading = loading;
    },
    setGlossaryError: (
      state,
      action: PayloadAction<{ glossaryId: string; error: string | null }>
    ) => {
      const { glossaryId, error } = action.payload;
      state.glossaries[glossaryId].error = error;
    },
    setGlossaryNodes: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        nodes: Record<string, GlossaryNode>;
        structure: GlossaryNode[];
        renderState: Record<string, { expanded: boolean; rename: boolean }>;
      }>
    ) => {
      const { glossaryId, nodes, structure, renderState } = action.payload;
      state.glossaries[glossaryId].nodes = nodes;
      state.glossaries[glossaryId].structure = structure;
      state.glossaries[glossaryId].renderState = renderState;
      state.glossaries[glossaryId].hydrated = true;
    },

    updateGlossaryNode: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        nodeId: string;
        nodeData: Partial<GlossaryNode>;
      }>
    ) => {
      const { glossaryId, nodeId, nodeData } = action.payload;
      const glossary = state.glossaries[glossaryId];
      if (glossary) {
        const node = glossary.nodes[nodeId];
        console.log(node.name, 'node name before update:', node);
        console.log(nodeData.name, 'nodeData to update:', nodeData);
        if (node && node.flatIndex !== undefined) {
          Object.assign(node, nodeData);
          glossary.structure[node.flatIndex].name = node.name;
          glossary.structure = sortByIndex([...glossary.structure]);
        }
      }
    },
    updateGlossaryNodes: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        updates: { nodeId: string; nodeData: Partial<GlossaryNode> }[];
      }>
    ) => {
      const { glossaryId, updates } = action.payload;
      const glossary = state.glossaries[glossaryId];
      if (glossary) {
        updates.forEach(({ nodeId, nodeData }) => {
          const node = glossary.nodes[nodeId];
          if (node) Object.assign(node, nodeData);
        });
        glossary.structure = sortByIndex([...glossary.structure]);
      }
    },
    addGlossaryNode: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        nodeId: string;
        nodeData: GlossaryNode;
      }>
    ) => {
      const { glossaryId, nodeId, nodeData } = action.payload;
      const glossary = state.glossaries[glossaryId];
      if (!glossary) return;

      const withFlatIndex = {
        ...nodeData,
        flatIndex: glossary.structure.length,
      };

      glossary.nodes[nodeId] = withFlatIndex;
      glossary.structure.push(withFlatIndex);
      glossary.renderState[nodeId] = { expanded: false, rename: false };
      glossary.structure = sortByIndex([...glossary.structure]);

      if (withFlatIndex.parentId) {
        const parent = glossary.nodes[withFlatIndex.parentId];
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(withFlatIndex);
        }
      }
    },
    removeGlossaryNode: (
      state,
      action: PayloadAction<{ glossaryId: string; nodeId: string }>
    ) => {
      const { glossaryId, nodeId } = action.payload;
      const glossary = state.glossaries[glossaryId];
      if (!glossary) return;

      const collectDescendantIds = (id: string, acc: string[]) => {
        const node = glossary.nodes[id];
        if (!node) return;
        acc.push(id);
        const children = Object.values(glossary.nodes).filter(
          (n) => n.parentId === id
        );
        children.forEach((child) => collectDescendantIds(child.id, acc));
      };

      const allToDelete: string[] = [];
      collectDescendantIds(nodeId, allToDelete);

      allToDelete.forEach((id) => {
        delete glossary.nodes[id];
        delete glossary.renderState[id];
      });

      glossary.structure = glossary.structure.filter(
        (node) => !allToDelete.includes(node.id)
      );

      glossary.structure = sortByIndex([...glossary.structure]);
    },
    toggleExpand: (
      state,
      action: PayloadAction<{
        glossaryId: string | null;
        nodeId: string;
        expanded: boolean;
      }>
    ) => {
      const { glossaryId, nodeId, expanded } = action.payload;
      if (glossaryId === null) return;
      const glossary = state.glossaries[glossaryId];
      if (glossary) {
        glossary.renderState[nodeId].expanded = expanded;
      }
    },
    toggleExpandAll: (
      state,
      action: PayloadAction<{ glossaryId: string; expand: boolean }>
    ) => {
      const { glossaryId, expand } = action.payload;
      const glossary = state.glossaries[glossaryId];
      if (glossary) {
        glossary.structure.forEach((node) => {
          glossary.renderState[node.id].expanded = expand;
        });
      }
    },
    setActiveGlossaryId: (
      state,
      action: PayloadAction<{ glossaryId: string | null }>
    ) => {
      const { glossaryId } = action.payload;
      state.activeGlossaryId = glossaryId;
    },
    setSnackbar: (
      state,
      action: PayloadAction<{
        snackbar: {
          message: string;
          type: 'error' | 'success' | 'info' | 'warning';
          duration: number;
          rollback?: any;
          rollbackFn?: (rollback: any) => void;
        } | null;
      }>
    ) => {
      const { snackbar } = action.payload;
      state.snackbar = snackbar;
    },
    toggleNameEdit: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        nodeId: string;
      }>
    ) => {
      const { glossaryId, nodeId } = action.payload;
      const glossary = state.glossaries[glossaryId];
      if (glossary) {
        if (!glossary.renderState[nodeId]?.rename) {
          glossary.renderState[nodeId].rename = true;
        } else {
          glossary.renderState[nodeId].rename = false;
        }
      }
    },
  },
});

export const {
  initializeGlossary,
  setGlossaryLoading,
  setGlossaryError,
  setGlossaryNodes,
  updateGlossaryNode,
  updateGlossaryNodes,
  addGlossaryNode,
  removeGlossaryNode,
  setSnackbar,
  setActiveGlossaryId,
  toggleExpand,
  toggleExpandAll,
  toggleNameEdit,
} = glossarySlice.actions;

export default glossarySlice.reducer;
