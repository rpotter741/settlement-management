import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep, get, remove, set } from 'lodash';
import {
  GlossaryEntry,
  GlossaryNode,
  SubModelType,
  Genre,
} from 'types/index.js';
import { GlossaryState, GlossaryStateEntry } from '../types/GlossaryTypes.js';
import sortByIndex from '../../features/Glossary/utils/sortByIndex.js';
import { SubModelTypes } from '@/features/Glossary/utils/getPropertyLabel.js';
import { ThemeKeys } from '@/features/Glossary/EditGlossary/Palette/CustomizePalette.js';

const defaultGlossaryState: GlossaryState = {
  glossaries: {
    edit: {
      byId: {},
      allIds: [],
    },
    static: {
      byId: {},
      allIds: [],
    },
  },
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
        theme: string | { light: any; dark: any };
        subTypes?: Record<string, any[]>;
      }>
    ) => {
      const {
        glossaryId,
        name,
        description,
        genre,
        subGenre,
        integrationState,
        theme,
        subTypes = {},
      } = action.payload;
      const newGlossary: GlossaryStateEntry = {
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
        visibility: null,
        integrationState,
        theme,
        subTypes,
      };
      state.glossaries.static.byId[glossaryId] = newGlossary;
      state.glossaries.static.allIds.push(glossaryId);
      state.glossaries.edit.byId[glossaryId] = newGlossary;
      state.glossaries.edit.allIds.push(glossaryId);
    },
    setGlossaryLoading: (
      state,
      action: PayloadAction<{ glossaryId: string; loading: boolean }>
    ) => {
      const { glossaryId, loading } = action.payload;
      state.glossaries.edit.byId[glossaryId].loading = loading;
    },
    removeGlossary: (state, action: PayloadAction<{ glossaryId: string }>) => {
      const { glossaryId } = action.payload;
      if (state.glossaries.edit.byId[glossaryId]) {
        delete state.glossaries.edit.byId[glossaryId];
        delete state.glossaries.static.byId[glossaryId];
        remove(state.glossaries.edit.allIds, (id) => id === glossaryId);
        remove(state.glossaries.static.allIds, (id) => id === glossaryId);
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
      state.glossaries.edit.byId[glossaryId].error = error;
    },
    updateGlossary: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Record<string, any>;
      }>
    ) => {
      const { id, updates } = action.payload;
      const glossary = state.glossaries.edit.byId[id];
      if (glossary) {
        Object.entries(updates).forEach(([key, value]) => {
          set(glossary, key, value);
        });
      } else {
        console.warn(`Glossary with id ${id} not found for update.`);
      }
    },
    updateGlossaryTerm: (
      state,
      action: PayloadAction<{
        id: string;
        key: string;
        subModel: SubModelTypes;
        value: string | null;
      }>
    ) => {
      const { id, key, subModel, value } = action.payload;
      const glossary = state.glossaries.edit.byId[id];
      if (glossary) {
        if (!glossary.integrationState) {
          glossary.integrationState = {};
        }
        if (glossary.integrationState[subModel] === undefined) {
          glossary.integrationState[subModel] = {};
        }
        if (glossary.integrationState[subModel][key] === undefined) {
          glossary.integrationState[subModel][key] = {};
        }
        if (value === null || value === undefined) {
          delete glossary.integrationState[subModel][key].label;
        } else {
          glossary.integrationState[subModel][key].label = value;
        }
      } else {
        console.warn(`Glossary with id ${id} not found for term update.`);
      }
    },
    syncGlossaryIntegrationState: (
      state,
      action: PayloadAction<{ id: string }>
    ) => {
      const { id } = action.payload;
      const editGlossary = state.glossaries.edit.byId[id];
      const staticGlossary = state.glossaries.static.byId[id];
      if (editGlossary) {
        staticGlossary.integrationState = {
          ...editGlossary.integrationState,
        };
      } else {
        console.warn(`Glossary with id ${id} not found for term sync.`);
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
      state.glossaries.edit.byId[glossaryId].nodes = nodes;
      state.glossaries.edit.byId[glossaryId].structure = structure;
      state.glossaries.edit.byId[glossaryId].renderState = renderState;
      state.glossaries.edit.byId[glossaryId].hydrated = true;
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
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (glossary) {
        const node = glossary.nodes[nodeId];
        if (node) {
          for (const [key, value] of Object.entries(nodeData)) {
            if (value !== undefined) {
              (node as any)[key] = value;
            }
          }
          const index = glossary.structure.findIndex((n) => n.id === nodeId);
          if (index !== -1) glossary.structure[index].name = node.name;
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
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (glossary) {
        updates.forEach(({ nodeId, nodeData }) => {
          const node = glossary.nodes[nodeId];
          if (node) Object.assign(node, nodeData);
        });
        glossary.structure = sortByIndex([...glossary.structure]);
      }
    },
    reparentNodes: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        movedNodes: GlossaryNode[];
        newParentId: string | null;
      }>
    ) => {
      const { glossaryId, movedNodes, newParentId } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary) return;

      movedNodes.forEach((moved) => {
        const nodeId = moved.id;
        if (!nodeId) return;

        // Ensure we operate on the canonical node in glossary.nodes
        const node = glossary.nodes[nodeId];
        if (!node) return;

        // Prevent cycles: can't reparent a node to itself or one of its descendants
        if (
          newParentId &&
          (newParentId === nodeId || isAncestor(glossary, nodeId, newParentId))
        ) {
          console.warn(
            `Skipping reparent of ${nodeId} to ${newParentId} to avoid cycle`
          );
          return;
        }

        const oldParentId = node.parentId || null;
        if (oldParentId) {
          const oldParent = glossary.nodes[oldParentId];
          if (oldParent && oldParent.children) {
            oldParent.children = oldParent.children.filter(
              (child) => child.id !== nodeId
            );
          }
        }

        // Update the node's parentId on both the nodes map and the structure entries
        node.parentId = newParentId;
        const structItem = glossary.structure.find((n) => n.id === nodeId);
        if (structItem) {
          structItem.parentId = newParentId;
        }

        // Add to new parent's children list (if applicable)
        if (newParentId) {
          const newParent = glossary.nodes[newParentId];
          if (newParent) {
            if (!newParent.children) newParent.children = [];
            // ensure we don't add duplicates
            if (!newParent.children.find((c) => c.id === nodeId)) {
              newParent.children.push(node);
            }
            // make parent expanded so moved node is visible
            if (!glossary.renderState[newParentId]) {
              glossary.renderState[newParentId] = {
                expanded: true,
                rename: false,
              };
            } else {
              glossary.renderState[newParentId].expanded = true;
            }
          }
        }

        // Ensure renderState exists for the node
        if (!glossary.renderState[nodeId]) {
          glossary.renderState[nodeId] = { expanded: false, rename: false };
        }
      });

      // Normalize children references to point to canonical objects in glossary.nodes
      Object.values(glossary.nodes).forEach((n) => {
        if (n.children && n.children.length > 0) {
          n.children = n.children
            .map((c) => glossary.nodes[c.id] || c)
            .filter(Boolean);
          // remove duplicates
          n.children = n.children.filter(
            (child, idx, arr) => arr.findIndex((c) => c.id === child.id) === idx
          );
        }
      });

      // Make sure structure entries reflect changes, then sort and reindex flatIndex
      glossary.structure = sortByIndex([...glossary.structure]);
      glossary.structure.forEach((s, idx) => {
        s.flatIndex = idx;
        if (glossary.nodes[s.id]) {
          glossary.nodes[s.id].flatIndex = idx;
        }
      });
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
      const glossary = state.glossaries.edit.byId[glossaryId];
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
    bulkAddGlossaryNodes: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        nodes: GlossaryNode[];
      }>
    ) => {
      const { glossaryId, nodes } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary) return;

      nodes.forEach((nodeData) => {
        const nodeId = nodeData.id;
        if (!nodeId) return;

        const withFlatIndex = {
          ...nodeData,
          flatIndex: glossary.structure.length,
        };

        glossary.nodes[nodeId] = withFlatIndex;
        glossary.structure.push(withFlatIndex);
        glossary.renderState[nodeId] = { expanded: false, rename: false };

        if (withFlatIndex.parentId) {
          const parent = glossary.nodes[withFlatIndex.parentId];
          if (parent) {
            if (!parent.children) parent.children = [];
            parent.children.push(withFlatIndex);
            glossary.renderState[parent.id].expanded = true;
          }
        }
      });
    },
    bulkRemoveReferencesToNodes: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        nodeIds: string[];
        affectedEntries: Record<
          string,
          { keypath: string; oldValue: any; newValue: any; compKey?: string }[]
        >;
      }>
    ) => {
      const { glossaryId, nodeIds, affectedEntries } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary) return;

      nodeIds.forEach((nodeId) => {
        // Remove node from nodes
        delete glossary.nodes[nodeId];
        // Remove node from structure
        glossary.structure = glossary.structure.filter(
          (node) => node.id !== nodeId
        );
        // Remove render state
        delete glossary.renderState[nodeId];
      });

      // Update affected entries
      Object.entries(affectedEntries).forEach(([entryId, changes]) => {
        const entry = glossary.entries[entryId];
        if (entry) {
          changes.forEach(({ keypath, oldValue, newValue, compKey }) => {
            if (compKey) {
              const order = keypath.split('.').slice(0, 4).join('.') + '.order';
              const currentOrder = get(entry, order, []);
              const newOrder = [...currentOrder].filter(
                (id: string) => id !== compKey
              );
              set(entry, order, newOrder);
            }
            set(entry, keypath, newValue);
          });
        }
      });
    },
    removeGlossaryNode: (
      state,
      action: PayloadAction<{ glossaryId: string; nodeId: string }>
    ) => {
      const { glossaryId, nodeId } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
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
    removeGlossaryEntry: (
      state,
      action: PayloadAction<{ glossaryId: string; entryId: string }>
    ) => {
      const { glossaryId, entryId } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (glossary) {
        console.log(
          cloneDeep(glossary.entries[entryId]?.name),
          'deleting entry'
        );
        delete glossary.entries[entryId];
      }
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
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (glossary) {
        glossary.renderState[nodeId].expanded = expanded;
      }
    },
    toggleExpandAll: (
      state,
      action: PayloadAction<{ glossaryId: string; expand: boolean }>
    ) => {
      const { glossaryId, expand } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
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
      const glossary = state.glossaries.edit.byId[glossaryId];
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
      const glossary = state.glossaries.static.byId[glossaryId];
      const editGlossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !editGlossary) return;
      // Ensure the entry has a unique ID
      if (!entryData.id) {
        entryData.id = entryId;
      }
      // Add the new entry to the glossary
      glossary.entries[entryId] = entryData;
      editGlossary.entries[entryId] = entryData;
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
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (glossary) {
        const entry = glossary.entries[entryId];
        if (entry) {
          Object.entries(content).forEach(([key, value]) => {
            set(entry, key, value);
          });
          console.log(cloneDeep(entry));
        }
      }
    },
    batchRollbackGlossaryEntries: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        rollbackData: Record<string, { keypath: string; value: any }[]>;
      }>
    ) => {
      const { glossaryId, rollbackData } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (glossary) {
        Object.entries(rollbackData).forEach(([entryId, changes]) => {
          const entry = glossary.entries[entryId];
          if (entry) {
            changes.forEach(
              ({ keypath, value }: { keypath: string; value: any }) => {
                set(entry, keypath, value);
              }
            );
          }
        });
      }
    },
    batchUpdateAnchorValues: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        subType: any;
      }>
    ) => {
      const { glossaryId, subType } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary) return;
      const entries = Object.values(glossary.entries).filter(
        (e) => e.subTypeId === subType.id
      );
      if (!entries || entries.length === 0) return;
      const { primary, secondary } = subType.anchors || {};
      if (!primary && !secondary) return;
      entries.forEach((entry) => {
        if (primary) {
          const newPrimaryValue = get(entry, primary, null);
          entry.primaryAnchorValue =
            (newPrimaryValue?.value || newPrimaryValue) ?? null;
        }
        if (secondary) {
          const newSecondaryValue = get(entry, secondary, null);
          entry.secondaryAnchorValue =
            (newSecondaryValue?.value || newSecondaryValue) ?? null;
        }
      });
    },
    addOptionsForEntry: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        entryId: string;
        property: keyof GlossaryEntry;
        options: Record<
          'inherited' | 'nearby' | 'extended' | 'other',
          {
            id: string;
            name: string;
            [key: string]: any;
          }
        >;
      }>
    ) => {
      const { glossaryId, entryId, property, options } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (glossary) {
        if (!glossary.options[entryId]) {
          console.warn(
            `Entry ${entryId} not found in glossary ${glossaryId}. Creating...`
          );
          glossary.options[entryId] = {};
        }
        glossary.options[entryId][property] = {
          inherited: options.inherited,
          nearby: options.nearby,
          extended: options.extended,
          other: options.other,
        };
      }
    },
    updatePalette: (
      state,
      action: PayloadAction<{
        themeKey: ThemeKeys;
        shade: 'light' | 'main' | 'dark' | 'default' | 'paper';
        color: string;
        glossaryId: string;
        mode: 'light' | 'dark';
        defaultTheme: any;
      }>
    ) => {
      const { themeKey, shade, color, glossaryId, mode, defaultTheme } =
        action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (glossary) {
        if (
          typeof glossary.theme !== 'object' ||
          !('light' in glossary.theme) ||
          !('dark' in glossary.theme)
        ) {
          glossary.theme = {
            light: mode === 'light' ? defaultTheme : defaultTheme,
            dark: mode === 'dark' ? defaultTheme : defaultTheme,
          };
        }
        if (!glossary.theme[mode]) {
          glossary.theme[mode] = defaultTheme;
        }
        glossary.theme[mode][themeKey][shade] = color;
      } else {
        console.warn(`Glossary ${glossaryId} not found for updating palette.`);
      }
    },
    resetPalette: (
      state,
      action: PayloadAction<{
        glossaryId: string;
      }>
    ) => {
      const { glossaryId } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (glossary) {
        glossary.theme = 'default';
      } else {
        console.warn(`Glossary ${glossaryId} not found for resetting palette.`);
      }
    },
    savePalette: (
      state,
      action: PayloadAction<{
        glossaryId: string;
      }>
    ) => {
      const { glossaryId } = action.payload;
      if (!glossaryId) return;
      const editGlossary = state.glossaries.edit.byId[glossaryId];
      const staticGlossary = state.glossaries.static.byId[glossaryId];
      if (!editGlossary || !staticGlossary) return;
      staticGlossary.theme = editGlossary.theme;
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
  removeGlossaryEntry,
  setActiveGlossaryId,
  toggleExpand,
  toggleExpandAll,
  toggleNameEdit,
  addGlossaryEntry,
  removeGlossary,
  syncGlossaryIntegrationState,
  addOptionsForEntry,
  updatePalette,
  resetPalette,
  savePalette,
  batchRollbackGlossaryEntries,
  bulkAddGlossaryNodes,
  bulkRemoveReferencesToNodes,
  batchUpdateAnchorValues,
  reparentNodes,
} = glossarySlice.actions;

export default glossarySlice.reducer;

function isAncestor(
  glossary: GlossaryStateEntry,
  ancestorId: string,
  descendantId: string | null
) {
  if (!descendantId) return false;
  let cur = glossary.nodes[descendantId];
  while (cur) {
    if (cur.id === ancestorId) return true;
    //@ts-ignore
    cur = cur.parentId ? glossary.nodes[cur.parentId] : undefined;
  }
  return false;
}
