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
      state.byId[newAttr.refId] = newAttr;
      state.allIds.push(newAttr.refId);
    },
    addAttribute(state, action) {
      const { attribute } = action.payload;
      state.byId[attribute.refId] = attribute;
      state.allIds.push(attribute.refId);
    },
    initializeEdit(state, action) {
      const { refId } = action.payload;
      state.edit = cloneDeep(state.byId[refId]);
    },
    saveAttribute(state, action) {
      const { refId } = action.payload;
      const editClone = cloneDeep(state.edit);
      state.byId[refId] = editClone;
    },
    updateAttributeById(state, action) {
      const { refId, keypath, updates } = action.payload;
      if (state.byId[refId]) {
        set(state.byId[refId], keypath, updates);
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
      const { refId } = action.payload;
      delete state.byId[refId];
      state.allIds = state.allIds.filter(
        (attributeId) => attributeId !== refId
      );
    },
    refreshAttribute(state, action) {
      const { refId } = action.payload;
      state.byId[refId] = { ...state.byId[refId] };
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
