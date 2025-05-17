import React, { useState, useEffect } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { TitledCollapse } from '../../../../components/index.js';

import { useTools } from 'hooks/useTool.tsx';
import { useToolContext } from 'context/ToolContext.jsx';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

import InnerTabbedContainer from 'components/shared/TabbedContainer/InnerTabbedContainer.jsx';

import CreatePhase from '../forms/CreatePhase.jsx';
import { newPhase, newResolution } from '../../helpers/eventObjects.js';

import EventMetaData from '../forms/EventMetaData.jsx';

const EditEvent = ({ setShowModal }) => {
  const { preventSplit, setPreventSplit } = useSidePanel();
  const { id } = useToolContext();
  const { edit, updateTool } = useTools('event', id);
  const [phaseTabs, setPhaseTabs] = useState([]);
  const [count, setCount] = useState(edit?.phases.length || 2);

  useEffect(() => {
    if (edit) {
      const newPhaseTabs = edit.phases.map((phase, index) => ({
        name: phase.name,
        component: CreatePhase,
        props: { phaseId: phase.id },
        tabId: phase.id,
      }));
      setPhaseTabs(newPhaseTabs);
    }
  }, [edit]);

  const handleAddPhase = () => {
    const oldPhases = [...edit.phases];
    const newestPhase = newPhase(oldPhases.length);
    oldPhases.push({ ...newestPhase, name: `Phase ${count}` });
    setCount((prev) => prev + 1);
    updateTool('phases', oldPhases);

    setPhaseTabs((prev) => [
      ...prev,
      {
        name: newestPhase.name,
        component: CreatePhase,
        props: { phaseId: newestPhase.id },
        tabId: newestPhase.id,
      },
    ]);
  };

  const handleRemovePhase = (id) => {
    const oldPhases = [...edit.phases];
    const newPhases = oldPhases.filter((phase) => phase.id !== id);
    updateTool('phases', newPhases);

    setPhaseTabs((prev) => prev.filter((tab) => tab.tabId !== id));
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '2fr 10px 4fr',
        gridTemplateRows: 'auto',
        alignItems: 'start',
        justifyContent: 'start',
        gap: 1,
        my: 2,
        backgroundColor: 'background.paper',
        width: '100%',
        position: 'relative',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      {/* Add your event editing components here */}
      <EventMetaData />
      <Divider orientation="vertical" flexItem sx={{ mr: 1.5 }} />
      <InnerTabbedContainer
        tabs={[...phaseTabs]}
        onAdd={handleAddPhase}
        onRemove={handleRemovePhase}
        removeLimit={1}
        maxContentHeight="87vh"
        height="100%"
        maxWidth="100%"
        headerSx={{}}
        addLabel="+"
      />
    </Box>
  );
};

export default EditEvent;
