import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep, remove, set } from 'lodash';
import {
  GlossaryEntry,
  GlossaryNode,
  GlossarySection,
  SubModelType,
  Genre,
  GenericObject,
  GlossaryEntryType,
} from 'types/index.js';
import { GlossaryState, GlossaryStateEntry } from '../types/GlossaryTypes.js';
import { rehydrateGlossaryTree } from '../../features/Glossary/utils/rehydrateGlossary.js';
import sortByIndex from '../../features/Glossary/utils/sortByIndex.js';
import { SubModelTypes } from '@/features/Glossary/utils/getPropertyLabel.js';
import { VisibilitySetting } from '@/features/Glossary/EditGlossary/components/GlossaryPropertyLabels.js';
import {
  defaultThemeState,
  ThemeKeys,
} from '@/features/Glossary/EditGlossary/Palette/CustomizePalette.js';
import { dark } from '@mui/material/styles/createPalette.js';
import {
  SubTypeCompoundData,
  SubTypeCompoundDataTypes,
  SubTypeCompoundDefinition,
} from '@/features/Glossary/EditGlossary/Templates/components/types.js';

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
            (entry as any)[key] = value;
          });
        }
      }
    },
    appendEntrySubModel: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        entryId: string;
        subModel: string;
        data: Record<string, any>;
      }>
    ) => {
      const { glossaryId, entryId, subModel, data } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (glossary) {
        const entry = glossary.entries[entryId];
        if (entry) {
          //@ts-ignore
          entry[subModel as keyof typeof entry] = data;
        } else {
          console.warn(`Entry ${entryId} not found in glossary ${glossaryId}.`);
        }
      } else {
        console.warn(
          `Glossary ${glossaryId} not found for appending sub-model.`
        );
      }
    },
    updateEntrySubModel: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        entryId: string;
        subModel: SubModelType;
        keypath: string;
        data: any;
      }>
    ) => {
      const { glossaryId, entryId, subModel, keypath, data } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (glossary) {
        const entry = glossary.entries[entryId] as GlossarySection;
        const entrySubModel = entry[subModel];
        if (entrySubModel) {
          set(entrySubModel, keypath, data);
        } else {
          console.warn(`Entry ${entryId} not found in glossary ${glossaryId}.`);
        }
      } else {
        console.warn(
          `Glossary ${glossaryId} not found for updating sub-model.`
        );
      }
    },
    syncEntrySubModel: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        entryId: string;
        subModel: SubModelType;
      }>
    ) => {
      const { glossaryId, entryId, subModel } = action.payload;
      const editGlossary = state.glossaries.edit.byId[glossaryId];
      const staticGlossary = state.glossaries.static.byId[glossaryId];
      if (editGlossary && staticGlossary) {
        const editEntry = editGlossary.entries[entryId];
        const staticEntry = staticGlossary.entries[entryId];
        if (editEntry && staticEntry) {
          (staticEntry as any)[subModel] = cloneDeep(
            (editEntry as any)[subModel]
          );
        } else {
          console.warn(
            `Entry ${entryId} not found in either edit or static glossaries for ${glossaryId}.`
          );
        }
      } else {
        console.warn(`Glossary ${glossaryId} not found for syncing sub-model.`);
      }
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
    addSubTypeToGlossary: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        subType: any;
      }>
    ) => {
      const { glossaryId, subType } = action.payload;
      const { id } = subType;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary) return;

      if (!glossary.subTypes) {
        glossary.subTypes = {};
      }
      if (!glossary.subTypes[subType.entryType]) {
        glossary.subTypes[subType.entryType] = {};
      }
      if (glossary.subTypes[subType.entryType][id]) return;

      glossary.subTypes[subType.entryType][id] = subType;
    },
    addSubTypeGroup: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        type: GlossaryEntryType;
        subTypeId: string;
        group: {
          id: string;
          name: string;
          propertyOrder: string[];
          propertyData: GenericObject;
        };
      }>
    ) => {
      const { glossaryId, subTypeId, group, type } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !glossary.subTypes) return;
      const subType = glossary.subTypes[type][subTypeId];
      if (!subType) return;
      subType.groupOrder.push(group.id);
      subType.groupData[group.id] = group;
    },
    reorderSubTypeGroups: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        type: GlossaryEntryType;
        subTypeId: string;
        newOrder: string[];
      }>
    ) => {
      const { glossaryId, subTypeId, newOrder, type } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !glossary.subTypes) return;
      const subType = glossary.subTypes[type][subTypeId];
      if (!subType) return;
      subType.groupOrder = newOrder;
    },
    addSubTypeProperty: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        type: GlossaryEntryType;
        subTypeId: string;
        groupId: string;
        property: {
          id: string;
          name: string;
          type: string;
          value: any;
        };
      }>
    ) => {
      const { glossaryId, subTypeId, groupId, property, type } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !glossary.subTypes) return;
      const subType = glossary.subTypes[type][subTypeId];

      const group = subType.groupData[groupId];
      if (!subType || !group) return;
      group.propertyOrder.push(property.id);
      group.propertyData[property.id] = property;
      // Ensure properties are sorted by order after addition
    },
    updateSubTypeProperty: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        type: GlossaryEntryType;
        subTypeId: string;
        groupId: string;
        propertyId: string;
        keypath: string;
        value: any;
      }>
    ) => {
      const {
        glossaryId,
        subTypeId,
        groupId,
        propertyId,
        keypath,
        value,
        type,
      } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !glossary.subTypes) return;
      const subType = glossary.subTypes[type][subTypeId];
      if (!subType) return;
      const group = subType.groupData[groupId];
      if (!group) return;
      const property = group.propertyData[propertyId];
      if (!property) return;
      set(property, keypath, value);
    },
    changeSubTypeProperty: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        type: GlossaryEntryType;
        subTypeId: string;
        groupId: string;
        propertyId: string;
        property: GenericObject;
      }>
    ) => {
      const { glossaryId, subTypeId, groupId, propertyId, type } =
        action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !glossary.subTypes) return;
      const subType = glossary.subTypes[type][subTypeId];
      if (!subType) return;
      const group = subType.groupData[groupId];
      if (!group) return;
      const property = group.propertyData[propertyId];
      if (!property) return;
      group.propertyData[propertyId] = action.payload.property;
    },
    updateSubTypeAnchor: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        type: GlossaryEntryType;
        subTypeId: string;
        anchor: 'primary' | 'secondary';
        value: string | null;
      }>
    ) => {
      const { glossaryId, type, subTypeId, anchor, value } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !glossary.subTypes) return;
      const subType = glossary.subTypes[type][subTypeId];
      if (!subType) return;
      subType.anchors[anchor] = value;
    },
    updateSubTypeName: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        type: GlossaryEntryType;
        subTypeId: string;
        name: string;
      }>
    ) => {
      const { glossaryId, type, subTypeId, name } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !glossary.subTypes) return;
      const subType = glossary.subTypes[type][subTypeId];
      if (!subType) return;
      subType.name = name;
    },
    updateSubTypeSubProperty: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        type: GlossaryEntryType;
        subTypeId: string;
        groupId: string;
        propertyId: string;
        side: 'left' | 'right';
        keypath: string;
        value: any;
      }>
    ) => {
      const {
        glossaryId,
        type,
        subTypeId,
        groupId,
        propertyId,
        side,
        keypath,
        value,
      } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !glossary.subTypes) return;
      const subType = glossary.subTypes[type][subTypeId];
      if (!subType) return;
      const group = subType.groupData[groupId];
      if (!group) return;
      const property: SubTypeCompoundDefinition =
        group.propertyData[propertyId];
      if (!property) return;
      const subProperty = property[side];
      if (!subProperty) return;
      set(subProperty, keypath, value);
    },
    changeSubTypeSubProperty: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        type: GlossaryEntryType;
        subTypeId: string;
        groupId: string;
        propertyId: string;
        side: 'left' | 'right';
        subProperty: GenericObject;
      }>
    ) => {
      const { glossaryId, type, subTypeId, groupId, propertyId, side } =
        action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !glossary.subTypes) return;
      const subType = glossary.subTypes[type][subTypeId];
      if (!subType) return;
      const group = subType.groupData[groupId];
      if (!group) return;
      const property = group.propertyData[propertyId];
      if (!property) return;
      if (!property[side]) return;
      property[side] = action.payload.subProperty;
    },
    changeSubTypeGroupName: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        type: GlossaryEntryType;
        subTypeId: string;
        groupId: string;
        name: string;
      }>
    ) => {
      const { glossaryId, type, subTypeId, groupId, name } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !glossary.subTypes) return;
      const subType = glossary.subTypes[type][subTypeId];
      if (!subType) return;
      const group = subType.groupData[groupId];
      if (!group) return;
      group.name = name;
    },
    removeSubTypeGroup: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        type: GlossaryEntryType;
        subTypeId: string;
        groupId: string;
      }>
    ) => {
      const { glossaryId, type, subTypeId, groupId } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !glossary.subTypes) return;
      const subType = glossary.subTypes[type][subTypeId];
      if (!subType) return;
      delete subType.groupData[groupId];
      subType.groupOrder = subType.groupOrder.filter(
        (id: string) => id !== groupId
      );
    },
    updateAllSubTypeGroupData: (
      state,
      action: PayloadAction<{
        glossaryId: string;
        type: GlossaryEntryType;
        subTypeId: string;
        groupData: GenericObject;
      }>
    ) => {
      const { glossaryId, type, subTypeId, groupData } = action.payload;
      const glossary = state.glossaries.edit.byId[glossaryId];
      if (!glossary || !glossary.subTypes) return;
      const subType = glossary.subTypes[type][subTypeId];
      if (!subType) return;
      subType.groupData = groupData;
    },
  },
});

export const {
  initializeGlossary,
  appendEntrySubModel,
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
  syncGlossaryIntegrationState,
  addOptionsForEntry,
  updateEntrySubModel,
  syncEntrySubModel,
  updatePalette,
  resetPalette,
  savePalette,
  addSubTypeToGlossary,
  addSubTypeGroup,
  addSubTypeProperty,
  updateSubTypeProperty,
  updateSubTypeAnchor,
  changeSubTypeProperty,
  updateSubTypeName,
  updateSubTypeSubProperty,
  changeSubTypeSubProperty,
  changeSubTypeGroupName,
  removeSubTypeGroup,
  reorderSubTypeGroups,
  updateAllSubTypeGroupData,
} = glossarySlice.actions;

export default glossarySlice.reducer;
