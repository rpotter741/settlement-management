import React, { useEffect, useState } from 'react';

import initializeStatus from 'features/Statuses/helpers/initializeStatus.js';

// custom components
import IconSelector from 'components/shared/IconSelector/IconSelector.jsx';
import EditStatus from 'features/Statuses/components/wrappers/EditStatus.jsx';
import PreviewStatus from 'features/Statuses/components/wrappers/PreviewStatus.jsx';
import checklistContent from '../../helpers/statusChecklist.js';

import CreateShell from '@/components/shared/CreateShell/CreateToolShell.js';

const CreateStatus = ({ tab, setModalContent }) => {
  return (
    <CreateShell
      tab={tab}
      initializeTool={initializeStatus}
      validationFields={['name', 'description']}
      editComponent={EditStatus}
      previewComponent={PreviewStatus}
      checklistContent={checklistContent}
      setModalContent={setModalContent}
    />
  );
};

export default CreateStatus;
