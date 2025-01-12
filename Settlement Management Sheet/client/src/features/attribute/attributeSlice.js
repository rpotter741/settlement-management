import { createSlice, createSelector } from '@reduxjs/toolkit';
import iconList from '../../components/utils/IconSelector/iconList.jsx';

const attributesSlice = createSlice({
  name: 'attributes',
  initialState: {
    byId: {},
    allIds: [],
  },
  reducers: {
    initializeAttribute(state) {
      const tempId = `temp-${Date.now()}`; // Temporary unique ID for the category
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
        thresholds: [
          { name: '', max: 9, id: 'temp-1' },
          { name: '', max: 29, id: 'temp-2' },
          { name: '', max: 49, id: 'temp-3' },
          { name: '', max: 69, id: 'temp-4' },
          { name: '', max: 84, id: 'temp-5' },
          { name: '', max: 99, id: 'temp-6' },
          { name: '', max: 100, id: 'temp-7' },
        ],
        settlementPointCost: {
          default: 1,
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
    updateAttribute(state, action) {
      const { id, updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...updates };
      }
    },

    addSettlementPointCost(state, action) {
      const { id, name } = action.payload;
      if (state.byId[id]) {
        state.byId[id].settlementPointCost[name] = 0;
      }
    },

    updateSettlementPointCost(state, action) {
      const { id, name, value } = action.payload;
      if (state.byId[id]) {
        state.byId[id].settlementPointCost[name] = value;
      }
    },

    removeSettlementPointCost(state, action) {
      const { id, name } = action.payload;
      if (state.byId[id]) {
        delete state.byId[id].settlementPointCost[name];
      }
    },

    deleteAttribute(state, action) {
      const { id } = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((attributeId) => attributeId !== id);
    },
  },

  refreshAttribute(state, action) {
    const { id } = action.payload;
    state.byId[id] = { ...state.byId[id] };
  },
});

export const {
  initializeAttribute,
  addAttribute,
  updateAttribute,
  addSettlementPointCost,
  updateSettlementPointCost,
  removeSettlementPointCost,
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
