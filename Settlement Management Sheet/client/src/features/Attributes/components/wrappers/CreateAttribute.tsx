import React from 'react';
// redux
import initializeAttribute from 'features/Attributes/helpers/initializeAttribute.js';
// custom components
import IconSelector from 'components/shared/IconSelector/IconSelector.jsx';
import EditAttribute from './EditAttribute.jsx';
import PreviewAttribute from './PreviewAttribute.jsx';
import checklistContent from '../../helpers/attributeChecklist.js';

import CreateShell from '@/components/shared/CreateShell/CreateToolShell.js';
import { Tab } from '@/app/types/SidePanelTypes.js';

export const validationFields = [
  'name',
  'description',
  'balance',
  'thresholds',
  'settlementPointCost',
];

interface CreateAttributeProps {
  tab: Tab;
}

const CreateAttribute: React.FC<CreateAttributeProps> = ({ tab }) => {
  return (
    <CreateShell
      tab={tab}
      initializeTool={initializeAttribute}
      validationFields={validationFields}
      editComponent={EditAttribute}
      previewComponent={PreviewAttribute}
      checklistContent={checklistContent}
    />
  );
};

export default CreateAttribute;
