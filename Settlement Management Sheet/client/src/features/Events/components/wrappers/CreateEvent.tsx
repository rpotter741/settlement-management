import React, { useEffect } from 'react';

import initializeEvent from 'features/Events/helpers/initializeEvent.js';

import PreviewEvent from './PreviewEvent.jsx';
import EditEvent from './EditEvent.jsx';
import checklistContent from '../../helpers/checklistContent.js';

import CreateShell from '@/components/shared/CreateShell/CreateToolShell.js';
import { useSidePanel } from 'hooks/global/useSidePanel.jsx';

const CreateEvent = ({ tab }) => {
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
      tab={tab}
      initializeTool={initializeEvent}
      validationFields={['name', 'description']}
      editComponent={EditEvent}
      previewComponent={PreviewEvent}
      checklistContent={checklistContent}
      innerStyle={{
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
        alignItems: 'center',
        px: 0,
        mb: 0,
        boxShadow: 'none',
        borderRadius: 0,
        backgroundColor: 'background.default',
        width: '100%',
        maxWidth: '100%',
        position: 'relative',
        flexShrink: 1,
        height: '100%',
        overflowY: 'scroll',
      }}
    />
  );
};

export default CreateEvent;
