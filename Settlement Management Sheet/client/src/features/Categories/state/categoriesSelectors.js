import { createSelector } from '@reduxjs/toolkit';

// Base Selectors
const category = (state) => state.categories;
export const selectAllCategories = createSelector([category], (state) =>
  state.allIds.map((id) => state.byId[id])
);

export const selectCategoryIds = (state) => state.categories.allIds;
export const selectEditCategory = (state) => state.categories.edit;
export const selectCategoryById = (id) => (state) => state.categories.byId[id];
export const selectCategoryErrors = (state) => state.validation.category;
export const selectCategoryId = (state) => state.selection.category;

// Dynamic Error Selector Factory
const createErrorSelector = (errorField) =>
  createSelector([selectCategoryErrors], (errors) => errors[errorField]);

// Metadata Selectors
export const selectMetadata = createSelector(
  [selectEditCategory],
  (category) => ({
    name: category?.name,
    description: category?.description,
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
  (category) => category?.attributes
);

export const selectThresholds = createSelector(
  [selectEditCategory],
  (category) => category?.thresholds
);

export const selectThresholdErrors = createErrorSelector('thresholds');

export const selectDependencies = createSelector(
  [selectEditCategory],
  (category) => category?.dependencies
);

export const selectDependenciesErrors = createErrorSelector('dependencies');

// active category
export const selectCategory = createSelector(
  [selectCategoryId, (state) => state.categories.byId],
  (catId, categoriesById) => categoriesById[catId] || null
);

export const categorySelectors = {
  base: {
    current: selectCategory,
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
  attributes: selectAttributes,
  thresholds: {
    main: selectThresholds,
    errors: selectThresholdErrors,
  },
  dependencies: {
    main: selectDependencies,
    errors: selectDependenciesErrors,
  },
};
