import React, { useEffect, useState } from 'react';
import eventSidebar from '../../../helpers/events/createEventsSidebar';
import NewPhase from './components/NewPhase';
import Box from '@mui/material/Box';

import { emptyPhase } from '../../../helpers/events/emptyEventObjects';

import InnerTabbedContainer from '../../shared/TabbedContainer/InnerTabbedContainer';
import sidebarSx from '../../shared/Sidebar/styles.js';

const CustomEvent = ({ event, setEvent }) => {
  const [phases, setPhases] = useState(event.phases || []);
  const { updateHandlers, updateContent } = useDynamicSidebar();

  const handleSetPhase = (index, newPhase) => {
    setPhases((prev) =>
      prev.map((phase, i) => (i === index ? newPhase : phase))
    );
  };

  const handleAddPhase = () => {
    setPhases([...phases, { ...emptyPhase }]);
  };

  const handleRemovePhase = (_, index) => {
    setPhases((prev) => prev.filter((_, i) => i !== index));
  };

  const getTabs = () => {
    const renderedPhases = phases.map((phase, index) => {
      const name = phase.name ? phase.name : `Phase ${index + 1}`;
      const component = NewPhase;
      const props = { phase, setPhase: handleSetPhase, index };
      return {
        name,
        component,
        props,
        sidebarSx,
        // contentSx,
      };
    });
    const tempPhase = () => <div>Test</div>;
    // return [tempPhase];
    return renderedPhases;
  };

  useEffect(() => {
    const handlers = [];
    updateHandlers(handlers);
    updateContent(eventSidebar);
  }, []);

  const headerSx = {
    width: '90%',
    justifyContent: 'flex-start',
    mb: -0,
  };

  const tabSx = {
    m: 0,
    p: 0,
    justifyContent: 'start',
    backgroundColor: 'background.dark',
  };

  return phases ? (
    <InnerTabbedContainer
      tabs={getTabs() || []}
      onRemove={handleRemovePhase}
      onAdd={handleAddPhase}
      headerSx={headerSx}
      tabSx={tabSx}
    />
  ) : (
    <Box>Nothing to show!</Box>
  );
};
{
  /* </Box> */
}

export default CustomEvent;
