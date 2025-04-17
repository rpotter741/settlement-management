import React, { useEffect, useState } from 'react';

// redux
import initializeCategory from 'features/Categories/helpers/initializeCategory.js';
// custom components
import checklistContent from '../../helpers/checklistContent.js';
import EditCategory from './EditCategory';
import PreviewCategory from './PreviewCategory.jsx';
import LoadTool from 'components/shared/LoadTool/LoadTool.jsx';
import { useTools } from 'hooks/useTool.jsx';

import CreateShell from 'components/shared/CreateShell/CreateShell.jsx';

const CreateCategory = () => {
  const { updateTool, edit } = useTools('category');
  return (
    <CreateShell
      tool="category"
      initializeTool={initializeCategory}
      validationFields={['name', 'description', 'thresholds', 'dependencies']}
      editComponent={EditCategory}
      previewComponent={PreviewCategory}
      checklistContent={checklistContent}
      loadDisplayName="Load Category"
      modalComponents={{
        'Select Attribute': LoadTool,
      }}
      modalComponentsProps={{
        'Select Attribute': {
          tool: 'attribute',
          displayName: 'Attribute',
          keypath: 'attributes',
          selectionMode: true,
          outerUpdate: updateTool,
          outerTool: edit,
        },
      }}
    />
  );
};

export default CreateCategory;
