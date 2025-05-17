import { ToolName, Tool } from '../../../types/index.js';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeTool, initializeEdit, updateById } from '../app/toolSlice';
import {
  validateTool,
  setValidationObject,
  getErrorCount,
  initializeValidationObject,
} from '../features/Validation/validationSlice';

export const useInitializeTool = ({
  tool,
  id,
  current,
  edit,
  errorData,
  initializeFn,
  validationFields,
}: {
  tool: ToolName;
  id: string;
  current: Tool | undefined;
  edit: Tool | undefined;
  errorData: any;
  initializeFn: () => Tool;
  validationFields: string[];
}) => {
  const dispatch = useDispatch();
  const [errorCount, setErrorCount] = useState<number>(0);

  useEffect(() => {
    const count = getErrorCount(errorData);
    setErrorCount(count);
    if (current) {
      if (count === 0 && !current.isValid) {
        updateById({ tool, keypath: 'isValid', updates: true, id });
      } else if (count > 0 && current.isValid) {
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
      const obj = initializeValidationObject(current);
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
        (field) => current[field as keyof Tool] !== undefined
      );
      if (!isReady) return;
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
