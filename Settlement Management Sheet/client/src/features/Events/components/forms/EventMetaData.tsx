import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { TitledCollapse } from '../../../../components/index.js';
import { useTools } from 'hooks/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

import EditNameDescription from 'components/shared/MetaData/EditNameDescription.jsx';
import eventFormData from '../../helpers/eventFormData.js';

const EventMetaData = ({}) => {
  const { id } = useShellContext();
  const { edit } = useTools('event', id);

  return (
    <Box>
      <EditNameDescription tool="event" id={id} fields={eventFormData} />
    </Box>
  );
};

export default EventMetaData;
