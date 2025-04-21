import React from 'react';
import { useTools } from 'hooks/useTool.jsx';

import DynamicForm from '../DynamicForm/DynamicForm.jsx';

const EditNameDescription = ({ tool, fields }) => {
  const { edit, errors, updateTool, validateToolField } = useTools(tool);

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
