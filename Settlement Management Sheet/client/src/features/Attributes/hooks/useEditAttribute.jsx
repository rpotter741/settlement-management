import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { updateEditAttribute, saveAttribute } from '../state/attributeSlice';
import { loadSelectedAttribute } from '../state/attributeThunks';
import { validateField, validateTool } from '../../validation/validationSlice';
import { attributeSelectors as select } from '../state/attributeSelectors.js';

export const useAttributeSelectors = () => {
  const attribute = useSelector(select.base.currentAttribute);
  const editAttribute = useSelector(select.base.edit);
  const allIds = useSelector(select.base.allIds);
  const errors = useSelector(select.base.errors);

  const metadata = {
    data: useSelector(select.metadata.main),
    errors: useSelector(select.metadata.errors),
  };

  const balance = {
    data: useSelector(select.balance.main),
    errors: useSelector(select.balance.errors),
  };

  const thresholds = {
    data: useSelector(select.thresholds.main),
    errors: useSelector(select.thresholds.errors),
    order: useSelector(select.thresholds.order),
  };

  const settlementPointCost = {
    data: useSelector(select.settlementPointCost.main),
    errors: useSelector(select.settlementPointCost.errors),
    order: useSelector(select.settlementPointCost.order),
  };

  return {
    attribute,
    allIds,
    editAttribute,
    errors,
    metadata,
    balance,
    thresholds,
    settlementPointCost,
    selectAll: useSelector(select.base.allAttributes),
    selectEditId: useSelector(select.base.attributeId),
    selectCurrent: useSelector(select.base.currentAttribute),
  };
};

export const useAttributeActions = () => {
  const dispatch = useDispatch();

  const updateAttribute = useCallback(
    (keypath, updates) => {
      dispatch(updateEditAttribute({ keypath, updates }));
    },
    [dispatch]
  );

  const validateAttributeField = useCallback(
    (keypath, error) => {
      dispatch(validateField({ tool: 'attribute', keypath, error }));
    },
    [dispatch]
  );

  const validateEntireAttribute = useCallback(
    (attribute) => {
      dispatch(
        validateTool({
          tool: 'attribute',
          fields: Object.keys(attribute),
          refObj: attribute,
        })
      );
    },
    [dispatch]
  );

  const saveEditAttribute = useCallback(
    (attribute) => {
      dispatch(saveAttribute({ refId: attribute.refId }));
    },
    [dispatch]
  );

  const loadAttribute = useCallback(
    ({ refId, id }) => {
      console.log(refId);
      dispatch(loadSelectedAttribute({ refId, id }));
    },
    [dispatch]
  );

  return {
    updateAttribute,
    validateAttributeField,
    validateEntireAttribute,
    saveEditAttribute,
    loadAttribute,
  };
};

// Combined Hook for Convenience
export const useAttribute = () => {
  const selectors = useAttributeSelectors();
  const actions = useAttributeActions();
  return { ...selectors, ...actions };
};
