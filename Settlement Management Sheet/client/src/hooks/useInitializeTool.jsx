import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeTool,
  initializeEdit,
  updateEdit,
  setCurrent,
} from '../app/toolSlice.js';
import {
  validateTool,
  initializeValidation,
  getErrorCount,
} from 'features/validation/validationSlice.js';
import { selectKey, selectTool } from 'features/selection/selectionSlice.js';

export const useInitializeTool = ({
  tool,
  allIds,
  current,
  errors,
  initializeFn,
  validationFields,
}) => {
  const dispatch = useDispatch();
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    dispatch(selectTool({ tool: tool }));
  }, []);

  useEffect(() => {
    const count = getErrorCount(errors);
    setErrorCount(count);
    if (current) {
      if (count === 0 && !tool.isValid) {
        updateEdit({ tool, keypath: 'isValid', updates: true });
      } else if (count > 0 && tool.isValid) {
        updateEdit({ tool, keypath: 'isValid', updates: false });
      }
    }
  }, [errors, tool]);

  useEffect(() => {
    if (!current) {
      const data = initializeFn();
      dispatch(initializeTool({ tool, data }));
      dispatch(setCurrent({ tool, data, initializeEdit: true }));
    }
  }, [current, dispatch]);

  useEffect(() => {
    if (!current && allIds.length > 0) {
      const lastId = allIds[allIds.length - 1];
      dispatch(selectKey({ key: tool, value: lastId }));
    }
  }, [tool, allIds, dispatch]);

  useEffect(() => {
    if (current) {
      dispatch(initializeEdit({ refId: tool.refId, tool }));
      dispatch(initializeValidation({ tool, obj: tool }));
    }
  }, [tool, dispatch]);

  useEffect(() => {
    if (current && validationFields.length > 0) {
      dispatch(
        validateTool({
          tool,
          fields: validationFields,
          refObj: current,
        })
      );
    }
  }, [current, dispatch]);
};

//  useInitializeTool({
//    tool: 'attribute',
//    allIds,
//    current,
//    errors,
//    validateTool,
//    initializeFn: initializeAttribute,
//    validationFields: ['name', 'description', 'balance', 'thresholds', 'settlementPointCost']
//})
