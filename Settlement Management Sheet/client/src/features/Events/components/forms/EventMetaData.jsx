import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { TitledCollapse } from '../../../../components/index.js';
import { useTools } from 'hooks/useTool.tsx';
import { useToolContext } from 'context/ToolContext.jsx';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

import EditNameDescription from 'components/shared/MetaData/EditNameDescription.jsx';
import eventFormData from '../../helpers/eventFormData.js';

const EventMetaData = ({}) => {
  const { id } = useToolContext();
  const { edit } = useTools('event', id);

  return (
    <Box>
      <EditNameDescription tool="event" id={id} fields={eventFormData} />
    </Box>
  );
};

export default EventMetaData;
