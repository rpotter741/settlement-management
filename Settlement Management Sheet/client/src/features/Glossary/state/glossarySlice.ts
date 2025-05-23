import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remove, set } from 'lodash';
import { GlossaryNode } from '../../../../../types';
import { GlossaryState } from './types';
import { rehydrateGlossaryTree } from '../helpers/rehydrateGlossary';
import sortByIndex from '../helpers/sortByIndex';

const defaultGlossaryState: GlossaryState = {
  glossaries: {},
  activeGlossaryId: null,
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
        expanded: {},
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
      }>
    ) => {
      const { glossaryId, nodes, structure } = action.payload;
      state.glossaries[glossaryId].nodes = nodes;
      state.glossaries[glossaryId].structure = structure;
    },
    rehydrateTree: (
      state,
      action: PayloadAction<{ glossaryId: string; treeData: any }>
    ) => {
      const { glossaryId, treeData } = action.payload;
      const { roots, nodeMap } = rehydrateGlossaryTree(treeData);
      state.glossaries[glossaryId].nodes = nodeMap;
      state.glossaries[glossaryId].structure = roots;
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
        if (node) {
          Object.assign(node, nodeData);
          glossary.structure = sortByIndex(glossary.nodes);
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
        glossary.structure = sortByIndex(glossary.nodes);
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
      if (glossary) {
        glossary.nodes[nodeId] = nodeData;
        glossary.structure = sortByIndex(glossary.nodes);
      }
    },
    removeGlossaryNode: (
      state,
      action: PayloadAction<{ glossaryId: string; nodeId: string }>
    ) => {
      const { glossaryId, nodeId } = action.payload;
      const glossary = state.glossaries[glossaryId];
      if (glossary) {
        const node = glossary.nodes[nodeId];
        if (node) {
          remove(glossary.structure, (n) => n.id === nodeId);
          delete glossary.nodes[nodeId];
        }
        glossary.structure = sortByIndex(glossary.nodes);
      }
    },
    toggleExpand: (
      state,
      action: PayloadAction<{ glossaryId: string; nodeId: string }>
    ) => {
      const { glossaryId, nodeId } = action.payload;
      const glossary = state.glossaries[glossaryId];
      if (glossary) {
        glossary.expanded[nodeId] = !glossary.expanded[nodeId];
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
          glossary.expanded[node.id] = expand;
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
  },
});

export const {
  initializeGlossary,
  setGlossaryLoading,
  setGlossaryError,
  setGlossaryNodes,
  rehydrateTree,
  updateGlossaryNode,
  updateGlossaryNodes,
  addGlossaryNode,
  removeGlossaryNode,
} = glossarySlice.actions;

export default glossarySlice.reducer;
