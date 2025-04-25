import React, { useEffect, useState } from 'react';
// redux
import initializeAttribute from 'features/Attributes/helpers/initializeAttribute.js';
// custom components
import IconSelector from 'components/shared/IconSelector/IconSelector.jsx';
import EditAttribute from './EditAttribute.jsx';
import PreviewAttribute from './PreviewAttribute.jsx';
import checklistContent from '../../helpers/attributeChecklist.js';

import CreateShell from 'components/shared/CreateShell/CreateShell.jsx';

const CreateAttribute = ({ id }) => {
  return (
    <CreateShell
      tool="attribute"
      id={id}
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
          id,
        },
      }}
    />
  );
};

export default CreateAttribute;
