import React from 'react';
import { useTools } from 'hooks/useTool.tsx';

import DynamicForm from 'components/shared/DynamicForm/DynamicForm.jsx';

const CategoryMetadata = () => {
  const {
    edit: category,
    errors,
    updateTool: updateCategory,
    validateToolField: validateCategoryField,
  } = useTools('category');

  const handleUpdate = (updates, { keypath }) => {
    updateCategory(keypath, updates);
  };

  const handleValidationUpdate = (error, { keypath }) => {
    validateCategoryField(keypath, error);
  };

  return (
    <>
      <DynamicForm
        initialValues={{ name: category?.name || '' }}
        field={categoryFields.name}
        externalUpdate={handleUpdate}
        shrink
        parentError={errors?.name}
        onError={handleValidationUpdate}
        boxSx={{ gridColumn: 'span 3', px: 1 }}
      />
      <DynamicForm
        initialValues={{ name: category?.description || '' }}
        field={categoryFields.description}
        externalUpdate={handleUpdate}
        shrink
        parentError={errors?.description}
        onError={handleValidationUpdate}
        boxSx={{ gridColumn: 'span 3', px: 1 }}
      />
    </>
  );
};

export default CategoryMetadata;
