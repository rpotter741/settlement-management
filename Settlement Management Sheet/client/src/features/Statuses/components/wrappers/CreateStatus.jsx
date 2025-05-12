import React, { useEffect, useState } from 'react';

import initializeStatus from 'features/Statuses/helpers/initializeStatus.js';

// custom components
import IconSelector from 'components/shared/IconSelector/IconSelector.jsx';
import EditStatus from 'features/Statuses/components/wrappers/EditStatus.jsx';
import PreviewStatus from 'features/Statuses/components/wrappers/PreviewStatus.jsx';
import checklistContent from '../../helpers/statusChecklist.js';

import CreateShell from 'components/shared/CreateShell/CreateShell.jsx';

const CreateStatus = ({ id, mode, side, tabId }) => {
  return (
    <CreateShell
      tool="gameStatus"
      toolName="Status"
      id={id}
      initializeTool={initializeStatus}
      validationFields={['name', 'description']}
      editComponent={EditStatus}
      previewComponent={PreviewStatus}
      checklistContent={checklistContent}
      loadDisplayName="Load Status"
      modalComponents={{}}
      side={side}
      mode={mode}
      tabId={tabId}
    />
  );
};

export default CreateStatus;
