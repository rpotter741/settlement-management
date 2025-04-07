import React from 'react';
import { useCategory } from '../../hooks/useCategory.jsx';

import { DynamicForm } from '../../../../components/index.js';

import categoryFields from '../../helpers/categoryFormData.js';

const CategoryMetadata = () => {
  const { editCategory, errors, updateCategory, validateCategoryField } =
    useCategory();
  const category = editCategory;
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
        boxSx={{ gridColumn: 'span 3' }}
      />
      <DynamicForm
        initialValues={{ name: category?.description || '' }}
        field={categoryFields.description}
        externalUpdate={handleUpdate}
        shrink
        parentError={errors?.description}
        onError={handleValidationUpdate}
        boxSx={{ gridColumn: 'span 3' }}
      />
    </>
  );
};

export default CategoryMetadata;
