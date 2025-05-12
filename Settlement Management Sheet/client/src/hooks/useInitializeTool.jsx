import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeTool,
  initializeEdit,
  updateById,
} from '../app/toolSlice.js';
import {
  validateTool,
  setValidationObject,
  getErrorCount,
  initializeObject,
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
    if (edit === undefined && current) {
      dispatch(initializeEdit({ id, tool }));
      const obj = initializeObject(current);
      console.log(obj);
      dispatch(
        setValidationObject({
          tool,
          validationObject: obj,
          id,
        })
      );
    }
  }, [tool, dispatch, edit, current]);

  useEffect(() => {
    if (current && validationFields.length > 0) {
      const isReady = validationFields.every(
        (field) => current[field] !== undefined
      );
      if (!isReady) return;
      console.log('validating bitches');
      dispatch(
        validateTool({
          tool,
          fields: validationFields,
          refObj: current,
          id: current.id,
        })
      );
    }
  }, [current, dispatch]);

  return { errorCount, setErrorCount };
};
