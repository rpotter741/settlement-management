import React, { useEffect, useState } from 'react';
// redux
import initializeAttribute from 'features/Attributes/helpers/initializeAttribute.js';
// custom components
import IconSelector from 'components/shared/IconSelector/IconSelector.jsx';
import EditAttribute from './EditAttribute.jsx';
import PreviewAttribute from './PreviewAttribute.jsx';
import checklistContent from '../../helpers/attributeChecklist.js';

import CreateShell from 'components/shared/CreateShell/CreateShell.jsx';

const CreateAttribute = () => {
  return (
    <CreateShell
      tool="attribute"
      initializeTool={initializeAttribute}
      validationFields={[
        'name',
        'description',
        'balance',
        'thresholds',
        'settlementPointCost',
      ]}
      editComponent={EditAttribute}
      previewComponent={PreviewAttribute}
      checklistContent={checklistContent}
      loadDisplayName="Load Attribute"
      modalComponents={{
        'Change Icon': IconSelector,
      }}
      modalComponentsProps={{
        'Change Icon': {
          tool: 'attribute',
        },
      }}
    />
  );
};

export default CreateAttribute;
