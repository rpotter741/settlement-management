import React from 'react';
import { useTools } from 'hooks/useTool.tsx';

import DynamicForm from '../DynamicForm/DynamicForm.jsx';

const EditNameDescription = ({ tool, fields, id, snakeCaseName = false }) => {
  const { edit, errors, updateTool, validateToolField } = useTools(tool, id);
  const handleUpdate = (updates, { keypath }) => {
    updateTool(keypath, updates);
  };

  const handleValidationUpdate = (error, { keypath }) => {
    validateToolField(keypath, error);
  };

  return (
    <>
      <DynamicForm
        initialValues={{ name: edit?.name || '' }}
        field={fields.name}
        externalUpdate={handleUpdate}
        shrink
        parentError={errors?.name}
        onError={handleValidationUpdate}
        boxSx={{ gridColumn: 'span 3', px: 1 }}
        snakeCase={snakeCaseName}
      />
      <DynamicForm
        initialValues={{ description: edit?.description || '' }}
        field={fields.description}
        externalUpdate={handleUpdate}
        shrink
        parentError={errors?.description}
        onError={handleValidationUpdate}
        boxSx={{ gridColumn: 'span 3', px: 1 }}
      />
    </>
  );
};

export default EditNameDescription;
