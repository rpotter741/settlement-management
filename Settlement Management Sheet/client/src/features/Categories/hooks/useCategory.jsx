import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  validateField,
  validateTool,
} from 'features/validation/validationSlice';
import { categorySelectors as select } from 'features/Categories/state/categoriesSelectors.js';

export const useCategorySelectors = () => {
  const allCategories = useSelector(select.base.allCategories);
  const category = useSelector(select.base.currentCategory);
  const editCategory = useSelector(select.base.edit);
  const allIds = useSelector(select.base.allIds);
  const errors = useSelector(select.base.errors);

  const metadata = {
    data: useSelector(select.metadata.main),
    errors: useSelector(select.metadata.errors),
  };

  const attributes = useSelector(select.attributes);

  const thresholds = {
    data: useSelector(select.thresholds.main),
    errors: useSelector(select.thresholds.errors),
  };

  const dependencies = {
    data: useSelector(select.dependencies.main),
    errors: useSelector(select.dependencies.errors),
  };

  return {
    allCategories,
    category,
    editCategory,
    allIds,
    errors,
    metadata,
    attributes,
    thresholds,
    dependencies,
  };
};

export const useCategoryActions = () => {
  const dispatch = useDispatch();

  const updateCategory = useCallback(
    (keypath, updates) => {
      dispatch(updateEditCategory({ keypath, updates }));
    },
    [dispatch]
  );

  const validateCategoryField = useCallback(
    (keypath, error) => {
      dispatch(validateField({ tool: 'category', keypath, error }));
    },
    [dispatch]
  );

  const validateCategory = useCallback(
    (category) => {
      dispatch(
        validateTool({
          tool: 'category',
          fields: Object.keys(category),
          refObj: category,
        })
      );
    },
    [dispatch]
  );

  const saveCategory = useCallback(
    (id) => {
      dispatch(saveCategory({ id }));
    },
    [dispatch]
  );

  return {
    updateCategory,
    validateCategoryField,
    validateCategory,
    saveCategory,
  };
};

export const useCategory = () => {
  const selectors = useCategorySelectors();
  const actions = useCategoryActions();
  return { ...selectors, ...actions };
};
