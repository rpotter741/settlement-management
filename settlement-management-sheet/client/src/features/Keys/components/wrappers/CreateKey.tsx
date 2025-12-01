import React, { useEffect, useState } from 'react';
// redux
import initializeKey from 'features/Keys/helpers/initializeKey.js';
// custom components
import EditKey from './EditKey.jsx';
import PreviewKey from './PreviewKey.jsx';

import CreateShell from '@/components/shared/CreateShell/CreateToolShell.js';

const CreateKey = ({ id, mode, side, tabId }) => {
  return (
    <CreateShell
      tool="key"
      id={id}
      initializeTool={initializeKey}
      validationFields={['name', 'description']}
      editComponent={EditKey}
      previewComponent={PreviewKey}
      checklistContent={[]}
      loadDisplayName="Load Key"
      side={side}
      mode={mode}
      tabId={tabId}
    />
  );
};

export default CreateKey;
