import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAttribute } from '../../hooks/useEditAttribute.jsx';
import { useSnackbar } from 'context/SnackbarContext.jsx';

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

import PersonalAttributes from '../forms/PersonalAttributes.jsx';
import CommunityAttributes from '../forms/CommunityAttributes.jsx';

const LoadAttribute = ({ setShowModal }) => {
  const { addAlert } = useSnackbar();
  const { loadAttribute } = useAttribute();

  const ActionClick = (e, action, { refId, id }) => {
    e.stopPropagation();
    switch (action) {
      case 'Edit':
        return () => {
          loadAttribute({ refId, id });
          setShowModal(null);
        };
      case 'Delete':
        return () => {};
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
      <PersonalAttributes onActionClick={handleActionClick} options={options} />
      <CommunityAttributes
        onActionClick={handleActionClick}
        options={options}
      />
    </Box>
  );
};

export default LoadAttribute;
