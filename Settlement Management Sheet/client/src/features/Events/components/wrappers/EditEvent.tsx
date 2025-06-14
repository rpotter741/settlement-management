import React, { useState, useEffect } from 'react';
import { Box, Divider, Typography, Drawer, Collapse } from '@mui/material';
import { TitledCollapse } from '../../../../components/index.js';

import { useTools } from 'hooks/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

import InnerTabbedContainer from 'components/shared/TabbedContainer/InnerTabbedContainer.jsx';

import CreatePhase from '../forms/CreatePhase.jsx';
import { newPhase, newResolution } from '../../helpers/eventObjects.js';

import EventMetaData from '../forms/EventMetaData.jsx';

const EditEvent = ({ setShowModal }) => {
  const { preventSplit, setPreventSplit } = useSidePanel();
  const { id } = useShellContext();
  const { edit, updateTool } = useTools('event', id);
  const [phaseTabs, setPhaseTabs] = useState([]);
  const [count, setCount] = useState(edit?.phases.length || 2);

  useEffect(() => {
    if (edit) {
      console.log(edit.phases);
      const newPhaseTabs = edit.phases.order.map((id, index) => ({
        name: edit.phases.data[id]?.name,
        component: CreatePhase,
        props: { phaseId: id },
        tabId: id,
      }));
      setPhaseTabs(newPhaseTabs);
    }
  }, [edit]);

  const handleAddPhase = () => {
    const oldPhaseObject = { ...edit.phases.data };
    const oldPhases = [...edit.phases.order];

    const newestPhase = newPhase(oldPhases.length);
    oldPhaseObject[newestPhase.id] = newestPhase;
    oldPhases.push(newestPhase.id);
    setCount((prev) => prev + 1);

    updateTool('phases.data', oldPhaseObject);
    updateTool('phases.order', oldPhases);

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
    const oldPhaseOrder = [...edit.phases.order];
    const oldPhaseObject = { ...edit.phases.data };

    delete oldPhaseObject[id];
    const newPhases = oldPhaseOrder.filter((phaseId) => phaseId !== id);

    updateTool('phases.data', oldPhaseObject);
    updateTool('phases.order', newPhases);

    setPhaseTabs((prev) => prev.filter((tab) => tab.tabId !== id));
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 6fr',
        gridTemplateRows: 'auto',
        py: 2,
        backgroundColor: 'background.paper',
        width: '100%',
        position: 'relative',
        overflowY: 'auto',
        height: '100%',
      }}
    >
      {/* Add your event editing components here */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          justifyContent: 'start',
          gap: 2,
          backgroundColor: 'background.paper',
          height: '100%',
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        <Typography>Meta Data</Typography>
        <Typography>Phases</Typography>
        <Typography>Event Map</Typography>
        <Typography>Resolutions</Typography>
        <Typography>Keys</Typography>
      </Box>

      <InnerTabbedContainer
        tabs={[...phaseTabs]}
        onAdd={handleAddPhase}
        onRemove={handleRemovePhase}
        removeLimit={1}
        maxContentHeight="calc(100vh - 200px)"
        height="100%"
        maxWidth="95%"
        headerSx={{}}
        addLabel="+"
      />
    </Box>
  );
};

export default EditEvent;
