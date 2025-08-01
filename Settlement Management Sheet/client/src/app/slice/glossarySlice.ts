import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remove, set } from 'lodash';
import { GlossaryEntry, GlossaryNode } from 'types/index.js';
import { GlossaryState } from '../types/GlossaryTypes.js';
import { rehydrateGlossaryTree } from '../../features/Glossary/utils/rehydrateGlossary.js';
import sortByIndex from '../../features/Glossary/utils/sortByIndex.js';
import { Genre } from '@/components/shared/Metadata/GenreSelect.js';

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
        description: {
          markdown: string;
          string: string;
        };
        genre: Genre;
        subGenre: string;
        integrationState: any;
      }>
    ) => {
      const {
        glossaryId,
        name,
        description,
        genre,
        subGenre,
        integrationState,
      } = action.payload;
      state.glossaries[glossaryId] = {
        name,
        description,
        id: glossaryId,
        genre,
        subGenre,
        hydrated: false,
        loading: true,
        error: null,
        nodes: {},
        structure: [],
        renderState: {},
        entries: {},
        options: {},
        integrationState,
      };
    },
    setGlossaryLoading: (
      state,
      action: PayloadAction<{ glossaryId: string; loading: boolean }>
    ) => {
      const { glossaryId, loading } = action.payload;
      state.glossaries[glossaryId].loading = loading;
    },
    removeGlossary: (state, action: PayloadAction<{ glossaryId: string }>) => {
      const { glossaryId } = action.payload;
      if (state.glossaries[glossaryId]) {
        delete state.glossaries[glossaryId];
      } else {
        console.warn(`Glossary with id ${glossaryId} not found for removal.`);
      }
      if (state.activeGlossaryId === glossaryId) {
        state.activeGlossaryId = null;
      }
    },
    setGlossaryError: (
      state,
      action: PayloadAction<{ glossaryId: string; error: string | null }>
    ) => {
      const { glossaryId, error } = action.payload;
      state.glossaries[glossaryId].error = error;
    },
    updateGlossary: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Record<string, any>;
      }>
    ) => {
      const { id, updates } = action.payload;
      const glossary = state.glossaries[id];
      if (glossary) {
        Object.assign(glossary, updates);
      } else {
        console.warn(`Glossary with id ${id} not found for update.`);
      }
    },
    updateGlossaryTerm: (
      state,
      action: PayloadAction<{
        id: string;
        key: string;
        value: string | null;
      }>
    ) => {
      const { id, key, value } = action.payload;
      const glossary = state.glossaries[id];
      if (glossary) {
        if (!glossary.integrationState?.terms) {
          glossary.integrationState.terms = {};
        }
        if (value === null || value === undefined) {
          delete glossary.integrationState.terms[key];
        } else {
          glossary.integrationState.terms[key] = value;
        }
      } else {
        console.warn(`Glossary with id ${id} not found for term update.`);
      }
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
    addGlossaryEntry: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        entryId: string;
        entryData: GlossaryEntry;
      }>
    ) => {
      const { glossaryId, entryId, entryData } = action.payload;
      const glossary = state.glossaries[glossaryId];
      if (!glossary) return;

      // Ensure the entry has a unique ID
      if (!entryData.id) {
        entryData.id = entryId;
      }

      // Add the new entry to the glossary
      glossary.entries[entryId] = entryData;
    },
    updateGlossaryEntry: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        entryId: string;
        content: Record<string, any>;
      }>
    ) => {
      const { glossaryId, entryId, content } = action.payload;
      const glossary = state.glossaries[glossaryId];
      if (glossary) {
        const entry = glossary.entries[entryId];
        if (entry) {
          Object.entries(content).forEach(([key, value]) => {
            if (key in entry) {
              (entry as GlossaryEntry)[key as keyof GlossaryEntry] = value;
            } else {
              console.warn(`Key ${key} does not exist in entry ${entryId}`);
            }
          });
        }
      }
    },
    addOptionsForEntry: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        entryId: string;
        property: keyof GlossaryEntry;
        options: Record<'inherited' | 'local' | 'other', string[]>;
      }>
    ) => {
      const { glossaryId, entryId, property, options } = action.payload;
      const glossary = state.glossaries[glossaryId];
      if (glossary) {
        if (!glossary.options[entryId]) {
          console.warn(
            `Entry ${entryId} not found in glossary ${glossaryId}. Creating...`
          );
          glossary.options[entryId] = {};
        }
        glossary.options[entryId][property] = {
          inherited: options.inherited.map((str) => ({ id: str, name: str })),
          local: options.local.map((str) => ({ id: str, name: str })),
          other: options.other.map((str) => ({ id: str, name: str })),
        };
      }
    },
  },
});

export const {
  initializeGlossary,
  setGlossaryLoading,
  setGlossaryError,
  updateGlossary,
  setGlossaryNodes,
  updateGlossaryNode,
  updateGlossaryNodes,
  updateGlossaryEntry,
  updateGlossaryTerm,
  addGlossaryNode,
  removeGlossaryNode,
  setActiveGlossaryId,
  toggleExpand,
  toggleExpandAll,
  toggleNameEdit,
  addGlossaryEntry,
  removeGlossary,
  addOptionsForEntry,
} = glossarySlice.actions;

export default glossarySlice.reducer;
