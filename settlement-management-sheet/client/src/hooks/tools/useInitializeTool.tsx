import { ToolName, Tool } from '../../../types/index.js';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeTool,
  initializeEdit,
  updateById,
} from '@/app/slice/toolSlice.js';
import {
  validateTool,
  setValidationObject,
  getErrorCount,
  initializeValidationObject,
} from '@/app/slice/validationSlice.js';
import { set } from 'lodash';

export const useInitializeTool = ({
  tool,
  mode,
  id,
  current,
  edit,
  errorData,
  initializeFn,
  validationFields,
}: {
  tool: ToolName;
  mode: 'edit' | 'preview';
  id: string;
  current: Tool | undefined;
  edit: Tool | undefined;
  errorData: any;
  initializeFn: () => Tool;
  validationFields: string[];
}) => {
  const dispatch = useDispatch();
  const [errorCount, setErrorCount] = useState<number>(0);
  const [currentReady, setCurrentReady] = useState<boolean>(false);
  const [editReady, setEditReady] = useState<boolean>(false);

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
    if (mode === 'preview') {
      if (current && validationFields.length > 0) {
        const isReady = validationFields.every(
          (field) => current[field as keyof Tool] !== undefined
        );
        if (!isReady) return;
        dispatch(
          validateTool({
            tool,
            fields: validationFields,
            refObj: edit,
            id: current.id,
          })
        );
      }
    } else if (mode === 'edit') {
      if (edit && validationFields.length > 0) {
        if (!editReady) {
          const isReady = validationFields.every(
            (field) => edit[field as keyof Tool] !== undefined
          );
          if (!isReady) return;
          setEditReady(true);
          dispatch(
            validateTool({
              tool,
              fields: validationFields,
              refObj: edit,
              id: edit.id,
            })
          );
        }
      }
    }
  }, [dispatch, mode, edit, current]);

  return { errorCount, setErrorCount };
};
