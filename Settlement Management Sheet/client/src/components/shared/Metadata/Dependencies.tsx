import React, { useCallback, useState, useEffect, lazy } from 'react';
import { useTools } from '@/hooks/useTools.jsx';

import { v4 as newId } from 'uuid';

import { Box, Typography, Tooltip, Button } from '@mui/material';
import EditDependency from '@/components/shared/Metadata/EditDependency.jsx';
import { ToolName } from '@/app/types/ToolTypes.js';
import { ModalContent } from '../TabbedContainer/TabbedContainer.js';

interface ObjectDependenciesProps {
  tool: ToolName;
  setModalContent: (content: ModalContent) => void;
  id: string;
  displayName: string;
}

const ObjectDependencies: React.FC<ObjectDependenciesProps> = ({
  tool,
  setModalContent,
  id,
  displayName,
}) => {
  const { edit } = useTools(tool, id);

  const outerUpdate = useCallback(() => {}, [tool, id]);

  return (
    <Box>
      <Typography variant="h6">
        {tool.charAt(0).toUpperCase() + tool.slice(1)} Dependencies
      </Typography>
      <Typography>
        Dependencies reflect how this {tool} interacts with others. For
        instance, if this {tool} is dependent on another {tool}, its own score
        will be modulated by the thresholds of the other {tool}. A dependency
        modifier of 0.75 means this {tool} will be 25% less at the other {tool}
        's threshold.
      </Typography>
      <EditDependency />
      <Button
        variant="contained"
        color="success"
        aria-label="Add dependency"
        sx={{ px: 4 }}
        onClick={() => {
          setModalContent({
            component: lazy(() => import('../LoadTool/LoadTool.jsx')),
            props: {
              tool,
              displayName,
              keypath: 'dependencies.order',
              refKeypath: 'dependencies.refIds',
              selectionMode: true,
              outerUpdate,
              outerTool: edit,
              dependency: true,
            },
          });
        }}
      >
        Add Dependency
      </Button>
    </Box>
  );
};

export default ObjectDependencies;
