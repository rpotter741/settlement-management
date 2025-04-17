import React, { useEffect, useState } from 'react';

// redux
import initializeCategory from 'features/Categories/helpers/initializeCategory.js';
// custom components
import checklistContent from '../../helpers/checklistContent.js';
import EditCategory from './EditCategory';
import PreviewCategory from './PreviewCategory.jsx';

import CreateShell from 'components/shared/CreateShell/CreateShell.jsx';

const CreateCategory = () => {
  return (
    <CreateShell
      tool="category"
      initializeTool={initializeCategory}
      validationFields={['name', 'description']}
      editComponent={EditCategory}
      previewComponent={PreviewCategory}
      checklistContent={checklistContent}
      loadDisplayName="Load Category"
    />
  );
};

export default CreateCategory;
