import React from 'react';

import { Box, Tooltip, IconButton } from '@mui/material';
import PencilIcon from '@mui/icons-material/Edit';
import TrashIcon from '@mui/icons-material/Delete';
import HeartFill from '@mui/icons-material/Favorite';

const ActionsButton = React.memo((props) => {
  const { onActionClick, refId, id, options, onDelete } = props;
  return (
    <Box sx={{ display: 'flex', gap: 0 }}>
      {options.map((option) => (
        <Tooltip key={option.name} title={option.name} placement="top" arrow>
          <IconButton
            size="small"
            fontSize="inherit"
            sx={{
              zIndex: 1000,
              fontSize: '1rem',
              '&:hover': {
                color: 'secondary.main',
              },
            }}
            key={option.name}
            icon={option.icon}
            onClick={async (e) => {
              e.stopPropagation();
              if (option.name === 'delete') {
                try {
                  await onActionClick(e, option.name, {
                    refId,
                    id,
                  }); // do the actual delete
                  onDelete(e, refId); // only remove from local state after success
                } catch (error) {
                  console.error('Failed to delete:', error);
                }
              } else {
                onActionClick(e, option.name, { refId, id });
              }
            }}
          >
            {option.name === 'Favorite' ? (
              <HeartFill fontSize="inherit" />
            ) : option.name === 'Delete' ? (
              <TrashIcon fontSize="inherit" />
            ) : option.name === 'Edit' ? (
              <PencilIcon fontSize="inherit" />
            ) : (
              option.icon
            )}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
});

export default ActionsButton;
