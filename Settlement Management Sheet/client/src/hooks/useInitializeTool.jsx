import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeTool,
  initializeEdit,
  updateById,
} from '../app/toolSlice.js';
import {
  validateTool,
  initializeValidation,
  getErrorCount,
} from 'features/validation/validationSlice.js';

export const useInitializeTool = ({
  tool,
  id,
  current,
  edit,
  errorData,
  initializeFn,
  validationFields,
}) => {
  const dispatch = useDispatch();
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    const count = getErrorCount(errorData);
    setErrorCount(count);
    if (current) {
      if (count === 0 && !tool.isValid) {
        updateById({ tool, keypath: 'isValid', updates: true, id });
      } else if (count > 0 && tool.isValid) {
        updateById({ tool, keypath: 'isValid', updates: false, id });
      }
    }
  }, [errorData, tool]);

  useEffect(() => {
    if (current === undefined) {
      const newTool = initializeFn();
      const data = { ...newTool, id };
      dispatch(initializeTool({ tool, data }));
    }
  }, [current, dispatch]);

  useEffect(() => {
    if (edit === undefined) {
      dispatch(initializeEdit({ id, tool }));
      dispatch(initializeValidation({ tool, obj: tool }));
    }
  }, [tool, dispatch]);

  useEffect(() => {
    if (current && validationFields.length > 0) {
      const isReady = validationFields.every(
        (field) => current[field] !== undefined
      );
      if (!isReady) return;
      dispatch(
        validateTool({
          tool,
          fields: validationFields,
          refObj: current,
        })
      );
    }
  }, [current, dispatch]);

  return { errorCount, setErrorCount };
};
