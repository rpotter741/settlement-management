import React, { useState, useEffect } from 'react';
import { useTools } from 'hooks/useTool.tsx';
import { useSnackbar } from 'context/SnackbarContext.jsx';
import useServer from '../../../services/useServer.js';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

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

import FetchedDisplay from 'components/shared/FetchedDisplay/SidePanelFetchDisplay.jsx';

const LoadTool = ({
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
  const { loadNewTool } = useTools(tool);
  const { showSnackbar } = useSnackbar();
  const [selected, setSelected] = useState({
    ids: get(outerTool, keypath) || [],
    refIds: get(outerTool, refKeypath) || [],
  });

  const handleSelectConfirm = () => {
    outerUpdate(keypath, selected);
  };

  const ActionClick = (e, action, { refId, id }) => {
    e.stopPropagation();
    switch (action) {
      case 'Edit':
        return () => {
          loadNewTool({ refId, id, currentTool: tool });
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
      case 'Favorite':
        return async () => {
          try {
            // await useServer({
            //   tool,
            //   type: 'favorite',
            //   data: { refId, id },
            // });
            showSnackbar('Favorited successfully', 'success');
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
        isOpen={false}
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
        isOpen={false}
      />
    </Box>
  );
};

export default LoadTool;
