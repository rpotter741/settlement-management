import React, { useState, useEffect } from 'react';
import { useTools } from 'hooks/useTool.tsx';
import { useSnackbar } from 'context/SnackbarContext.jsx';
import useServer from '../../../services/useServer.js';

import get from 'lodash/get';

import { Box, Typography } from '@mui/material';

import HeartIcon from '@mui/icons-material/Favorite';
import PencilIcon from '@mui/icons-material/Edit';
import TrashIcon from '@mui/icons-material/Delete';

const Heart = () => <HeartIcon />;
const HeartFill = () => <HeartIcon style={{ color: 'red' }} />;
const Pencil = () => <PencilIcon />;
const Trash = () => <TrashIcon />;

const options = [
  { name: 'Edit', icon: <Pencil /> },
  { name: 'Delete', icon: <Trash /> },
  { name: 'Favorite', icon: <HeartFill /> },
];

import FetchedDisplay from 'components/shared/FetchedDisplay/FetchedDisplay.jsx';

const LoadTool = ({
  setShowModal,
  tool,
  keypath = '',
  refKeypath = '',
  displayName,
  selectionMode = false,
  maxSelections = 6,
  outerUpdate = () => {},
  outerTool = {},
  dependency = false,
}) => {
  const { loadNewTool, edit } = useTools(tool);
  const { showSnackbar } = useSnackbar();
  const [selected, setSelected] = useState({
    ids: get(outerTool, keypath) || [],
    refIds: get(outerTool, refKeypath) || [],
  });
  const capsTool = tool.toUpperCase();

  const handleSelectConfirm = () => {
    outerUpdate(keypath, selected);
    setShowModal(null);
  };

  const ActionClick = (e, action, { refId, id }) => {
    e.stopPropagation();
    switch (action) {
      case 'Edit':
        return () => {
          loadNewTool({ refId, id, setNew: true });
          setShowModal(null);
        };
      case 'Delete':
        return async () => {
          try {
            await useServer({
              tool,
              type: 'delete',
              data: { refId, id },
            });
            showSnackbar('Deleted successfully', 'success');
          } catch (error) {
            showSnackbar(error.message, 'error');
          }
        };
      default:
        return;
    }
  };

  const handleActionClick = (e, action, { refId, id }) => {
    e.stopPropagation();
    ActionClick(e, action, { refId, id })();
  };

  return (
    <Box sx={{ minWidth: ['100%'] }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        LOAD {capsTool}
      </Typography>
      <FetchedDisplay
        onActionClick={handleActionClick}
        options={options}
        type="personal"
        tool={tool}
        displayName={displayName}
        selectionMode={selectionMode}
        selected={selected}
        setSelected={setSelected}
        maxSelections={maxSelections}
        onConfirm={handleSelectConfirm}
        dependency={dependency}
      />
      <FetchedDisplay
        onActionClick={handleActionClick}
        options={options}
        type="community"
        tool={tool}
        displayName={displayName}
        selectionMode={selectionMode}
        selected={selected}
        setSelected={setSelected}
        maxSelections={maxSelections}
        onConfirm={handleSelectConfirm}
        dependency={dependency}
      />
    </Box>
  );
};

export default LoadTool;
