import { createSelector } from '@reduxjs/toolkit';

export const selectEditAttr = (state) => state.attributes.edit;

export const selectAttrErrors = (state) => state.validation.attribute;

export const selectAttrThresholds = createSelector(
  [selectEditAttr],
  (attribute) => attribute.thresholds
);

export const selectAttrThresholdErrors = createSelector(
  [selectAttrErrors],
  (errors) => errors.thresholds
);

export const selectAttrSPC = createSelector([selectEditAttr], (attribute) => {
  return attribute.settlementPointCost;
});

export const selectAttrSPCErrors = createSelector(
  [selectAttrErrors],
  (errors) => errors.settlementPointCost
);

export const selectAttrMetadata = createSelector(
  [selectEditAttr],
  (attribute) => ({
    name: attribute.name,
    description: attribute.description,
    icon: attribute.icon,
    iconColor: attribute.iconColor,
  })
);

export const selectAttrMetadataErrors = createSelector(
  [selectAttrErrors],
  (errors) => ({
    name: errors.name,
    description: errors.description,
    costPerLevel: errors.costPerLevel,
    healthPerLevel: errors.healthPerLevel,
    maxPerLevel: errors.values.maxPerLevel,
  })
);

export const selectAttrValues = createSelector(
  [selectEditAttr],
  (attribute) => ({
    costPerLevel: attribute.costPerLevel,
    healthPerLevel: attribute.healthPerLevel,
    maxPerLevel: attribute.values.maxPerLevel,
  })
);

export const selectAttrValuesErrors = createSelector(
  [selectAttrErrors],
  (errors) => ({
    costPerLevel: errors.costPerLevel,
    healthPerLevel: errors.healthPerLevel,
    maxPerLevel: errors.values.maxPerLevel,
  })
);
