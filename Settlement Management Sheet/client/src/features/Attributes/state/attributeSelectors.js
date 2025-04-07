import { createSelector } from '@reduxjs/toolkit';

// Base Selectors
const attribute = (state) => state.attributes;
export const selectEditAttr = (state) => state.attributes.edit;
export const selectAttrErrors = (state) => state.validation.attribute;
export const selectAllAttributeIds = createSelector(
  [attribute],
  (state) => state.allIds
);
export const selectAttributeById = (id) => (state) => state.attributes.byId[id];
export const selectAllAttributes = createSelector([attribute], (state) =>
  state.allIds.map((id) => state.byId[id])
);
export const selectAttributeId = (state) => state.selection.attribute;

// Dynamic Error Selector Factory
const createErrorSelector = (errorField) =>
  createSelector([selectAttrErrors], (errors) => errors[errorField]);

// Metadata Selectors
export const selectMetadata = createSelector([selectEditAttr], (attr) => ({
  name: attr.name,
  description: attr.description,
  icon: attr.icon,
  iconColor: attr.iconColor,
}));

export const selectMetadataErrors = createErrorSelector('metadata');

// Balance Selectors
export const selectBalance = createSelector(
  [selectEditAttr],
  (attr) => attr.balance
);

export const selectBalanceErrors = createErrorSelector('balance');

// Thresholds Selectors
export const selectThresholds = createSelector(
  [selectEditAttr],
  (attr) => attr.thresholds?.data
);

export const selectThresholdErrors = createErrorSelector('thresholds');

export const selectThresholdsOrder = createSelector(
  [selectEditAttr],
  (attr) => attr.thresholds?.order
);

// Settlement Point Cost Selectors
export const selectSettlementPointCost = createSelector(
  [selectEditAttr],
  (attr) => attr.settlementPointCost?.data
);

export const selectSettlementPointCostErrors = createErrorSelector(
  'settlementPointCost'
);

export const selectSettlementPointCostOrder = createSelector(
  [selectEditAttr],
  (attr) => attr.settlementPointCost?.order
);

// Current Attribute Selector
export const selectAttribute = createSelector(
  [selectAttributeId, (state) => state.attributes.byId],
  (attrId, attributesById) => attributesById[attrId] || null
);

// Grouped Selectors for Better Organization
export const attributeSelectors = {
  base: {
    edit: selectEditAttr,
    errors: selectAttrErrors,
    allIds: selectAllAttributeIds,
    attributeById: selectAttributeById,
    allAttributes: selectAllAttributes,
    attributeId: selectAttributeId,
    currentAttribute: selectAttribute,
  },
  metadata: {
    main: selectMetadata,
    errors: selectMetadataErrors,
  },
  balance: {
    main: selectBalance,
    errors: selectBalanceErrors,
  },
  thresholds: {
    main: selectThresholds,
    errors: selectThresholdErrors,
    order: selectThresholdsOrder,
  },
  settlementPointCost: {
    main: selectSettlementPointCost,
    errors: selectSettlementPointCostErrors,
    order: selectSettlementPointCostOrder,
  },
};
