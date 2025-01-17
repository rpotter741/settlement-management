import { createSelector } from '@reduxjs/toolkit';

// Base Selectors
export const selectAllCategories = (state) =>
  state.categories.allIds.map((id) => state.categories.byId[id]);
export const selectCategoryIds = (state) => state.categories.allIds;
export const selectEditCategory = (state) => state.categories.edit;
export const selectCategoryById = (id) => (state) => state.categories.byId[id];
export const selectCategoryErrors = (state) => state.validation.category;

// Dynamic Error Selector Factory
const createErrorSelector = (errorField) =>
  createSelector([selectCategoryErrors], (errors) => errors[errorField]);

// Metadata Selectors
export const selectMetadata = createSelector(
  [selectEditCategory],
  (category) => ({
    name: category.name,
    description: category.description,
  })
);

export const selectMetadataErrors = createSelector(
  [selectCategoryErrors],
  (errors) => ({
    name: errors.name,
    description: errors.description,
  })
);

//
export const selectAttributes = createSelector(
  [selectEditCategory],
  (category) => category.attributes
);

export const selectThresholds = createSelector(
  [selectEditCategory],
  (category) => category.thresholds
);

export const selectThresholdErrors = createErrorSelector('thresholds');

export const selectDependencies = createSelector(
  [selectEditCategory],
  (category) => category.dependencies
);

export const selectDependenciesErrors = createErrorSelector('dependencies');

export const categorySelectors = {
  base: {
    edit: selectEditCategory,
    errors: selectCategoryErrors,
    allIds: selectCategoryIds,
    categoryById: selectCategoryById,
    allCategories: selectAllCategories,
  },
  metadata: {
    main: selectMetadata,
    errors: selectMetadataErrors,
  },
  selectAttributes,
  thresholds: {
    main: selectThresholds,
    errors: selectThresholdErrors,
  },
  dependencies: {
    main: selectDependencies,
    errors: selectDependenciesErrors,
  },
};
