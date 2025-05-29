import React, { useCallback, useState, useEffect } from 'react';
import { useTools } from 'hooks/useTool.tsx';
import { useSnackbar } from 'context/SnackbarContext.jsx';

import { v4 as newId } from 'uuid';

import { Box, Typography, Tooltip, Button } from '@mui/material';
import EditDependency from 'components/shared/Metadata/EditDependency.jsx';
import LoadTool from 'components/shared/LoadTool/LoadTool.jsx';

const ObjectDependencies = ({ tool, setShowModal, id }) => {
  const { selectValue, edit, updateTool, validateToolField, errors } = useTools(
    tool,
    id
  );
  const dependencies = selectValue('dependencies');
  const [showTooltip, setShowTooltip] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [lastId, setLastId] = useState(null);

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
      <EditDependency tool={tool} id={id} />
      <Button
        variant="contained"
        color="success"
        aria-label="Add threshold"
        sx={{ px: 4 }}
        onClick={() => {
          setShowModal('Select Category');
        }}
      >
        Add Dependency
      </Button>
    </Box>
  );
};

export default ObjectDependencies;
