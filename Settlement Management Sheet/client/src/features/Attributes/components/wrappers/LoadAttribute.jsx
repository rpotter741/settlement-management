import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'context/SnackbarContext.jsx';
import useServer from 'services/useServer.js';
import { useTools } from 'hooks/useTool.jsx';

import { Box, Typography, Button } from '@mui/material';

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

const LoadAttribute = ({ setShowModal }) => {
  const { showSnackbar } = useSnackbar();
  const { loadNewTool } = useTools('attribute');

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
              tool: 'attribute',
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
    <Box sx={{ minWidth: ['100%', '600px', '800px', '1000px'] }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        LOAD ATTRIBUTE
      </Typography>
      <FetchedDisplay
        onActionClick={handleActionClick}
        options={options}
        type="personal"
        tool="attribute"
        displayName="Attributes"
      />
      <FetchedDisplay
        onActionClick={handleActionClick}
        options={options}
        type="community"
        tool="attribute"
        displayName="Attributes"
      />
    </Box>
  );
};

export default LoadAttribute;
