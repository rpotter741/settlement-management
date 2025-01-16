import { createSlice, createSelector } from '@reduxjs/toolkit';
import iconList from '../../components/utils/IconSelector/iconList.jsx';
import { cloneDeep } from 'lodash';
import { setKeypathValue as set } from '../../utility/setKeypathValue.js';
import { v4 as newId } from 'uuid';

const attributesSlice = createSlice({
  name: 'attributes',
  initialState: {
    byId: {},
    allIds: [],
    edit: {},
  },
  reducers: {
    initializeAttribute(state) {
      const tempId = newId(); // Temporary unique ID for the category
      const thresholds = {};
      const thresholdOrder = [];
      const maxThresholds = [9, 29, 49, 69, 84, 99, 100];
      for (let i = 0; i < 7; i++) {
        const id = newId();
        thresholds[id] = {
          name: '',
          max: maxThresholds[i],
        };
        thresholdOrder.push(id);
      }
      state.byId[tempId] = {
        id: tempId,
        name: '',
        description: '',
        values: {
          current: 0,
          maxPerLevel: 0,
          max: 0,
          bonus: 0,
        },
        healthPerLevel: 0,
        costPerLevel: 0,
        thresholds: {
          [newId()]: {
            name: '',
            max: 9,
          },
          [newId()]: {
            name: '',
            max: 29,
          },
          [newId()]: {
            name: '',
            max: 49,
          },
          [newId()]: {
            name: '',
            max: 69,
          },
          [newId()]: {
            name: '',
            max: 84,
          },
          [newId()]: {
            name: '',
            max: 99,
          },
          [newId()]: {
            name: '',
            max: 100,
          },
        },
        settlementPointCost: {
          [newId()]: {
            name: 'default',
            value: 1,
          },
        },
        icon: { ...iconList[0] },
        iconColor: '#000000',
        tags: [],
      };
      state.allIds.push(tempId);
    },
    addAttribute(state, action) {
      const {
        id,
        name,
        description,
        values,
        healthPerLevel,
        costPerLevel,
        settlementPointCost,
      } = action.payload;
      state.byId[id] = {
        id,
        name,
        description,
        values,
        healthPerLevel,
        costPerLevel,
        settlementPointCost,
      };
      state.allIds.push(id);
    },
    initializeEdit(state, action) {
      const { id } = action.payload;
      state.edit = cloneDeep(state.byId[id]);
    },
    saveAttribute(state, action) {
      const { id } = action.payload;
      const editClone = cloneDeep(state.edit);
      state.byId[id] = editClone;
    },
    updateAttributeById(state, action) {
      const { id, keypath, updates } = action.payload;
      if (state.byId[id]) {
        set(state.byId[id], keypath, updates);
      }
    },
    updateEditAttribute(state, action) {
      const { keypath, updates } = action.payload;
      set(state.edit, keypath, updates);
      console.log({ ...state.edit }, 'state.edit');
    },
    deleteEditIndex(state, action) {
      const { keypath, index } = action.payload;
      state.edit[keypath].splice(index, 1);
    },
    deleteEditKey(state, action) {
      const { keypath, key } = action.payload;
      delete state.edit[keypath][key];
    },
    updateEditIcon(state, action) {
      const { icon, color } = action.payload;
      state.edit.icon = icon;
      state.edit.iconColor = color;
    },
    deleteAttribute(state, action) {
      const { id } = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((attributeId) => attributeId !== id);
    },
    refreshAttribute(state, action) {
      const { id } = action.payload;
      state.byId[id] = { ...state.byId[id] };
    },
  },
});

export const {
  initializeAttribute,
  initializeEdit,
  saveAttribute,
  addAttribute,
  updateAttributeById,
  updateEditAttribute,
  deleteEditIndex,
  deleteEditKey,
  updateEditIcon,
  deleteAttribute,
} = attributesSlice.actions;

export const selectAttributeById = (id) => (state) => state.attributes.byId[id];
export const selectAllAttributes = (state) =>
  (state.attributes.allIds || []).map((id) => state.attributes.byId[id]);

export const selectAttributeId = (state) => state.selection.attribute;

export const selectAttribute = createSelector(
  [selectAttributeId, (state) => state.attributes.byId],
  (attrId, attributesById) => attributesById[attrId] || null
);

export default attributesSlice.reducer;
