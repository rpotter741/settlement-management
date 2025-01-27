import { createSlice, createSelector } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { setKeypathValue as set } from 'utility/setKeypathValue.js';
import createNewAttribute from '../helpers/initializeAttribute.js';

const attributesSlice = createSlice({
  name: 'attributes',
  initialState: {
    byId: {},
    allIds: [],
    edit: {},
  },
  reducers: {
    initializeAttribute(state) {
      const newAttr = createNewAttribute();
      state.byId[newAttr.id] = newAttr;
      state.allIds.push(newAttr.id);
    },
    addAttribute(state, action) {
      const { attribute } = action.payload;
      state.byId[attribute.id] = attribute;
      state.allIds.push(attribute.id);
    },
    initializeEdit(state, action) {
      const { id } = action.payload;
      state.edit = cloneDeep(state.byId[id]);
    },
    saveAttribute(state, action) {
      const { id } = action.payload;
      const editClone = cloneDeep(state.edit);
      console.log('editClone', editClone);
      console.log('state.byId[id]', state.byId[id]);
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

export default attributesSlice.reducer;
