import React, { useEffect } from 'react';

import initializeEvent from 'features/Events/helpers/initializeEvent.js';

import PreviewEvent from './PreviewEvent.jsx';
import EditEvent from './EditEvent.jsx';
import checklistContent from '../../helpers/checklistContent.js';

import CreateShell from 'components/shared/CreateShell/CreateShell.jsx';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

const CreateEvent = ({ id, mode, side, tabId }) => {
  const { preventSplit, setPreventSplit } = useSidePanel();

  useEffect(() => {
    if (!preventSplit) {
      setPreventSplit(true);
    }
  }, [preventSplit, setPreventSplit]);

  useEffect(() => {
    return () => {
      setPreventSplit(false);
    };
  }, []);

  return (
    <CreateShell
      tool="event"
      id={id}
      initializeTool={initializeEvent}
      validationFields={['name', 'description']}
      editComponent={EditEvent}
      previewComponent={PreviewEvent}
      checklistContent={checklistContent}
      loadDisplayName="Load Event"
      modalComponents={{}}
      modalComponentsProps={{}}
      side={side}
      mode={mode}
      tabId={tabId}
      width="100%"
    />
  );
};

export default CreateEvent;
